// TODO- Add File to Core... maybe??

export const DOM = {
    import: {
        fileUpload: document.getElementById('importInputFile'),
        submitButton: document.getElementById('importInputSubmit'),
        trimBulk: document.getElementById('importInputCheckTrimBulk'),
        priceThreshold: document.getElementById('importInputNumber'),
        window: document.getElementById('importWindow')
    },
    export: {
        window: document.getElementById('exportWindow'),
        asJSON: document.getElementById('exportAsJSON'),
        asTCGPlayer: document.getElementById('exportAsTCGPlayer'),
        asTXT: document.getElementById('exportAsText')
    },
    stats: {
        totalCards: document.getElementById('statsTotalCards'),
        totalPrice: document.getElementById('statsTotalPrice'),
        percentageRange: document.getElementById('statsInputRangePercentage'),
        percentagePrice: document.getElementById('statsPercentagePrice'),
        failedCards: document.getElementById('statsFailedCards'),
        trimmedCards: document.getElementById('statsTrimmedCards'),
        successfulCards: document.getElementById('statsSuccessfulCards'),
    },
    table: document.getElementById('tableDisplay'),
    tableError: document.getElementById('tableErrorDisplay')
}
