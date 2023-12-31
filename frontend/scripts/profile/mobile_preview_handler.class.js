import Profile from '/frontend/scripts/profile/profile.class.js';
import MobileLinkItem from '/frontend/scripts/profile/mobile_link_item.class.js';
import FormErrorHandler from '/frontend/scripts/form_submission/form_error_handler.class.js';

export default class MobilePreviewHandler {

    static #linkItems;
    static #blankMobileItems = 5;

    // METHODS

    // Clear existing mobile link items to prevent errors when adding/removing links

    static #clearExistingMobileLinkItems() {

        // Select All link node fillers
        
        MobilePreviewHandler.#linkItems = Profile.getNodes().mobileSection.linksSection.querySelectorAll(`[data-mobilelinkitem]`);
    
        MobilePreviewHandler.#linkItems.forEach((item, index) => {
            item.innerHTML = '';
            item.dataset.order = index + 1;

            // Removes all blank items if user previously saved, otherwise blank mobile items will be shown if total links is less than blankMobileItems

            if (Profile.userSaved() && index > 0) {
                item.remove();
            } else if (index + 1 > MobilePreviewHandler.#blankMobileItems) {
                item.remove();
            }
        });

        // Brings back blank link items if users removes all existing

        if (Profile.userSaved() && !Profile.getData().links.length && Profile.getNodes().mobileSection.linksSection.querySelectorAll(`[data-mobilelinkitem]`).length === 1) {
            for(let i = 1; i < MobilePreviewHandler.#blankMobileItems; i++) {
                const addBlankItem = Profile.getNodes().mobileSection.blankLinkItem.cloneNode(true);
                Profile.getNodes().mobileSection.linksSection.appendChild(addBlankItem);
            }
        }
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

    // Render Uploaded Image

    static #renderUploadedImage() {

        // Remove error styling from any previous file upload error attempt

        Profile.getNodes().imageSection.main.classList.remove("field-error");

        // Set placeholder text to change image

        Profile.getNodes().imageSection.placeholderText.innerText = Profile.getNodes().imageSection.placeholderText.dataset.changeimage;

        // Clear input background

        Profile.getNodes().imageSection.imageRenderNode.src = '';

        // Add overlay styling for input image viewing

        Profile.getNodes().imageSection.imageContainerNode.classList.add("show-rendered-image");

        // Render image to mobile preview

        Profile.getNodes().mobileSection.imageNode.src = Profile.getData().image_upload.data;
        Profile.getNodes().mobileSection.image.classList.add("show-rendered-image");

        // Render image to background of image input

        Profile.getNodes().imageSection.imageRenderNode.src = Profile.getData().image_upload.data;

    }

    // Set error styling, add error message and clear any existing upload for image upload error

    static setImageUploadError(msg) {
        Profile.resetImageUploadData();
        Profile.getNodes().imageSection.main.classList.add("field-error");
        FormErrorHandler.fieldErrorSet(Profile.getNodes().imageSection.main, msg);
        Profile.getNodes().mobileSection.image.classList.remove("show-rendered-image");
        Profile.getNodes().imageSection.imageContainerNode.classList.remove("show-rendered-image");
        Profile.getNodes().imageSection.imageRenderNode.src = '';
        Profile.getNodes().imageSection.placeholderText.innerText = Profile.getNodes().imageSection.placeholderText.dataset.uploadimage;
    }

    // Set existing image from url in database to mobile and image field section;

    static #setImageFromUrl() {

        // Add overlay styling for input image viewing

        Profile.getNodes().imageSection.imageContainerNode.classList.add("show-rendered-image");

        // Set placeholder text to change image

        Profile.getNodes().imageSection.placeholderText.innerText = Profile.getNodes().imageSection.placeholderText.dataset.changeimage;

        // Render profile picture image field

        Profile.getNodes().imageSection.imageRenderNode.src = window.location.origin + Profile.getData().image_url;

        // Set styling and image source on image node to show image in mobile preview

        Profile.getNodes().mobileSection.image.classList.add("show-rendered-image");
        Profile.getNodes().mobileSection.imageNode.src = window.location.origin + Profile.getData().image_url;
    }

    // Render user name and email

    static #renderUserNameEmail(type) {
        
        // Render by type

        if (type === 'first_name' || type === 'last_name') {
            Profile.getNodes().mobileSection.name.classList.add("show-text");
            Profile.getNodes().mobileSection.name.innerText = `${Profile.getData().first_name ? Profile.getData().first_name : ''} ${Profile.getData().last_name ? Profile.getData().last_name : ''}`;
        }

        if (type === 'display_email') {
            Profile.getNodes().mobileSection.email.classList.add("show-text");
            Profile.getNodes().mobileSection.email.innerText = Profile.getData().display_email ? Profile.getData().display_email : '';
        }

        // If data string is empty on any fields, run clearNameEmailField handler

        if (!Profile.getData()[type]) {
            MobilePreviewHandler.#clearNameEmailField();
        }
    }

    // Clear user name or email field if the field(s) are blank

    static #clearNameEmailField() {

        if (!Profile.getData().last_name && !Profile.getData().last_name) {
            Profile.getNodes().mobileSection.name.classList.remove("show-text");
        }

        if (!Profile.getData().email) {
            Profile.getNodes().mobileSection.email.classList.remove("show-text");
        }
    }

    // Render data to mobile preview 

    static renderMobilePreview(type) {

        // Determines section of mobile preview to rerender based upon data that was updated

        switch(type) {

            // Render link items

            case 'links':

                // Clear existing mobile link items to prevent errors when adding/removing links

                MobilePreviewHandler.#clearExistingMobileLinkItems();

                // Render link items.  Fills in any blank gray mobile items fillers with link

                MobilePreviewHandler.#renderLinkItems();

                break;

            // Render uploaded image

            case 'image_upload':

                // Run renderUploadedImage if data is not blank

                if (Profile.getData().image_upload) {

                    MobilePreviewHandler.#renderUploadedImage();

                }

                break;

            // Render image url from database

            case 'image_url':

                if (Profile.getData().image_url) {
                    MobilePreviewHandler.#setImageFromUrl();
                }

            // Render first name

            case 'first_name':

                MobilePreviewHandler.#renderUserNameEmail(type);
                
                break;

            // Render last name

            case 'last_name':

                MobilePreviewHandler.#renderUserNameEmail(type);

                break;

            // Render email

            case 'display_email':

                MobilePreviewHandler.#renderUserNameEmail(type);

                break;

            default:
                break;
        }

    }
}