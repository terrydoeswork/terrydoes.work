import * as ENUM from './enums.js'
import { Card } from './card.js';
import * as FCH from './fch.js';
import * as API from '../../../assets/js/terrydoeslibrary.js';

const importTableList = document.getElementById('importTableList');
const exportButtonsList = document.getElementById('exportButtonsList')
const fileInput = document.getElementById('fileInput');
const trimLowRaritiesInput = document.getElementById('trimLowRarities');
const digitInputPrune = document.getElementById('digitInputPrune')
const collectionTable = document.getElementById('tableDisplay');
const cardPreview = document.createElement('img');
const submitButton = document.getElementById('submitButton');

const inputPriceAdjuster = document.getElementById('inputPriceAdjuster');

const statTotalPrice = document.getElementById('statsTotalPrice');
const statTotalCards = document.getElementById('statsTotalCards');
const statsPercentagePrice = document.getElementById('statsPercentagePrice');

document.body.appendChild(cardPreview);
cardPreview.id = 'cardPreview';
cardPreview.classList.add('w3-card');



importTableList.addEventListener('submit', handleSubmit);
inputPriceAdjuster.addEventListener('input', handleRangeQuery);


/**
 * Convert a CSV file of one's TCGPlayer Collection into an HTML table. 
 * @param {*} event 
 */
async function handleSubmit(event) {
    // Prevent the default browser page reload behavior
    event.preventDefault(); 
    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

    const minPriceThreshold = digitInputPrune.value;
    const isTrimmingRarity = trimLowRaritiesInput.checked;

    // check if file uploaded
    const CSVFile = fileInput.files;
    
    if (CSVFile.length == 0) {
        console.warn('nothing uploaded :(')
        submitButton.disabled = false;
        submitButton.innerText = 'Submit';
        return;
    }

    const file = CSVFile[0]

    // check if file is csv or txt
    if (file.type != 'text/csv' && file.type != 'text/txt') {
        console.warn(`Expected a text/csv or text/txt, got ${file.type} instead!`);
        submitButton.disabled = false;
        submitButton.innerText = 'Submit';
        return;
    }

    const data = await FCH.parseCSV(file)
    
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
    
    
    constructTable(cardArray);
    updateStatBlock(cardArray);
    
    let btn = document.getElementById('exportButtonAsJSON');
    btn.addEventListener('click', function() {
        FCH.downloadObjAsJSONFile(cardArray, `Collection(DevJSON)`);
    })

    let btn2 = document.getElementById('exportButtonAsText');
    btn2.addEventListener('click', function() {
        FCH.downloadTXT(FCH.convertCardArrayToTextList(cardArray), 'Collection(Text)')
    });
    
    let btn3 = document.getElementById('exportButtonAsTCGPlayer');
    btn3.addEventListener('click', function() {
        FCH.downloadCSV(FCH.convertCardArrayToTCGPlayerList(cardArray), 'Collection(TCGPlayerCollection)');
    });

    exportButtonsList.style.display = 'block';

    // allow resubmitting 
    submitButton.disabled = false;
    submitButton.innerText = 'Submit';
}

function constructTable(array) {
    const columns = [  
        {
            header: 'Card',
            headerClasses: [],
            render(card, cell) {

                let text = `${card.name}`;
                const span = document.createElement('span');
                span.textContent = text;

                cell.addEventListener('mouseenter', () => {
                   cardPreview.src = card.imageLink;
                   cardPreview.hidden = false;
                });

                cell.addEventListener('mousemove', (e) => {
                   cardPreview.style.left = `${e.clientX + 20}px`;
                   cardPreview.style.top = `${e.clientY + 20}px`;
                });

                cell.addEventListener('mouseleave', () => {
                   cardPreview.hidden = true;
                });

                cell.appendChild(span)
            }
        },
        {
            header: 'Finish',
            headerClasses: ['w3-center'],
            render(card, cell) {
                const span = document.createElement('span');
                const foil = (card.isFoil()) ? '🌈' : '⬛';

                span.textContent = foil;

                cell.classList.add('w3-center');
                cell.width = 'min-content';
                cell.appendChild(span);

            }
        },
        {
            header: 'Condition',
            headerClasses: ['w3-center'],
            render(card, cell) {
                const span = document.createElement('span');

                span.textContent = card.getCondition();

                cell.classList.add('w3-center');
                cell.appendChild(span);
            }
        },
        {
            header: 'Low Price',
            headerClasses: ['w3-center'],
            render(card, cell) {
                const span = document.createElement('span');

                if(card.success) {
                    span.textContent = `$${card.priceLow}`;
                } else {
                    span.textContent = `$???`
                }

                cell.classList.add('w3-right-align');
                cell.appendChild(span)
            }
        },
        {
            header: 'Count',
            headerClasses: ['w3-center'],
            render(card, cell) {
                const span = document.createElement('span');
                span.textContent = card.count;
                
                cell.classList.add('w3-right-align');
                cell.appendChild(span);
            }
        }
    ];

    API.createTable(columns, array, collectionTable);

}

function updateStatBlock(cardArray) {
    
    let totalCards = cardArray.length;
    let totalPrice = FCH.getTotalPrice(cardArray);

    statTotalCards.textContent = totalCards;
    statTotalPrice.textContent = '$' + totalPrice;
    
}

function handleRangeQuery(event) {

    let percent = inputPriceAdjuster.labels[0];
    let dd = inputPriceAdjuster.parentElement.nextElementSibling;

    // statTotalPrice.dd

    percent.textContent = inputPriceAdjuster.value + '%';
    dd.innerHTML = '$' + (API.moneyRound(API.convertStringToNumber(statTotalPrice.textContent) * API.convertStringToNumber(percent.textContent)));
    
}

// function createTableFromCollection(array) {
    
//     let totalPrice = 0
    
//     const columns = [  
//         {
//             header: 'Card',
//             headerClasses: [],
//             render(card, cell) {

//                 let text = `${card.name}`;
//                 const span = document.createElement('span');
//                 span.textContent = text;

//                 // cell.addEventListener('mouseenter', () => {
//                 //    cardPreview.src = card.imageLink;
//                 //    cardPreview.hidden = false;
//                 // });

//                 // cell.addEventListener('mousemove', (e) => {
//                 //    cardPreview.style.left = `${e.clientX + 20}px`;
//                 //    cardPreview.style.top = `${e.clientY + 20}px`;
//                 // });

//                 // cell.addEventListener('mouseleave', () => {
//                 //    cardPreview.hidden = true;
//                 // });

//                 cell.appendChild(span)
//             }
//         },
//         {
//             header: 'Finish',
//             headerClasses: ['w3-center'],
//             render(card, cell) {
//                 const span = document.createElement('span');
//                 const foil = (card.isFoil()) ? '🌈' : '⬛';

//                 span.textContent = foil;

//                 cell.classList.add('w3-center');
//                 cell.appendChild(span);
//             }
//         },
//         {
//             header: 'Condition',
//             headerClasses: ['w3-center'],
//             render(card, cell) {
//                 const span = document.createElement('span');

//                 span.textContent = card.getCondition();

//                 cell.classList.add('w3-center');
//                 cell.appendChild(span);
//             }
//         },
//         {
//             header: 'Low Price',
//             headerClasses: ['w3-center'],
//             render(card, cell) {
//                 const span = document.createElement('span');

//                 if(card.success) {
//                     span.textContent = `$${card.priceLow}`;
//                 } else {
//                     span.textContent = `$???`
//                 }

//                 cell.classList.add('w3-right-align');
//                 cell.appendChild(span)
//             }
//         },
//         {
//             header: 'Count',
//             headerClasses: ['w3-center'],
//             render(card, cell) {
//                 const span = document.createElement('span');
//                 span.textContent = card.count;
                
//                 cell.classList.add('w3-right-align');
//                 cell.appendChild(span);
//             }
//         }
//     ];

//     const headerRow = collectionTable.createTHead();
    
//     columns.forEach((col, index) => {
        
//         let a = true;
//         const th = document.createElement('th');
//         th.textContent = col.header;

//         th.addEventListener('click', function() {
//             API.sortTable(collectionTable, index, a);
//             a = !a;
//         });
        

//         col.headerClasses.forEach(c => {
//             th.classList.add(c);
//         });

//         headerRow.appendChild(th);

//     });

//     array.forEach(card => {
    
//         const row = collectionTable.insertRow();
//         columns.forEach(col => {
//             const cell = row.insertCell();
//             col.render(card, cell);

//         })

//         totalPrice += Number(card.priceLow);

        
//         row.addEventListener('mouseenter', () => {
//             cardPreview.src = card.imageLink;
//             cardPreview.hidden = false;
//         });

//         row.addEventListener('mousemove', (e) => {

//             cardPreview.style.left = `${e.clientX + 20}px`;
//             cardPreview.style.top = `${e.clientY + 20}px`;
//         });

//         row.addEventListener('mouseleave', () => {
//             cardPreview.hidden = true;
//         });
//     });

//     let totalPriceBlock = document.getElementById('totalPrice');
        
//     totalPriceBlock.innerText = API.moneyRound(totalPrice);

// }




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