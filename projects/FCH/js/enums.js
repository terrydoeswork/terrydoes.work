/**
 * Possible Card Coditions.
 * @readonly
 * @enum {number}
 */
export const CARD_CONDITION = Object.freeze({
    NEAR_MINT: 1,
    LIGHTLY_PLAYED: 2,
    MODERATELY_PLAYED: 3,
    HEAVILY_PLAYED: 4,
    DAMAGED: 5
});

/**
 * Possible Card Finishes
 * @readonly
 * @enum {number}
 */
export const CARD_FINISH = Object.freeze({
    NORMAL: 1,
    FOIL: 2
})

/**
 * Possible Card Rarities
 * @readonly
 * @enum {number}
 */
export const CARD_RARITY = Object.freeze({
    TOKEN: 0,
    PROMO: 1,
    COMMON: 2,
    UNCOMMON: 3,
    RARE: 101,
    MYTHIC: 102,
    LAND: 110
})