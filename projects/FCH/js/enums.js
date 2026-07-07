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
    DAMAGED: 5,
});

/**
 * Possible Card Finishes
 * @readonly
 * @enum {number}
 */
export const CARD_FINISH = Object.freeze({
    NORMAL: 1,
    FOIL: 2,
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
    LAND: 110,
})

export const FINISH_EMOJI = Object.freeze({
    [CARD_FINISH.NORMAL]: '⬛',
    [CARD_FINISH.FOIL]: '🌈'
});

export const FINISH_NAME = Object.freeze({
    [CARD_FINISH.NORMAL]: 'Normal',
    [CARD_FINISH.FOIL]: 'Foil'
})

export const CONDITION_NAME = Object.freeze({
    [CARD_CONDITION.NEAR_MINT]: 'NM',
    [CARD_CONDITION.LIGHTLY_PLAYED]: 'LP',
    [CARD_CONDITION.MODERATELY_PLAYED]: 'MP',
    [CARD_CONDITION.HEAVILY_PLAYED]: 'HP',
    [CARD_CONDITION.DAMAGED]: 'DMG'
});

export const RARITY_NAME = Object.freeze({
    [CARD_RARITY.COMMON]: 'Common',
    [CARD_RARITY.UNCOMMON]: 'Uncommon',
    [CARD_FINISH.RARE]: 'Rare',
    [CARD_RARITY.MYTHIC]: 'Mythic',
    [CARD_RARITY.TOKEN]: 'Token',
    [CARD_RARITY.PROMO]: 'Promo',
    [CARD_RARITY.LAND]: 'Land'
});