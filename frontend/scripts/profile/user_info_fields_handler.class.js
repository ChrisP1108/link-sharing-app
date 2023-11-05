import Profile from '/frontend/scripts/profile/profile.class.js';

export default class UserInfoFieldsHandler {

    static #nameInputs;

    // Populates user input values if existing user data existed on page load

    static #populateExistingData() {
        UserInfoFieldsHandler.#nameInputs.forEach(input => {
            const existingFieldData = Profile.getData()[input.name];
            if (existingFieldData) {
                input.value = existingFieldData;
                UserInfoFieldsHandler.#userInputHandler(input);
            }
        });
    }

    // Updates profile data and mobile view text

    static #userInputHandler(input) {

        // Select parent container to get field name
        
        const inputParent = input.closest("[data-fieldparent]");

        const fieldName = inputParent.dataset.fieldname;

        // Set data which will trigger MobilePreviewHandler render handling

        Profile.setData(fieldName, input.value);
    }

    static initUserInfoFieldsHandler() {

        // Select all name input nodes and assign them to #nameInputs

        UserInfoFieldsHandler.#nameInputs = Profile.getNodes().nameSection.main.querySelectorAll("input");

        // Populate user fields if existing data exists on page load

        UserInfoFieldsHandler.#populateExistingData();
        
        // Set event listeners in input and apply nameInputHandler when user types

        UserInfoFieldsHandler.#nameInputs.forEach(input => {
            input.addEventListener('input', () => {
                UserInfoFieldsHandler.#userInputHandler(input);
            });
        });
    }
}