import { CARD_CONDITION, CARD_FINISH, CARD_RARITY, CONDITION_NAME, FINISH_NAME, RARITY_NAME } from '../enums.js';

export class Card {
    constructor(data) {
        // card physical details 
        this.name = data.name;
        this.namePrinted = data.namePrinted;
        this.finish = data.finish;
        this.condition = data.condition;
        this.rarity = data.rarity;
        this.setCode = data.setCode;
        this.setName = data.setName;
        this.count = data.count;
        this.collectorNumber = data.collectorNumber;

        // pricing
        this.priceLow = data.priceLow;
        this.priceMarket = data.priceMarket;

        // tcgplayer / tcgtacking data
        this.productID = data.productID;
        this.tcgpID = data.tcgpID;
        this.imageLink = data.imageLink;

        // meta data
        this.success = data.success ?? true;
        this.notes = data.notes;
        this.error = data.error;
    }
   
    updateFromTCGTracking(data) {
        this.success = data.success;
        
        this.error = data.error;

        this.priceLow = data.priceLow;
        this.priceMarket = data.priceMarket;

        this.setCode = data.setCode;
        this.namePrinted = data.namePrinted;

    }

    /**
     * @returns {boolean}
     */
    isFoil() {
        return this.finish === CARD_FINISH.FOIL;
    }

    /**
     * @returns {boolean}
     */
    isUnderRare() {
        return this.rarity < CARD_RARITY.RARE;
    }

    get conditionName() {
        return CONDITION_NAME[this.condition];
    }

    get finishName() {
        return FINISH_NAME[this.finish];
    }

    get TCGTrackingILink() {
        return 'https://tcgtracking.com/tcgapi/v1/products/' + this.productID;

    }
}