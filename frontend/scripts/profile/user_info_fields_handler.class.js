import Profile from '/frontend/scripts/profile/profile.class.js';

export default class UserInfoFieldsHandler {

    static #nameInputs;

    // Updates profile data and mobile view text

    static #userInputHandler(input) {

        // Update data

        // Select parent container to get field name
        
        const inputParent = input.closest("[data-fieldparent]");

        const fieldName = inputParent.dataset.fieldname;

        // Set data which will trigger MobilePreviewHandler render handling

        Profile.setData(fieldName, input.value);

    }

    static initUserInfoFieldsHandler() {

        // Select all name input nodes and assign them to #nameInputs

        UserInfoFieldsHandler.#nameInputs = Profile.getNodes().nameSection.main.querySelectorAll("input");

        // Set event listeners in input and apply nameInputHandler when user types

        UserInfoFieldsHandler.#nameInputs.forEach(input => {
            input.addEventListener('input', () => {
                UserInfoFieldsHandler.#userInputHandler(input);
            });
        });
    }
}