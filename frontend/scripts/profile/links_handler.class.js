import Profile from '/frontend/scripts/profile/profile.class.js';
import SaveButtonHandler from '/frontend/scripts/profile/save_button_handler.class.js';
import LetsGetYouStartedHandler from '/frontend/scripts/profile/lets_get_you_started_handler.class.js';
import AddNewLinkButtonHandler from '/frontend/scripts/profile/add_new_link_button_handler.class.js';
import LinkPlatformDropdownHandler from '/frontend/scripts/profile/link_platform_dropdown_handler.class.js';
import LinkFieldCollapseHandler from '/frontend/scripts/profile/link_field_collapse_handler.class.js';
import LinkItem from '/frontend/scripts/profile/link_item.class.js';
import MobilePreviewHandler from '/frontend/scripts/profile/mobile_preview_handler.class.js';

export default class LinksHandler {

    // METHODS

    // Monitor link input change

    static #linkFieldChangeUpdate() {
        const linkInputs = Profile.getNodes().linkFieldsSection.querySelectorAll(`input`);

        linkInputs.forEach(input => {
            input.addEventListener('input', () => {
                Profile.setData('links', [...Profile.getData().links].map(link => 
                    link.order === Number(input.dataset.order) ? {...link, link: input.value } : link
                ));
            });
        })
    }

    // Update Platform Field

    static updatePlatformField(node, data) {

        // Select platform field text

        const platformLabelField = node.querySelector("[data-platformoptionselected]");

        const clickedOptionData = Profile.getPlatformDropdownOptions().find(option => option.value === data.platform);

        // Rerender link platform field icon

        node.querySelector("svg.platform-icon").outerHTML = clickedOptionData.iconSVG;

        platformLabelField.innerText = clickedOptionData.label;

        // Set dataset value

        platformLabelField.dataset.value = clickedOptionData.value;

    }

    // Render link section field nodes

    static renderLinkFieldNodes(adding = false) {

        // Re-sort links by order number

        Profile.setData('links', [...Profile.getData().links].sort((prev, curr) => 
            prev.order > curr.order ? 1 : -1
        ), false);

        // Re-number links after sorting

        Profile.setData('links', Profile.getData().links.map((link, index) => 
            ({...link, order: index + 1})
        ));

        // Generate HTML for link fields

        const linkFieldsHTML = Profile.getData().links.map((link, index) => {

            // Instantiate link item

            const linkItem = new LinkItem(link, index, adding);

            return linkItem.html();

        }).join("");

        // Render link field(s) into linkFieldsSection node

        Profile.getNodes().linkFieldsSection.innerHTML = linkFieldsHTML;

        // Add link field values after rendering based upon links data

        Profile.getData().links.forEach(link => {
            const input = Profile.getNodes().linkFieldsSection.querySelector(`input[data-order="${link.order}"]`);
            input.value = link.link;
        });

        // If total number of link inputs fields equals total number of options available, add CSS class and disable dropdown

        const linkInputsLength = Profile.getNodes().linkFieldsSection.querySelectorAll(`[data-fieldtype="link"]`).length;
            
        if (linkInputsLength === Profile.getPlatformDropdownOptions().length) {
            Profile.getNodes().linkFieldsSection.classList.add("platform-fields-click-disabled");
        } else {
            Profile.getNodes().linkFieldsSection.classList.remove("platform-fields-click-disabled");

            // Initialize dropdownClickHandler in PlatformDropdownHandler to monitor for clicking of platform fields

            LinkPlatformDropdownHandler.dropdownInitHandler();
        }

        // Reinitialize removeLinkItemHandler for newly rendered link fields

        LinksHandler.#removeLinkItemHandler();

        // Monitor change of link input fields and rerender on input change

        LinksHandler.#linkFieldChangeUpdate()

        // Monitor click of link field collapse icon

        LinkFieldCollapseHandler.initLinkCollapseHandler();

        // Render mobile preview

        MobilePreviewHandler.renderMobilePreview('links');
    }

    // Monitor "+ Add new link" click and add link field.  Prevent adding more fields than there are link options

    static #addNewLinkHandler() {
        Profile.getNodes().addNewLinkButton.addEventListener("click", () => {

            // Makes sure user cannot add more link fields than options available.  Will hide addNewLinkButton node if number of link fields equals number of options

            let linkFieldNodes = Profile.getNodes().linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length < Profile.getNodes().linkOptionsLimit) {

                // Add additional link field to profile data links prior to rendering to HTML

                const newLinkData = { platform: '', link: '', order: Profile.getData().links.length + 1  }
                
                // Makes sure that link field being added adds platform that is not previously listed in another link field

                const nextPlatformLink = Profile.getPlatformDropdownOptions().find(option => {
                    if (!Profile.getData().links.some(link => link.platform === option.value)) {
                        return true;
                    }
                });

                // Update links data for new link field

                newLinkData.platform = nextPlatformLink.value;
                Profile.setData('links', [...Profile.getData().links, newLinkData ], false);

                // Add link field HTML into link fields section.

                LinksHandler.renderLinkFieldNodes(true);

                // Hide "Let's get you started" section node and enable form save button

                LetsGetYouStartedHandler.toggleLetsGetYouStarted(false);
                SaveButtonHandler.toggleFormSaveButton(true)

                // Make sure addNewLinkButton node is visible

                AddNewLinkButtonHandler.toggleaddNewLinkButton(true);
            } 

            // Check after rendering that once number of link fields equals number of options available, to hit add new link button

            linkFieldNodes = Profile.getNodes().linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length === Profile.getNodes().linkOptionsLimit) {
                AddNewLinkButtonHandler.toggleaddNewLinkButton(false);
            }
        });
    }

    // Remove link item click handler

    static #removeLinkItemHandler() {

        // Update Remove links

        Profile.setLinkFieldsRemovers(document.querySelectorAll("[data-profileform] [data-removelinkbutton]"));

        // Makes sure + Add new link button is shows

        AddNewLinkButtonHandler.toggleaddNewLinkButton(true);
        
        // Remove link clicked from data and rerender

        Profile.getNodes().linkFieldsRemovers.forEach(remover => {
            remover.addEventListener("click", () => {
                Profile.setData('links', Profile.getData().links.filter(link => link.order !== Number(remover.dataset.linknumber)), false);
                LinksHandler.renderLinkFieldNodes();

                // If data links is blank, toggle "Let's get you started" back on and disable form save button

                if (!Profile.getData().links.length) {
                    LetsGetYouStartedHandler.toggleLetsGetYouStarted(true);
                    SaveButtonHandler.toggleFormSaveButton(false);
                }
            });
        });
    }

    // Check if link input field url is valid

    static linkUrlValid(platform) {

        if (!platform) {
            return false
        }

        const linkData =  Profile.getData().links.find(link => link.platform === platform.toLowerCase());

        // If link data found, link field will be checked if input matches input requirement for platform.  If no corresponding link data found, false will be returned

        if (linkData) {
            
            const optionData = Profile.getPlatformDropdownOptions().find(option => option.value === linkData.platform);
                
            // Get corresponding link input field node

            const getLinkFieldNode = Profile.getNodes().linkFieldsSection.querySelector(`[data-inputcontainer] input[data-order="${linkData.order}"]`)
            
            if (getLinkFieldNode) {

                // Returns true or false if required text is filled plus at least one additional character

                const requiredTextFilled = getLinkFieldNode.value.includes(optionData.requiredText);

                return requiredTextFilled && getLinkFieldNode.value.length > optionData.requiredText.length;

            } else return false;
        } else return false;
    }

    // Initialize Add New Link Handler

    static initAddNewLinkHandler() {

        // Activate "+ Add new link" click handler

        LinksHandler.#addNewLinkHandler();

        // Remove click handler

        LinksHandler.#removeLinkItemHandler();

        // Check if data contains any links and show them.  If not, then show "Let's get you started to show them"

        if (Profile.getData().links.length === 0) {
            LetsGetYouStartedHandler.toggleLetsGetYouStarted(true)
        } else {
            LinksHandler.renderLinkFieldNodes();
            LetsGetYouStartedHandler.toggleLetsGetYouStarted(false);
            SaveButtonHandler.toggleFormSaveButton(true);
        }
    }
}