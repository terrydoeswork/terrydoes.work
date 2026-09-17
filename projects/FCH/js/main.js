import * as ENUM from './enums.js'
import { Card } from './card/card.js';
import { convertStringToNumber, moneyRound } from '../../../js/terrydoeslibrary.js';
import { initializePreview } from './mods/preview.js';
import { renderCollection, resetErrorTable, resetTable } from './mods/table.js';
import { DOM } from './core/DOM.js';
import { initializeStats, resetStats, updateStats } from './mods/stats.js';
import { initializeExport, registerExports, resetExports } from './mods/export.js';
import { createCard } from './card/card-factory.js';
import { updateCardData } from './api/tcg-tracking.js';
import { disableSubmitButton, initializeImport } from './mods/import.js';
import { parseCSV, parseTXT } from './api/papaparse.js';
import { parseUpload, validateUpload } from './services/file.js';


init();

function init() {

    // modules inits
    initializePreview();
    initializeStats();
    initializeExport();
    initializeImport();

    // event listeners
    DOM.import.window.addEventListener('submit', handleSubmit);

}

async function handleSubmit(event) {
    event.preventDefault();

    try {
        resetEverything();
        disableSubmitButton(true);

        const file = validateUpload();
        const data = await parseUpload(file, ENUM.SOURCE.MANABOX);

        const collection = await buildCollection(data, ENUM.SOURCE.MANABOX);

        renderCollection(collection);
        registerExports(collection);

        updateStats(collection);

    } catch (error) {
        console.error(error);

    } finally {
        disableSubmitButton(false);
    }
}

// TODO- Change to Globally Defined Object
function resetEverything() {
    resetTable();
    resetErrorTable();
    resetStats();
    resetExports();
}

// TODO- use promise all mapping
// TODO- create seperate file for this?
async function buildCollection(data) {
    
    const cards = [];

    const collection = {
        failed: [],
        trimmed: [],
        success: []
    }

    const source = data.source;
    let iCard = {}

    for (const card of data) {

        try {
            iCard = await createCard(card, source);
                    
            if(shouldDiscard(iCard)) {
                collection.trimmed.push(iCard);

            } else if(!iCard.success) {
                throw new Error(`Card unsuccessful`)

            } else

            collection.success.push(iCard);

        } catch(error) {
            iCard.success = false;
            // iCard.error.push(error);
            console.error('Issue!', error);
            
            collection.failed.push(iCard);
        } finally {
            console.log(iCard);
        }

    }
    return collection
}


// TODO- maybe abstract this
function shouldDiscard(card) {
    return (
        DOM.import.trimBulk.checked &&
        card.rarity < ENUM.CARD_RARITY.RARE
    ) || card.priceLow < DOM.import.priceThreshold.value;
}