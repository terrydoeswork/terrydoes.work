const cardPreview = document.createElement('img');

export function initializePreview() {
    document.body.appendChild(cardPreview);
    cardPreview.id = 'cardPreview';
    cardPreview.classList.add('w3-card');

}

// TODO- Create JSDocs and comment
export function showPreview(image, coordX, coordY) {
    cardPreview.src = image;
    cardPreview.hidden = false;
}

// TODO- Create JSDocs and comment
export function movePreview(coordX, coordY) {
    cardPreview.style.left = `${coordX + 20}px`;
    cardPreview.style.top = `${coordY + 20}px`;
}

// TODO- Create JSDocs and comment
export function hidePreview() {
    cardPreview.hidden = true;
}