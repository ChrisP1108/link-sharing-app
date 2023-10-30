import SubmissionCheckHandler from '/frontend/scripts/form_submission/submission_check_handler.class.js';
import LinksHandler from '/frontend/scripts/profile/links_handler.class.js';

export default class FormSubmission {

    // CLASS PROPERTIES

        static formNode;
        static formData = {};
        static formDataNodes = {};
        static formButtonNode;
        static formButtonText;
        static formType;
        static submitting = false;
        static submissionError = false;
        static apiRoute;
        static spinnerSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12"><circle cx="4" cy="12" r="0"><animate begin="0;h.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate begin="b.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="d.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="g" begin="f.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="h" begin="g.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate></circle><circle cx="4" cy="12" r="3"><animate begin="0;h.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="b.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="e" begin="d.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="f" begin="e.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="f.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate></circle><circle cx="12" cy="12" r="3"><animate begin="0;h.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate><animate id="c" begin="b.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="d" begin="c.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="d.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate begin="f.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate></circle><circle cx="20" cy="12" r="3"><animate id="a" begin="0;h.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="3;0" fill="freeze"></animate><animate id="b" begin="a.end" attributeName="cx" dur="0.001s" values="20;4" fill="freeze"></animate><animate begin="b.end" attributeName="r" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="0;3" fill="freeze"></animate><animate id="e" begin="d.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="4;12" fill="freeze"></animate><animate begin="f.end" attributeName="cx" calcMode="spline" dur="0.5s" keySplines=".36,.6,.31,1" values="12;20" fill="freeze"></animate></circle></svg>`;

    // METHOD

        // Bind form data to nodes for submission checking/error handling

        static setFormDataNodes() {
            Object.entries(FormSubmission.formData).forEach(([key, value]) => {
                const node = FormSubmission.formNode.querySelector(`[name="${key}"]`);
                let required = true;
                if (node && node.dataset.required) {
                    if (node.dataset.required === 'false') {
                        required = false;
                    }
                }
                
                // Handles links since it is an array

                if (value && value.length && key === 'links') {
                    FormSubmission.formDataNodes[key] = FormSubmission.formData[key].map(item => {
                        return {
                            value: {
                                platform: item.platform,
                                link: item.link,
                                order: item.order
                            },
                            node: {
                                platform: FormSubmission.formNode.querySelector(`[data-platformoptionselected][data-value="${item.platform}"]`),
                                link: FormSubmission.formNode.querySelector(`[name="link-item-${item.order}"]`),
                            },
                            required,
                            linkValid: LinksHandler.linkUrlValid(item.platform)
                        }
                    });

                } else {

                // Handles individual fields

                    FormSubmission.formDataNodes[key] = {
                        value,
                        node,
                        required
                    }
                }
            });

            console.log(FormSubmission.formDataNodes);
        }

    // CONSTRUCTOR

        constructor(formNode = null, formType = null, apiRoute = null, spinnerSVG = null) {

            if (!formNode || !formType || !apiRoute) {
                throw new Error("Form node, form type, and API route must be passed in on FormSubmission class instantiation.")
            }

            FormSubmission.formNode = document.querySelector(formNode);
            FormSubmission.formButtonNode = FormSubmission.formNode.querySelector("button");
            FormSubmission.formButtonText = FormSubmission.formButtonNode.innerText;
            FormSubmission.formType = formType;
            FormSubmission.apiRoute = apiRoute;

            // Set loading spinner if custom SVG HTML passed in.

            if (spinnerSVG) {
                FormSubmission.spinnerSVG = spinnerSVG;
            }

            // Set event listener on form submit.  Prevent default submission, update data and form node binding and run #formSubmitCheck method if not currently in submitting process

            FormSubmission.formNode.addEventListener("submit", e => {
                e.preventDefault();
                FormSubmission.formData = FormSubmission.formNode.value;
                FormSubmission.setFormDataNodes();
                if (!FormSubmission.submitting) {
                    SubmissionCheckHandler.formSubmitCheck(e);
                }
            });
        }

    // METHODS

        // Direct to url

        static directToUrl(url) {

            // Perform redirect

            window.location.href = window.location.origin + '/' + url;
        }
}