import Profile from '/frontend/scripts/profile/profile.class.js';

export default class SaveButtonHandler {

    // METHODS

    // Toggle Form Save Button

    static toggleFormSaveButton(active = false) {
        if (active) {
            Profile.getNodes().formSaveButton.classList.remove("button-disabled");
        } else {
            Profile.getNodes().formSaveButton.classList.add("button-disabled");
        }
    }
}