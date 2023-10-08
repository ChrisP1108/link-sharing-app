import Profile from '/frontend/scripts/profile/profile.class.js';

export default class LinkPlatformDropdownHandler {

    // PROPERTIES

    static #availablePlatformOptions;
    static #linkPlatformFieldNodes;

    // METHODS

    // Initialize platform dropdown on click of platform field

    static dropdownInitHandler() {
        LinkPlatformDropdownHandler.#linkPlatformFieldNodes = Profile.getNodes().linkFieldsSection.querySelectorAll(`[data-fieldtype="link"] [data-linkitemplatformfield]`);

        LinkPlatformDropdownHandler.#linkPlatformFieldNodes.forEach(field => {
            field.addEventListener('click', () => {
                if (!field.querySelector(`[data-linkplatformdropdownlist]`)) {
                    LinkPlatformDropdownHandler.#renderPlatformDropdown(field);
                } else {
                    field.querySelector(`[data-linkplatformdropdownlist]`).remove();
                }
            });
        });
    }

    // Renders dropdown.  Takes an an array of strings for items to show

    static #renderPlatformDropdown(platformField) {

        // Checks available dropdown Options

        LinkPlatformDropdownHandler.#availablePlatformOptions = Profile.getPlatformDropdownOptions().filter(option => {
            
            if (![...LinkPlatformDropdownHandler.#linkPlatformFieldNodes].some(node => node.dataset.value === option.value)) {
                return true;
            }
        });

        // Select Parent link container to insert dropdown

        const dropdownHTML = Profile.getNodes().linkFieldDropdown.cloneNode(true);
        
        // Remove any platform items that are currently listed in a link field

        dropdownHTML.querySelectorAll("li").forEach(item => {
            if (!LinkPlatformDropdownHandler.#availablePlatformOptions.some(platform => platform.value === item.dataset.value) && item.dataset.value !== platformField.dataset.value) {
                item.remove();
            } 
        });

        // Remove hidden class to make dropdown visible

        dropdownHTML.classList.remove("hidden");

        // Append node to parent link container

        platformField.appendChild(dropdownHTML);

        LinkPlatformDropdownHandler.#dropdownClickHandler();

    }

    // Monitor clicking item in dropdown once it is rendered

    static #dropdownClickHandler() {

        // Select dropdown list

        const dropdownList = document.querySelector(`[data-linkplatformdropdownlist]`)

        // Remove dropdown if user clicks outside dropdown area

        const outsideAreaHandler = window.addEventListener("click", e => {
            const clickedOnDropdown = e.target.closest("[data-linkitemplatformfield]") !== null
            if (!clickedOnDropdown) {
                const dropdownList = document.querySelector(`[data-linkplatformdropdownlist]`);
                if (dropdownList) {
                    dropdownList.remove();
                }
                window.removeEventListener("click", outsideAreaHandler, true);
            }
        });

        // Monitor click of dropdown item

        dropdownList.addEventListener("click", e => {
            // Select parent list option node

            const optionNode = e.target.closest("li");

            // Selected option value

            const optionValueClicked = e.target.closest("li").dataset.value;

            // Select platform field

            const platformFieldNode = optionNode.closest(`[data-linkitemplatformfield]`);

            // Get data corresponding to option clicked

            const clickedOptionData = Profile.getPlatformDropdownOptions().find(option => option.value === optionValueClicked);
            
            // Update data to reflect option clicked

            const linkDataToUpdate = Profile.getData().links.find(link => link.order === Number(platformFieldNode.dataset.order));

            linkDataToUpdate.platform = clickedOptionData.value;

            Profile.setData('links', Profile.getData().links.map(link => 
                link.order === Number(platformFieldNode.dataset.order) ? linkDataToUpdate : link)
            );
            
            // Set icon of platform field

            platformFieldNode.querySelector("svg").outerHTML = clickedOptionData.iconSVG;

            // Set label of platform field

            platformFieldNode.querySelector("span").innerText = clickedOptionData.label;

            // Remove dropdown

            dropdownList.remove();
        });
    }

}