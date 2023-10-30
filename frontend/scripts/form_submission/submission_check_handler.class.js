import FormSubmission from '/frontend/scripts/form_submission/form_submission.class.js';
import FormErrorHandler from '/frontend/scripts/form_submission/form_error_handler.class.js';
import PostRequestHandler from '/frontend/scripts/form_submission/post_request_handler.class.js';

export default class SubmissionCheckHandler {

    // Form submission field check.  Makes sure there are no error prior to submission

    static async formSubmitCheck(e) {

        // Gather form data and input nodes

        const formData = new FormData(e.target);

        const fieldNodes = [];
        
        for (let i = 0; e.target.length - 1 > i; i++) {
            const item = e.target[i];
            formData[item.name] = item.value;
            fieldNodes.push(item);
        }    
        
        // Used to determine if error was found

        let formError = false;

        const fieldValues = Object.values(FormSubmission.formDataNodes).flat(1).map(f => {
            return f.type === 'link' ? {...f, value: f.value.link ? f.value.link : '', node: f.node.link, name: f.value.platform, parentNode: f.node.link.closest("[data-fieldparent]").querySelector("[data-linkitemcontainer]") } 
            : {...f, value: f.value ? f.value : '', name: f.node.id, parentNode: f.node.closest("[data-fieldparent]") }
        });

        // Loop through fieldsValues
        
        fieldValues.forEach(field => {

            // Used for determining errors

            let requiredBlank = false;

            let fieldError = false;

            // Select Error text node

            let inputErrMsg = '';

            // Set error if required field blank

            if (!field.value && field.required) {
                requiredBlank = true;
                fieldError = true;
                formError = true;
                inputErrMsg = "Can't be empty";
            }

            // Check that field inputs are valid

            if (!requiredBlank) {

                switch(field.type) {
                    case 'email':
                        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                        if (!emailRegex.test(field.value)) {
                            fieldError = true;
                            formError = true;
                            inputErrMsg = "Invalid email"
                        } 
                        break;
                }
            }

            // Check on create page for passwords matching

            if (FormSubmission.formType === 'create') {
                const passwordFields = fieldNodes.filter(field => field.type === "password");
                const passwords = passwordFields.map(i => i.value);
                if (field.type === 'password' && field.value.length < 8) {
                    fieldError = true;
                    inputErrMsg = "8 characters minimum";
                    formError = true;
                }
                if (passwords[0] !== passwords[1]) {
                    if (field.type === 'password') {
                        fieldError = true;
                        inputErrMsg = "Passwords do not match";
                        formError = true;
                    } 
                }
            }

            // Handle error on fields if error found.  Applies red border and red text, and removes when user clicks afterward

            if (fieldError) {            
                FormErrorHandler.fieldErrorSet(field.parentNode, inputErrMsg);
            }
        });

        if (!formError) {
            fieldValues.forEach(f => {
                FormErrorHandler.fieldErrorRemove(FormSubmission.formNode, f.parentNode);
            });
            PostRequestHandler.formPostRequest(formData);
        }
    }
}