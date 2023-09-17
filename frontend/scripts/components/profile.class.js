import Header from '/frontend/scripts/components/header.function.js';

export default class Profile {

    // Declare properties

    #id
    #first_name;
    #last_name;
    #email;
    #image_url;
    #links;

    // Render html

    render() {
        return `
            ${Header()}
        `
    }

    getData() {
        return {
            id: this.#id,
            first_name: this.#first_name,
            last_name: this.#last_name,
            email: this.#email,
            image_url: this.#image_url,
            links: this.#links
        }
    }

    // Instantiate class

    constructor({ id = null, first_name = null, last_name = null, email = null, image_url = null, links = [] }) {
        this.#id = id;
        this.#first_name = first_name;
        this.#last_name = last_name;
        this.#email = email;
        this.#image_url = image_url;
        this.#links = links;
    }
}