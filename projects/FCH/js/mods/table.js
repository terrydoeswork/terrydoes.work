import { hidePreview, movePreview, showPreview } from './preview.js';
import { createTable } from '../../../../js/terrydoeslibrary.js';
import { DOM } from '../core/DOM.js';
import { FINISH_EMOJI } from '../enums.js';

// TODO- Create JSDocs
export const TABLE_COLUMNS = [  
    {
        header: 'Card',
        headerClasses: [],
        render: renderCardName
    },
    {
        header: 'Finish',
        headerClasses: ['w3-center'],
        render: renderCardFinish
    },
    {
        header: 'Condition',
        headerClasses: ['w3-center'],
        render: renderCardCondition
    },
    {
        header: 'Low Price',
        headerClasses: ['w3-center'],
        render: renderCardLowPrice
    },
    {
        header: 'Count',
        headerClasses: ['w3-center'],
        render: renderCardCount
    }
];

function renderCardName(card, cell) {

    let text = `${card.name}`;
    const span = document.createElement('span');
    span.textContent = text;

    cell.appendChild(span);
    
    cell.addEventListener('mouseenter', () => {
        showPreview(card.imageLink);
    });

    cell.addEventListener('mousemove', (e) => {
        movePreview(e.clientX, e.clientY);
    });

    cell.addEventListener('mouseleave', () => {
        hidePreview();
    });    
}

function renderCardFinish(card, cell) {
    const span = document.createElement('span');
    const foil = (FINISH_EMOJI[card.finish]);

    span.textContent = foil;

    cell.classList.add('w3-center');
    cell.width = 'min-content';
    cell.appendChild(span);
    
}

function renderCardCondition(card, cell) {
    const span = document.createElement('span');

    span.textContent = card.conditionName;

    cell.classList.add('w3-center');
    cell.appendChild(span);
    
}

function renderCardLowPrice(card, cell) {
    const span = document.createElement('span');

    if(card.success) {
        span.textContent = `$${card.priceLow}`;
    } else {
        span.textContent = `$???`
    }

    cell.classList.add('w3-right-align');
    cell.appendChild(span);
}

function renderCardCount(card, cell) {
    const span = document.createElement('span');
    span.textContent = card.count;
    
    cell.classList.add('w3-right-align');
    cell.appendChild(span);
}

// TODO- Create JSDocs
export function renderCollection(cards) {    
    createTable(TABLE_COLUMNS, cards, DOM.table);
}

export function resetTable() {
    DOM.table.replaceChildren();
}