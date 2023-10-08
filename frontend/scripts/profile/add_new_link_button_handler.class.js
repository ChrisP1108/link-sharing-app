import Profile from '/frontend/scripts/profile/profile.class.js';

export default class AddNewLinkButtonHandler {

    // METHODS

    // Toggle addNewLinkButton node hidden / visible

    static toggleAddNewLinkButtonNode(active = false) {
        if (active) {
            Profile.getNodes().addNewLinkButtonNode.classList.remove("hidden");
        } else Profile.getNodes().addNewLinkButtonNode.classList.add("hidden");
    }
}