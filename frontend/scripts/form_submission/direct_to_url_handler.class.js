export default class DirectToUrlHandler {

    // METHODS

    // Direct to url

    static directToUrl(url) {

        // Perform redirect

        window.location.href = window.location.origin + '/' + url;
    }
}