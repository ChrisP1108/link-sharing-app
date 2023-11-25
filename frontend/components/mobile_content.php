<?php
    $profile = $props['type'] === 'profile';
    $preview = $props['type'] === 'preview';
    $user = $props['type'] === 'user';
    $data = $props['data'] ?? null;

    $parent_classes_add = null;

    if ($profile) { 
        $parent_classes_add = 'profile'; 
    } else if ($preview) { 
        $parent_classes_add = 'preview box-section box-shadow'; 
    } else if ($user) { 
        $parent_classes_add =  'user'; 
    }
?>

<div class="mobile-content-container <?php echo $parent_classes_add; ?>">
    <div class="image-container <?php if (!$profile) echo 'show-rendered-image'; ?>" data-mobilesection="image">
        <img data-mobileimage <?php if($preview || $user) echo 'src="' . get_url_origin() . $data->image_url . '"'; ?>>
    </div>
    <?php if ($profile): ?>
        <h6 class="name-text <?php if ($preview || $user) echo "show-text"; ?>" data-mobilesection="name"></h6>
    <?php else: ?>
        <h3><?php echo $data->first_name; ?> <?php echo $data->last_name; ?></h3>
    <?php endif; ?>
    <p class="email-text <?php if ($preview || $user) echo "show-text"; ?>" data-mobilesection="email"><?php if ($preview || $user) echo $data->display_email;?></p>
    <section class="mobile-links-container" data-mobilesection="links">
        <?php if ($profile): ?>
            <div class="mobile-link-container" data-mobilelinkitem data-order="1"></div>
            <div class="mobile-link-container" data-mobilelinkitem data-order="2"></div>
            <div class="mobile-link-container" data-mobilelinkitem data-order="3"></div>
            <div class="mobile-link-container" data-mobilelinkitem data-order="4"></div>
            <div class="mobile-link-container" data-mobilelinkitem data-order="5"></div>
        <?php else: ?>
            <?php foreach(json_decode($data->links, true) as $item): ?> 
                <?php
                    $platform_data = null;
                    foreach(LINK_OPTIONS as $option) {
                        if (strtolower($item['platform']) === strtolower($option['name'])) {
                            $platform_data = $option;
                        }
                    }
                ?>
                <div class="mobile-link-container" data-mobilelinkitem data-order="<?php echo $item['order']; ?>" style="background: <?php echo $platform_data['color']; ?>;">
                    <a class="mobile-click-link" href="<?php echo $item['link']; ?>" target="_blank" rel="nofollow">
                        <?php 
                            if ($platform_data['icon']) {
                                echo $platform_data['icon'];
                            }
                        ?>
                        <span class="mobile-link-text"><?php echo ucfirst($item['platform']); ?></span>
                        <svg class="link-arrow" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.666626 5.3333V6.66664H8.66663L4.99996 10.3333L5.94663 11.28L11.2266 5.99997L5.94663 0.719971L4.99996 1.66664L8.66663 5.3333H0.666626Z" />
                        </svg>
                    </a>
                </div>
            <?php endforeach ?>
        <?php endif; ?>
    </section>
</div>