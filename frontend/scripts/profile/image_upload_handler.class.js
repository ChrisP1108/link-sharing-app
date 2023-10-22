import Profile from '/frontend/scripts/profile/profile.class.js';

export default class ImageUploadHandler {

    static #fileData;
    static #imageTagNode;

    // Render uploaded image to image field and mobile image preview

    static #renderUploadedImage() {

        // Remove error styling from any previous file upload error attempt

        Profile.getNodes().imageSection.main.classList.remove("image-upload-error");

        // Set placeholder text to change image

        Profile.getNodes().imageSection.placeholderText.innerText = Profile.getNodes().imageSection.placeholderText.dataset.changeimage;

        // Clear input background

        Profile.getNodes().imageSection.imageRenderNode.src = '';

        // Add overlay styling for input image viewing

        Profile.getNodes().imageSection.imageContainerNode.classList.add("show-rendered-image");

        const fileReader = new FileReader();

        fileReader.onload = () => { 

            // Render image to mobile preview

            ImageUploadHandler.#imageTagNode.src = fileReader.result;
            Profile.getNodes().mobileSection.image.classList.add("show-rendered-image");

            // Render image to background of image input

            Profile.getNodes().imageSection.imageRenderNode.src = fileReader.result;

        };

        fileReader.readAsDataURL(ImageUploadHandler.#fileData);

    }

    // Handles file when first uploaded

    static #uploadedFileHandler() {

        // Clear any previous upload error styling

        Profile.getNodes().imageSection.main.classList.remove("image-upload-error");

        // Check that file upload type is either 'jpg', 'jpeg', or 'webp'

        const acceptableFileTypes = ['jpg', 'jpeg', 'webp'];

        // Used to check if type is invalid

        let typeValid = false;

        // Performs tests on file uploaded to make sure it is of an acceptable file type and if passed, typeValid is set to true

        if (ImageUploadHandler.#fileData && ImageUploadHandler.#fileData.type && ImageUploadHandler.#fileData.type.includes("/")) {
            const uploadedFileType = ImageUploadHandler.#fileData.type.split("/")[1].toLowerCase();
            if (acceptableFileTypes.includes(uploadedFileType)) {
                typeValid = true;
            }
        }

        // Render uploaded image if tests passed and update data.  Otherwise, remove any pre-existing image and show error message styling

        if (typeValid) {
            ImageUploadHandler.#renderUploadedImage();
            Profile.setData('image_upload', ImageUploadHandler.#fileData);
        } else {

            // Set error styling and clear any existing upload

            Profile.getNodes().imageSection.main.classList.add("image-upload-error");
            Profile.getNodes().mobileSection.image.classList.remove("show-rendered-image");
            Profile.getNodes().imageSection.imageContainerNode.classList.remove("show-rendered-image");
            Profile.getNodes().imageSection.imageRenderNode.src = '';
            Profile.setData('image_upload', null);
            Profile.getNodes().imageSection.placeholderText.innerText = Profile.getNodes().imageSection.placeholderText.dataset.uploadimage;
            console.log(Profile.getData());
        }
    }

    // Monitor change of input file field

    static initImageUploadHandler() {

        // Select image tag node in mobile image container

        ImageUploadHandler.#imageTagNode = Profile.getNodes().mobileSection.image.querySelector(`[data-mobileimage]`);

        // Monitor upload and run uploadFileHandler

        Profile.getNodes().imageSection.imageNode.addEventListener("change", () => {
            ImageUploadHandler.#fileData = Profile.getNodes().imageSection.imageNode.files[0];
            ImageUploadHandler.#uploadedFileHandler();
        });
    }

}