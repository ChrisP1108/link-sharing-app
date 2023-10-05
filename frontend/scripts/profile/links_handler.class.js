import Profile from '/frontend/scripts/profile/profile.class.js';
import SaveButtonHandler from '/frontend/scripts/profile/save_button_handler.class.js';

export default class LinksHandler {

    // PROPERTIES

    #formSaveButtonHandler;

    // METHODS

    // Toggle "Let's get you started" section

    toggleLetsGetYouStarted(active = false) {
        if (active) {
            Profile.nodes.letsGetYouStarted.classList.remove("hidden");
            Profile.nodes.linkFieldsSection.classList.add("hidden");
        } else {
            Profile.nodes.letsGetYouStarted.classList.add("hidden");
            Profile.nodes.linkFieldsSection.classList.remove("hidden");
        }
    }

    // Render link section field nodes

    renderLinkFieldNodes(adding = false) {

        // Add additional link field blank object if additional field link is being added

        if (adding) {
            const newLinkData = { platform: '', link: '', order: Profile.data.links.length + 1  }
            Profile.data.links = [...Profile.data.links, newLinkData ];
        }

        // Re-sort links by order number

        Profile.data.links = [...Profile.data.links].sort((prev, curr) => {
            return prev.order > curr.order ? 1 : -1;
        });

        // Re-number links after sorting

        Profile.data.links = Profile.data.links.map((link, index) => 
            ({...link, order: index + 1})
        );

        // Generate HTML for link fields

        const linkFieldsHTML = Profile.data.links.map(link  => {
            const linkNodeHTML = Profile.nodes.linkFieldHTML.cloneNode(true);
            linkNodeHTML.querySelector("[data-linkheading]").innerText = `Link #${link.order}`;
            linkNodeHTML.querySelector("[data-removelinkbutton]").dataset.linknumber = link.order;
            return linkNodeHTML.outerHTML;
        }).join("");

        // Render link field(s) into linkFieldsSection node

        Profile.nodes.linkFieldsSection.innerHTML = linkFieldsHTML;

        this.removeLinkItemHandler();
    }

    // Monitor "+ Add new link" click and add link field.  Prevent adding more fields than there are link options

    addNewLinkHandler() {
        Profile.nodes.addNewLinkButtonNode.addEventListener("click", () => {

            // Makes sure user cannot add more link fields than options available.  Will hide addNewLinkButton node if number of link fields equals number of options

            let linkFieldNodes = Profile.nodes.linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length < Profile.nodes.linkOptionsLimit) {

                // Add link field HTML into link fields section.

                this.renderLinkFieldNodes(true);

                // Hide "Let's get you started" section node and enable form save button

                this.toggleLetsGetYouStarted(false);
                this.#formSaveButtonHandler.toggleFormSaveButton(true)

                // Make sure addNewLinkButton node is visible

                Profile.nodes.addNewLinkButtonNode.classList.remove("hidden");
            } 

            // Check after rendering that once number of link fields equals number of options available, to hit add new link button

            linkFieldNodes = Profile.nodes.linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length === Profile.nodes.linkOptionsLimit) {
                Profile.nodes.addNewLinkButtonNode.classList.add("hidden");
            }
        });
    }

    // Remove link item click handler

    removeLinkItemHandler() {

        // Update Remove links

        Profile.nodes.linkFieldsRemovers = document.querySelectorAll("[data-profileform] [data-removelinkbutton]");

        // Makes sure + Add new link button is shows

        Profile.nodes.addNewLinkButtonNode.classList.remove("hidden");
        
        // Remove link clicked from data and rerender

        Profile.nodes.linkFieldsRemovers.forEach(remover => {
            remover.addEventListener("click", () => {
                Profile.data.links = Profile.data.links.filter(link => link.order !== Number(remover.dataset.linknumber));
                this.renderLinkFieldNodes();

                // If data links is blank, toggle "Let's get you started" back on and disable form save button

                if (!Profile.data.links.length) {
                    this.toggleLetsGetYouStarted(true);
                    this.#formSaveButtonHandler.toggleFormSaveButton(false);
                }
            });
        });
    }

    // CONSTRUCTOR

    constructor() {

        // Activate "+ Add new link" click handler

        this.addNewLinkHandler();

        // Remove click handler

        this.removeLinkItemHandler();

        // Instantiate FormSaveButtonHandler

        this.#formSaveButtonHandler = new SaveButtonHandler();

        // Check if data contains any links and show them.  If not, then show "Let's get you started to show them"

        if (Profile.data.links.length === 0) {
            this.toggleLetsGetYouStarted(true)
        } else {
            this.#formSaveButtonHandler.toggleFormSaveButton(true);
        }
    }
}