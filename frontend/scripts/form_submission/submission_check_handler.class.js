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

            // Set error if required field is blank

            if (!field.value && field.required) {
                requiredBlank = true;
                fieldError = true;
                formError = true;
                inputErrMsg = "Can't be empty";
            }

            // Check that fields don't contain spaces or quote characters

            if (typeof field.value === 'string') {
                if (field.value.includes(" ")) {
                    fieldError = true;
                    formError = true;
                    inputErrMsg = "No blank spaces";
                }

                if (field.value.includes("'") || field.value.includes('"')) {
                    fieldError = true;
                    formError = true;
                    inputErrMsg = "No quote characters";
                }
            }

            // Check that field inputs are valid

            if (!requiredBlank && !fieldError) {

                switch(field.type) {

                    // Check that email is valid

                    case 'email':
                        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                        if (!emailRegex.test(field.value) && field.required) {
                            fieldError = true;
                            formError = true;
                            inputErrMsg = "Invalid email";
                        } 
                        break;

                    // Check that profile link url is valid based upon platform selected

                    case 'link':
                        if (!field.linkValid) {
                            fieldError = true;
                            formError = true;
                            inputErrMsg = "Please check the URL";
                        }
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

                // Add form error general message for user to check links and profile tabs for field errors

                if (FormSubmission.getFormType() === 'profile') {
                    FormErrorHandler.formErrSet("One or more fields contain errors.  Check all fields and try saving again.")
                }
            }
        });

        if (!formError) {
            FormSubmission.getFormNodesData().forEach(f => {
                FormErrorHandler.fieldErrorRemove(FormSubmission.getFormNode(), f.parentNode);
            });
            PostRequestHandler.formSubmitRequest(FormSubmission.getFormData());
        }
    }
}