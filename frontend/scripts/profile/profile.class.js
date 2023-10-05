import TabHandler from '/frontend/scripts/profile/tab_handler.class.js';
import LinksHandler from '/frontend/scripts/profile/links_handler.class.js';

export default class Profile {

    // Declare properties

    static data = { 
        id: null, 
        first_name: null, 
        last_name: null, 
        email: null, 
        image_url: null, 
        links: []
    };

    #tabHandler;
    #linksHandler;

    // Instantiate class

    constructor({ id = null, first_name = null, last_name = null, email = null, image_url = null, links = []}) {

        // Set data

        Profile.data.id = id;
        Profile.data.first_name = first_name;
        Profile.data.last_name = last_name;
        Profile.data.email = email;
        Profile.data.image_url = image_url;
        Profile.data.links = links;

        // Instantiate Tab Handler Class.

        this.#tabHandler = new TabHandler(document.querySelectorAll("[data-tab]"), document.querySelectorAll('[data-section="tabs"] [data-tabsection]'));

        // Instantiate Links Handler Class.

        this.#linksHandler = new LinksHandler(document.querySelector("[data-letsgetyoustarted]"), document.querySelector("[data-linkfieldssection]"), document.querySelector(`[data-fieldtype="link"]`), document.querySelector("[data-buttonaddlink]"));
        
    }
}