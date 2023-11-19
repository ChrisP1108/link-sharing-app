import FormSubmission from '/frontend/scripts/form_submission/form_submission.class.js';
import LinksHandler from '/frontend/scripts/profile/links_handler.class.js';
import Profile from '/frontend/scripts/profile/profile.class.js';

export default class NodeDataHandler {

    // METHODS

    // Bind form data to nodes for submission checking/error handling

    static setFormDataNodes() {

        let output = [];

        Object.entries(FormSubmission.getFormData()).forEach(([key, value]) => {

            // Filter out any unnecessary keys

            const notApplicableKeys = ['id', 'image_url'];

            // Check for any keys in which the name doesn't match the node name, such as image upload

            const differingKeys = [
                {
                    key: 'image_upload',
                    nodeName: 'profile_picture'
                },
            ];

            if (!notApplicableKeys.includes(key)) {
                let node = null; 
                if (differingKeys.some(k => k.key === key)) {
                    const nodeName = differingKeys.find(k => k.key === key).nodeName
                    node = FormSubmission.getFormNode().querySelector(`[name="${nodeName}"]`);
                } else node = FormSubmission.getFormNode().querySelector(`[name="${key}"]`);
                let required = true;
                if (node && node.dataset.required) {
                    if (node.dataset.required === 'false') {
                        required = false;
                    }
                }
                
                // Handles links since it is an array

                if (value && value.length && key === 'links') {
                    output = [...output, FormSubmission.getFormData()[key].map(item => {
                        const node = FormSubmission.getFormNode().querySelector(`[name="link-item-${item.order}"]`);
                        return {
                            name: key,
                            value: item.link ? item.link : '',
                            node,
                            required,
                            parentNode: node.closest("[data-fieldparent]").querySelector("[data-linkitemcontainer]"),
                            linkValid: LinksHandler.linkUrlValid(item.platform),
                            type: FormSubmission.getFormNode().querySelector(`[data-platformoptionselected][data-value="${item.platform}"]`).closest("[data-fieldparent]").dataset.fieldtype
                        }
                    })];

                } else {

                // Handles individual field

                    const parentNode = node.closest("[data-fieldparent]")

                    // Set output on fields that aren't images and no existing image_url data is found

                    if (parentNode.dataset.fieldtype === 'image' && Profile.getData().image_url) {
                        required = false;
                    }

                    output = [...output, {
                        name: key,
                        value: value ? value : '',
                        node,
                        required,
                        parentNode,
                        type: parentNode.dataset.fieldtype
                    }];
                }
            }
        });

        // Set finished data 

        FormSubmission.setFormNodesData(output.flat(1));
    }
}