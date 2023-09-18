// API Request Handler

async function APIReq(type = 'POST', data = {}, route = null) {
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

async function formSubmission(e) {

    // Prevent form default submission

    e.preventDefault();

    // Gather form data and input nodes

    const formData = new FormData(e.target);

    const fieldNodes = [];
    
    for(let i = 0; e.target.length - 1 > i; i++) {
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

        const fieldNode = document.querySelector(`[data-fieldname="${field.name}"]`);

        // Select Error text node

        const inputErrMsg = fieldNode.querySelector('p');

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

        if (e.target.dataset.type === 'create') {
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
            fieldNode.classList.add("field-error");
            inputErrMsg.removeAttribute("hidden");
            fieldNode.addEventListener("click", () => {
                if (field.type === 'password' && e.target.dataset.type === 'create') {
                    document.querySelectorAll(`[data-fieldtype="password"]`).forEach(pField => {
                        pField.classList.remove("field-error");
                        const errMsg = pField.querySelector("p");
                        errMsg.setAttribute("hidden", "");
                        errMsg.innerText = '';
                    });
                } else {
                    fieldNode.classList.remove("field-error");
                    inputErrMsg.setAttribute("hidden", "");
                    inputErrMsg.innerText = '';
                }
            });
        }
    });

    // Submit form if no errors found

    if (!formError) {

        // Create user handler

        if (e.target.dataset.type === 'create') {
            formData.password = formData.confirm_password;
            delete formData.create_password;
            delete formData.confirm_password;

            const apiRequest = await APIReq("POST", formData, '/api/user');

            if (apiRequest.ok) {
                window.location.href = window.location.origin + '/profile';
            }
        }
    }
}


// Run on form submit

const form = document.querySelector("form");

form.addEventListener("submit", formSubmission);
