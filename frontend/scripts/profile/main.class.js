import TabHandler from '/frontend/scripts/profile/tabs.class.js';
import LinksHandler from '/frontend/scripts/profile/links.class.js';

export default class Profile {

    // Declare properties

    _data = { };
    #tabHandler;
    #linksHandler;

    // Instantiate class

    constructor({ id = null, first_name = null, last_name = null, email = null, image_url = null, links = []}) {
        this._data.id = id;
        this._data.first_name = first_name;
        this._data.last_name = last_name;
        this._data.email = email;
        this._data.image_url = image_url;
        this._data.links = links;

        // Instantiate Tab Handler Class. Select tab link nodes, Select first tab to set active on page load, Select tab section nodes

        this.#tabHandler = new TabHandler(document.querySelectorAll("[data-tab]"), document.querySelectorAll('[data-section="tabs"] [data-tabsection]'));

        // Instantiate Links Hanlder Class.

        this.#linksHandler = new LinksHandler(this._data.links, document.querySelector("[data-letsgetyoustarted]"), document.querySelector("[data-linkfieldssection]"), document.querySelector(`[data-fieldtype="link"]`), document.querySelector("[data-buttonaddlink]"));
        
    }
}