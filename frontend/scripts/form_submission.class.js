class FormHandler {

    // CLASS PROPERTIES

        #formNode;
        #formButtonNode;
        #formButtonText;
        #formType;
        #submitting = false;
        #submissionError = false;
        #apiRoute;
        #spinnerSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12"><circle cx="4" cy="12" r="0"><animate begin="0;h.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate begin="b.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="d.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="g" begin="f.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="h" begin="g.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate></circle><circle cx="4" cy="12" r="3"><animate begin="0;h.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="b.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="e" begin="d.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="f" begin="e.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="f.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate></circle><circle cx="12" cy="12" r="3"><animate begin="0;h.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="c" begin="b.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="d" begin="c.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="d.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate begin="f.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate></circle><circle cx="20" cy="12" r="3"><animate id="a" begin="0;h.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="b" begin="a.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="b.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate id="e" begin="d.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="f.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate></circle></svg>`;

    // CONSTRUCTOR

        constructor(formNode = null, formType = null, apiRoute = null, spinnerSVG = null) {

            if (!formNode || !formType || !apiRoute) {
                throw new Error("Form node, form type, and API route must be passed in on FormHandler class instantiation.")
            }

            this.#formNode = document.querySelector(formNode);
            this.#formButtonNode = this.#formNode.querySelector("button");
            this.#formButtonText = this.#formButtonNode.innerText;
            this.#formType = formType;
            this.#apiRoute = apiRoute;

            // Set loading spinner if custom SVG HTML passed in.

            if (spinnerSVG) {
                this.#spinnerSVG = spinnerSVG;
            }

            // Set event listener on form submit.  Prevent default submission and run #formSubmitCheck method if not currently in submitting process

            this.#formNode.addEventListener("submit", e => {
                e.preventDefault();
                if (!this.#submitting) {
                    this.#formSubmitCheck(e);
                }
            });
        }

    // METHODS

        // Form error message handler

        #formErrSet(errMsg) {

            // Set #submissionError to true

            this.#submissionError = true;

            // Remove background opacity

            document.body.classList.remove("opaque");

            const formErrMsg = this.#formNode.querySelector("[data-formerrmsg]");
            formErrMsg.classList.remove("hidden");
            formErrMsg.innerText = errMsg;

            const formFields = this.#formNode.querySelectorAll(`[data-fieldtype]`);

            // Remove error function after user clicks or types

            function removeErrHandler() {
                formErrMsg.classList.add("hidden", "");
                formErrMsg.innerText = '';
                
                // Set #submissionError to false

                this.#submissionError = false;
            }

            // Monitor for click or input of field with error applied to remove when user clicks

            formFields.forEach(field => {
                field.addEventListener('click', removeErrHandler);
                field.addEventListener('keyup', removeErrHandler);
            });
        }

        // Remove field error handler

        #fieldErrorRemove(fieldNode) {

            const inputErrMsg = fieldNode.querySelector('[data-errormsg]');

            const multiplePasswordFields = this.#formNode.querySelectorAll(`[data-fieldtype="password"]`);

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

            // Set #submissionError to false

            this.#submissionError = false;
        }

        // Set field error handler

        #fieldErrorSet(fieldNode = null, errMsg = null) {

            // Set #submissionError to true

            this.#submissionError = true;

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
                    this.#fieldErrorRemove(fieldNode);   
                });

                fieldNode.addEventListener("keyup", () => {
                    this.#fieldErrorRemove(fieldNode);   
                });

            }
        }

        // Direct to url

        #directToUrl(url) {

            // Perform redirect

            window.location.href = window.location.origin + '/' + url;
        }

        // API POST Request Handler

        async apiPostRequest(data = []) {

            let requestResolved = false;

            // Timer in the event response taken more than 15 seconds.

            setTimeout(() => {
                if (!requestResolved) {
                    return { ok: false, status: 0, msg: 'Server took too long to respond.  Please try again.'};
                }
            }, 15000);

            // Make request to API

            try {
                const res = await fetch(this.#apiRoute, {
                    method: 'POST',
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

        // Form submission field check.  Makes sure there are no error prior to submission

        async #formSubmitCheck(e) {

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

            // Loop through input nodes
            
            fieldNodes.forEach(field => {

                // Used for determining errors

                let requiredBlank = false;

                let fieldError = false;

                // Select field node

                const fieldNode = this.#formNode.querySelector(`[data-fieldname="${field.name}"]`);

                // Select Error text node

                let inputErrMsg = '';

                // Set error if required field blank

                if (field.value === '' && field.dataset.required === 'true') {
                    requiredBlank = true;
                    fieldError = true;
                    formError = true;
                    inputErrMsg = "Can't be empty";
                }

                // Check that field inputs are valid

                if (!requiredBlank) {

                    switch(field.dataset.type) {
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

                if (this.#formType === 'create') {
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
                    this.#fieldErrorSet(fieldNode, inputErrMsg);
                }
            });

            if(!formError) {
                fieldNodes.forEach(field => {
                    const fieldNode = this.#formNode.querySelector(`[data-fieldname="${field.name}"]`);
                    this.#fieldErrorRemove(fieldNode);
                });
                this.#formPostRequest(formData);
            }
        }

        // Send data to API via a POST Request

        async #formPostRequest(formData) {

            // Set submitting to true to prevent form submission during API call

            this.#submitting = true;

            // Set window to be opaque during request

            document.body.classList.add("opaque");

            // Load Spinner in submit button

            this.#formButtonNode.innerHTML = `<span>${this.#formButtonText}</span>` + this.#spinnerSVG;

            // Checks for error
            
            // Submission handle by type

            switch(this.#formType) {

                // Create user handler

                case 'create':
                    formData.password = formData.confirm_password;
                    delete formData.create_password;
                    delete formData.confirm_password;

                    const createRequest = await this.apiPostRequest(formData);

                    if (createRequest.ok) {
                        this.#directToUrl('profile');
                    } else {
                        if (createRequest.msg.includes('same email already exists')) {
                            this.#fieldErrorSet(this.#formNode.querySelector(`[data-fieldtype="email"]`), 'Email already exists');
                        } else {
                            this.#formErrSet(createRequest.msg);
                        }
                    }
                break;

                // Login user handler

                case 'login':
                    const loginRequest = await this.apiPostRequest(formData);

                    if (loginRequest.ok) {
                        this.#directToUrl('profile');
                    } else {
                        if (loginRequest.msg.includes("Invalid user email")) {
                            this.#fieldErrorSet(this.#formNode.querySelector(`[data-fieldtype="email"]`), 'Invalid email');
                        } else if (loginRequest.msg.includes("Invalid password")) {
                            this.#fieldErrorSet(this.#formNode.querySelector(`[data-fieldtype="password"]`), 'Invalid password');
                        } else {
                            this.#formErrSet(loginRequest.msg);
                        }
                    }
            }

            // Set set button text back from spinner if error found and window to full opacity and submitting to false
            
            if (this.#submissionError) {
                this.#formButtonNode.innerHTML = this.#formButtonText;
            }

            this.#submitting = false;
        }
}