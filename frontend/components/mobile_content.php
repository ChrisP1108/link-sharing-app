<?php
    $profile = $props['type'] === 'profile';
    $preview = $props['type'] === 'preview';
?>

<div class="mobile-content-container">
    <div class="image-container" data-mobilesection="image">
        <img data-mobileimage>
    </div>
    <h6 class="name-text <?php if ($preview) echo "show-text"; ?>" data-mobilesection="name"></h6>
    <p class="email-text <?php if ($preview) echo "show-text"; ?>" data-mobilesection="email"></p>
    <section class="mobile-links-container" data-mobilesection="links">
        <?php if ($profile): ?>

            <div class="mobile-link-container" data-mobilelinkitem data-order="1"></div>
            <div class="mobile-link-container" data-mobilelinkitem data-order="2"></div>
            <div class="mobile-link-container" data-mobilelinkitem data-order="3"></div>
            <div class="mobile-link-container" data-mobilelinkitem data-order="4"></div>
            <div class="mobile-link-container" data-mobilelinkitem data-order="5"></div>

        <?php else: ?>

        <?php endif; ?>
    </section>
</div>