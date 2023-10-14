import Profile from '/frontend/scripts/profile/profile.class.js';
import MobileLinkItem from '/frontend/scripts/profile/mobile_link_item.class.js';

export default class MobilePreviewHandler {

    static #linkItems;
    static #blankMobileItems = 5;

    // METHODS

    // Clear existing mobile link items to prevent errors when adding/removing links

    static #clearExistingMobileItems() {

        // Select All link node fillers
        
        MobilePreviewHandler.#linkItems = Profile.getNodes().mobileSection.linksSection.querySelectorAll(`[data-mobilelinkitem]`);
    
        MobilePreviewHandler.#linkItems.forEach((item, index) => {
            item.innerHTML = '';
            item.dataset.order = index + 1;
            if (index + 1 > MobilePreviewHandler.#blankMobileItems) {
                item.remove();
            }
        });
    }

    static #renderLinkItems() {

        // Select All link node fillers
        
        MobilePreviewHandler.#linkItems = Profile.getNodes().mobileSection.linksSection.querySelectorAll(`[data-mobilelinkitem]`);
        
        // Assign link data to the 5 link node fillers if any link data found

        MobilePreviewHandler.#linkItems.forEach(node => {

            const mobileLink = new MobileLinkItem(node);

            mobileLink.html();

        });

        // Create additional nodes if there are more than 5 links or more than blank mobile link items

        if (Profile.getData().links.length > MobilePreviewHandler.#linkItems.length) {

            // Iterate through remaining link data items greater than length of existing mobileLinkItems

            Profile.getData().links.forEach((link, index) => {
                if (index + 1 > MobilePreviewHandler.#linkItems.length) {

                    // Clone blank mobile link node

                    const nodeCopy = MobilePreviewHandler.#linkItems[0].cloneNode(true);

                    // Adjust node dataset order number accordingly

                    nodeCopy.dataset.order = index + 1;

                    // Append node to links section

                    Profile.getNodes().mobileSection.linksSection.appendChild(nodeCopy)

                    // Generate mobile link items html

                    const mobileLinkToRender = new MobileLinkItem(nodeCopy);

                    mobileLinkToRender.html();
                }
            });
        }
    }

    // Render data to mobile preview 

    static renderMobilePreview() {

        // Clear existing mobile link items to prevent errors when adding/removing links

        MobilePreviewHandler.#clearExistingMobileItems();

        // Render link items.  Fills in any blank gray mobile items fillers with linkn

        MobilePreviewHandler.#renderLinkItems();

    }
}