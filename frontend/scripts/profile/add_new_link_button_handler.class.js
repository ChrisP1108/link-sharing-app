import Profile from '/frontend/scripts/profile/profile.class.js';

export default class AddNewLinkButtonHandler {

    // METHODS

    // Toggle addNewLinkButton node hidden / visible

    static toggleaddNewLinkButton(active = false) {
        if (active) {
            Profile.getNodes().addNewLinkButton.classList.remove("hidden");
        } else Profile.getNodes().addNewLinkButton.classList.add("hidden");
    }
}