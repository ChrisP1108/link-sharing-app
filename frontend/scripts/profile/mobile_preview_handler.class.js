import Profile from '/frontend/scripts/profile/profile.class.js';

export default class MobilePreviewHandler {

    // METHODS

    // Render data to mobile preview 

    static renderMobilePreview() {

        // Set links

        // Select All link node fillers
        
        const mobileLinkItems = Profile.getNodes().mobileSection.linksSection.querySelectorAll(`[data-mobilelinkitem]`);

        // Assign link data to link node fillers if any link data found

        mobileLinkItems.forEach(node => {

            // Clear link node back to filler to ensure deleted links get cleared

            node.innerHTML = '';
            node.style.background = '';

            // Get link data

            const linkData = Profile.getData().links.find(link => link.order === Number(node.dataset.order));

            // If corresponding link data found, get option data and render.

            if (linkData) {

                // Get option data corresponding to link data

                const optionData = Profile.getPlatformDropdownOptions().find(option => option.value === linkData.platform);
            
                if (linkData) {
                    node.style.background = optionData.color;
                    node.innerHTML = `<h4>${optionData.label}</h4>`;
                }
            }
        });
    }
}