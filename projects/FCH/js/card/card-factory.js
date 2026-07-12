import { Card } from './card.js'
import { CARD_CONDITION, CARD_FINISH, CARD_RARITY, CONDITION_NAME, SOURCE } from "../enums.js";
import { searchForCard, updateCardData } from '../api/tcg-tracking.js';

/**
 * There definitely is a better way to make this. I need a working codebase though, so future terry is doing that
 * @param {object} data 
 * @param {SOURCE} source 
 * @returns {Card}
 */
// TODO- Find the better way to make this
export async function createCard(data, source) {
    
    let card = new Card();
    
    data.name && (card.name = data.name);
    data.namePrinted && (card.namePrinted = data.namePrinted);
    data.finish && (card.finish = parseFinish(data.finish));
    data.rarity && (card.rarity = parseRarity(data.rarity));
    data.setName && (card.setName = data.setName);
    data.count && (card.count = Number(data.count));
    data.collectorNumber && (card.collectorNumber = Number(data.collectorNumber));
    data.tcgpID && (card.tcgpID = Number(data.tcgpID));
    data.source && (card.source = data.source);
    
    if(!data.condition) {
        card.condition = CARD_CONDITION.NEAR_MINT;
        card.error.push(new Error(`condition not found on ${data.name}, assuming NM`))

    } else card.condition = data.condition;

    try {
        if(!data.productID) {        
            card.productID = await searchForCard(data.name, data.setCode, data.collectorNumber);
        } else card.productID = data.productID;
        await updateCardData(card);

    } catch(error) {
        card.success = false;
        card.error.push(error)

    } finally {
        return card;
    }
}

/**
 * 
 * @param {string} value
 * @returns {CARD_FINISH}
 */
// TODO- MAYBE refactor to parseValueToFinish?
export function parseFinish(value) {
    switch(value) {
        case 'Foil':
        case CARD_FINISH.FOIL:
            return CARD_FINISH.FOIL;
        case 'Normal':
        case CARD_FINISH.NORMAL:
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
// TODO- MAYBE refactor to parseValueToRarity?
export function parseRarity(value) {
    switch(value) {
        case CARD_RARITY.COMMON:
        case 'Common':
        case 'C':
            return CARD_RARITY.COMMON;
        case CARD_RARITY.UNCOMMON:
        case 'Uncommon':
        case 'U':
            return CARD_RARITY.UNCOMMON;
        case CARD_RARITY.RARE:
        case 'Rare':
        case 'R':
            return CARD_RARITY.RARE;
        case CARD_RARITY.MYTHIC:
        case 'Mythic':
        case 'M':
            return CARD_RARITY.MYTHIC;
        case CARD_RARITY.PROMO:
        case 'Promo':
        case 'P':
            return CARD_RARITY.PROMO;
        case CARD_RARITY.LAND:
        case 'Land':
        case 'L':
            return CARD_RARITY.LAND;
        case CARD_RARITY.TOKEN:
        case 'Token':
        case 'T':
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
// TODO- MAYBE refactor to parseValueToCondition?
export function parseCondition(value) {
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
// TODO- why did I do this?
function normalize(value) {    
    if (!value) {
        throw new Error("Missing value");
    }
    return value.trim();
}