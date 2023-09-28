class Profile {

    // Declare properties

    #id
    #first_name;
    #last_name;
    #email;
    #image_url;
    #links;
    #tabLinkNodes;
    #tabSelected;
    #tabSectionNodes;

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

    // Instantiate class

    constructor({ id = null, first_name = null, last_name = null, email = null, image_url = null, links = [] }) {
        this.#id = id;
        this.#first_name = first_name;
        this.#last_name = last_name;
        this.#email = email;
        this.#image_url = image_url;
        this.#links = links;

        this.#tabLinkNodes = document.querySelectorAll("[data-tab]");

        this.#tabSelected = this.#tabLinkNodes[0].dataset.tab ?? null;

        this.#tabSectionNodes = document.querySelectorAll('[data-section="tabs"] [data-tabsection]');

        this.#tabClickHandler();
        this.#setTabActive(this.#tabSelected);
    }
}