import Profile from '/frontend/scripts/profile/profile.class.js';

export default class LinkItem {

    // PROPERTIES

    #linkNode;
    #platformNode;
    #platformFieldLabel;
    #renderData;
    #platformData;
    #addingLinkItem;
    #index;

    // METHODS

    // Update Platform Field

    #updatePlatformField() {
        
        // Set link platform field icon

        this.#linkNode.querySelector("svg.platform-icon").outerHTML = this.#platformData.iconSVG;
        
        // Set platform field label text

        this.#platformFieldLabel.innerText = this.#platformData.label

        // Set platform field label value dataset

        this.#platformFieldLabel.dataset.value = this.#platformData.value
    }

    html() {

        // Update platform field

        this.#updatePlatformField();

        // Declare id to be set

        const linkInputId = `link-item-${this.#renderData.order}`

        // Select link field parent container (label & input)

        const linkContainer = this.#linkNode.querySelector(`[data-linkitemcontainer]`);
            
        linkContainer.querySelector("label").htmlFor = linkInputId;

        const linkInputField = linkContainer.querySelector(`input`);

        // Set link field input placeholder text

        linkInputField.placeholder = this.#platformData.placeholder;

        // Set link field input name

        linkInputField.name = linkInputId;

        // Set link field input id

        linkInputField.id = linkInputId;

        // Set order number attribute on link field input

        linkInputField.dataset.order = this.#renderData.order;

        // Set dataset value for platform

        this.#platformNode.dataset.value = this.#platformData.value;

        // Set order value number for platform

        this.#platformNode.dataset.order = this.#renderData.order;

        // Set Link heading #

        this.#linkNode.querySelector("[data-linkheading]").innerText = `Link #${this.#renderData.order}`;

        // Set link number data attribute to remove click item

        this.#linkNode.querySelector("[data-removelinkbutton]").dataset.linknumber = this.#renderData.order;

        // If link field is last in array, add animation class 'animate-fade-up' if link field is added.  If single, add animation clas

        if (this.#index) {
            if (this.#index === Profile.getData().links.length && this.#addingLinkItem) {
                this.#linkNode.classList.add("animate-fade-up");
            }
        } else this.#linkNode.classList.add("animate-fade-up");

        // Return link node HTML

        return this.#linkNode.outerHTML;
    }

    // CONSTRUCTOR

    constructor(data, index = null, addingLinkItem = false) {

        // Render data

        this.#renderData = data;

        // Index for array

        this.#index = index + 1;

        // Determines if link item was added for animation

        this.#addingLinkItem = addingLinkItem;

        // Link node to render data to

        this.#linkNode = Profile.getNodes().linkFieldHTML.cloneNode(true);

        // Select Platform field node

        this.#platformNode = this.#linkNode.querySelector("[data-linkitemplatformfield]");

        // Select platform field text

        this.#platformFieldLabel = this.#platformNode.querySelector("[data-platformoptionselected]");
        
        // Get platform name based on link in array map iteration
        
        this.#platformData = Profile.getPlatformDropdownOptions().find(option => option.value === this.#renderData.platform);
    }
}