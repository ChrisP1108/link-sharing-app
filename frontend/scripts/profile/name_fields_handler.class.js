import Profile from '/frontend/scripts/profile/profile.class.js';

export default class NameFieldsHandler {

    static #nameInputs;

    // Updates profile data for name fields

    static #nameInputHandler(input) {
        const inputParent = input.closest("[data-fieldparent]");

        Profile.setData(inputParent.dataset.fieldname, input.value);

    }

    static initNameFieldsHandler() {

        // Select all name input nodes and assign them to #nameInputs

        NameFieldsHandler.#nameInputs = Profile.getNodes().nameSection.main.querySelectorAll("input");

        // Set event listeners in input and apply nameInputHandler when user types

        NameFieldsHandler.#nameInputs.forEach(input => {
            input.addEventListener('input', () => {
                NameFieldsHandler.#nameInputHandler(input);
            });
        });
    }
}