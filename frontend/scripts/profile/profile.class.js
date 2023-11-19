import TabHandler from '/frontend/scripts/profile/tab_handler.class.js';
import LinksHandler from '/frontend/scripts/profile/links_handler.class.js';
import MobilePreviewHandler from '/frontend/scripts/profile/mobile_preview_handler.class.js';
import ImageUploadHandler from '/frontend/scripts/profile/image_upload_handler.class.js';
import UserInfoFieldsHandler from '/frontend/scripts/profile/user_info_fields_handler.class.js';

export default class Profile {

    // Declare properties

    // Data

    static #data = { 
        id: null, 
        first_name: null, 
        last_name: null, 
        email: null, 
        image_url: null, 
        image_upload: {
            size: null,
            type: null,
            data: null,
            width: null,
            height: null
        },
        links: []
    };

    // Data getter

    static getData() {
        return Profile.#data;
    }

    // Data setter

    static setData(key, value, rerender = true) {
        Profile.#data[key] = value;
        Profile.#nodes.formRoot.value = Profile.#data;

        // Render mobile preview if rerender needed and update links collapse local storage data

        if (rerender) {

            MobilePreviewHandler.renderMobilePreview(key);

            // Update link fields collapsed in local Storage if a field was added or deleted

            if (Profile.getLinkCollapseData().length !== Profile.getData().links.length) {
                Profile.setLinkCollapseData(Profile.getLinkCollapseData().filter(link => Profile.getData().links.some(l => l.platform === link.platform)));
            }
        }
    }

    // Check if user has previously saved

    static userSaved() {
        return Profile.#data.image_url ? true : false;
    }

    // Reset image upload fields

    static resetImageUploadData() {
        Profile.#data.image_upload  = { size: null, type: null, data: null, width: null, height: null };
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
        addNewLinkButton: null,
        formSaveButton: null,
        mobileSection: {
            main: null,
            image: null,
            imageNode: null,
            name: null,
            email: null,
            linksSection: null
        },
        imageSection: {
            main: null,
            imageContainerNode: null,
            imageNode: null,
            imageRenderNode: null,
            placeholderText: null
        },
        nameSection: {
            main: null,
            firstName: null,
            lastName: null
        }
    }

    static #linkDropdownOptions = [];

    static getPlatformDropdownOptions() {
        return Profile.#linkDropdownOptions;
    }

    // Link collapse local storage data

    static #linkCollapseLocalData = [];

    // Get link collapse local storage data

    static getLinkCollapseData() {
        const getLocalData = JSON.parse(localStorage.getItem("link-field-collapsed-data"));

        if (getLocalData && getLocalData.length) {
            Profile.#linkCollapseLocalData = getLocalData;
        } else Profile.#linkCollapseLocalData = [];
        
        return Profile.#linkCollapseLocalData;
    }

    // Set local storage link collapse data

    static setLinkCollapseData(array) {
        Profile.#linkCollapseLocalData = array;
        localStorage.setItem("link-field-collapsed-data", JSON.stringify(array))
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
        Profile.#nodes.addNewLinkButton = document.querySelector(`[data-buttonaddlink]`);
        Profile.#nodes.formSaveButton = document.querySelector(`[data-formsavebutton]`);
        Profile.#nodes.mobileSection.main = document.querySelector(`[data-section="mobile-preview"]`);
        Profile.#nodes.mobileSection.image = Profile.#nodes.mobileSection.main.querySelector(`[data-mobilesection="image"]`);
        Profile.#nodes.mobileSection.imageNode = Profile.#nodes.mobileSection.image.querySelector("[data-mobileimage]");
        Profile.#nodes.mobileSection.name = Profile.#nodes.mobileSection.main.querySelector(`[data-mobilesection="name"]`);
        Profile.#nodes.mobileSection.email = Profile.#nodes.mobileSection.main.querySelector(`[data-mobilesection="email"]`);
        Profile.#nodes.mobileSection.linksSection = Profile.#nodes.mobileSection.main.querySelector(`[data-mobilesection="links"]`);
        Profile.#nodes.imageSection.main = document.querySelector(`[data-fieldtype="image"]`);
        Profile.#nodes.imageSection.imageContainerNode = Profile.#nodes.imageSection.main.querySelector(`[data-inputcontainer]`);
        Profile.#nodes.imageSection.imageNode = Profile.#nodes.imageSection.main.querySelector(`input[type="file"]`);
        Profile.#nodes.imageSection.imageRenderNode = Profile.#nodes.imageSection.main.querySelector(`img[data-inputfileimage]`);
        Profile.#nodes.imageSection.placeholderText = Profile.#nodes.imageSection.main.querySelector(`[data-imageplaceholdertext]`);
        Profile.#nodes.nameSection.main = document.querySelector(`[data-namefieldscontainer]`);
        Profile.#nodes.nameSection.firstName = Profile.#nodes.nameSection.main.querySelector(`[data-fieldname="first_name"]`);
        Profile.#nodes.nameSection.lastName = Profile.#nodes.nameSection.main.querySelector(`[data-fieldname="last_name"]`);

        // Remove initial linkFieldHTML Node after being cloned

        document.querySelector(`[data-fieldtype="link"]`).remove();

        // Remove dropdown HTML out of linkFieldHTML since it is stored in linkFieldDropdown

        Profile.#nodes.linkFieldHTML.querySelector("ul").remove();

        // Set starting active section tab

        Profile.tabSelected = Profile.#nodes.tabLinks[0].dataset.tab;

        // Set platform dropdown options to linkDropdownOptions

        Profile.#nodes.linkFieldDropdown.querySelectorAll('li').forEach(item => {

            const option = { 
                value: item.dataset.value, 
                label: item.querySelector("span").innerText, 
                iconSVG: item.querySelector("svg").outerHTML,
                placeholder: 'e.g. ' + item.dataset.placeholder,
                color: item.dataset.color,
                requiredText: item.dataset.requiredtext 
            }
            
            Profile.#linkDropdownOptions.push(option);
        });

        // Initialize Tab Handler

        TabHandler.initTabHandler();

        // Initialize Links Handler

        LinksHandler.initAddNewLinkHandler();

        // Initialize ImageUploadHandler

        ImageUploadHandler.initImageUploadHandler();

        // Initialize UserInfoFieldsHandler

        UserInfoFieldsHandler.initUserInfoFieldsHandler();

        // Set existing image if image_url found in data

        if (Profile.getData().image_url) {
            MobilePreviewHandler.renderMobilePreview('image_url');
        }
    }
}