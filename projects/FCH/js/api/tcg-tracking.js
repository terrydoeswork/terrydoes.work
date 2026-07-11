const LANGUAGE_ENGLISH = 1;
const GAME = {
    MTG: 1,
}
const URL = 'https://openapi.tcgtracking.com/v1/'

export async function updateCardData(card) {
        
    const data = await fetchLink(getProductLink(card.productID));
    
    let sku = locateSku(data, card.condition, card.finish);
    
    if (!isSkuValid(sku)) {
        throw new Error(`Could not find sku on card. Critical Error`)
    }

    card.priceLow = Number(sku.lowest_price);
    card.priceMarket = Number(sku.market_price);
    card.setCode = data.product.set_abbr;
    card.imageLink = data.product.image_url;

    return card;
}

export async function searchForCard(cardName, setCode, collectorNumber) {
    const searchData = await fetchLink(URL + GAME.MTG + '/search?q=' + setCode);
    const set = searchData.sets.find(set => 
        set.abbreviation === setCode
    )
    const setID = set.id;

    const setData = await fetchLink(URL + GAME.MTG + '/sets/' + setID + '/cards');

    const card = setData.products.find(card =>
        card.name == cardName ||
        card.clean_name == cardName ||
        card.number == collectorNumber
    )
    
    
    if (card?.id) {
        return Number(card.id);

    } else throw new Error(
        `Card not found: ${cardName} \n` +
        `Details:`, card
    )
}

async function fetchLink(link) {
    const response = await fetch(link)
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Link not found: ${link}\n` +
            `${errorText}`
        );
    }

    return await response.json();
}

function locateSku(data, condition, finish, language=LANGUAGE_ENGLISH) {
    return data.skus.find(sku =>
        sku.condition_id === condition && 
        sku.variant_id === finish &&
        sku.language_id === language
    )
}

function isSkuValid(sku) {
    return sku?.lowest_price != null
}

function getProductLink(productID) {
    return URL + '/products/' + productID;
}