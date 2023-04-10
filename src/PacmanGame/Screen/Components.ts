export function returnArrow() : HTMLElement {
    const returnArrow = document.createElement("button");
    returnArrow.className = "return-arrow";
    returnArrow.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon>`;
    returnArrow.onclick = (e) => {
        const parentElement = returnArrow.parentElement;
        if (parentElement) {
            parentElement.parentElement?.children[0].classList.remove("hidden");
            parentElement.parentElement?.removeChild(parentElement);
        }
    }
    return returnArrow;
}