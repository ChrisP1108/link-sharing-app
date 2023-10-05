import Profile from '/frontend/scripts/profile/profile.class.js';

export default class PlatformDropdownHandler {

    dropdownClickHandler() {
        
    }

    // Renders dropdown.  Takes an an array of strings for items to show

    renderDropdown(itemsToRender, insertion) {
        const dropdownHTML = Profile.nodes.linkFieldDropdown.cloneNode(true);

        dropdownHTML.querySelectorAll("li").forEach(item => {
            if (!itemsToRender.includes(item.dataset.value)) {
                item.remove();
            }
        });

        insertion.appendChild(dropdownHTML);
        
        this.dropdownClickHandler();
    }

    constructor() {

    }
}