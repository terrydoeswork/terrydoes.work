import { DOM } from "../core/DOM.js";

export function initializeImport() {
}

export function disableSubmitButton(bool) {
    if (bool) {
        DOM.import.submitButton.disabled = true;
        DOM.import.submitButton.innerText = 'Submitting...';
    } else {
        DOM.import.submitButton.disabled = false;
        DOM.import.submitButton.innerText = 'Submit';
    }
}
