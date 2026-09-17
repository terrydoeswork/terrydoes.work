// TODO- move file.js to core/ 

// responsible for parsing file and putting it in standardized data object
// standardized data obj is written same as Card Object

import { parseManaBox } from '../api/manabox.js';
import { parseMoxfield } from '../api/moxfield.js';
import { parseCSV } from '../api/papaparse.js';
import { parseTCGP } from '../api/tcgplayer.js';
import { DOM } from '../core/DOM.js'
import { SOURCE } from '../enums.js';


// TODO- Create JSDocs
export function validateUpload() {
    const files = DOM.import.fileUpload.files;

    if (files.length === 0) throw new Error(
        `Nothing Uploaded! \n` +
        `Details:`,
        files
    )
    return files[0];
}
/**
 * 
 * @param {*} file 
 * @param {SOURCE} source One of a few options. defaults to TCGPlayer if no input
 * @returns {object[]}
 */
export async function parseUpload(file, source) {
    switch(source) {
        case SOURCE.TCGPLAYER:
            return await parseTCGP(file);
        case SOURCE.MOXFIELD:
            return await parseMoxfield(file);
        case SOURCE.MANABOX:
            return await parseManaBox(file);
        case SOURCE.UNKNOWN:
        case defualt:
            if (file.name.toLowerCase().endsWith('.txt')) {
                return await parseMoxfield(file);
            }
            return await parseTCGP(file);
    }
}

