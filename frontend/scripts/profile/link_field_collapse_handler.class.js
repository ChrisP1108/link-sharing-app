import Profile from '/frontend/scripts/profile/profile.class.js';

export default class LinkFieldCollapseHandler {

    // METHODS

    static initLinkCollapseHandler() {

        // Select all link fields

        const linkFields = Profile.getNodes().linkFieldsSection.querySelectorAll(`[data-fieldtype="link"]`);

        // Select all field collapse icons, check local storage for existing fields that user may have collapsed and apply those settings, and then add click event listener

        linkFields.forEach(field => {

            // Check for existing link collapsed data and apply settings

            const existingLinkCollapseData = JSON.parse(localStorage.getItem(Profile.linkCollapseLocalDataName));

            if (existingLinkCollapseData) {
                existingLinkCollapseData.forEach(link => {
                    if (link.platform === field.querySelector(`[data-linkitemplatformfield]`).dataset.value && link.collapsed) {
                        field.classList.add("link-field-collapsed");
                    }
                });
            }

            // Monitor click of link field collapse icons

            const collapseIcon = field.querySelector("[data-linkcollapseclick]");

            collapseIcon.addEventListener("click", () => {

                // Toggle CSS class to collapse, uncollapse link field

                field.classList.toggle("link-field-collapsed");

                // Set collapse data in local storage by looping through nodes and checking if CSS class is added or not.

                const localData = [];
                
                Profile.getNodes().linkFieldsSection
                    .querySelectorAll(`[data-linkitemplatformfield]`)
                    .forEach(link => {
                        const linkFieldSave = { platform: link.dataset.value, collapsed: link.closest("[data-fieldparent]").classList.contains("link-field-collapsed")}
                        localData.push(linkFieldSave);
                    }
                );

                // Update local storage

                localStorage.setItem(Profile.linkCollapseLocalDataName, JSON.stringify(localData));
            });
        });
    }
}