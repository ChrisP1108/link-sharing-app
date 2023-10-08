import Profile from '/frontend/scripts/profile/profile.class.js';

export default class LetsGetYouStartedHandler {
    
    // METHODS

    // Toggle "Let's get you started" section

    static toggleLetsGetYouStarted(active = false) {
        if (active) {
            Profile.getNodes().letsGetYouStarted.classList.remove("hidden");
            Profile.getNodes().linkFieldsSection.classList.add("hidden");
        } else {
            Profile.getNodes().letsGetYouStarted.classList.add("hidden");
            Profile.getNodes().linkFieldsSection.classList.remove("hidden");
        }
    }
}