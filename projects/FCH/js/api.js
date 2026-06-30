/**
 * @param {String} displayText Text to be displayed on the button
 * @param {Function} callback OnClick event 
 * @returns button HTML DOM
 */
export function createdButtonElement(displayText, callback) {
    let btn = document.createElement('input');

    btn.setAttribute("type", "button");
    btn.setAttribute("value", displayText);
    btn.addEventListener('click', callback);

    return btn;
}

/**
 * @param {Object} obj Converts to JSON to download
 * @param {String} filename Name of file (do not add .json)
 */
export function downloadObjAsJSONFile(obj, filename) {
    const jsonString = JSON.stringify(obj, null, 4);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function downloadCSV(obj, filename) {
    let newCSV = Papa.unparse(obj);
    const blob = new Blob([newCSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 
 * @param {Array} cardArray Array of Card Objects
 */
export function convertCardArrayToTCGPlayerList(cardArray) {
    
    const targetArray = []

    cardArray.forEach(card => {
        targetArray.push({
            "Product ID": card.productID,
            "TCGplayer Id": card.tcgpid,
            "Product Line": "Magic: The Gathering",
            "Set Name": "",
            "Product Name": card.displayName,
            "Title": "",
            "Number": "",
            "Rarity": card.getRarityString(),
            "Condition": card.getCondition(),
            "Printing": card.getFinishString(),
            "TCG Market Price": "",
            "TCG Direct Low": "",
            "TCG Low Price With Shipping": "",
            "TCG Low Price": "",
            "Total Quantity": "",
            "Add to Quantity": card.count,
            "TCG Marketplace Price": "",
            "Photo URL": card.imageLink
        })
    })

    return targetArray;


    
}

/**
 * Parses CSV files in a cutesy way.
 * @param {File} file 
 * @returns 
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