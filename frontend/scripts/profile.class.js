class Profile {

    // Declare properties

    #data = { };
    #tabLinkNodes;
    #tabSelected;
    #tabSectionNodes;
    #addNewLinkButtonNode;
    #letsGetYouStartedNode;
    #linkFieldsSection;
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

    #toggleLetsGetYouStarted(active) {
        if (active) {
            this.#letsGetYouStartedNode.classList.remove("hidden");
            this.#linkFieldsSection.classList.add("hidden");
        } else {
            this.#letsGetYouStartedNode.classList.add("hidden");
            this.#linkFieldsSection.classList.remove("hidden");
        }
    }

    // Monitor "+ Add new link" click and add link field

    #addNewLinkHandler() {
        this.#addNewLinkButtonNode.addEventListener("click", () => {

            // Hide "Let's get you started" section node and enable form save button

            this.#toggleLetsGetYouStarted(false);
            this.#toggleFormSaveButton(true);
        });
    }

    // Toggle Form Save Button

    #toggleFormSaveButton(active) {
        if (active) {
            this.#formSaveButtonNode .classList.remove("button-disabled");
        } else {
            this.#formSaveButtonNode .classList.add("button-disabled");
        }
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

        this.#tabSelected = this.#tabLinkNodes[0].dataset.tab ?? null;4

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
    }
}