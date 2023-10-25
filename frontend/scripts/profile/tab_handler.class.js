import Profile from '/frontend/scripts/profile/profile.class.js';

export default class TabHandler {

    // METHODS

    // Set tab to be active.  Also hides, unhides tab sections

    static #setTabActive(tabName) {

        Profile.getNodes().tabLinks.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add("tab-active");
                Profile.tabSelected = tab.dataset.tab;
            } else {
                tab.classList.remove("tab-active");
            }
        });

        Profile.getNodes().tabSection.forEach(section => {
            if (section.dataset.tabsection === Profile.tabSelected) {
                section.classList.remove("hidden");
            } else {
                section.classList.add("hidden");
            }
        });
    }

    // Activate tab click handler to monitor clicking of links, profile details tabs

    static #tabClickHandler() {
        Profile.getNodes().tabLinks.forEach(tab => {
            tab.addEventListener('click', () => {
                this.#setTabActive(tab.dataset.tab);
            });
        });
    }

    // Initialize Tab Handler

    static initTabHandler() {

        // Run Tab Click Handler On Page Load

        TabHandler.#tabClickHandler();

        // Set Active Tab to tabSelected On Page Load
        
        TabHandler.#setTabActive(Profile.tabSelected);
    }
}