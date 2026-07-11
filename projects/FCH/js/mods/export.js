import { DOM } from "../core/DOM.js"

const CONFIG = {
    FILENAME: 'Collection'
}

const FILE_TYPES = {
    TXT: {
        extension: '.txt',
        blob: 'text/plain'
    },
    CSV: {
        extension: '.csv',
        blob: 'text/csv;charset=utf-8'
    },
    JSON: {
        extension: '.json',
        blob: 'application/json'
    }
}


const EXPORTTYPES = [
    {
        fileType: FILE_TYPES.JSON,
        event: jsonHandleClick,
        dom: DOM.export.asJSON
    },
    {
        fileType: FILE_TYPES.TXT,
        event: textHandleClick,
        dom: DOM.export.asTXT
    },
    {
        fileType: FILE_TYPES.CSV,
        event: tcgpHandleClick,
        dom: DOM.export.asTCGPlayer
    }
]

let COLLECTION = [];


// exports 
export function initializeExport() {
    hideExportWindow(true);
}

export function resetExports() {
    
    hideExportWindow(true);
    COLLECTION = [];
    EXPORTTYPES.forEach(item => {
        item.dom.removeEventListener('click', item.event);
    })
}

export function registerExports(cardArray) { 
    // called in main.js

    COLLECTION = cardArray;
    EXPORTTYPES.forEach(item => {
        item.dom.addEventListener('click', item.event);
    })
    hideExportWindow(false);
}

// General

function downloadFile(obj, fileName, fileExtensionType) {    
    const blob = new Blob([obj], { type: fileExtensionType.blob });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName + fileExtensionType.extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function hideExportWindow(bool) {
    if(bool) {
        DOM.export.window.style.display = 'none';
    } else {    
        DOM.export.window.style.display = 'block';
    }
}

// JSON 
function jsonHandleClick(e) {
    const obj = JSON.stringify(COLLECTION, null, 4);
    downloadFile(obj, CONFIG.FILENAME + `(DevMode)`, FILE_TYPES.JSON);
}

// Moxfield // text
function textHandleClick(e) {
    downloadFile(parseText(), CONFIG.FILENAME, FILE_TYPES.TXT);
}

function parseText() {
    let j = [];
    COLLECTION.forEach(card => {
        j.push(
            `${card.count} ${card.name} ${card.setCode} ${card.collectorNumber}\n`
        );
    })

    return j;
}

// TCGPlayer List
async function tcgpHandleClick(e) {
    const j = toTCGPlayerList();
    const pp = Papa.unparse(j);
    downloadFile(pp, CONFIG.FILENAME + '(TCGPlayer List)', FILE_TYPES.CSV);
}

function toTCGPlayerList() {
    
    const targetArray = []

    COLLECTION.forEach(card => {
        targetArray.push({
            'Product ID': card.productID,
            'TCGplayer Id': card.tcgpid,
            'Product Line': 'Magic: The Gathering',
            'Set Name': '',
            'Product Name': card.name,
            'Title': '',
            'Number': '',
            'Rarity': card.rarityName,
            'Condition': card.conditionName,
            'Printing': card.finishName,
            'TCG Market Price': '',
            'TCG Direct Low': '',
            'TCG Low Price With Shipping': '',
            'TCG Low Price': '',
            'Total Quantity': '',
            'Add to Quantity': card.count,
            'TCG Marketplace Price': '',
            'Photo URL': card.imageLink
        })
    })
    return targetArray;
}