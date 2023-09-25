class Profile {

    // Declare properties

    #id
    #first_name;
    #last_name;
    #email;
    #image_url;
    #links;
    #tabNodes;
    #tabSelected;
    #tabSectionNode;

    // Render Links Tab HTML

    #renderLinksHTML() {
        return `
            <h3>Customize your links</h3>
            <h5>Add/edit/remove links below and then share all your profile with the world!</h5>
        `
    }

    // Render Profile Details HTML

    #renderProfileDetailsHTML() {
        return `
            <h3>Profile Details</h3>
            <h5>Add your details to create a personal touch to your profile.</h5>
        `
    }

    // Set tab to be active

    #setTabActive(tabName) {
        let tab;
        this.#tabNodes.forEach(t => {
            if (t.dataset.tab === tabName) {
                tab = t;
            }
            t.classList.remove("tab-active");
        });
        tab.classList.add("tab-active");
        this.#tabSelected = tab.dataset.tab;

        // Render HTML into main section based on tab that is active

        switch(this.#tabSelected) {
            case 'links':
                this.#tabSectionNode.innerHTML = this.#renderLinksHTML();
                break;
            case 'profile':
                this.#tabSectionNode.innerHTML = this.#renderProfileDetailsHTML();
                break;
            default:
                break;
        }
    }

    // Monitor clicking of links, profile details tabs

    #tabClickHandler() {
        this.#tabNodes.forEach(tab => {
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

        this.#tabNodes = document.querySelectorAll("[data-tab]");

        this.#tabSelected = this.#tabNodes[0].dataset.tab ?? null;

        this.#tabSectionNode = document.querySelector('[data-section="tabs"]');

        this.#tabClickHandler();
        this.#setTabActive(this.#tabSelected);
    }
}