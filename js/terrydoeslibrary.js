

/**
 * EXAMPLE number=5.0244 RETURNS 5.02
 * @param {Number} number - Number to be rounded.
 * @returns {Number}
 */
export function moneyRound(number) {
    return Math.ceil(number * 100) / 100;
}

/**
 * Parses CSV files to readable JSON
 * @param {File} file 
 * @returns {JSON}
 */
export function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: results => resolve(results.data),
            error: reject
        });
    });
}

// Source - https://stackoverflow.com/a/14268260
// Posted by Paul S., modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-02, License - CC BY-SA 3.0
/**
 * 
 * @param {HTMLTableElement} table - The table to sort
 * @param {number} columnIndex - Which column to sort through.
 * @param {boolean} ascending - defaults to true. set to false if sorting Z-A or 9-0 
 */ 
export function sortTable(table, columnIndex, ascending = true) {

    const tbody = table.querySelector('tbody') || table;
    const rows = Array.from(tbody.querySelectorAll('tr'));


    // Sort rows based on the text content of the specified column index
    const sortedRows = rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent.trim();
        const cellB = rowB.cells[columnIndex].textContent.trim();

        // Check if values are numeric
        const isNum = !isNaN(cellA) && !isNaN(cellB);
        
        if (isNum) {
        return ascending ? cellA - cellB : cellB - cellA;
        } else {
        return ascending 
            ? cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' })
            : cellB.localeCompare(cellA, undefined, { numeric: true, sensitivity: 'base' });
        }
    });

    // Re-append sorted rows to the body (DOM moves them automatically)
    tbody.append(...sortedRows);
    return ascending;    
}

/**
 * @param {string} displayText Text shown on button
 * @param {string} color colors found @ https://www.w3schools.com/w3css/w3css_colors.asp
 * @param {callback} callback event to fire when clicked
 * @returns {HTMLButtonElement} Button element. must still attach it
 */
export function createButtonElement(displayText, color, callback) {
    let btn = document.createElement('input');

    btn.setAttribute('type', 'button');
    btn.setAttribute('value', displayText);
    btn.classList.add(color);

    btn.addEventListener('click', callback);

    return btn;
}

/**
 * 
 * @param {Object} obj 
 * @param {string} filename 
 */
export function downloadCSV(obj, filename) {
    let newCSV = Papa.unparse(obj);
    const blob = new Blob([newCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 
 * @param {string} str
 * @returns {number}
 */
export function convertStringToNumber(str) {
    let newStr = str.toString()

    if (newStr.includes('%')) return (parseFloat(newStr.replace(/[%\$,]/g, "")) / 100);
    

    return parseFloat(newStr.replace(/[\$,]/g, ""));
}


/**
 * 
 * @param {Array} columnArray - example found below this class.  
 * @param {Array} bodyArray - array of information, values must match columnArray.
 * @param {HTMLTableElement} table - if mot set, create table.
 * @returns {HTMLTableElement}
 */
export function createTable(columnArray, bodyArray, table = null) {

    if(table == null) {
        table = document.createElement('table')
    }
    const headerRow = table.createTHead();

    // for each column, create a table cell and name it apropiately
    columnArray.forEach((col, index) => {

        const th = document.createElement('th');
        th.textContent = col.header;

        // Click the col to sort table by that value.
        let a = true;
        th.addEventListener('click', function() {
            sortTable(table, index, a);
            a = !a;
        });
        
        // for each class in colClasses value, give said class 
        col.headerClasses.forEach(clas => {
            th.classList.add(clas);
        });

        headerRow.appendChild(th);
    
    });

    bodyArray.forEach(item => {
        const row = table.insertRow();
        columnArray.forEach(col => {
            const cell = row.insertCell();
            col.render(item, cell);
        })
    });

    return table;
}
/**
const columns = [
    {
        header: 'Card',
        headerClasses: [],
        render(card, cell) {

            let text = `${card.name}`;
            const span = document.createElement('span');
            span.textContent = text;

            cell.addEventListener('mouseenter', () => {
               cardPreview.src = card.imageLink;
               cardPreview.hidden = false;
            });

            cell.addEventListener('mousemove', (e) => {
               cardPreview.style.left = `${e.clientX + 20}px`;
               cardPreview.style.top = `${e.clientY + 20}px`;
            });

            cell.addEventListener('mouseleave', () => {
               cardPreview.hidden = true;
            });

            cell.appendChild(span)
        }
    },
    {
        header: 'Finish',
        headerClasses: ['w3-center'],
        render(card, cell) {
            const span = document.createElement('span');
            const foil = (card.isFoil()) ? '🌈' : '⬛';

            span.textContent = foil;

            cell.classList.add('w3-center');
            cell.appendChild(span);
        }
    },
    {
        header: 'Condition',
        headerClasses: ['w3-center'],
        render(card, cell) {
            const span = document.createElement('span');

            span.textContent = card.getCondition();

            cell.classList.add('w3-center');
            cell.appendChild(span);
        }
    },
    {
        header: 'Low Price',
        headerClasses: ['w3-center'],
        render(card, cell) {
            const span = document.createElement('span');

            if(card.success) {
                span.textContent = `$${card.priceLow}`;
            } else {
                span.textContent = `$???`
            }

            cell.classList.add('w3-right-align');
            cell.appendChild(span)
        }
    },
    {
        header: 'Count',
        headerClasses: ['w3-center'],
        render(card, cell) {
            const span = document.createElement('span');
            span.textContent = card.count;
            
            cell.classList.add('w3-right-align');
            cell.appendChild(span);
        }
    }
 */