

/**
 * EXAMPLE number=5.0244 RETURNS 5.02
 * @param {Number} number - Number to be rounded.
 * @returns {Number}
 */
export function moneyRound(number) {
    return Math.ceil(number * 100) / 100;
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
 * @returns {HTMLButtonElement} Button element. must still attach
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