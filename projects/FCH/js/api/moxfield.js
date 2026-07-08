import { CARD_CONDITION, SOURCE } from "../enums.js";

const DELIMITER = {
    COUNT:' ',
    NAME:' (',
    SET:') ',
    COLLECTOR_NUMBER: ' ',
    FINISH:'*F*',
    SET_THELIST_BS: '-'
}
const FOIL_CODE = '*F*';
const THE_LIST_SETCODE = 'PLST';

/**
 *  
 * @param {File} file 
 */
export async function parseMoxfield(file) {
    const str = (await file.text()).split('\n');
    let cardList = [];

    str.forEach(line => {
        
        if(!isLineValid(line)) {
            console.log('skipped 1 line');
            return;
        } 

        const data = findAll(cleanLine(line));

        cardList.push({
            finish: data.finish,
            count: data.count,
            setCode: data.setCode,
            name: data.name,
            collectorNumber: data.collectorNumber,
            source: SOURCE.MOXFIELD
        })
    })
    
    return {
        source: SOURCE.MOXFIELD,
        cards: cardList
    }
}

function cleanLine(line) {
    return line
        .replaceAll('\r')
        .replaceAll('\n');
}

/**
 * needs improvement. Cant think how right now though.
 * @returns {object}
 */
function findAll(line) {
    
    let obj = {};

    obj.countArray = splitX(line, DELIMITER.COUNT); // returns ['1', 'name (set) 001 *f*']
    obj.nameArray = splitX(obj.countArray[1], DELIMITER.NAME); //returns ['name', '(set) 001 *f*']
    
    obj.setArray = splitX(obj.nameArray[1], DELIMITER.SET); //returns ['set', '001 *f*']

    if (obj.setArray[0] === THE_LIST_SETCODE) {

        obj.setArray = splitX(obj.setArray[1], DELIMITER.SET_THELIST_BS); 
    }
    
    obj.collectorNumberArray = splitX(obj.setArray[1], DELIMITER.COLLECTOR_NUMBER) // returns ['001', '*f*']
    obj.finish = isFoil(obj.collectorNumberArray[1]);

    return {
        count: obj.countArray[0],
        collectorNumber: Number(obj.collectorNumberArray[0].replace(/\D/g, "")),
        setCode: obj.setArray[0],
        name: obj.nameArray[0],
        finish: findFinish(obj.collectorNumberArray[1])
    }
    
}

function isFoil(line) {
    return line.endsWith(FOIL_CODE) || line.includes(FOIL_CODE);
}

function isLineValid(line) {
    return line.length > 7; 
}

function findFinish(line) {

    if(isFoil(line)) {
        return 'Foil';
    } else return 'Normal';
}

function splitX(line, delimiter) {
    const index = line.indexOf(delimiter);
    let targetArray = []
    
    targetArray.push(line.slice(0, index));
    targetArray.push(line.slice(index + delimiter.length));
     
    return targetArray;
}