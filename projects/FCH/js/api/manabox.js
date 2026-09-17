import { CARD_CONDITION } from "../enums.js";
import { parseFinish, parseCondition, parseRarity } from "../card/card-factory.js";
import { parseCSV } from "./papaparse.js";

/**
 *  
 * @param {*} file 
 * @returns 
 */
export async function parseManaBox(file) {
    const rows = await parseCSV(file)
    let dataArray = [];

    for (const row of rows) {
        console.log(row);
        
        dataArray.push(createRowFromManaBox(row))
    }
    return dataArray;
}


function createRowFromManaBox(row) {
    return {
        scryfallID: row['Scryfall ID'],
        name: row['Name'],
        finish: parseFinish(row['Foil']),
        condition: parseCondition(row['Condition']),
        count: Number(row['Quantity']),
        rarity: parseRarity(row['Rarity']),
        setCode: row['Set code'],
        setName: row['Set name'],

        ManaBoxID: row['ManaBox ID'],
        collectorNumber: row['Collector number'],

    };
}