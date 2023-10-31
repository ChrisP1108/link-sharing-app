import FormSubmission from '/frontend/scripts/form_submission/form_submission.class.js';
import FormErrorHandler from '/frontend/scripts/form_submission/form_error_handler.class.js';
import PostRequestHandler from '/frontend/scripts/form_submission/post_request_handler.class.js';

export default class SubmissionCheckHandler {

    // Form submission field check.  Makes sure there are no error prior to submission

    static async formSubmitCheck(e) {
        
        // Used to determine if error was found

        let formError = false;

        // Loop through form nodes data
        
        FormSubmission.getFormNodesData().forEach(field => {

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

            if (FormSubmission.getFormType() === 'create') {
                const passwordFields = FormSubmission.getFormNodesData().filter(field => field.type === "password");
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
            FormSubmission.getFormNodesData().forEach(f => {
                FormErrorHandler.fieldErrorRemove(FormSubmission.getFormNode(), f.parentNode);
            });
            PostRequestHandler.formPostRequest(FormSubmission.getFormData());
        }
    }
}