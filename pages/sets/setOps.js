
summation = (paths, clear = false, draw = false) =>
genericOperation(paths, 'source-over', clear, draw);

subtraction = (paths, clear = false, draw = false) => 
genericOperation(paths, 'destination-out', clear, draw);

intersection = (paths, clear = false, draw = false) => 
genericOperation(paths, 'source-in', clear, draw);

xor = (paths, clear = false, draw = false) => 
genericOperation(paths, 'xor', clear, draw);

/**
 * Robi prawie wszystko.
 * Lista trybów pracy: 
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
 * @param {Path2D} paths - lista zbiorów, na których pracujemy
 * @param {string} op -tryb pracy
 * 
 */
function genericOperation(els, op, cl = false, draw = false){
    if(cl && draw) clear();
    const result = document.createElement('canvas');
    result.width = canvas.width;
    result.height = canvas.height;
    const resultContext = result.getContext('2d');
    for (i = 0; i < els.length; i++) {
        resultContext.globalCompositeOperation = i === 0 ? 'source-over' : op;
        if(els[i].arc !== undefined) els[i] = pathToCanvas(els[i]);
        // els[i].arc === undefined ? canvas : ścieżka
        resultContext.drawImage(els[i], 0, 0);
    }
    if(draw) {
    context.drawImage(result, 0, 0);
    redraw();
    }
    // document.body.appendChild(result);
    return result;
}

negation = (paths, clear = false, draw = false) =>{
    paths[1] = canvas;
genericOperation(paths, 'source-over', clear, draw);
}
