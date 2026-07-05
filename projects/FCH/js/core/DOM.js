
export const DOM = {
    import: {
        fileUpload: document.getElementById('fileInput'),
        submitButton: document.getElementById('submitButton'),
        trimLowRaritiesButton: document.getElementById('trimLowRarities'),
        priceThreshold: document.getElementById('digitInputPrune'),
        importSettingsForm: document.getElementById('importSettingsForm')
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
        percentageRange: document.getElementById('statsPercentageRange'),
        percentagePrice: document.getElementById('statsPercentagePrice')
    },
    table: document.getElementById('tableDisplay')
}
