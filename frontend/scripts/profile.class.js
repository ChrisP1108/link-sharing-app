class Profile {

    // Declare properties

    #data = { };
    #tabLinkNodes;
    #tabSelected;
    #tabSectionNodes;
    #addNewLinkButtonNode;
    #letsGetYouStartedNode;
    #linkFieldsSection;
    #linkFieldHTML;
    #linkFieldsRemovers;
    #linkOptionsLimit;
    #formSaveButtonNode;

    // Set tab to be active.  Also hides, unhides tab sections

    #setTabActive(tabName) {

        this.#tabLinkNodes.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add("tab-active");
                this.#tabSelected = tab.dataset.tab;
            } else {
                tab.classList.remove("tab-active");
            }
        });

        this.#tabSectionNodes.forEach(section => {
            if (section.dataset.tabsection === this.#tabSelected) {
                section.classList.remove("hidden");
            } else {
                section.classList.add("hidden");
            }
        });
    }

    // Monitor clicking of links, profile details tabs

    #tabClickHandler() {
        this.#tabLinkNodes.forEach(tab => {
            tab.addEventListener('click', () => {
                this.#setTabActive(tab.dataset.tab);
            });
        });
    }

    // Toggle "Let's get you started" section

    #toggleLetsGetYouStarted(active = false) {
        if (active) {
            this.#letsGetYouStartedNode.classList.remove("hidden");
            this.#linkFieldsSection.classList.add("hidden");
        } else {
            this.#letsGetYouStartedNode.classList.add("hidden");
            this.#linkFieldsSection.classList.remove("hidden");
        }
    }

    // Render link section field nodes

    #renderLinkFieldNodes(adding = false) {

        // Add additional link field blank object if additional field link is being added

        if (adding) {
            const newLinkData = { platform: '', link: '', order: this.#data.links.length + 1  }
            this.#data.links = [...this.#data.links, newLinkData ];
        }

        // Re-sort links by order number

        this.#data.links = [...this.#data.links].sort((prev, curr) => {
            return prev.order > curr.order ? 1 : -1;
        });

        // Re-number links after sorting

        this.#data.links = this.#data.links.map((link, index) => 
            ({...link, order: index + 1})
        );

        // Generate HTML for link fields

        const linkFieldsHTML = this.#data.links.map(link  => {
            const linkNodeHTML = this.#linkFieldHTML.cloneNode(true);
            linkNodeHTML.querySelector("[data-linkheading]").innerText = `Link #${link.order}`;
            linkNodeHTML.querySelector("[data-removelinkbutton]").dataset.linknumber = link.order;
            return linkNodeHTML.outerHTML;

        }).join("");

        // Render link field(s) into linkFieldsSection node

        this.#linkFieldsSection.innerHTML = linkFieldsHTML;

        this.#removeLinkItemHandler();
    }

    // Monitor "+ Add new link" click and add link field.  Prevent adding more fields than there are link options

    #addNewLinkHandler() {
        this.#addNewLinkButtonNode.addEventListener("click", () => {

            // Makes sure user cannot add more link fields than options available.  Will hide addNewLinkButton node if number of link fields equals number of options

            let linkFieldNodes = this.#linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length < this.#linkOptionsLimit) {

                // Add link field HTML into link fields section.

                this.#renderLinkFieldNodes(true);

                // Hide "Let's get you started" section node and enable form save button

                this.#toggleLetsGetYouStarted(false);
                this.#toggleFormSaveButton(true);

                // Make sure addNewLinkButton node is visible

                this.#addNewLinkButtonNode.classList.remove("hidden");
            } 

            // Check after rendering that once number of link fields equals number of options available, to hit add new link button

            linkFieldNodes = this.#linkFieldsSection.querySelectorAll("[data-fieldname]");

            if (linkFieldNodes.length === this.#linkOptionsLimit) {
                this.#addNewLinkButtonNode.classList.add("hidden");
            }
        });
    }

    // Toggle Form Save Button

    #toggleFormSaveButton(active = false) {
        if (active) {
            this.#formSaveButtonNode .classList.remove("button-disabled");
        } else {
            this.#formSaveButtonNode .classList.add("button-disabled");
        }
    }

    // Remove link item click handler

    #removeLinkItemHandler() {

        // Update Remove links

        this.#linkFieldsRemovers = document.querySelectorAll("[data-profileform] [data-removelinkbutton]");

        // Makes sure + Add new link button is shows

        this.#addNewLinkButtonNode.classList.remove("hidden");
        
        // Remove link clicked from data and rerender

        this.#linkFieldsRemovers.forEach(remover => {
            remover.addEventListener("click", () => {
                this.#data.links = this.#data.links.filter(link => link.order !== Number(remover.dataset.linknumber));
                this.#renderLinkFieldNodes();

                // If data links is blank, toggle "Let's get you started" back on and disable form save button

                if (!this.#data.links.length) {
                    this.#toggleLetsGetYouStarted(true);
                    this.#toggleFormSaveButton(false);
                }
            });
        });
    }

    // Instantiate class

    constructor({ id = null, first_name = null, last_name = null, email = null, image_url = null, links = []}) {
        this.#data.id = id;
        this.#data.first_name = first_name;
        this.#data.last_name = last_name;
        this.#data.email = email;
        this.#data.image_url = image_url;
        this.#data.links = links;

        // Select tab link nodes

        this.#tabLinkNodes = document.querySelectorAll("[data-tab]");

        // Select first tab to set active on page load

        this.#tabSelected = this.#tabLinkNodes[0].dataset.tab ?? null;

        // Select tab section nodes

        this.#tabSectionNodes = document.querySelectorAll('[data-section="tabs"] [data-tabsection]');

        // Activate tab click handler to monitor clicking of links, profile details tabs

        this.#tabClickHandler();

        // Activate tab to be active on page load

        this.#setTabActive(this.#tabSelected);

        // Select "Let's get you started" section node

        this.#letsGetYouStartedNode = document.querySelector("[data-letsgetyoustarted]");

        // Select links fields section

        this.#linkFieldsSection = document.querySelector("[data-linkfieldssection]");

        // Select first link field HTML for templating and remove it after saved as a node

        this.#linkFieldHTML = document.querySelector(`[data-fieldtype="link"]`);
        this.#linkFieldHTML = this.#linkFieldHTML.cloneNode(true);
        document.querySelector(`[data-fieldtype="link"]`).remove();

        // Set link on number of links user can add based upon total options

        this.#linkOptionsLimit = this.#linkFieldHTML.querySelectorAll("select option").length;
        
        // Select form save button

        this.#formSaveButtonNode = document.querySelector("[data-formsavebutton]");
        
        // Select "+ Add new link" button node

        this.#addNewLinkButtonNode = document.querySelector("[data-buttonaddlink]");

        // Activate "+ Add new link" click handler

        this.#addNewLinkHandler();

        // Check if data contains any links and show them.  If not, then show "Let's get you started to show them"

        if (this.#data.links.length === 0) {
            this.#toggleLetsGetYouStarted(true)
        } else {
            this.#toggleFormSaveButton(true);
        }

        // Remove click handler

        this.#removeLinkItemHandler();
    }
}