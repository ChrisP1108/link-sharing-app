<?php

    // User data

    $user_data = json_decode(get_user_data());

    $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? null;
    $id = Token::get_cookie_id($cookie);

    Component::header();
?>
    <main class="preview-page-container">
        <header class="box-section">
            <a href="/profile" class="button-styling">Back to Editor</a>
            <div data-clipboardlink="<?php echo get_url_origin() . '/user/' . $id; ?>" class="button-styling purple-button-styling">Share Link</a>
        </header>
        <div class="filler-mobile-content-container">
            <div class="color-filler"></div>
            <?php
                Component::mobile_content([
                    'type' => 'preview',
                    'data' => $user_data
                ]);
            ?>
        </div>
    </main>

    <script type="module">
        import PopupMessageHandler from '/frontend/scripts/profile/popup_message_handler.class.js';

        // Set share link url to clipboard when button is clicked and show popup message

        const shareButton = document.querySelector("[data-clipboardlink]");

        shareButton.addEventListener("click", () => {
            navigator.clipboard.writeText(shareButton.dataset.clipboardlink);
            const existingPopup = document.querySelector("[data-popupmessage]");
            if (existingPopup) existingPopup.remove();
            const newPopupMessage = new PopupMessageHandler("The link has been copied to your clipboard!", "link");
            newPopupMessage.render(document.body);
        });

    </script>

<?php
    Component::footer();
?>   
