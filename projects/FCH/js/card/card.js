import { CARD_CONDITION, CARD_FINISH, CARD_RARITY, CONDITION_NAME, FINISH_EMOJI, FINISH_NAME, RARITY_NAME, SOURCE} from '../enums.js';

// TODO- Create better JSDocs
export class Card {
    
    /**
     * Create a Card Object
     * @param {string} name Name including (foil etched) and such
     * @param {string} namePrinted Name as printed on the card 
     * @param {CARD_FINISH} finish nonfoil, foil 
     * @param {CARD_CONDITION} condition NM, LP, MP, HP, DMG
     * @param {CARD_RARITY} rarity Token, Rare, Promo etc 
     * @param {string} setCode 3-4 letter code for set 
     * @param {string} setName name of set. Usually pretty long 
     * @param {number} count number of identical cards this object repersents
     * @param {number} collectorNumber 1-4 digit number
     * @param {number} priceLow number of pennies. Divide by 100 to get in USD
     * @param {number} priceMarket number of pennies. Divide by 100 to get in USD
     * @param {number} productID internal number of card
     * @param {number} tcgpID inernal number of card including condition and finish
     * @param {string} imageLink link to card image file 
     * @param {boolean} success default=true, set to false if issue 
     * @param {string} notes pretty useless, might delete
     * @param {Error[]} error collection of errors when constructing card 
     * @param {SOURCE} source where the card data is parsed from
     */
    
    constructor(
        name=undefined, namePrinted=undefined, finish=undefined, condition=undefined, rarity=undefined, setCode=undefined, setName=undefined, count=undefined, collectorNumber=undefined, 
        priceLow=undefined, priceMarket=undefined, 
        productID=undefined, tcgpID=undefined, imageLink=undefined, 
        success=true, notes=undefined, error=[], source=SOURCE.UNKNOWN) {
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

        // tcgplayer / tcgtacking data
        this.productID = productID;
        this.tcgpID = tcgpID;
        this.imageLink = imageLink;

        // meta data
        this.success = success;
        this.notes = notes;
        this.error = [];
        this.source = source;
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