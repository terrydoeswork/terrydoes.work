import * as ENUM from './enums.js'
import { Card } from './card.js';
import * as api from './api.js'

const myForm = document.getElementById('myForm');
const fileInput = document.getElementById('csvInput');
const trimLowRaritiesInput = document.getElementById('trimLowRarities');
const digitInputPrune = document.getElementById('digitInputPrune')
const collectionTable = document.getElementById('tableDisplay');
const cardPreview = document.createElement('img');
const submitButton = document.getElementById('submitButton');
document.body.appendChild(cardPreview);
cardPreview.id = 'cardPreview';

myForm.addEventListener('submit', handleSubmit);


/**
 * Convert a CSV file of one's TCGPlayer Collection into an HTML table. 
 * @param {*} event 
 */
async function handleSubmit(event) {
    // Prevent the default browser page reload behavior
    event.preventDefault(); 
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";

    const minPriceThreshold = digitInputPrune.value;
    const isTrimmingRarity = trimLowRaritiesInput.checked;

    // check if file uploaded
    const CSVFile = fileInput.files;
    
    if (CSVFile.length == 0) {
        console.warn('nothing uploaded :(')
        return;
    }

    const file = CSVFile[0]

    // check if file is csv or txt
    if (file.type != 'text/csv' && file.type != 'text/txt') {
        console.warn(`Expected a text/csv or text/txt, got ${file.type} instead!`);
        return;
    }

    const data = await api.parseCSV(file)
    
    const cardArray = [];
    const cardArrayDiscard = [];

    // For each data object i, create a card obj 
    // Update its PriceLow and Market if able. 
    // Match that card against the threshold price
    for(const i of data) {

        const iCard = new Card(i);

        try {
            await updateCardData(iCard);

            // test if Common or Uncommon
            if(isTrimmingRarity && iCard.isCardUnderRare()) {
                cardArrayDiscard.push(iCard);
            }
            
            // test if cast is under threshold
            else if(iCard.priceLow < minPriceThreshold) {
                cardArrayDiscard.push(iCard)

            } else cardArray.push(iCard);
            

        } catch(error) {
            console.error('Issue!', error);
            cardArrayDiscard.push(iCard);
        }

    }
    
    createTableFromCollection(cardArray);
    
    let btn = api.createdButtonElement('Download Active List', function() {
        api.downloadObjAsJSONFile(cardArray, `collection_list_(${new Date().toLocaleDateString()})`);
    })
    let btn2 = api.createdButtonElement('Download Discarded List', function() {
        api.downloadObjAsJSONFile(cardArrayDiscard, `discarded_collection_list_(${new Date().toLocaleDateString()})`);
    })
    let btn3 = api.createdButtonElement('Export as TCGPlayer/CSV', function() {
        api.downloadCSV(api.convertCardArrayToTCGPlayerList, `TCGPlayer List ${new Date().toLocaleDateString()}`)
    })

    myForm.appendChild(btn);
    myForm.appendChild(btn2);
    myForm.appendChild(btn3);

    // allow resubmitting 
    submitButton.disabled = false;
    submitButton.innerText = "Submit";
}


function createTableFromCollection(array) {

    const table = document.createElement('table');
    
    let totalPrice = 0
    
    const columns = [
        {
            header: 'Card',
            render(card, cell) {
                let foil = (card.isFoil()) ? '🌈' : '⬛';

                let text = `${card.name} ${foil}`;
                const span = document.createElement('span');
                const preview = document.getElementById('cardPreview'); // Im getting dejavu

                span.textContent = text;

                span.addEventListener('mouseenter', () => {
                    preview.src = card.imageLink;
                    preview.hidden = false;
                });

                span.addEventListener('mousemove', (e) => {
                    preview.style.left = `${e.clientX + 20}px`;
                    preview.style.top = `${e.clientY + 20}px`;
                });

                span.addEventListener('mouseleave', () => {
                    preview.hidden = true;
                });

                cell.appendChild(span)
            }
        },
        {
            header: 'Condition',
            render(card, cell) {
                const span = document.createElement('span');

                span.textContent = card.getCondition();

                cell.appendChild(span);
            }
        },
        {
            header: 'Low Price',
            render(card, cell) {
                const span = document.createElement('span');

                if(card.success) {
                    span.textContent = `$${card.priceLow}`;
                } else {
                    span.textContent = `$???`
                }

                cell.appendChild(span)
            }
        },
        {
            header: 'Count',
            render(card, cell) {
                const span = document.createElement('span');
                span.textContent = card.count;

                cell.appendChild(span);
            }
        }
    ];

    const headerRow = table.insertRow();
    
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.header;
        headerRow.appendChild(th);
    });

    array.forEach(card => {
    
        const row = table.insertRow();
        columns.forEach(col => {
            const cell = row.insertCell();
            col.render(card, cell);

        })

        totalPrice += Number(card.priceLow);
    });

    collectionTable.appendChild(table);

    let totalPriceBlock = document.getElementById('totalPrice');
        
    totalPriceBlock.innerText = totalPrice;

}




/**
 * 
 * @param {Card} card
 */
async function updateCardData(card) {
    
    const response = await fetch(card.getTCGTrackingILink()) 

    if (!response.ok) {
        const errorText = await response.text();
        card.success = false;
        throw new Error(
            `Card not found in OPEN TCG API database!\n` +
            `Card Name(ID): ${card.name} (${card.productID})\n` +            
            `Status: ${response.status}\n${errorText}`
        );
    }

    const data = await response.json()

    // Update card name & set code
    card.name = data.product.clean_name;
    card.setName = data.product.set_abbr;
    
    // Find sku with matching condition, foiling, and in ENGLISH
    let sku = data.skus?.find(sku =>
        sku.condition_id === card.condition && 
        sku.variant_id === card.finish &&
        sku.language_id === 1 // TCG API's id for english
    )

    
    if (sku && sku.lowest_price != null) {
        card.priceLow = sku.lowest_price;
        card.priceMarket = sku.market_price;
    } else {
        card.success = false;
        throw new Error(
            `There is no data for card sku!\n` +
            `Card Name(ID): ${card.name} (${card.productID})\n` +
            `Sku data: ${JSON.stringify(sku, null, 2)}`
        );
    }
    
    return card;
}


// function downloadAsJSONFile(obj, filename) {
//     const jsonString = JSON.stringify(obj, null, 4);
    
//     const blob = new Blob([jsonString], { type: 'application/json' });

//     const url = URL.createObjectURL(blob);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
// }

