export default class TabHandler {

    // PROPERTIES

    tabLinkNodes;
    tabSelected;
    tabSectionNodes;

    // METHODS

    // Set tab to be active.  Also hides, unhides tab sections

    setTabActive(tabName) {

        this.tabLinkNodes.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add("tab-active");
                this.tabSelected = tab.dataset.tab;
            } else {
                tab.classList.remove("tab-active");
            }
        });

        this.tabSectionNodes.forEach(section => {
            if (section.dataset.tabsection === this.tabSelected) {
                section.classList.remove("hidden");
            } else {
                section.classList.add("hidden");
            }
        });
    }

    // Activate tab click handler to monitor clicking of links, profile details tabs

    tabClickHandler() {
        this.tabLinkNodes.forEach(tab => {
            tab.addEventListener('click', () => {
                this.setTabActive(tab.dataset.tab);
            });
        });
    }

    // CONSTRUCTOR

    constructor(tabLinkNodes = null, tabSectionNodes = null) {

        // Select tab link nodes

        this.tabLinkNodes = tabLinkNodes;

        // Select first tab to set active on page load

        this.tabSelected = this.tabLinkNodes[0].dataset.tab;

        // Select tab section nodes

        this.tabSectionNodes = tabSectionNodes;

        // Run Tab Click Handler On Page Load

        this.tabClickHandler();

        // Set Active Tab to tabSelected On Page Load
        
        this.setTabActive(this.tabSelected);
    }
}