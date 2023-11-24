<?php
    Component::header();
?>
    <div class="preview-page-container">
        <header class="box-section">
            <a href="/profile" class="button-styling">Back to Editor</a>
            <a href="/preview" class="button-styling">Preview</a>
        </header>
        <div class="color-filler"></div>
        <?php
            Component::mobile_content([
                'type' => 'preview',
            ]);
        ?>
    </div>

<?php
    Component::footer();
?>   
