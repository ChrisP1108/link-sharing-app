import Profile from '/frontend/scripts/profile/profile.class.js';
import MobilePreviewHandler from '/frontend/scripts/profile/mobile_preview_handler.class.js';

export default class ImageUploadHandler {

    static #fileData;

    // Handles file when first uploaded

    static #uploadedFileHandler() {

        // Clear any previous upload error styling

        Profile.getNodes().imageSection.main.classList.remove("image-upload-error");

        // Check that file upload type is either 'jpg', 'jpeg', or 'webp'

        const acceptableFileTypes = ['jpg', 'jpeg', 'webp'];

        // Used to check if type is invalid

        let typeValid = false;

        // Used to parse image format type

        let uploadedFileType = null;

        // Performs tests on file uploaded to make sure it is of an acceptable file type and if passed, typeValid is set to true

        if (ImageUploadHandler.#fileData && ImageUploadHandler.#fileData.type && ImageUploadHandler.#fileData.type.includes("/")) {
            uploadedFileType = ImageUploadHandler.#fileData.type.split("/")[1].toLowerCase();
            if (acceptableFileTypes.includes(uploadedFileType)) {
                typeValid = true;
            }
        }

        // Render uploaded image if tests passed and update data.  Otherwise, remove any pre-existing image and show error message styling

        if (typeValid) {
            Profile.setData('image_upload', { size: ImageUploadHandler.#fileData.size, type: uploadedFileType }, false);

            const fileReader = new FileReader();

            fileReader.onload = e => {
                const img = new Image();

                img.onload = () => {
                    Profile.setData('image_upload', {...Profile.getData().image_upload, data: fileReader.result, width: img.width, height: img.height });
                }

                img.src = e.target.result;
            }

            fileReader.readAsDataURL(Profile.getNodes().imageSection.imageNode.files[0]);

        } else {

            // Set error styling and clear any existing upload for image upload error

            MobilePreviewHandler.setImageUploadError();
        }
    }

    // Monitor change of input file field

    static initImageUploadHandler() {

        // Monitor upload and run uploadFileHandler

        Profile.getNodes().imageSection.imageNode.addEventListener("change", () => {
            ImageUploadHandler.#fileData = Profile.getNodes().imageSection.imageNode.files[0];
            ImageUploadHandler.#uploadedFileHandler();
        });
    }

}