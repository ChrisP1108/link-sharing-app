import FormSubmission from '/frontend/scripts/form_submission/form_submission.class.js';

export default class FormErrorHandler {

    // Form error message handler

    static formErrSet(errMsg) {

        // Set #submissionError to true

        FormSubmission.submissionError = true;

        // Remove background opacity

        document.body.classList.remove("opaque");

        const formErrMsg = FormSubmission.formNode.querySelector("[data-formerrmsg]");
        formErrMsg.classList.remove("hidden");
        formErrMsg.innerText = errMsg;

        const formFields = formNode.querySelectorAll(`[data-fieldtype]`);

        // Remove error function after user clicks or types

        function removeErrHandler() {
            formErrMsg.classList.add("hidden", "");
            formErrMsg.innerText = '';
            
            // Set #submissionError to false

            FormSubmission.submissionError = false;
        }

        // Monitor for click or input of field with error applied to remove when user clicks

        formFields.forEach(field => {
            field.addEventListener('click', removeErrHandler);
            field.addEventListener('keyup', removeErrHandler);
        });
    }

    // Remove field error handler

    static fieldErrorRemove(fieldNode) {

        const inputErrMsg = fieldNode.querySelector('[data-errormsg]');

        const multiplePasswordFields = FormSubmission.formNode.querySelectorAll(`[data-fieldtype="password"]`);

        // Apply if multiple password fields and field is type password, such as create page

        if (multiplePasswordFields.length > 1 && fieldNode.dataset.fieldtype === 'password') {
            multiplePasswordFields.forEach(pField => {
                pField.classList.remove("field-error");
                const errMsg = pField.querySelector("[data-errormsg]");
                if (errMsg) {
                    errMsg.remove();
                }
            });

        } else {
        
            // Apply error styling to just one fields if no multiple password fields found
        
            fieldNode.classList.remove("field-error");

            // Remove input error text if found.

            if (inputErrMsg) {
                inputErrMsg.remove();
            }
        }

        // Set submissionError to false

        FormSubmission.submissionError = false;
    }

    // Set field error handler

    static fieldErrorSet(fieldNode = null, errMsg = null) {

        // Set submissionError to true

        FormSubmission.submissionError = true;

        // Remove background opacity

        document.body.classList.remove("opaque");

        // Check if there is an existing error message to avoid duplicates

        const existingErrMsg = fieldNode.querySelector("[data-errormsg]") !== null;

        if (!existingErrMsg) {

            // Generate error text p tag

            const inputErrMsg = document.createElement("p");

            inputErrMsg.dataset.errormsg = '';

            // Add field red border and show error text

            fieldNode.classList.add("field-error");

            inputErrMsg.innerText = errMsg ? errMsg : '';

            // Add error text p tag into DOM

            fieldNode.querySelector("[data-inputcontainer]").appendChild(inputErrMsg);

            // Monitor click to remove red border and error text

            // Check if multiple password fields, like on create page and remove all error styling and error text, otherwise remove single field

            fieldNode.addEventListener("click", () => {
                FormErrorHandler.fieldErrorRemove(fieldNode);   
            });

            fieldNode.addEventListener("keyup", () => {
                FormErrorHandler.fieldErrorRemove(fieldNode);  
            });

        }
    }
}