import TabHandler from '/frontend/scripts/profile/tab_handler.class.js';
import LinksHandler from '/frontend/scripts/profile/links_handler.class.js';

export default class Profile {

    // Declare properties

    // Data

    static #data = { 
        id: null, 
        first_name: null, 
        last_name: null, 
        email: null, 
        image_url: null, 
        links: []
    };

    // Data getter

    static getData() {
        return Profile.#data;
    }

    // Data setter

    static setData(key, value) {
        Profile.#data[key] = value;
        Profile.#nodes.formRoot.data = Profile.#data;
    }

    // Nodes

    static #nodes = {
        formRoot: null,
        tabLinks: null,
        tabSelected: null,
        tabSection: null, 
        letsGetYouStarted: null,
        linkFieldsSection: null,
        linkFieldHTML: null,     
        linkOptionsLimit: null,
        linkFieldsRemovers: null,
        linkFieldDropdown: null,
        addNewLinkButtonNode: null,
        formSaveButton: null,
    }

    static #linkDropdownOptions = [];

    static getPlatformDropdownOptions() {
        return Profile.#linkDropdownOptions;
    }

    // Tab Selected

    static tabSelected = null;

    // Nodes getter

    static getNodes() {
        return Profile.#nodes;
    }

    // Set linkFieldsRemovers node

    static setLinkFieldsRemovers(removerNodes) {
        Profile.#nodes.linkFieldsRemovers = removerNodes;
    }

    // Instantiate class

    constructor({ id = null, first_name = null, last_name = null, email = null, image_url = null, links = []}) {

        // Set data

        Profile.#data.id = id;
        Profile.#data.first_name = first_name;
        Profile.#data.last_name = last_name;
        Profile.#data.email = email;
        Profile.#data.image_url = image_url;
        Profile.#data.links = links;

        // Set nodes

        Profile.#nodes.formRoot = document.querySelector("[data-profileform]");
        Profile.#nodes.tabLinks = document.querySelectorAll("[data-tab]");
        Profile.#nodes.tabSection = document.querySelectorAll('[data-section="tabs"] [data-tabsection]');
        Profile.#nodes.letsGetYouStarted = document.querySelector("[data-letsgetyoustarted]");
        Profile.#nodes.linkFieldsSection = document.querySelector("[data-linkfieldssection]");
        Profile.#nodes.linkFieldHTML = document.querySelector(`[data-fieldtype="link"]`).cloneNode(true);
        Profile.#nodes.linkOptionsLimit = Profile.#nodes.linkFieldHTML.querySelectorAll("ul li").length;
        Profile.#nodes.linkFieldsRemovers = Profile.#nodes.linkFieldHTML.querySelectorAll(`[data-fieldtype="link"] [data-removelinkbutton]`);
        Profile.#nodes.linkFieldDropdown = Profile.#nodes.linkFieldHTML.querySelector("ul");
        Profile.#nodes.addNewLinkButtonNode = document.querySelector(`[data-buttonaddlink]`);
        Profile.#nodes.formSaveButton = document.querySelector(`[data-formsavebutton]`);

        // Remove initial linkFieldHTML Node after being cloned

        document.querySelector(`[data-fieldtype="link"]`).remove();

        // Remove dropdown HTML out of linkFieldHTML since it is stored in linkFieldDropdown

        Profile.#nodes.linkFieldHTML.querySelector("ul").remove();

        // Set starting active section tab

        Profile.tabSelected = Profile.#nodes.tabLinks[0].dataset.tab;

        // Set platform dropdown options to linkDropdownOptions

        Profile.#nodes.linkFieldDropdown.querySelectorAll('li').forEach(item => {
            Profile.#linkDropdownOptions.push({ value: item.dataset.value, label: item.querySelector("span").innerText, iconSVG: item.querySelector("svg").outerHTML });
        });

        // Instantiate tab handler class

        new TabHandler();

        // Instantiate links 

        new LinksHandler();
        
    }
}