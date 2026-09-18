import { isWithinPercentage } from '../../../../js/terrydoeslibrary.js';
import { CARD_CONDITION, CARD_FINISH, CARD_RARITY, CONDITION_NAME, FINISH_EMOJI, FINISH_NAME, RARITY_NAME } from '../enums.js';

// TODO- Create better JSDocs
export class Card {
    
    /**
     * Create a Card Object
     * @param {string} name Name including (foil etched) and such
     * @param {CARD_FINISH} finish nonfoil, foil, rare cases etched
     * @param {CARD_CONDITION} condition NM, LP, MP, HP, DMG
     * @param {number} count number of identical cards this object repersents
     * 
     * @param {string} setCode 3-4 letter code for set 
     * @param {string} setName name of set. Usually pretty long 
     * 
     * @param {string} namePrinted Name as printed on the card
     * @param {CARD_RARITY} rarity Token, Rare, Promo etc 
     * @param {number} collectorNumber 1-4 digit number
     * 
     * @param {number} priceLow number of pennies. Divide by 100 to get in USD
     * @param {number} priceMarket number of pennies. Divide by 100 to get in USD
     * @param {number} priceDamaged price of a damaged copy AKA worse case scenario
     * @param {number} priceMint price of a NM copy AKA best case scenario
     * 
     * @param {number} productID internal number of card
     * @param {number} tcgpID inernal number of card including condition and finish
     * @param {string} scryfallID 
     * @param {number} manaBoxID
     * 
     * @param {string} imageLink link to card image file 
     * 
     * @param {boolean} success default=true, set to false if issue
     * @param {Error[]} error collection of errors when constructing card
     */
    
    constructor(
        name=undefined, namePrinted=undefined, finish=CARD_FINISH.UNKNOWN, condition=CARD_CONDITION.UNKNOWN, rarity=undefined, setCode=undefined, setName=undefined, count=undefined, collectorNumber=undefined, 
        priceLow=undefined, priceMarket=undefined, priceDamaged=undefined, priceMint=undefined,
        productID=undefined, tcgpID=undefined, manaBoxID=undefined, scryfallID=undefined, imageLink=undefined, 
        success=true, error=[]) {

        // card physical details 
        this.name = name;
        this.namePrinted = namePrinted;
        this.finish = finish;
        this.condition = condition;
        this.rarity = rarity;
        this.setCode = setCode;
        this.setName = setName;
        this.count = count;
        this.collectorNumber = collectorNumber;

        // pricing
        this.priceLow = priceLow;
        this.priceMarket = priceMarket;
        
        this.priceRange = {
            nonfoil: {
                low: priceLow,
                market: priceMarket,
                damaged: priceDamaged,
                mint: priceMint
            },
            foil: {
                low: priceLow,
                market: priceMarket,
                damaged: priceDamaged,
                mint: priceMint
            }
        }

        // tcgplayer / tcgtacking data
        this.productID = productID;
        this.tcgpID = tcgpID;
        this.imageLink = imageLink;

        // other IDs and what not
        this.manaBoxID = manaBoxID;
        this.scryfallID = scryfallID;

        // meta data
        this.success = success;
        this.error = [];
        
    }

    updateFromTCGTracking(data) {
        this.priceLow = data.priceLow;
        this.priceMarket = data.priceMarket;

        this.setCode = data.setCode;
        this.namePrinted = data.namePrinted;
        this.imageLink = data.imageLink;

    }

    /**
     * @returns {boolean}
     */
    isFoil() {
        return this.finish === CARD_FINISH.FOIL;
    }

    /**
     * @param {number} percent 1-100- How close is Lowprice to marketprice?
     * @returns {boolean}
     */
    isSus(percent) {
        return !isWithinPercentage(this.priceLow, this.priceMarket, 50)
    }

    /**
     * @returns {boolean}
     */
    get isUnderRare() {
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

    get rarityName() {
        return RARITY_NAME[this.rarity];
    }

    get finishEmoji() {
        return FINISH_EMOJI[this.finish];
    }
}