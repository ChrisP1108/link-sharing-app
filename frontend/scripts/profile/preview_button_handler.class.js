import Profile from '/frontend/scripts/profile/profile.class.js';

export default class PreviewButtonHandler {

    // Removes button-disabled class if user previously saved

    static initPreviewButtonHandler() {
        if (Profile.userSaved()) {
            Profile.getNodes().previewButton.classList.remove("button-disabled")
        }
    }
}