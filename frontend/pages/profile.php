<?php
    Component::header();
?>

<header class="profile-header">
    <?php Component::logo(); ?>
</header>

<div id="app"></div>

<script>
    const userData = <?php echo get_user_data(); ?>; 
</script>
<script type="module" src="frontend/scripts/profile.app.js"></script>

<?php
    Component::footer();
?>   
