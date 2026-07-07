import { DOM } from "../core/DOM.js";

export function initializeImport() {
}


export function validateUpload() {
    const files = DOM.import.fileUpload.files;

    if (files.length === 0) throw new Error(
        `Nothing Uploaded! \n` +
        `Details: \n` +
        files.toString()
    )
    return files[0];
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
