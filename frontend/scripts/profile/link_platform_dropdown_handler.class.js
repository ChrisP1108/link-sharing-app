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

        LinkPlatformDropdownHandler.#resetDropdownArrows();

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
        
        // Loop through dropdown list items and remove any items already listed and hightlight current item corresponding to platform field

        dropdownHTML.querySelectorAll("li").forEach(item => {
            
            // Remove any platform items that are currently listed in a link field
            
            if (!LinkPlatformDropdownHandler.#availablePlatformOptions.some(platform => platform.value === item.dataset.value) && item.dataset.value !== platformField.dataset.value) {
                item.remove();
            }
            
             // Highlight dropdown list item that corresponds to platform currently shown in platform field by adding CSS class
        
            if (item.dataset.value === platformField.dataset.value) {
                item.classList.add("active-dropdown-item");
            }
        });

        // Remove hidden class to make dropdown visible

        dropdownHTML.classList.remove("hidden");

        // Append node to parent link container

        platformField.appendChild(dropdownHTML);

        LinkPlatformDropdownHandler.#dropdownClickHandler();

    }

    // Set all link platform field arrows back to down position

    static #resetDropdownArrows() {
        Profile.getNodes().linkFieldsSection
            .querySelectorAll("[data-linkitemplatformfield]")
            .forEach(link => {
                link.classList.remove("dropdown-active");
            });
    }

    // Monitor clicking item in dropdown once it is rendered

    static #dropdownClickHandler() {

        // Select dropdown list

        const dropdownList = document.querySelector(`[data-linkplatformdropdownlist]`);

        // Remove dropdown if user clicks outside dropdown area and set all dropdown arrows

        const outsideAreaHandler = window.addEventListener("click", e => {
            const clickedOnDropdown = e.target.closest("[data-linkitemplatformfield]") !== null
            if (!clickedOnDropdown) {
                const dropdownList = document.querySelector(`[data-linkplatformdropdownlist]`);
                if (dropdownList) {
                    dropdownList.remove();
                }
                LinkPlatformDropdownHandler.#resetDropdownArrows();
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

                // Set dataset value for parent platformFieldNode

                platformFieldNode.dataset.value = optionValueClicked;

                // Get data corresponding to option clicked

                const clickedOptionData = Profile.getPlatformDropdownOptions().find(option => option.value === optionValueClicked);
                
                // Update data to reflect option clicked

                const linkDataToUpdate = Profile.getData().links.find(link => link.order === Number(platformFieldNode.dataset.order));

                linkDataToUpdate.platform = clickedOptionData.value;

                Profile.setData('links', Profile.getData().links.map(link => 
                    link.order === Number(platformFieldNode.dataset.order) ? linkDataToUpdate : link)
                );
                
                // Rerender link platform field to update change

                LinksHandler.updatePlatformField(platformFieldNode, linkDataToUpdate);

                // Remove dropdown

                dropdownList.remove();

                // Set platform field arrows back to down position

                LinkPlatformDropdownHandler.#resetDropdownArrows();
            });
        }
    }

}