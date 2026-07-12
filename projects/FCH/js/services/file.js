// responsible for parsing file and putting it in standardized data object
// standardized data obj is written same as Card Object

import { parseMoxfield } from '../api/moxfield.js';
import { parseCSV } from '../api/papaparse.js';
import { parseTCGP } from '../api/tcgplayer.js';
import { DOM } from '../core/DOM.js'


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

// TODO- Create JSDocs
// TODO- Add better scanning for TCGPlayer and Moxfield
export async function parseUpload(file) {
    if (file.name.toLowerCase().endsWith('.csv')) {

        return await parseTCGP(file);
    } else if (file.name.toLowerCase().endsWith('.txt')) {
        return await parseMoxfield(file);
    }
}

