// inicjalizacja
const A = 0x41; // do rysowania opisów
const canvas = rysowanie;
canvas.width = canvas.height = canvas.offsetHeight;
const context = canvas.getContext('2d');
let sets = new Array();
const X = canvas.cloneNode(false);
let initialCanvases = new Array();
const symbols = ['+', '-', '\\', '/', '(', ')', '\'', '(lit)'];
pressXToJason('./symbolProps.json', d => symbolProperties = d);
const operation = {
    set1: null,
    set2: null,
    f: null,
    neg: false,
    priority: 0,
    depth: 0,
    /* Kolejność wykonywania działań:
    1. nawias
    2. negacja
    3. reszta
    */
}

function firstRun(){
    parseError('Wprowadź instrukcję.', 'blue');
    let xc = X.getContext('2d');
    xc.fillStyle = 'red';
    xc.fillRect(0, 0, X.width, X.height);
    generateSets(3);
}
/**
 * @abstract Rysuje n zbiorów
 * @param {int} n 
 */
function generateSets(n) {
    initialCanvases = [];
    sets = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
    let offsetAngle = (2 * Math.PI / n);
    for (i = 0; i < n; i++) {
        let path = new Path2D();
        path.arc(400 + 140 * Math.cos(offsetAngle * i),
            400 + 140 * Math.sin(offsetAngle * i),
            200, 0, 2 * Math.PI);
        sets.push(path);
        context.stroke(path);
    }
    initialCanvases = sets.map((e) => pathToCanvas(e));
    generateText(n, offsetAngle);
};


/**
 * Przerysowuje identyfikatory przypisane zbiorom.
 * @param {int} n 
 * @param {float} offsetAngle 
 */
function generateText(n, offsetAngle = null) {
    if (offsetAngle == null) offsetAngle = (2 * Math.PI / n);
    context.beginPath();
    for (i = 0; i < n; i++) {
        context.fillStyle = "rgb(0 0 0)";
        context.font = '24px Arial'
        let char = A + i;
        context.fillText(String.fromCodePoint(char),
            400 + 380 * Math.cos(offsetAngle * i),
            400 + 380 * Math.sin(offsetAngle * i));
    }
    context.font = '30pt Arial'
    context.fillText("X", 750, 770);
    context.closePath();
    return;
}

/**
 * Przerysowuje kontury.
 * Przydatne po funkcjach zapełniających pola.
 */
function redraw() {
    for (i = 0; i < sets.length; i++) {
        context.stroke(sets[i]);
    }
    generateText(sets.length);

}

/**
 * Zaopiekuj się intrukcją od początku do końca
 * @param {string} instruction 
 * @returns 
 */
function parseInstruction(instruction) {

    let inst = preformat(instruction);
    if (inst === false) {
        parseError('Podaj poprawną instrukcję', 'blue');
        regenerate();
        return false;
    }

    let canContinue = validateInput(inst);
    if (!canContinue) return;
    parseError('Komenda jest poprawna.', 'green');
    let ops = translateInst(inst);

    executeOps(ops);
}

/**
 * Wstępnie formatuje instrukcję.
 * @param {string} instruction 
 * @returns {string} 
 */
function preformat(instruction) {
    // wstępnie sformatuj
    let inst = instruction.toUpperCase();
    inst = inst.replace(/\s+|[^\+\-\\\/\(\)\'A-Z]/g, "") //wyrzuć wszystkie zbędne znaki
    .replace('∪', '+')
    .replace('∩', '-')
    .replace('÷', '/');
    console.log(inst);

    if (forceCharset.checked) document.getElementById('instruction').value = inst;
    //  console.log(inst);
    if (inst.length == 0) {
        return false;
    } else return inst;
}

/**
 * Sprawdź, czy wejście jest poprawne
 * @param {string} inst
 * @returns {boolean}
 */
function validateInput(inst) {

    let depth = 0;
    let maxDepth = depth;

    for (i = 0; i < inst.length; i++) {
        let char = inst[i];
        let isLetter = /[A-Z]/.test(char);
        let symbolMapping = symbols.indexOf(this.previousSymbol)
        if (isLetter) {
            let code = char.codePointAt(0);
            let setCode = code - A;
            if(char == 'X') char = '(lit)';
            
            else if (setCode >= sets.length) {
                // błąd: niepoprawny zbiór
                parseError('Niepoprawny zbiór!');
                regenerate();
                return false;
            }
            char = '(lit)';
        }
        if (i == 0) {
            if (!symbolProperties[char].canFirst) {
                parseError('Niepoprawny pierwszy znak!');
                regenerate();
                return;
            }
            if (char == '(') {
                depth++;
            }
            this.previousSymbol = isLetter ? '(lit)' : char;
            continue;
        }
        if (!symbolProperties[char].canStandAfter[symbolMapping]) {
            // nieprawidłowe polecenie
            parseError('Niepoprawne polecenie!');
            regenerate();
            return;
        }
        if (char == '(') {
            depth++;
            //if (depth > maxDepth) maxDepth = depth;
            continue;
        }
        if (char == ')') {
            depth--;
            if (depth < 0) {
                parseError('Nieprawidłowy nawias!')
                regenerate();
                return;
            }

        }
        this.previousSymbol = isLetter ? '(lit)' : char;
    };
    if (depth != 0) {
        parseError("Niedomkniętych nawiasów: " + depth);
        regenerate();
    } else if (!symbolProperties[this.previousSymbol].canLast) {
        parseError("Niedokończona instrukcja!")
    } else {
        parseError("");
        regenerate();
        redraw();
        return true;
    }
}
/**
 * Tłumaczy poprawną komendę na ciąg operacji do wykonania.
 * Wynalazł to pan Dijkstra; 
 * swoją drogą, czego on nie wynalazł?
 * https://en.wikipedia.org/wiki/Shunting_yard_algorithm
 * @param {string} inst 
 */
function translateInst(inst) {
    let outStack = new Array();
    let opStack = new Array();
    for (char of inst) {
        let isLetter = /[A-Z]/.test(char);
        if (isLetter) {
            let charCode = char.codePointAt(0);
            //outStack.push(char);
            if(char == 'X') outStack.push(X);
            else outStack.push(initialCanvases[charCode - A]);
            continue;
        }
        switch (char) {
            case '(': {
                opStack.push(char);
                continue;
            }
            case ')': {
                while (opStack.length && opStack[opStack.length - 1] !== '(') {
                    //console.log(opStack);

                    outStack.push(opStack.pop());
                }
                opStack.pop(); // ( robi wrum 
                continue;
            }
            case '\'':{
                outStack.push(X);
                opStack.push(xor);
                continue
            }
            // operator, który nie jest primem
            default: {
                while (opStack.length && opStack[opStack.length - 1] !== '(') {
                    outStack.push(opStack.pop());
                }
                switch(char){
                    case '+':
                    case '∪': opStack.push(summation); break;
                    case '-':
                    case '∩': opStack.push(intersection); break;
                    case '/':
                    case '÷': opStack.push(xor); break;
                    case '\\': opStack.push(subtraction); break;
                    default: break; // to się nie powinno stać
                }
            }
        }
    }

   //console.log(opStack)
    while (opStack.length) {
        outStack.push(opStack.pop());
    }
 //  console.log(outStack);

   // komenda to tylko jeden zbiór
   if(outStack.length == 1){
    outStack.push(outStack[0], summation);
   }

    return outStack;
}

function executeOps(opList){
    console.log(opList);
    let ops = new Array();
    for(op of opList){
        
        typeof op === 'function' ? ops.push(op([ops.pop(),ops.pop()].reverse())) : ops.push(op);
        // op op op
        // oppa gangnam style
    }
    clear();
    console.log(ops);
    context.drawImage(ops[0], 0, 0);
    redraw();
    return;

}

function pathToCanvas(path){
    const c = document.createElement('canvas');
    // console.log(canvases);
    c.width = canvas.width;
    c.height = canvas.height;
    cc = c.getContext('2d');
    cc.fillStyle = 'red'; // wszystko jedno, byle czysty kolor
    cc.stroke(path);
    cc.fill(path);
   // console.log(c);
    return c;
}

// małe funkcje

/**
 * Czyta parametry parsera z pliku.
 * @param {string} file - ścieżka do pliku
 * @returns {JSON} 
 */
async function pressXToJason(file, f) {
    return f(await fetch(file).then(r => r.json()));
}
clear = (c = context, w = canvas.width, h = canvas.height) => c.clearRect(0, 0, w, h);
parseError = (text, color = 'red') => error.innerHTML = `<span style="color: ${color}">${text}</span>`;
regenerate = () => {clear(); redraw();}