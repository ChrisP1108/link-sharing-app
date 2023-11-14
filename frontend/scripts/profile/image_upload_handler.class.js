import Profile from '/frontend/scripts/profile/profile.class.js';
import MobilePreviewHandler from '/frontend/scripts/profile/mobile_preview_handler.class.js';

export default class ImageUploadHandler {

    static #fileData;

    // Handles file when first uploaded

    static #uploadedFileHandler() {

        // Clear any previous upload error styling

        Profile.getNodes().imageSection.main.classList.remove("image-upload-error");

        // Get data about file

        let fileData = { size: ImageUploadHandler.#fileData.size, type: ImageUploadHandler.#fileData.type.split("/")[1].toLowerCase() }

        // Used to check that file upload type is either 'jpg', 'jpeg', 'png',or 'webp'

        const acceptableFileTypes = ['jpg', 'jpeg', 'webp', 'png'];

        // Used to check for errors

        let fileError = false;

        // Check that file format type is valid

        if (!acceptableFileTypes.includes(fileData.type.toLowerCase())) {

            // Set error styling and clear any existing upload for image upload error

            MobilePreviewHandler.setImageUploadError("Invalid file format");

            fileError = true;
        }
        
        const fileReader = new FileReader();

        fileReader.onload = e => {
            const img = new Image();

            img.onload = () => {
                fileData = {...fileData, data: fileReader.result, width: img.width, height: img.height }

                // Check that file resolution doesn't exceed 1024px on height or width

                if (fileData.width > 1024 || fileData.height > 1024) {

                    MobilePreviewHandler.setImageUploadError("Cannot be larger than 1024px");

                    fileError = true;
                }

                // Render uploaded image if tests passed.  Otherwise, remove any pre-existing image and show error message styling
                
                if (!fileError) {
                    Profile.setData('image_upload', fileData);
                }
            }

            img.src = e.target.result;
        }

        fileReader.readAsDataURL(Profile.getNodes().imageSection.imageNode.files[0]);

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