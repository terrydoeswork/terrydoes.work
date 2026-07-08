import { parseCSV } from "./papaparse.js";


/**
 * 
 * @param {File} file 
 * @returns {object[]}
 */
export async function parseTCGP(file) {
    const rows = parseCSV(file)
    let dataArray = []
    for (const row of rows) {
        dataArray.push(createCardFromTCGPlayerList(row))
    }
    return dataArray;
}

function createCardFromTCGPlayerList(row) {
    return {
        productID: data['Product ID'],
        tcgpID: data['TCGplayer Id'],
        name: data['Product Name'],
        finish: parseFinish(data['Printing']),
        condition: parseCondition(data['Condition']),
        count: Number(data['Add to Quantity']),
        rarity: parseRarity(data['Rarity']),
        imageLink: data['Photo URL'],
        collectorNumber: data['Number'],
        error: undefined
    };
}