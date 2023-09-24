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

    // Render html

    render() {
        return `
            <h1>Render works!</h1>
        `
    }

    // Monitor clicking of links, profile details tabs

    #tabClickHandler() {
        this.#tabNodes.forEach(tab => {
            tab.addEventListener('click', () => {
                this.#tabNodes.forEach(t => {
                    t.classList.remove("tab-active");
                });
                tab.classList.add("tab-active");
                this.#tabSelected = tab.dataset.tab;
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

        this.#tabClickHandler();
        this.render();
    }
}