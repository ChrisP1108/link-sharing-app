import Profile from '/frontend/scripts/profile/profile.class.js';

export default class SaveButtonHandler {

    // METHODS

    // Toggle Form Save Button

    toggleFormSaveButton(active = false) {
        if (active) {
            Profile.nodes.formSaveButton.classList.remove("button-disabled");
        } else {
            Profile.nodes.formSaveButton.classList.add("button-disabled");
        }
    }

    // CONSTRUCTOR

    constructor() {

    }
}