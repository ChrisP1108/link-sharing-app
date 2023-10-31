import SubmissionCheckHandler from '/frontend/scripts/form_submission/submission_check_handler.class.js';
import NodeDataHandler from '/frontend/scripts/form_submission/node_data_handler.class.js';

export default class FormSubmission {

    // CLASS PROPERTIES

        static #formNode;
        static #formData = {};
        static #formNodesData;
        static #formButtonNode;
        static #formButtonText;
        static #formType;
        static #submitting = false;
        static #submissionError = false;
        static #apiRoute;
        static #spinnerSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12"><circle cx="4" cy="12" r="0"><animate begin="0;h.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate begin="b.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="d.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="g" begin="f.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="h" begin="g.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate></circle><circle cx="4" cy="12" r="3"><animate begin="0;h.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="b.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="e" begin="d.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="f" begin="e.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="f.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate></circle><circle cx="12" cy="12" r="3"><animate begin="0;h.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="c" begin="b.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="d" begin="c.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="d.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate begin="f.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate></circle><circle cx="20" cy="12" r="3"><animate id="a" begin="0;h.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="b" begin="a.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="b.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate id="e" begin="d.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="f.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate></circle></svg>`;

    // METHODS

        // Get form node

        static getFormNode() {
            return FormSubmission.#formNode;
        }

        // Get form data

        static getFormData() {
            return FormSubmission.#formData;
        }

        // Get form nodes data

        static getFormNodesData() {
            return FormSubmission.#formNodesData;
        }

        // Set form nodes data

        static setFormNodesData(data) {
            FormSubmission.#formNodesData = data;
        }

        // Get form button node

        static getFormButtonNode() {
            return FormSubmission.#formButtonNode
        }

        // Get form button text

        static getFormButtonText() {
            return FormSubmission.#formButtonText;
        }

        // Get form type

        static getFormType() {
            return FormSubmission.#formType;
        }

        // Get submitting

        static getSubmitting() {
            return FormSubmission.#submitting
        }

        // Set submitting to true or false

        static setSubmitting(value) {
            FormSubmission.#submitting = value ? true : false;
        }

        // Get submission error

        static getSubmissionError() {
            return FormSubmission.#submissionError;
        }

        // Set submission error to true or false

        static setSubmissionError(value) {
            FormSubmission.#submissionError = value ? true : false;
        }

        // Get API Route

        static getAPIRoute() {
            return FormSubmission.#apiRoute;
        }

        // Get loading spinner

        static getLoadingSpinner() {
            return FormSubmission.#spinnerSVG;
        }

    // CONSTRUCTOR

        constructor(formNode = null, formType = null, apiRoute = null, spinnerSVG = null) {

            if (!formNode || !formType || !apiRoute) {
                throw new Error("Form node, form type, and API route must be passed in on FormSubmission class instantiation.")
            }

            FormSubmission.#formNode = document.querySelector(formNode);
            FormSubmission.#formButtonNode = FormSubmission.#formNode.querySelector("button");
            FormSubmission.#formButtonText = FormSubmission.#formButtonNode.innerText;
            FormSubmission.#formType = formType;
            FormSubmission.#apiRoute = apiRoute;

            // Set loading spinner if custom SVG HTML passed in.

            if (spinnerSVG) {
                FormSubmission.#spinnerSVG = spinnerSVG;
            }

            // Set event listener on form submit.  Prevent default submission, update data and form node binding and run #formSubmitCheck method if not currently in submitting process

            FormSubmission.#formNode.addEventListener("submit", e => {
                e.preventDefault();
                FormSubmission.#formData = FormSubmission.#formNode.value;
                NodeDataHandler.setFormDataNodes();
                if (!FormSubmission.#submitting) {
                    SubmissionCheckHandler.formSubmitCheck(e);
                }
            });
        }
}