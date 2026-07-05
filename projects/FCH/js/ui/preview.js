const cardPreview = document.createElement('img');

export function initializePreview() {
    document.body.appendChild(cardPreview);
    cardPreview.id = 'cardPreview';
    cardPreview.classList.add('w3-card');

}

export function showPreview(image, coordX, coordY) {
    cardPreview.src = image;
    cardPreview.hidden = false;
}

export function movePreview(coordX, coordY) {
    cardPreview.style.left = `${coordX + 20}px`;
    cardPreview.style.top = `${coordY + 20}px`;
}

export function hidePreview() {
    cardPreview.hidden = true;
}