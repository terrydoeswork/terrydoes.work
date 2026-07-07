
const LANGUAGE_ENGLISH = 1;

export async function updateCardData(card) {
    
    const response = await fetchLink(card.TCGTrackingILink);
    const data = await response.json();
    
    let sku = locateSku(data, card.condition, card.finish);
    let priceLow, priceMarket, success, error;

    if (isSkuValid(sku)) {
        priceLow = sku.lowest_price;
        priceMarket = sku.market_price;
    } else {
        error = true;
    }

    card.updateFromTCGTracking({
        success: success,
        error: error,

        priceLow: priceLow,
        priceMarket: priceMarket,

        setCode: data.product.set_abbr,
        namePrinted: data.product.clean_name
    })
    
    return card;
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
    return response;
}

function locateSku(data, condition, finish, language=LANGUAGE_ENGLISH) {
    return data.skus.find(sku =>
        sku.condition_id === condition && 
        sku.variant_id === finish &&
        sku.language_id === language
    )
}

function isSkuValid(sku) {
    return sku.lowest_price != null
}