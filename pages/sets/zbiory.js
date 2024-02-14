/**
    * Program rysujący diagramy Venna
    * 
    * Schemat działania:
    * 1. Użytkownik wprowadza polecenie do wykonania z użyciem klawiatury.
    * 2. Program weryfikuje dane wejściowe; jeśli są niepoprawne, informuje o błędzie.
    * 3. Tekst wejściowy jest przetwarzany na ciąg instrukcji do wykonania z uwzględnieniem kolejności wykonywania działań.
    * 4. Instrukcje są wykonywane za pomocą funkcjonalności Canvas.
    * 5. Efekt końcowy jest wyświetlany na ekranie.
    * 
    * Notatki:
    * - Operacje wprowadza się w polu tekstowym za pomocą klawiatury (tabelka) lub przycisków z symbolami notacji matematycznej (też tabelka).
    * - Program działa na dowolnej liczbie zbiorów między 1 a 23 (włącznie). Zbiory są oznaczone literami od A w górę.
    * - X to zawsze poprawny zbiór i oznacza cały obszar, w którym są wszystkie pozostałe zbiory (z tego powodu dopuszczalna liczba zbiorów to 23)
    * - Wszystkie operacje w tym samym nawiasie mają jednakowe pierwszeństwo i wykonują się od lewej do prawej
    *   Wyjątek: negacja działa tylko na elemencie bezpośrednio z lewej (może być nim nawias)
    * - Znaki, które nie są (i nie mogą) być częścią żadnego polecenia, są ignorowane.
    * - Negacja jest zaimplementowana jako suma wykluczająca z X
    * 
    * Wymagania:
    * - Przeglądarka wspierająca Canvas API (czyli każda znacząca wersja młodsza niż 15 lat)
    * - włączone wykonywanie Javascript
    * - zalecane: szerokość ekranu >= 800px
    * 
    * Kamil Bublij
    * Informatyka Stosowana sem. I
    * II 2024
   */
   
   // Dane globalne
   const A = 0x41;                                                     // ASCII
   const canvas = rysowanie;                                           // płótno widoczne dla użytkownika
   canvas.width = canvas.height = canvas.offsetHeight;
   const context = canvas.getContext('2d');
   let initialPaths = [];                                              // pierwotne płótna i ścieżki
   let initialCanvases = [];
   const X = canvas.cloneNode(false);                                  // kopia widocznego płótna
   const symbols = ['+', '-', '\\', '/', '(', ')', '\'', '(lit)'];     // lista dopuszczalnych symboli
   // tabelka: co może po czym stać
   // kolejność indeksów w "canStandAfter" jest zgodna z tą w "symbols"
    pressXToJason('./symbolProps.json', d => symbolProperties = d);
   
   /**
    * Funkcja uruchamia się po odświeżeniu strony
    */
   function firstRun() {
       parseError('Wprowadź instrukcję.', 'blue');
       let xc = X.getContext('2d');                // zamaluj widoczne płótno
       xc.fillStyle = 'red';                       // dlatego to musi być kopia
       xc.fillRect(0, 0, X.width, X.height);
       generateSets(3);
       // wejście typu "number" pozwala na wprowadzanie kilku znaków, któe liczbami nie są
       // napraw
       liczbaZbiorow.addEventListener('keydown', (e) => { ["e", "E", "+", "-", '.', ','].includes(e.key) && e.preventDefault() });
   }
   
   /**
    * Rysuje n zbiorów
    * @param {int} n 
    */
   function generateSets(n) {
       clear();
       initialPaths = initialCanvases = [];        // muszę wyczyścić listę, bo kąty i współrzędne już się nie zgadzają
       let offsetAngle = (2 * Math.PI / n);
       // równo rozdziel okręgi
       // płótno ma (sztywne) wymiary 800x800 [px], więc (400, 400) to środek
       for (i = 0; i < n; i++) {
           let path = new Path2D();
           path.arc(400 + 140 * Math.cos(offsetAngle * i),
               400 + 140 * Math.sin(offsetAngle * i),
               200, 0, 2 * Math.PI);
           initialPaths.push(path);
           context.stroke(path);
       }
       initialCanvases = initialPaths.map((e) => pathToCanvas(e)); // zapamiętaj ścieżki
       generateText(n, offsetAngle);
   };
   
   
   /**
    * Rysuje identyfikatory przypisane zbiorom.
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
    * Przerysowuje kontury wewnątrz zamalowanego obszaru.
    * Przydatne po funkcjach zapełniających pola.
    */
   function redraw() {
       for (i = 0; i < initialPaths.length; i++) {
           context.stroke(initialPaths[i]);
       }
       generateText(initialPaths.length);
   
   }
   
   /**
    * Zaopiekuj się intrukcją od początku do końca
    * @param {string} instruction 
    * @returns 
    */
   function parseInstruction(instruction) {
       // wstępnie sformatuj wprowadzone polecenie
       let inst = preformat(instruction);
       if (inst === false) {
           parseError('Podaj poprawną instrukcję', 'blue');
           regenerate();
           return false;
       }
   
       // zweryfikuj poprawność komendy
       let canContinue = validateInput(inst);
       if (!canContinue) return;
       parseError('Komenda jest poprawna.', 'green');
   
       // przetłumacz poprawne polecenie na ciąg instrukcji i go wykonaj
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
       inst = inst.replaceAll('∪', '+')
           .replaceAll('∩', '-')
           .replaceAll('÷', '/')
           .replace(/\s+|[^\+\-\\\/\(\)\'A-Z]/g, ""); //wyrzuć wszystkie zbędne znaki
       console.log(inst);
   
       // funkcjonalność debugu: nie zezwalaj na wpisywanie niepoprawnych znaków, a poprawne tłumacz na wersje używane w programie
       if (forceCharset.checked) document.getElementById('instruction').value = inst;
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
       let depth = 0; // w ilu nawiasach jest instrukcja?
       for (i = 0; i < inst.length; i++) {
           let char = inst[i];
           let isLetter = /[A-Z]/.test(char);
           let symbolMapping = symbols.indexOf(this.previousSymbol) // przetwórz znak na indeks
           if (isLetter) {
               let code = char.codePointAt(0);
               let setCode = code - A;
               if (char == 'X') char = '(lit)';
               else if (setCode >= initialPaths.length) {
                   // błąd: niepoprawny zbiór (litera, ale spoza zakresu [A-?])
                   parseError('Niepoprawny zbiór!');
                   regenerate();
                   return false;
               }
               char = '(lit)';
           }
           // specjalne traktowanie pierszej litery - ona po niczym nie stoi
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
               // tu są wychwytywane ciągi typu "A+-B" albo "AA/C"
               parseError('Niepoprawne polecenie!');
               regenerate();
               return;
           }
           if (char == '(') {
               depth++;
               continue;
           }
           if (char == ')') {
               depth--;
               if (depth < 0) {
                   // jest więcej nawiasów zamkniętych niż otwartych
                   parseError('Nieprawidłowy nawias!')
                   regenerate();
                   return;
               }
   
           }
           this.previousSymbol = isLetter ? '(lit)' : char;
       };
   
       if (depth != 0) {
           // jest więcej nawiasów otwartych niż zamkniętych 
           parseError("Niedomkniętych nawiasów: " + depth);
           regenerate();
       } else if (!symbolProperties[this.previousSymbol].canLast) {
           // tu są wychwytywane ciągi typu "A+"
           parseError("Niedokończona instrukcja!")
       } else {
           parseError(""); // wyczyść planszę
           regenerate();
           return true;
       }
   }
   
   /**
    * Tłumaczy poprawną komendę na ciąg operacji do wykonania, uwzględniając kolejność wykonywania działań. (notacja odwrotna polska)
    * Wynalazł to pan Dijkstra
    * (czego on nie wynalazł?)
    * https://en.wikipedia.org/wiki/Shunting_yard_algorithm
    * @param {string} inst 
    */
   /** Metoda działania algorytmu: 
    * 1. jeśli się da, wczytaj następny znak
    * 2. jeśli to:
    *      - zbiór: wepchnij go na stos końcowy;
    *      - operator:  
    *          - dopóki na stosie pośrednim jest coś, co nie jest lewym nawiasem 
    *            i ma wyższy priorytet/składa się w lewo:
    *              - zdejmij operator ze stosu pośredniego i wepchnij na końcowy,
    *          - wepchnij op. na stos pośredni;
    *      - "(": wepchnij go na stos pośredni;
    *      - ")":
    *          - dopóki na stosie jest coś, co nie jest lewym nawiasem:
    *              - (jeśli stos jest pusty, nawiasy są niezrównoważone - program temu zapobiega)
    *              - zdejmij to ze stosu posredniego i wepchnij na końcowy,
    *          - zdejmij operator ze stosu pośredniego (to powinien być "(") i odrzuć
    *    wróć do kroku 1
    * 3. dopóki stos pośredni nie jest pusty:
    *      - (jeśli na stosie teraz jest "(", nawiasy są niezrównoważone)
    *      - zdejmij operator ze stosu pośredniego i wrzuć na końcowy
    * 
    * Ta implementacja zawiera dodatkowe modyfikacje:
    * - podmienia operator "'" na różnicę względem zbioru X
    * - podmienia operatory na funkcje, które należy wykonać
   */
   function translateInst(inst) {
       let outStack = new Array();
       let opStack = new Array();
       for (char of inst) {
           let isLetter = /[A-Z]/.test(char);
           if (isLetter) {
               let charCode = char.codePointAt(0);
               //outStack.push(char);
               if (char == 'X') outStack.push(X);
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
                       outStack.push(opStack.pop());
                   }
                   opStack.pop(); // odrzuć lewy nawias
                   continue;
               }
               case '\'': {
                   outStack.push(X);
                   opStack.push(xor);
                   continue
               }
               // operator, który nie jest primem
               default: {
                   while (opStack.length && opStack[opStack.length - 1] !== '(') {
                       outStack.push(opStack.pop());
                   }
                   switch (char) {
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
   
       while (opStack.length) {
           outStack.push(opStack.pop());
       }
   
       return outStack;
   }
   
   /**
    * Wykonuje stos instrukcji zapisany w notacji odwrotnej.
    * @param {any} opList 
    */
   function executeOps(opList) {
   
       console.log(opList);
       let ops = new Array();
       for (op of opList) {
           // jeśli instrukcja to funkcja,
           // to wykonaj ją z następnymi dwoma znakami
           // a wynik wepchnij na stos
           if (typeof op === 'function')
               ops.push(op([ops.pop(), ops.pop()].reverse()))
           // oczywiście, jeśli to nie funkcja, to nie wykonuj
           else ops.push(op);
       }
       clear();
       // console.log(ops);
       context.drawImage(ops[0], 0, 0);
       redraw();
       return;
   
   }
   /**
    * Funkcja pomocnicza: po podaniu ścieżki zwraca płótno zawierające ją
    * @param {Path2D} path 
    * @returns {HTMLCanvasElement}
    */
   function pathToCanvas(path) {
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

    /**
    * Czyta parametry parsera z pliku. 
    * @param {string} file - ścieżka do pliku
    * @returns {JSON} 
    */
   
   async function pressXToJason(file, f) {
       return f(await fetch(file).then(r => r.json()));
   }

      // wyczyść ekran kompletnie
      clear = (c = context, w = canvas.width, h = canvas.height) => c.clearRect(0, 0, w, h);
   
      // wyświetl komunikat o błędzie na żądany kolor. Notacja '#xxxxxx' jest w porządku
      parseError = (text, color = 'red') => error.innerHTML = `<span style="color: ${color}">${text}</span>`;
      
      // wyczyść ekran i narysuj jeszcze raz już istniejące kontury zbiorów
      // NIE oblicza ich od nowa
      regenerate = () => { clear(); redraw(); }