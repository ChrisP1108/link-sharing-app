class FormHandler {

    // CLASS PROPERTIES

        #formNode;
        #formType;
        #submitting = false;

    // CONSTRUCTOR

        constructor(formNode = null, formType = null) {

            if (!formNode || !formType) {
                throw new Error("Form node and form type must be passed in on FormHandler class instantiation.")
            }

            this.#formNode = document.querySelector(formNode);
            this.#formType = formType;

            this.#formNode.addEventListener("submit", e => {
                e.preventDefault();
                if (!this.#submitting) {
                    this.#formSubmission(e);
                }
            });
        }

    // METHODS

        // Form error message handler

        #formErrSet(errMsg) {
            const formErrMsg = this.#formNode.querySelector("[data-formerrmsg]");
            formErrMsg.removeAttribute("hidden");
            formErrMsg.innerText = errMsg;

            const formFields = this.#formNode.querySelectorAll(`[data-fieldtype]`);

            formFields.forEach(field => {
                field.addEventListener('click', () => {
                    formErrMsg.setAttribute("hidden", "");
                    formErrMsg.innerText = '';
                });
            });
        }

        // Field error handler

        #fieldErrorSet(fieldNode = null, errMsg = null) {

            // Select error text p tag

            const inputErrMsg = fieldNode.querySelector('[data-errormsg]');

            // Add field red border and show error text

            fieldNode.classList.add("field-error");

            inputErrMsg.innerText = errMsg ? errMsg : inputErrMsg.innerText;

            inputErrMsg.removeAttribute("hidden");

            // Monitor click to remove red border and error text

            // Check if multiple password fields, like on create page and remove all error styling and error text, otherwise remove single field

            const multiplePasswordFields = this.#formNode.querySelectorAll(`[data-fieldtype="password"]`);

            fieldNode.addEventListener("click", () => {

                // Apply if multiple password fields and field is type password, such as create page

                if (multiplePasswordFields.length > 1 && fieldNode.dataset.fieldtype === 'password') {
                    multiplePasswordFields.forEach(pField => {
                        pField.classList.remove("field-error");
                        const errMsg = pField.querySelector("[data-errormsg]");
                        errMsg.setAttribute("hidden", "");
                        errMsg.innerText = '';
                    });

                } else {
                
                    // Apply error styling to just one fields if no multiple password fields found
                
                    fieldNode.classList.remove("field-error");
                    inputErrMsg.setAttribute("hidden", "");
                    inputErrMsg.innerText = '';
                }
            });
        }

        // Direct to url

        #directToUrl(url) {
            window.location.href = window.location.origin + url;
        }

        // API Request Handler

        async #APIReq(type = 'POST', data = {}, route = null) {
            try {
                const res = await fetch(route, {
                    method: type,
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const resData = await res.json();

                if (res.ok) {
                    return { ok: true, status: res.status, msg: resData.msg, data: resData.data ?? null};
                } else {
                    return { ok: false, status: res.status, msg: resData.msg }
                }
            } catch (err) {
                console.error(err);
                return { ok: false, status: 0, msg: err }
            }
        }

        // Form submission handler

        async #formSubmission(e) {

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

                const inputErrMsg = fieldNode.querySelector('[data-errormsg]');

                // Set error if required field blank

                if (field.value === '' && field.dataset.required === 'true') {
                    requiredBlank = true;
                    fieldError = true;
                    formError = true;
                    inputErrMsg.innerText = "Can't be empty"
                }

                // Check that field inputs are valid

                if (!requiredBlank) {

                    switch(field.dataset.type) {
                        case 'email':
                            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                            if (!emailRegex.test(field.value)) {
                                fieldError = true;
                                formError = true;
                                inputErrMsg.innerText = "Invalid email"
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
                        inputErrMsg.innerText = "8 characters minimum";
                        formError = true;
                    }
                    if (passwords[0] !== passwords[1]) {
                        if (field.type === 'password') {
                            fieldError = true;
                            inputErrMsg.innerText = "Passwords do not match";
                            formError = true;
                        } 
                    }
                }

                // Handle error on fields if error found.  Applies red border and red text, and removes when user clicks afterward

                if (fieldError) {            
                    this.#fieldErrorSet(fieldNode);
                }
            });

            // Submit form if no errors found

            if (!formError) {

                // Set submitting to true to prevent form submission during API call

                this.#submitting = true;

                // Select button node and get it's text

                const button = this.#formNode.querySelector("button");

                const buttonText = button.innerText;

                // Load Spinner in submit button

                const spinnerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12" style="fill: #fff; position: absolute; inset: 0; margin: auto;" height="1.75em" width="3.6em"><circle cx="4" cy="12" r="0"><animate begin="0;h.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate begin="b.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="d.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="g" begin="f.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="h" begin="g.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate></circle><circle cx="4" cy="12" r="3"><animate begin="0;h.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="b.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="e" begin="d.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="f" begin="e.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="f.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate></circle><circle cx="12" cy="12" r="3"><animate begin="0;h.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="c" begin="b.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="d" begin="c.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="d.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate begin="f.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate></circle><circle cx="20" cy="12" r="3"><animate id="a" begin="0;h.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="b" begin="a.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="b.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate id="e" begin="d.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="f.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate></circle></svg>`;

                button.innerHTML = `<span>${buttonText}</span>` + spinnerHTML;

                // Submission handle by type

                switch(this.#formType) {

                    // Create user handler

                    case 'create':
                        formData.password = formData.confirm_password;
                        delete formData.create_password;
                        delete formData.confirm_password;

                        const createRequest = await this.#APIReq("POST", formData, '/api/user');

                        if (createRequest.ok) {
                            this.#directToUrl('/profile');
                        } else {
                            button.innerHTML = buttonText;
                            if (createRequest.msg.includes('same email already exists')) {
                                this.#fieldErrorSet(this.#formNode.querySelector(`[data-fieldtype="email"]`), 'Email already exists');
                                this.#formErrSet(createRequest.msg);
                            } else {
                                this.#formErrSet(createRequest.msg);
                            }
                        }
                    break;

                    // Login user handler

                    case 'login':
                        const loginRequest = await this.#APIReq("POST", formData, 'api/user/login');

                        if (loginRequest.ok) {
                            this.#directToUrl('/profile');
                        } else {
                            button.innerHTML = buttonText;
                            this.#formErrSet(loginRequest.msg);
                        }
                }

                // Set submitting to false

                this.#submitting = false
            }
        }
}