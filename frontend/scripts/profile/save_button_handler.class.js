export default class SaveButtonHandler {

    // PROPERTIES

    formSaveButtonNode;

    // METHODS

    // Toggle Form Save Button

    toggleFormSaveButton(active = false) {
        if (active) {
            this.formSaveButtonNode .classList.remove("button-disabled");
        } else {
            this.formSaveButtonNode .classList.add("button-disabled");
        }
    }

    // CONSTRUCTOR

    constructor(formSaveButtonNode) {

        // Select form save button

        this.formSaveButtonNode = formSaveButtonNode;
    }
}