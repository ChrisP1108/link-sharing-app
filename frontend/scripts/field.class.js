class Input {
    #label;
    #type;
    #id;
    #options;

    // Select Element Node From DOM

    #node() {
        return document.querySelector(`[data-input=${this.#id}]`)
    }

    // Capitalize Text

    #capitalize(input) {
        return input[0].toUpperCase() + input.slice(1).toLowerCase();
    }

    // Render Input HTML

    html() {
        const preInputHTML =  `
            <div class="input-field input-type-${this.#type}" data-input=${this.#id}>
            <label for="${this.#id}">${this.#label}</label>
        `;

        const postInputHTML = `</div>`;

        switch(this.#type) {

            // Render Select Field

            case 'select':
                return `
                    ${preInputHTML}
                        <select name="${this.#id}" id="${this.#id}">
                            ${this.#options.map(option => 
                                `<option value="${option}">${this.#capitalize(option)}</option>`
                            ).join("")}
                        </select>
                    ${postInputHTML}
                `;

            // Render Textarea Field

            case 'textarea':
                return `
                    ${preInputHTML}
                        <textarea name="${this.#id}" id="${this.#id}"></textarea>
                    ${postInputHTML}
                `;
            
            // Render Checkbox Field

            case 'checkbox':
                return `
                    ${preInputHTML}
                        <div class="input-checkboxes">
                            ${this.#options.map((option, index) => 
                                `   <div class="input-single-checkbox" data-input="${this.#id}-${index + 1}">
                                        <input type="checkbox" name="${this.#id}-${index + 1}" id="${this.#id}-${index + 1}">
                                        <label for="${this.#id}-${index + 1}">${this.#capitalize(option)}</label>
                                    </div>
                                `
                            ).join("")}
                        </div>
                    ${postInputHTML}
                `;

            // Render Radio Field

            case 'radio':
                return `
                    ${preInputHTML}
                        <div class="input-radios">
                            ${this.#options.map((option, index) => 
                                `   <div class="input-single-radio" data-input="${this.#id}-${index + 1}">
                                        <input type="radio" name="${this.#id}" id="${this.#id}-${index + 1}">
                                        <label for="${this.#id}-${index + 1}">${this.#capitalize(option)}</label>
                                    </div>
                                `
                            ).join("")}
                        </div>
                    ${postInputHTML}
                `;

            // Render Text, Number Fields

            default: 
                return `
                    ${preInputHTML}
                        <input type=${this.#type} name="${this.#id}" id="${this.#id}">
                    ${postInputHTML}
                `;
        }
    }

    // Remove Input Node From DOM

    remove() {
        this.#node().remove();
    }

    // Set Value Of Input

    setValue(input) {
        this.#node().querySelector(`#${this.#id}`).value = input;
    }

    // Extract Value of values from radio, checkbox, or select inputs

    #multiOptionSelect(type) {
        const selectionNodes = this.#node().querySelectorAll(type);

        let value;

        if (!type.includes('checkbox')) {
            value = null;
        } else value = [];

        selectionNodes.forEach(option => {
            const input = option.querySelector("input");
            const label = option.querySelector("label");

            switch(type) {
                case '.input-single-checkbox':
                    if (input.checked) {
                        value.push(label.innerText);
                    }
                    break;
                case '.input-single-radio':
                    if (input.checked) {
                        value = label.innerText;
                    }
                    break;
                default:
                    value = option.value;
                    break;
            }
        });

        return value;
    } 

    // Get Value Of Input

    getValue() {
        switch(this.#type) {
            case 'select':
                return this.#multiOptionSelect('select');
            case 'radio':
                return this.#multiOptionSelect('.input-single-radio');
            case 'checkbox':
                return this.#multiOptionSelect('.input-single-checkbox');
            default:
                return this.#node().querySelector(`#${this.#id}`).value;
        }
    }

    // Set Label Of Input

    setLabel(input) {
        this.#node().querySelector(`label`).innerText = input;
    }

    // Get Label of Input

    getLabel() {
        return this.#label;
    }

    // Get id of input

    getId() {
        return this.#id;
    }

    // Instantiate properties

    constructor(id = null, type = null, label = null, options = []) {
        this.#id = 'input-' + id;
        this.#type = type;
        this.#label = label;
        this.#options = options;
    }
}