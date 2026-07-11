import { parseCondition, parseFinish, parseRarity } from "../card/card-factory.js";
import { parseCSV } from "./papaparse.js";


/**
 * 
 * @param {File} file 
 * @returns {object[]}
 */
export async function parseTCGP(file) {
    const rows = await parseCSV(file)
    
    let dataArray = [];
    for (const row of rows) {
        dataArray.push(createCardFromTCGPlayerList(row))
    }
    return dataArray;
}

function createCardFromTCGPlayerList(row) {
    return {
        productID: row['Product ID'],
        tcgpID: row['TCGplayer Id'],
        name: row['Product Name'],
        finish: parseFinish(row['Printing']),
        condition: parseCondition(row['Condition']),
        count: Number(row['Add to Quantity']),
        rarity: parseRarity(row['Rarity']),
        imageLink: row['Photo URL'],
        collectorNumber: row['Number'],
        error: undefined
    };
}