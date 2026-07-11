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
import { disableSubmitButton } from './mods/import.js';
import { parseCSV, parseTXT } from './api/papaparse.js';
import { parseUpload, validateUpload } from './services/file.js';


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
        const data = await parseUpload(file);
        
        let discardPile = [];

        const cards = await buildCollection(data, discardPile);

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

async function buildCollection(data, discardPile) {
    
    const cards = [];
    const source = data.source;
    let iCard = {}

    for (const card of data) {

        try {
            iCard = await createCard(card, source);
                    
            if(shouldDiscard(iCard)) {
                discardPile.push(iCard);
                
            } else if(!iCard.success) {
                throw new Error(`Card unsuccessful`)
            } else

            cards.push(iCard);
        } catch(error) {

            iCard.success = false;
            iCard.error.push(error);
            console.log(iCard);
            console.error('Issue!', error);
            
        } finally {
            console.log(iCard);
            
            
        }
        
    }
    return cards;
}

function shouldDiscard(card) {
    return (
        DOM.import.trimBulk.checked &&
        card.rarity < ENUM.CARD_RARITY.RARE
    ) || card.priceLow < DOM.import.priceThreshold.value;
}