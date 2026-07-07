import { Card } from './card.js'
import { CARD_CONDITION, CARD_FINISH, CARD_RARITY } from "../enums.js";
import { updateCardData } from '../api/tcg-tracking.js';

export async function createCard(row) {
    const card = createCardFromTCGPlayerList(row);
    await updateCardData(card);

    return card;
}

function createCardFromTCGPlayerList(row) {
    return new Card({
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
    });
}

/**
 * 
 * @param {string} value
 * @returns {CARD_FINISH}
 */
function parseFinish(value) {
    switch(value) {
        case 'Foil':
            return CARD_FINISH.FOIL;
        case 'Normal':
            return CARD_FINISH.NORMAL;
        default:
            return null;
    }
}

/**
 * 
 * @param {string} value
 * @returns {CARD_RARITY}
 */
function parseRarity(value) {
    switch(value) {
        case 'Common':
            return CARD_RARITY.COMMON;
        case 'Uncommon':
            return CARD_RARITY.UNCOMMON;
        case 'Rare':
            return CARD_RARITY.RARE;
        case 'Mythic':
            return CARD_RARITY.MYTHIC;
        case 'Promo':
            return CARD_RARITY.PROMO;
        case 'Land':
            return CARD_RARITY.LAND;
        case 'Token':
            return CARD_RARITY.TOKEN;
        default:
            return null;
    }
}

/**
 * 
 * @param {string} value 
 * @returns {CARD_CONDITION}
 */
function parseCondition(value) {
    switch(value) {
        case 'Near Mint':
            return CARD_CONDITION.NEAR_MINT;
        case 'Lightly Played':
            return CARD_CONDITION.LIGHTLY_PLAYED;
        case 'Moderately Played':
            return CARD_CONDITION.MODERATELY_PLAYED;
        case 'Heavily Played':
            return CARD_CONDITION.HEAVILY_PLAYED;
        case 'Damaged':
            return CARD_CONDITION.DAMAGED;
        default:
            return null;
    }  
}

/**
 * 
 * @param {string} value 
 * @returns {string}
 */
function normalize(value) {    
    if (!value) {
        throw new Error("Missing value");
    }
    return value.trim();
}