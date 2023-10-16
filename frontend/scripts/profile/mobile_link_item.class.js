import Profile from '/frontend/scripts/profile/profile.class.js';
import LinksHandler from '/frontend/scripts/profile/links_handler.class.js';

export default class MobileLinkItem {

    // PROPERTIES

    #data;
    #node;
    #linkArrowSVG = `<svg class="link-arrow" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.666626 5.3333V6.66664H8.66663L4.99996 10.3333L5.94663 11.28L11.2266 5.99997L5.94663 0.719971L4.99996 1.66664L8.66663 5.3333H0.666626Z" />
        </svg>
    `

    // METHODS

    // Render HTML

    html() {

        if (this.#linkDataFound()) {

            this.#node.style.background = this.#data.color;
            this.#node.innerHTML = `
                <a class="mobile-click-link" ${LinksHandler.linkUrlValid(this.#data.value) ? `href="${this.#data.link}"` : ``} target="_blank" rel="nofollow">
                    ${this.#data.iconSVG}
                    <span class="mobile-link-text">${this.#data.label}</span>
                    ${this.#linkArrowSVG}
                </a>
            `;
        }
    }

    // Check if link data found

    #linkDataFound() {
        return this.#data !== null;
    }

    // CONSTRUCTOR

    constructor(node) {

        // Select Node

        this.#node = node;

        // Clear link node back to filler to ensure deleted links get cleared

        this.#node.innerHTML = '';
        this.#node.style.background = '';

        // Get link data

        const linkData = Profile.getData().links.find(link => link.order === Number(this.#node.dataset.order));

        if (linkData) {

            // Get option data corresponding to link data

            const optionData = Profile.getPlatformDropdownOptions().find(option => option.value === linkData.platform);
        
            this.#data = {
                value: optionData.value,
                label: optionData.label,
                color: optionData.color,
                iconSVG: optionData.iconSVG,
                requiredText: optionData.requiredText,
                link: linkData.link,
                order: linkData.order,
            }
        } else {
            this.#data = null;
        }
    }
}