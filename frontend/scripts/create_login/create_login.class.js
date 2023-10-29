export default class CreateLogin {

    // CLASS PROPERTIES

        static formNode;
        static formInputNodes;
        static formData = {};

    // METHODS

    // Sets data on user input

    static #setCreateLoginData(key, value) {
        CreateLogin.formData[key] = value;
        CreateLogin.formNode.value = CreateLogin.formData;
    }

    // CONSTRUCTOR

    constructor(formNode) {

        CreateLogin.formNode = document.querySelector(formNode);
        CreateLogin.formInputNodes = CreateLogin.formNode.querySelectorAll("input");

        // Set initial keys for data and Monitor change of input nodes and update formData accordingly
        
        CreateLogin.formInputNodes.forEach(input => {

            // Set initial keys on load

            CreateLogin.#setCreateLoginData(input.name, input.value ? input.value : null);

            // Update data on user input

            input.addEventListener("input", () => {
                CreateLogin.#setCreateLoginData(input.name, input.value ? input.value : null);
            });
        });
    }
}