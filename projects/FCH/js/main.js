import * as ENUM from './enums.js'
import { Card } from './card.js';
import * as FCH from './fch.js';
import { convertStringToNumber, moneyRound } from '../../../assets/js/terrydoeslibrary.js';
import { initializePreview } from './ui/preview.js';
import { renderCollection, resetTable } from './ui/table.js';
import { DOM } from './core/DOM.js';
import { initializeStats, resetStats, updateStats } from './ui/stats.js';
import { initializeExport, registerExports, resetExports } from './ui/export.js';


const LANGUAGE_ENGLISH = 1;

init();

function init() {

    // modules inits
    initializePreview();
    initializeStats();
    initializeExport();
    // event listeners
    
    DOM.import.importWindow.addEventListener('submit', handleSubmit);
    
}

async function handleSubmit(event) {
    event.preventDefault();

    try {

        resetEverything();
        disableSubmitButton(true);

        const file = validateUpload();
        let rows = [];
    
        if (file.name.includes('.csv')) { 
            rows = await FCH.parseCSV(file);            
        } else {
            rows = await FCH.parseTXT(file);
        }

        let cardsDiscard = [];
        
        const cards = await buildCollection(rows, cardsDiscard);
        
        renderCollection(cards);
        registerExports(cards);

        let stats = calculateStats(cards);
        updateStats(stats);
    } catch(error) {
        console.error(error);
        
    }finally {
        disableSubmitButton(false);
    }
}

function validateUpload() {
    const files = DOM.import.fileUpload.files;

    if (files.length === 0) throw new Error(
        `Nothing Uploaded! \n` +
        `Details: \n` +
        files.toString()
    )
    return files[0];
}

/**
 * 
 * @param {Card} card
 */
async function updateCardData(card) {
    
    const response = await fetch(card.getTCGTrackingILink()) 

    if (!response.ok) {
        const errorText = await response.text();
        card.success = false;
        throw new Error(
            `Card not found in OPEN TCG API database!\n` +
            `Card Name(ID): ${card.name} (${card.productID})\n` +            
            `Status: ${response.status}\n${errorText}`
        );
    }

    const data = await response.json()

    // Update card name & set code
    card.name = data.product.clean_name;
    card.setName = data.product.set_abbr;
    
    // Find sku with matching condition, foiling, and in ENGLISH
    let sku = data.skus?.find(sku =>
        sku.condition_id === card.condition && 
        sku.variant_id === card.finish &&
        sku.language_id === 1 // TCG API's id for english
    )

    
    if (sku && sku.lowest_price != null) {
        card.priceLow = sku.lowest_price;
        card.priceMarket = sku.market_price;
    } else {
        card.success = false;
        throw new Error(
            `There is no data for card sku!\n` +
            `Card Name(ID): ${card.name} (${card.productID})\n` +
            `Sku data: ${JSON.stringify(sku, null, 2)}`
        );
    }
    
    return card;
}

function disableSubmitButton(bool) {
    if(bool) {
        submitButton.disabled = true;
        submitButton.innerText = 'Submitting...';
    } else {
        submitButton.disabled = false;
        submitButton.innerText = 'Submit';
    }
}


async function buildCollection(rows, discardPile) {
    const cards = []

    for(const row of rows) {
        const iCard = new Card(row);

        try {
            await updateCardData(iCard);
            
            if(shouldDiscard(iCard)) {
                discardPile.push(iCard);
            } else cards.push(iCard);

        } catch(error) {
            iCard.error = error.message;
            console.error('Issue!', error);
            discardPile.push(iCard);
        }
    }
    return cards;
}

function shouldDiscard(card) {
    return (
        DOM.import.trimLowRaritiesButton.checked &&
        card.isCardUnderRare()
    ) ||
    card.priceLow < DOM.import.priceThreshold.value;
}

function resetEverything() {
    resetTable();
    resetStats();
    resetExports();
}

function calculateStats(cards) {
    let totalCards = cards.length;
    let totalPrice = 0;
    cards.forEach(card =>{        
        totalPrice += parseFloat(card.priceLow);
    });

    return {
        totalCards: totalCards,
        totalPrice: moneyRound(totalPrice)
    }
}