import Profile from '/frontend/scripts/profile/profile.class.js';

export default class PlatformDropdownHandler {

    static dropdownClickHandler() {
        
    }

    // Renders dropdown.  Takes an an array of strings for items to show

    static renderPlatformDropdown(itemsToRender, insertion) {
        const dropdownHTML = Profile.getNodes().linkFieldDropdown.cloneNode(true);

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