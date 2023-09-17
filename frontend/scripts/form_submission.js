// Form submission handler

function form_submission() {
    const form = document.querySelector("form");
    form.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const fieldNodes = [];
        
        for(let i = 0; e.target.length - 1 > i; i++) {
            const item = e.target[i];
            formData[item.name] = item.value;
            fieldNodes.push(item);
        }        
        
        fieldNodes.forEach(field => {

            let fieldError = false;

            let requiredBlank = false;

            if (!field.value && field.dataset.required === 'true') {
                requiredBlank = true;
                fieldError = true;
            }

            if (!requiredBlank) {

                switch(field.dataset.type) {
                    case 'email':
                        console.log(field.value);
                        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                        if (emailRegex.test(field.value)) {
                            console.log("field invalid");
                        }
                }
            }

            if (fieldError) {
                const fieldNode = document.querySelector(`[data-fieldname="${field.name}"]`);
                const inputErr = fieldNode.querySelector('p');
                fieldNode.classList.add("field-error");
                const errNode = document.createElement("p");
                inputErr.removeAttribute("hidden")
                fieldNode.addEventListener("click", () => {
                    fieldNode.classList.remove("field-error");
                    inputErr.setAttribute("hidden", "")
                });
            }
        });
    });
}

// Run on page load

form_submission();