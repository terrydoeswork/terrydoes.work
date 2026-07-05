import * as ENUM from './enums.js'
/** 
* Standardized Card Object. 
* @constructor 
* @param {JSON} cardJSON - indivisual row of a TCGPlayer Collection CSV file. Used to generate Card object.
* @prop {String} productID - TCGPlayer Product ID. Also used for OPEN TCG API
* @prop {String} displayName - Self explanatory
* @prop {ENUM.CARD_FINISH} finish - Foil / Non-Foil
* @prop {ENUM.CARD_CONDITION} condition - NM / LP / MP / HP / DMG
* @prop {String} imageLink - URL to TCGPlayer's Image of card
* @prop {number} priceLow - The current lowest listing of card. Important metric for inventory buying
* @prop {number} priceMarket - The tradable price
* @prop {String} setName - 3 Letter String of the set the card is from
* @prop {String} notes - Random BS
* @prop {number} count - Number of cards in collection.
*/
export class Card {
    constructor(cardJSON) {
        this.productID = this.#initProductID(cardJSON); 
        this.name = this.#initName(cardJSON);        
        this.finish = this.#initFinish(cardJSON);
        this.condition = this.#initCondition(cardJSON);
        this.imageLink = this.#initTcgpImageLink(cardJSON);
        this.priceLow = undefined;
        this.priceMarket = undefined;
        this.setName = undefined;
        this.setCode = undefined;
        this.notes = this.#initNotes(cardJSON);
        this.count = this.#initQuantity(cardJSON);
        this.rarity = this.#initRarity(cardJSON);
        this.success = true;

        this.tcgpid = this.#inittcgpID(cardJSON);
        this.collectorNumber = this.#initCollectorNumber(cardJSON);
        this.error = undefined;
    }

    /**
     * Simplied version of the Card, Ideally for... tables.
     * @returns {JSON}
     * 1. cardImage
     * 2. cardName
     * 3. finish
     * 4. condition
     * 4. TCGLOW
     * 5. quantity
     */
    getSimplifiedCard() {
        return {
            image: this.imageLink,
            name: this.name,
            finish: this.finish,
            condition: this.condition,
            priceLow: this.priceLow,
            count: this.count,
            success: this.success
        }
    }

    /**
     * @returns {String} 
     */
    getTCGTrackingILink() {
        return 'https://tcgtracking.com/tcgapi/v1/products/' + this.productID;
    }

    /**
     * @returns {String}
     */
    getCondition() {
        switch(this.condition) {
            case 1:
                return 'NM';
            case 2:
                return 'LP';
            case 3:
                return 'MP';
            case 4:
                return 'HP';
            case 5:
                return 'DMG';
            default:
                throw new Error(`No condition on card ${this}`)
            }
    }
    
    /**
     * @returns {boolean}
     */
    isFoil() {
        if(this.finish == ENUM.CARD_FINISH.FOIL) {
            return true;
        } else return false;
    }

    /**
     * @returns {boolean}
     */
    isCardUnderRare() {
        return this.rarity < ENUM.CARD_RARITY.RARE;
    }

    getRarityString() {
        switch(this.rarity){
            case ENUM.CARD_RARITY.COMMON:
            default:
                return 'Common';
            case ENUM.CARD_RARITY.UNCOMMON:
                return 'Uncommon';
            case ENUM.CARD_RARITY.RARE:
                return 'Rare';
            case ENUM.CARD_RARITY.MYTHIC:
                return 'Mythic';
            case ENUM.CARD_RARITY.LAND:
                return 'Land';
            case ENUM.CARD_RARITY.TOKEN:
                return 'Token';
            case ENUM.CARD_RARITY.PROMO:
                return 'Promo';
            
        }
    }

    getFinishString() {
        switch(this.finish) {
            case ENUM.CARD_FINISH.FOIL:
                return 'Foil';
            case ENUM.CARD_FINISH.NORMAL:
            default:
                return 'Normal';
        
        
        }
    }

    /**
     * @returns {String}
     */
    getTCGPlayerLink() {
        return 'https://www.tcgplayer.com/product/' + this.productID;
    }

    #initName(data) {
        if (data['Product Name'] != null) return data['Product Name'];
    }
    
    #initProductID(data) {
        if (data['Product ID'] != null) return data['Product ID'];
    }

    #initCondition(data) {
        let conditionCased = data['Condition'].toUpperCase();
        switch(conditionCased) {
            case 'NM':
            case 'NEAR MINT':
                return ENUM.CARD_CONDITION.NEAR_MINT;
            case 'LP':
            case 'LIGHTLY PLAYED':
                return ENUM.CARD_CONDITION.LIGHTLY_PLAYED;
            case 'MP':
            case 'MODERATELY PLAYED':
                return ENUM.CARD_CONDITION.MODERATELY_PLAYED;
            case 'HP':
            case 'HEAVILY PLAYED':
                return ENUM.CARD_CONDITION.HEAVILY_PLAYED;
            case 'DM':
            case 'DMG':
            case 'DAMAGED':
                return ENUM.CARD_CONDITION.DAMAGED;
            default:
                console.warn(`Could not find condition for ${this.name} (${this.productID}), assuming NM.`)
                return ENUM.CARD_CONDITION.NEAR_MINT;
        }
    }

    #initFinish(data) {
        
        let finishCase = data['Printing'].toUpperCase();
        switch(finishCase) {
            case 'NORMAL':
                return ENUM.CARD_FINISH.NORMAL;
            case 'FOIL':
                return ENUM.CARD_FINISH.FOIL;
            default:
                console.warn(`Could not find finish for ${this.name} (${this.productID}), assuming Normal.`);
                return 1;
            }
    }
    


    #initTcgpImageLink(data) {
        if (data['Photo URL'] != null) return data['Photo URL'];
    }

    #initNotes(data) {
        if (data['Notes'] != null) {
            console.warn('this shouldnt show up!' + data['Notes']);
            return data['Notes'];
        } else return '';
    }
    
    #inittcgpID(data) {
        if (data['TCGplayer Id'] != null) {
            return data['TCGplayer Id'];
        }
    }

    #initQuantity(data) {
        if (data['Add to Quantity']) {
            return data['Add to Quantity'];
        }
    }

    #initRarity(data) {
        let rarityCase = data['Rarity'].toUpperCase();
        
        switch(rarityCase) {
            case 'COMMON':
                return ENUM.CARD_RARITY.COMMON;
            case 'UNCOMMON':
                return ENUM.CARD_RARITY.UNCOMMON;
            case 'RARE':
                return ENUM.CARD_RARITY.RARE;
            case 'MYTHIC':
                return ENUM.CARD_RARITY.MYTHIC;
            case 'PROMO':
                return ENUM.CARD_RARITY.PROMO;
            case 'LAND':
                return ENUM.CARD_RARITY.LAND;
            case 'TOKEN':
                return ENUM.CARD_RARITY.TOKEN;
        }

    }

    #initCollectorNumber(data) {
        if (data['Number']) {
            return data['Number'];
        }
    }
}

// /**
//  * Possible Card Coditions.
//  * @readonly
//  * @enum {number}
//  */
// export const CARD_CONDITION = Object.freeze({
//     NEAR_MINT: 1,
//     LIGHTLY_PLAYED: 2,
//     MODERATELY_PLAYED: 3,
//     HEAVILY_PLAYED: 4,
//     DAMAGED: 5
// });

// /**
//  * Possible Card Finishes
//  * @readonly
//  * @enum {number}
//  */
// export const CARD_FINISH = Object.freeze({
//     NORMAL: 1,
//     FOIL: 2
// })

// /**
//  * Possible Card Rarities
//  * @readonly
//  * @enum {number}
//  */
// export const CARD_RARITY = Object.freeze({
//     COMMON: 1,
//     UNCOMMON: 2,
//     RARE: 3,
//     MYTHIC: 4,
//     PROMO: 6,
//     LAND: 7,
//     TOKEN: 8
// })