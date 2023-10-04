import FormSaveButtonHandler from '/frontend/scripts/profile/savebutton.class.js';

export default class LinksHandler {

    // PROPERTIES
    
    data;
    letsGetYouStartedNode;
    linkFieldsSection;
    linkFieldHTML;
    linkOptionsLimit;
    addNewLinkButtonNode;
    linkFieldsRemovers;
    #formSaveButtonHandler;

    // METHODS

    // Toggle "Let's get you started" section

    toggleLetsGetYouStarted(active = false) {
        if (active) {
            this.letsGetYouStartedNode.classList.remove("hidden");
            this.linkFieldsSection.classList.add("hidden");
        } else {
            this.letsGetYouStartedNode.classList.add("hidden");
            this.linkFieldsSection.classList.remove("hidden");
        }
    }

    // Render link section field nodes

    renderLinkFieldNodes(adding = false) {

        // Add additional link field blank object if additional field link is being added

        if (adding) {
            const newLinkData = { platform: '', link: '', order: this.data.length + 1  }
            this.data = [...this.data, newLinkData ];
        }

        // Re-sort links by order number

        this.data = [...this.data].sort((prev, curr) => {
            return prev.order > curr.order ? 1 : -1;
        });

        // Re-number links after sorting

        this.data = this.data.map((link, index) => 
            ({...link, order: index + 1})
        );

        // Generate HTML for link fields

        const linkFieldsHTML = this.data.map(link  => {
            const linkNodeHTML = this.linkFieldHTML.cloneNode(true);
            linkNodeHTML.querySelector("[data-linkheading]").innerText = `Link #${link.order}`;
            linkNodeHTML.querySelector("[data-removelinkbutton]").dataset.linknumber = link.order;
            return linkNodeHTML.outerHTML;

        }).join("");

        // Render link field(s) into linkFieldsSection node

        this.linkFieldsSection.innerHTML = linkFieldsHTML;

        this.removeLinkItemHandler();
    }

    // Monitor "+ Add new link" click and add link field.  Prevent adding more fields than there are link options

    addNewLinkHandler() {
        this.addNewLinkButtonNode.addEventListener("click", () => {

            // Makes sure user cannot add more link fields than options available.  Will hide addNewLinkButton node if number of link fields equals number of options

            let linkFieldNodes = this.linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length < this.linkOptionsLimit) {

                // Add link field HTML into link fields section.

                this.renderLinkFieldNodes(true);

                // Hide "Let's get you started" section node and enable form save button

                this.toggleLetsGetYouStarted(false);
                this.#formSaveButtonHandler.toggleFormSaveButton(true)

                // Make sure addNewLinkButton node is visible

                this.addNewLinkButtonNode.classList.remove("hidden");
            } 

            // Check after rendering that once number of link fields equals number of options available, to hit add new link button

            linkFieldNodes = this.linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length === this.linkOptionsLimit) {
                this.addNewLinkButtonNode.classList.add("hidden");
            }
        });
    }

    // Remove link item click handler

    removeLinkItemHandler() {

        // Update Remove links

        this.linkFieldsRemovers = document.querySelectorAll("[data-profileform] [data-removelinkbutton]");

        // Makes sure + Add new link button is shows

        this.addNewLinkButtonNode.classList.remove("hidden");
        
        // Remove link clicked from data and rerender

        this.linkFieldsRemovers.forEach(remover => {
            remover.addEventListener("click", () => {
                this.data = this.data.filter(link => link.order !== Number(remover.dataset.linknumber));
                this.renderLinkFieldNodes();

                // If data links is blank, toggle "Let's get you started" back on and disable form save button

                if (!this.data.length) {
                    this.toggleLetsGetYouStarted(true);
                    this.#formSaveButtonHandler.toggleFormSaveButton(false);
                }
            });
        });
    }

    // CONSTRUCTOR

    constructor(data, letsGetYouStartedNode, linkFieldsSection, linkFieldHTML, addNewLinkButtonNode) {
        
        // Links Data

        this.data = data;
        
        // Select "Let's get you started" section node

        this.letsGetYouStartedNode = letsGetYouStartedNode;

        // Select links fields section

        this.linkFieldsSection = linkFieldsSection;

        // Select first link field HTML for templating and remove it after saved as a node

        this.linkFieldHTML = linkFieldHTML.cloneNode(true);
        linkFieldHTML.remove();

        // Set link on number of links user can add based upon total options

        this.linkOptionsLimit = this.linkFieldHTML.querySelectorAll("ul li").length;
    
        // Select "+ Add new link" button node

        this.addNewLinkButtonNode = addNewLinkButtonNode;

        // Activate "+ Add new link" click handler

        this.addNewLinkHandler();

        // Remove click handler

        this.removeLinkItemHandler();

        // Instantiate FormSaveButtonHandler

        this.#formSaveButtonHandler = new FormSaveButtonHandler(document.querySelector("[data-formsavebutton]"));

        // Check if data contains any links and show them.  If not, then show "Let's get you started to show them"

        if (this.data.length === 0) {
            this.toggleLetsGetYouStarted(true)
        } else {
            this.#formSaveButtonHandler.toggleFormSaveButton(true);
        }
    }
}