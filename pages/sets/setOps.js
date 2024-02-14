   // tryby pracy są tak dobrane, żeby odzwierciedlały operacje, które mają wykonać
   summation = (paths, clear = false, draw = false) =>
       genericOperation(paths, 'source-over', clear, draw);
   
   subtraction = (paths, clear = false, draw = false) =>
       genericOperation(paths, 'destination-out', clear, draw);
   
   intersection = (paths, clear = false, draw = false) =>
       genericOperation(paths, 'source-in', clear, draw);
   
   xor = (paths, clear = false, draw = false) =>
       genericOperation(paths, 'xor', clear, draw);
   
   /**
    * Wykonuje operacje pośrednie na zbiorach
    * Lista trybów pracy: 
    * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    * @param {Path2D} paths lista zbiorów, na których pracujemy
    * @param {string} op tryb pracy
    * @param {boolean} cl Wyczyść planszę przed narysowaniem operacji pośredniej? Przydatne do debugu, odradzane
    * @param {boolean} draw Wyświetlić efekt końcowy operacji pośrednich? Odradzane, może nie pokrywać się z wynikiem końcowym
    * 
    */
   function genericOperation(elems, op, cl = false, draw = false) {
       if (cl && draw) clear();
       const result = document.createElement('canvas');
       result.width = canvas.width;
       result.height = canvas.height;
       const resultContext = result.getContext('2d');
       for (i = 0; i < elems.length; i++) {
           // "source-over" to domyślny tryb pracy
           resultContext.globalCompositeOperation = i === 0 ? 'source-over' : op;
           /*
           naiwny sposób sprawdzenia czy operujemy na ścieżce, czy płótnie
               kiedy składnikiem jest któryś ze zbiorów początkowych, to ścieżka
               jeśli wynik działania pośredniego, to płótno
           dla obu typeof === 'object'
           */
           if (elems[i].arc !== undefined)
               elems[i] = pathToCanvas(elems[i]);
           resultContext.drawImage(elems[i], 0, 0);
       }
       if (draw) {
           context.drawImage(result, 0, 0);
           redraw();
       }
       return result;
   }
   