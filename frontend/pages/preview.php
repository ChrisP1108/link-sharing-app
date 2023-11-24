<?php

    // User data
    
    $user_data = json_decode(get_user_data());

    Component::header();
?>
    <div class="preview-page-container">
        <header class="box-section">
            <a href="/profile" class="button-styling">Back to Editor</a>
            <a href="/preview" class="button-styling purple-button-styling">Share Link</a>
        </header>
        <div class="color-filler"></div>
        <?php
            Component::mobile_content([
                'type' => 'preview',
                'data' => $user_data
            ]);
        ?>
    </div>

<?php
    Component::footer();
?>   
