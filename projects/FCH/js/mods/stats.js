import { moneyRound } from "../../../../js/terrydoeslibrary.js";
import { DOM } from "../core/DOM.js";

let STATS = {
    totalCards: 0,
    totalPrice: 0.00,
    percentage: .65,
    successfulCards: 0,
    failedCards: 0
}

export function initializeStats() {
    DOM.stats.percentageRange.addEventListener('input', handleRange);
}

// TODO- Create JSDocs
export function updateStats(collection) {
    
    let stats = calculateStats(collection);
    
    if(stats) Object.assign(STATS, stats);

    renderStats();
}

export function resetStats() {
    STATS = {
        totalCards: 0,
        totalPrice: 0.00,
        percentage: .65,
        successfulCards: 0,
        failedCards: 0
    }
    renderStats();
}

function renderStats() {
    renderSuccessfulCards();
    renderTotalPrice();
    renderPercentPrice();
    renderFailedCards();
    renderTrimmedCards();
}

function handleRange(event) {
    STATS.percentage = event.target.value / 100;
    renderPercentPrice();
}

function renderTrimmedCards() {
    DOM.stats.trimmedCards.textContent = STATS.trimmedCards;
}

function renderFailedCards() {
    DOM.stats.failedCards.textContent = STATS.failedCards;
}

function renderSuccessfulCards() {
    DOM.stats.successfulCards.textContent = STATS.successfulCards;
}

function renderTotalPrice() {
    DOM.stats.totalPrice.textContent = '$' + STATS.totalPrice;
}
function renderPercentPrice() {

    DOM.stats.percentageRange.labels[0].textContent = Math.floor(STATS.percentage*100) + '%';

    DOM.stats.percentagePrice.textContent = '$' + moneyRound(STATS.percentage * STATS.totalPrice);
}

function calculateStats(collection) {

    let failedCards = collection.failed.length;
    let trimmedCards = collection.trimmed.length;
    let successfulCards = collection.success.length;
    let totalCards = collection.success.length + collection.failed.length + collection.trimmed.length;
    let totalPrice = 0;

    collection.success.forEach(card => {
        totalPrice += parseFloat(card.priceLow);
    });

    return {
        totalCards: totalCards,
        totalPrice: moneyRound(totalPrice),
        successfulCards: successfulCards,
        failedCards: failedCards,
        trimmedCards: trimmedCards,

    }
}