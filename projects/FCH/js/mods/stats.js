import { moneyRound } from "../../../../js/terrydoeslibrary.js";
import { DOM } from "../core/DOM.js";

let STATS = {
    totalCards: 0,
    totalPrice: 0.00,
    percentage: .65
}

export function initializeStats() {
    DOM.stats.percentageRange.addEventListener('input', handleRange);
}

/**
 * 
 * @param {STATS} stats 
 */
export function updateStats(cards) {
    
    let stats = calculateStats(cards);
    
    if(stats) Object.assign(STATS, stats);
    renderStats();
}

export function resetStats() {
    STATS = {
    totalCards: 0,
    totalPrice: 0.00,
    percentage: .65
    }
    renderStats();
}

function renderStats() {
    renderTotalCards();
    renderTotalPrice();
    renderPercentPrice();
}

function handleRange(event) {
    STATS.percentage = event.target.value / 100;
    renderPercentPrice();
}

function renderTotalCards() {
    DOM.stats.totalCards.textContent = STATS.totalCards;
}

function renderTotalPrice() {
    DOM.stats.totalPrice.textContent = '$' + STATS.totalPrice;
}
function renderPercentPrice() {

    DOM.stats.percentageRange.labels[0].textContent = Math.floor(STATS.percentage*100) + '%';

    DOM.stats.percentagePrice.textContent = '$' + moneyRound(STATS.percentage * STATS.totalPrice);
}

function calculateStats(cards) {
    let totalCards = cards.length;
    let totalPrice = 0;
    cards.forEach(card => {
        totalPrice += parseFloat(card.priceLow);
    });

    return {
        totalCards: totalCards,
        totalPrice: moneyRound(totalPrice)
    }
}