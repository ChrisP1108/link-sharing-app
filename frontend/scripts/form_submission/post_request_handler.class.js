import FormSubmission from '/frontend/scripts/form_submission/form_submission.class.js';
import FormErrorHandler from '/frontend/scripts/form_submission/form_error_handler.class.js';
import DirectToUrlHandler from '/frontend/scripts/form_submission/direct_to_url_handler.class.js';
import Profile from '/frontend/scripts/profile/profile.class.js';

export default class PostRequestHandler {

    // API POST Request Handler

    static async #apiRequestHandler(type, data = []) {

        let requestResolved = false;

        // Timer in the event response taken more than 15 seconds.

        setTimeout(() => {
            if (!requestResolved) {
                return { ok: false, status: 0, msg: 'Server took too long to respond.  Please try again.'};
            }
        }, 15000);

        // Make request to API

        try {
            const res = await fetch(FormSubmission.getAPIRoute(), {
                method: type,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resData = await res.json();

            requestResolved = true;

            if (res.ok) {
                return { ok: true, status: res.status, msg: resData.msg, data: resData.data ?? null};
            } else {
                return { ok: false, status: res.status, msg: resData.msg }
            }
        } catch (err) {
            console.error(err);
            requestResolved = true;
            return { ok: false, status: 0, msg: 'A server error occured.  Please try again.' }
        }
    }

    // Send data to API via a POST Request

    static async formSubmitRequest(formData) {

        // Set submitting to true to prevent form submission during API call

        FormSubmission.setSubmitting(true);

        // Load Spinner in submit button

        FormSubmission.getFormButtonNode().innerHTML = `<span>${FormSubmission.getFormButtonText()}</span>` + FormSubmission.getLoadingSpinner();

        // Checks for error
        
        // Submission handle by type

        switch(FormSubmission.getFormType()) {

            // Create user handler

            case 'create':
                formData.password = formData.confirm_password;
                delete formData.create_password;
                delete formData.confirm_password;

                const createRequest = await PostRequestHandler.#apiRequestHandler('POST', formData);

                if (createRequest.ok) {
                    DirectToUrlHandler.directToUrl('profile');
                } else {
                    if (createRequest.msg.includes('same email already exists')) {
                        FormErrorHandler.fieldErrorSet(FormSubmission.getFormNode().querySelector(`[data-fieldtype="email"]`), 'Email already exists');
                    } else {
                        FormErrorHandler.formErrSet(createRequest.msg);
                    }
                }
            break;

            // Login user handler

            case 'login':
                const loginRequest = await PostRequestHandler.#apiRequestHandler('POST', formData);

                if (loginRequest.ok) {
                    DirectToUrlHandler.directToUrl('profile');
                } else {
                    if (loginRequest.msg.includes("Invalid user email")) {
                        FormErrorHandler.fieldErrorSet(FormSubmission.getFormNode().querySelector(`[data-fieldtype="email"]`), 'Invalid email');
                    } else if (loginRequest.msg.includes("Invalid password")) {
                        FormErrorHandler.fieldErrorSet(FormSubmission.getFormNode().querySelector(`[data-fieldtype="password"]`), 'Invalid password');
                    } else {
                        FormErrorHandler.formErrSet(loginRequest.msg);
                    }
                }
            break;

            // Profile user update

            case 'profile':
            
                const profileUpdateRequest = await PostRequestHandler.#apiRequestHandler('PUT', formData);

                if (profileUpdateRequest.ok) {
                    FormSubmission.getFormButtonNode().innerHTML = FormSubmission.getFormButtonText();

                    // Update images with url from server.  Delete image_upload fields as they are no longer needed until user wants to update image again.

                    Profile.setData('image_url', profileUpdateRequest.data.image_url);
                    Profile.setData('image_upload_data', null);
                    Profile.setData('image_upload_size', null);
                    Profile.setData('image_upload_format', null);
                    
                } else {
                    if (profileUpdateRequest.status === 401) {
                        window.location.reload();
                    } else if (profileUpdateRequest.msg.includes("Uploaded images must be 750KB") || profileUpdateRequest.msg.includes("An image upload must be")) {
                        FormErrorHandler.fieldErrorSet(FormSubmission.getFormNode().querySelector(`[data-fieldtype="image"]`), profileUpdateRequest.msg);
                    } else {
                        FormErrorHandler.formErrSet(profileUpdateRequest.msg);
                    }
                }
                FormSubmission.setSubmitting(false);
            break;
        }

        // Set set button text back from spinner if error found and window to full opacity and submitting to false
        
        if (FormSubmission.getSubmissionError()) {
            FormSubmission.getFormButtonNode().innerHTML = FormSubmission.getFormButtonText();
        }
    }
}