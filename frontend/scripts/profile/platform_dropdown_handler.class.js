export default class PlatformDropdownHandler {
    #dropdownOptions = [];
    #listItemsParentNode;
    #listItemNode;

    renderDropdown(items) {

    }

    constructor(dropdownOptions) {
        const dropdownListHTML = dropdownOptions.querySelectorAll (`ul li`);
        this.#listItemsParentNode = dropdownOptions.querySelector("ul");
        this.#listItemNode = this.#listItemsParentNode.querySelector("li");
        dropdownListHTML.forEach(item => {
            const listData = { name: item.querySelector("span").innerText, value: item.dataset.value, icon: item.querySelector("svg").outerHTML }
            this.#dropdownOptions = [ ...this.#dropdownOptions, listData]
        });
    }
}