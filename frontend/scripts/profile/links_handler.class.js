import Profile from '/frontend/scripts/profile/profile.class.js';
import SaveButtonHandler from '/frontend/scripts/profile/save_button_handler.class.js';

export default class LinksHandler {

    // METHODS

    // Toggle "Let's get you started" section

    #toggleLetsGetYouStarted(active = false) {
        if (active) {
            Profile.getNodes().letsGetYouStarted.classList.remove("hidden");
            Profile.getNodes().linkFieldsSection.classList.add("hidden");
        } else {
            Profile.getNodes().letsGetYouStarted.classList.add("hidden");
            Profile.getNodes().linkFieldsSection.classList.remove("hidden");
        }
    }

    // Render link section field nodes

    #renderLinkFieldNodes(adding = false) {

        // Add additional link field blank object if additional field link is being added

        if (adding) {
            const newLinkData = { platform: '', link: '', order: Profile.getData().links.length + 1  }
            const nextPlatformLink = Profile.getPlatformDropdownOptions().find(option => {
                if (!Profile.getData().links.some(link => link.platform === option.value)) {
                    return true;
                }
            });
            newLinkData.platform = nextPlatformLink.value;
            Profile.setData('links', [...Profile.getData().links, newLinkData ]);
        }

        // Re-sort links by order number

        Profile.setData('links', [...Profile.getData().links].sort((prev, curr) => 
            prev.order > curr.order ? 1 : -1
        ));

        // Re-number links after sorting

        Profile.setData('links', Profile.getData().links.map((link, index) => 
            ({...link, order: index + 1})
        ));

        console.log(Profile.getData().links);

        // Generate HTML for link fields

        const linkFieldsHTML = Profile.getData().links.map(link  => {

            // Clone linkHTML node

            const linkNodeHTML = Profile.getNodes().linkFieldHTML.cloneNode(true);

            // Select Platform field node

            const platformFieldNode = linkNodeHTML.querySelector("[data-linkitemplatformfield]");

            // Get platform name based on link in array map iteration

            const platformFieldData = Profile.getPlatformDropdownOptions().find(option => option.value === link.platform);
            
            // Set platform field SVG icon
            
            platformFieldNode.querySelector("svg").outerHTML = platformFieldData.iconSVG;

            // Set platform field label text

            platformFieldNode.querySelector("span").innerText = platformFieldData.label;

            // Set Link heading #

            linkNodeHTML.querySelector("[data-linkheading]").innerText = `Link #${link.order}`;

            // Set link number data attribute to remove click item

            linkNodeHTML.querySelector("[data-removelinkbutton]").dataset.linknumber = link.order;

            // Return link node HTML

            return linkNodeHTML.outerHTML;
            
        }).join("");

        // Render link field(s) into linkFieldsSection node

        Profile.getNodes().linkFieldsSection.innerHTML = linkFieldsHTML;

        this.#removeLinkItemHandler();
    }

    // Toggle addNewLinkButton node hidden / visible

    #toggleAddNewLinkButtonNode(active = false) {
        if (active) {
            Profile.getNodes().addNewLinkButtonNode.classList.remove("hidden");
        } else Profile.getNodes().addNewLinkButtonNode.classList.add("hidden");
    }

    // Monitor "+ Add new link" click and add link field.  Prevent adding more fields than there are link options

    #addNewLinkHandler() {
        Profile.getNodes().addNewLinkButtonNode.addEventListener("click", () => {

            // Makes sure user cannot add more link fields than options available.  Will hide addNewLinkButton node if number of link fields equals number of options

            let linkFieldNodes = Profile.getNodes().linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length < Profile.getNodes().linkOptionsLimit) {

                // Add link field HTML into link fields section.

                this.#renderLinkFieldNodes(true);

                // Hide "Let's get you started" section node and enable form save button

                this.#toggleLetsGetYouStarted(false);
                SaveButtonHandler.toggleFormSaveButton(true)

                // Make sure addNewLinkButton node is visible

                this.#toggleAddNewLinkButtonNode(true);
            } 

            // Check after rendering that once number of link fields equals number of options available, to hit add new link button

            linkFieldNodes = Profile.getNodes().linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length === Profile.getNodes().linkOptionsLimit) {
                this.#toggleAddNewLinkButtonNode(false);
            }
        });
    }

    // Remove link item click handler

    #removeLinkItemHandler() {

        // Update Remove links

        Profile.setLinkFieldsRemovers(document.querySelectorAll("[data-profileform] [data-removelinkbutton]"));

        // Makes sure + Add new link button is shows

        this.#toggleAddNewLinkButtonNode(true);
        
        // Remove link clicked from data and rerender

        Profile.getNodes().linkFieldsRemovers.forEach(remover => {
            remover.addEventListener("click", () => {
                Profile.setData('links', Profile.getData().links.filter(link => link.order !== Number(remover.dataset.linknumber)));
                this.#renderLinkFieldNodes();

                // If data links is blank, toggle "Let's get you started" back on and disable form save button

                if (!Profile.getData().links.length) {
                    this.#toggleLetsGetYouStarted(true);
                    SaveButtonHandler.toggleFormSaveButton(false);
                }
            });
        });
    }

    // CONSTRUCTOR

    constructor() {

        // Activate "+ Add new link" click handler

        this.#addNewLinkHandler();

        // Remove click handler

        this.#removeLinkItemHandler();

        // Check if data contains any links and show them.  If not, then show "Let's get you started to show them"

        if (Profile.getData().links.length === 0) {
            this.#toggleLetsGetYouStarted(true)
        } else {
            SaveButtonHandler.toggleFormSaveButton(true);
        }
    }
}