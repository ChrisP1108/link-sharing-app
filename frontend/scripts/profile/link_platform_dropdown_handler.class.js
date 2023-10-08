import Profile from '/frontend/scripts/profile/profile.class.js';
import LinksHandler from '/frontend/scripts/profile/links_handler.class.js';

export default class LinkPlatformDropdownHandler {

    // PROPERTIES

    static #availablePlatformOptions;
    static #linkPlatformFieldNodes;

    // METHODS

    // Initialize platform dropdown on click of platform field

    static dropdownInitHandler() {
        LinkPlatformDropdownHandler.#linkPlatformFieldNodes = Profile.getNodes().linkFieldsSection.querySelectorAll(`[data-fieldtype="link"] [data-linkitemplatformfield]`);

        // Initialize click handling of platform field to show dropdown

        LinkPlatformDropdownHandler.#linkPlatformFieldNodes.forEach(field => {

            // Disable all link fields that have CSS class of dropdown-active so dropdown arrow points down
            field.addEventListener('click', () => {

                field.classList.remove("dropdown-active");

                // Makes sure another dropdown list isn't already opened.  If so, the existing  one will be removed.

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

        // Add CSS class of dropdown-active for dropdown arrow to point upward on link platform field clicked

        platformField.classList.add("dropdown-active");

        // Makes sure there isn't another dropdown list so user can't open two or more dropdowns simultaneously

        if (document.querySelector(`[data-linkplatformdropdownlist]`)) {
            document.querySelector(`[data-linkplatformdropdownlist]`).remove();
        }

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

        const dropdownList = document.querySelector(`[data-linkplatformdropdownlist]`);

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

        if (dropdownList) {

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
                
                // Rerender link fields to update change

                LinksHandler.renderLinkFieldNodes();

                // Remove dropdown

                dropdownList.remove();
            });
        }
    }

}