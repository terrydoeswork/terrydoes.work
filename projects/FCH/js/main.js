import * as ENUM from './enums.js'
import { Card } from './card/card.js';
import { convertStringToNumber, moneyRound } from '../../../js/terrydoeslibrary.js';
import { initializePreview } from './mods/preview.js';
import { renderCollection, resetTable } from './mods/table.js';
import { DOM } from './core/DOM.js';
import { initializeStats, resetStats, updateStats } from './mods/stats.js';
import { initializeExport, registerExports, resetExports } from './mods/export.js';
import { createCard } from './card/card-factory.js';
import { updateCardData } from './api/tcg-tracking.js';
import { validateUpload, disableSubmitButton } from './mods/import.js';
import { parseCSV, parseTXT } from './api/papaparse.js';


init();

function init() {

    // modules inits
    initializePreview();
    initializeStats();
    initializeExport();

    // event listeners
    DOM.import.window.addEventListener('submit', handleSubmit);

}

async function handleSubmit(event) {
    event.preventDefault();

    try {
        resetEverything();
        disableSubmitButton(true);

        const file = validateUpload();
        const rows = await parseUpload(file)
        let discardPile = [];

        const cards = await buildCollection(rows, discardPile);

        renderCollection(cards);
        registerExports(cards);

        updateStats(cards);

    } catch (error) {
        console.error(error);

    } finally {
        disableSubmitButton(false);
    }
}

function resetEverything() {
    resetTable();
    resetStats();
    resetExports();
}


async function buildCollection(rows, discardPile) {
    const cards = []

    for (const row of rows) {
        const card = await createCard(row);

        console.log(card);
        
        try {

            if (shouldDiscard(card)) {
                discardPile.push(card);
            } else cards.push(card);

        } catch (error) {
            // card.error = error.message;
            console.error('Issue!', error);
            discardPile.push(card);
        }
    }
    return cards;
}

async function parseUpload(file) {
    if (file.name.toLowerCase().endsWith(".csv")) {
        return await parseCSV(file);
    } else {
        return await parseTXT(file);
    }
}

function shouldDiscard(card) {
    return (
        DOM.import.trimBulk.checked &&
        card.isCardUnderRare()
    ) || 
    card.priceLow < DOM.import.priceThreshold.value;
}