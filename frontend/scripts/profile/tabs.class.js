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
        this.tabLinkNodes = tabLinkNodes;
        this.tabSelected = this.tabLinkNodes[0].dataset.tab;
        this.tabSectionNodes = tabSectionNodes;

        this.tabClickHandler();
        this.setTabActive(this.tabSelected);
    }
}