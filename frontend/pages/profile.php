<?php
    Component::header();
?>

<div id="app"></div>

<script>
    const userData = <?php echo get_user_data(); ?>; 
</script>
<script type="module" src="frontend/scripts/app.js"></script>

<?php
    Component::footer();
?>   
