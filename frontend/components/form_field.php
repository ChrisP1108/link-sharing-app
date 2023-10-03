<?php

    // Icon type set for non-links

    $icon_code = null;

    $icon = $props['icon'] ?? null;

    switch($icon) {
        case 'email':
            $icon_code = '<svg viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 0H1C0.867392 0 0.740215 0.0526785 0.646447 0.146447C0.552678 0.240215 0.5 0.367392 0.5 0.5V9C0.5 9.26522 0.605357 9.51957 0.792893 9.70711C0.98043 9.89464 1.23478 10 1.5 10H12.5C12.7652 10 13.0196 9.89464 13.2071 9.70711C13.3946 9.51957 13.5 9.26522 13.5 9V0.5C13.5 0.367392 13.4473 0.240215 13.3536 0.146447C13.2598 0.0526785 13.1326 0 13 0ZM12.5 9H1.5V1.63688L6.66187 6.36875C6.75412 6.45343 6.87478 6.50041 7 6.50041C7.12522 6.50041 7.24588 6.45343 7.33813 6.36875L12.5 1.63688V9Z"/>
                </svg>
                ';
            break;
        case 'password':
            $icon_code = '<svg viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5H9V3.5C9 2.70435 8.68393 1.94129 8.12132 1.37868C7.55871 0.81607 6.79565 0.5 6 0.5C5.20435 0.5 4.44129 0.81607 3.87868 1.37868C3.31607 1.94129 3 2.70435 3 3.5V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14H11C11.2652 14 11.5196 13.8946 11.7071 13.7071C11.8946 13.5196 12 13.2652 12 13V6C12 5.73478 11.8946 5.48043 11.7071 5.29289C11.5196 5.10536 11.2652 5 11 5ZM6.5 9.91438V11.5C6.5 11.6326 6.44732 11.7598 6.35355 11.8536C6.25979 11.9473 6.13261 12 6 12C5.86739 12 5.74021 11.9473 5.64645 11.8536C5.55268 11.7598 5.5 11.6326 5.5 11.5V9.91438C5.16639 9.79643 4.88522 9.56434 4.70618 9.25914C4.52715 8.95393 4.46177 8.59526 4.5216 8.24651C4.58144 7.89776 4.76264 7.58139 5.03317 7.35332C5.3037 7.12525 5.64616 7.00016 6 7.00016C6.35384 7.00016 6.6963 7.12525 6.96683 7.35332C7.23736 7.58139 7.41856 7.89776 7.4784 8.24651C7.53823 8.59526 7.47285 8.95393 7.29382 9.25914C7.11478 9.56434 6.83361 9.79643 6.5 9.91438ZM8 5H4V3.5C4 2.96957 4.21071 2.46086 4.58579 2.08579C4.96086 1.71071 5.46957 1.5 6 1.5C6.53043 1.5 7.03914 1.71071 7.41421 2.08579C7.78929 2.46086 8 2.96957 8 3.5V5Z"/>
                </svg>
                ';
            break;
        default:
            $icon_code = '';
            break;
    }

    // Single Form Field Input/Select Component HTML

    if (!function_exists('form_field')) {
        function form_field($p, $i = null) {
            $capitalize_label = ucfirst($p['label']);
            $icon = $i ? $i : "";
            $required = $p['required'] ? "true" : "false";
            $type = $p['type'] === "email" ? "text" : $p['type'];
            $name = $p['name'];
            $placeholder = $p['placeholder'] ?? '';
            $value = $p['value'] ?? '';

            $html_code = '';

            // Render input type field (Non option field)

            if ($type !== 'link') {

                $html_code = <<<HTML
                    <label for="{$name}">
                        {$capitalize_label}
                    </label>
                    <div class="input-container" data-inputcontainer>
                        {$icon}
                        <input data-required="{$required}" 
                            type="{$type}" 
                            name="{$name}" id="{$name}" 
                            placeholder="{$placeholder}"
                            value="{$value}"
                        >
                    </div>
                HTML;
            } else {

            $selected_option = '';

            $html_options = "";

            foreach(LINK_OPTIONS as $index => $option) {
                $name_lowercase = strtolower($option['name']);

                $html_options .= <<<HTML
                    <li data-value="{$name_lowercase}">{$option['icon']}<span>{$option['name']}</span></li>
                HTML;

                if ($index === 0) {
                    $selected_option = <<<HTML
                        {$option['icon']}<span>{$option['name']}</span>
                    HTML;
                }
            }
            
            // Render link option field

                $html_code = <<<HTML
                    <label for="{$name}">
                        {$capitalize_label}
                    </label>
                    <div class="input-container platform-margin-bottom" data-inputcontainer>
                        <div class="selected-link-item-container">
                            {$selected_option}
                        </div>
                        <ul class="selection-dropdown-container hidden" data-name="{$name}" data-required="{$required}" id="{$name}"> 
                            {$html_options}
                        </ul>
                    </div>
                HTML;

            }

            return $html_code;
        }
    }

?>

<div class="form-field" data-fieldparent data-fieldname="<?php echo $props['name'] ?? null; ?>" data-fieldtype="<?php echo $props['type']; ?>">
    <?php if ($props['type'] !== 'link'): ?>
        <?php echo form_field($props, $icon_code); ?>
    <?php else :?>
        <div class="link-number-remove-container">
            <div class="link-number-container">
                <svg viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="12" height="1" fill="var(--grey)"/>
                    <rect y="5" width="12" height="1" fill="var(--grey)"/>
                </svg>
                <h5 data-linkheading></h5>
            </div>
            <button data-removelinkbutton type="button" data-linknumber="">Remove</button>
        </div>
        <?php 

            // Output Platform option field for link input

            echo form_field(
                [
                    'label' => 'Platform',
                    'type' => 'link',
                    'name' => 'Platform',
                    'required' => true
                ]
            ); 
        ?>
        <?php 

            // Set link icon code for link field for link input

            $icon_code = '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.52312 11.7207C8.59304 11.7903 8.64852 11.8731 8.68637 11.9643C8.72423 12.0555 8.74371 12.1532 8.74371 12.2519C8.74371 12.3506 8.72423 12.4484 8.68637 12.5395C8.64852 12.6307 8.59304 12.7135 8.52312 12.7832L8.15187 13.1544C7.44838 13.8579 6.49425 14.2531 5.49937 14.2531C4.50449 14.2531 3.55036 13.8579 2.84687 13.1544C2.14338 12.4509 1.74817 11.4968 1.74817 10.5019C1.74817 9.50702 2.14338 8.55289 2.84687 7.8494L4.35437 6.34253C5.0303 5.66493 5.93973 5.27142 6.89639 5.2426C7.85304 5.21378 8.78451 5.55184 9.5 6.18753C9.57386 6.25319 9.63408 6.33276 9.67719 6.42169C9.72031 6.51062 9.74549 6.60717 9.7513 6.70583C9.7571 6.8045 9.74341 6.90333 9.71102 6.99671C9.67863 7.09008 9.62816 7.17616 9.5625 7.25003C9.49683 7.3239 9.41727 7.38411 9.32834 7.42723C9.2394 7.47035 9.14285 7.49552 9.04419 7.50133C8.94553 7.50713 8.84669 7.49345 8.75331 7.46105C8.65994 7.42866 8.57386 7.37819 8.5 7.31253C8.07094 6.93148 7.51252 6.72877 6.93894 6.74584C6.36537 6.76292 5.81999 6.9985 5.41437 7.4044L3.90812 8.9094C3.48609 9.33143 3.249 9.90382 3.249 10.5007C3.249 11.0975 3.48609 11.6699 3.90812 12.0919C4.33015 12.5139 4.90254 12.751 5.49937 12.751C6.0962 12.751 6.66859 12.5139 7.09062 12.0919L7.46187 11.7207C7.53153 11.6509 7.61424 11.5956 7.70529 11.5579C7.79634 11.5201 7.89393 11.5007 7.9925 11.5007C8.09106 11.5007 8.18865 11.5201 8.2797 11.5579C8.37075 11.5956 8.45346 11.6509 8.52312 11.7207ZM13.1531 2.84565C12.4491 2.14325 11.4951 1.74878 10.5006 1.74878C9.5061 1.74878 8.55218 2.14325 7.84812 2.84565L7.47687 3.2169C7.33597 3.3578 7.25682 3.54889 7.25682 3.74815C7.25682 3.94741 7.33597 4.13851 7.47687 4.2794C7.61777 4.4203 7.80886 4.49945 8.00812 4.49945C8.20738 4.49945 8.39847 4.4203 8.53937 4.2794L8.91062 3.90815C9.33265 3.48613 9.90504 3.24903 10.5019 3.24903C11.0987 3.24903 11.6711 3.48613 12.0931 3.90815C12.5151 4.33018 12.7522 4.90257 12.7522 5.4994C12.7522 6.09624 12.5151 6.66863 12.0931 7.09065L10.5862 8.59815C10.1803 9.00388 9.63459 9.23912 9.06087 9.25574C8.48715 9.27235 7.92877 9.06908 7.5 8.68753C7.42613 8.62187 7.34005 8.5714 7.24668 8.539C7.1533 8.50661 7.05446 8.49292 6.9558 8.49873C6.85714 8.50453 6.76059 8.52971 6.67165 8.57283C6.58272 8.61595 6.50316 8.67616 6.4375 8.75003C6.37183 8.8239 6.32137 8.90997 6.28897 9.00335C6.25658 9.09672 6.24289 9.19556 6.24869 9.29422C6.2545 9.39288 6.27968 9.48944 6.3228 9.57837C6.36591 9.6673 6.42613 9.74687 6.5 9.81253C7.21498 10.4481 8.14583 10.7863 9.10203 10.7581C10.0582 10.7299 10.9675 10.3373 11.6437 9.66065L13.1512 8.15378C13.8545 7.44989 14.2496 6.49571 14.25 5.50073C14.2503 4.50575 13.8558 3.55129 13.1531 2.8469V2.84565Z" />
                </svg>
            ';

            // Output Link option field for link input

            echo form_field(
            [
                'label' => 'Link',
                'type' => 'text',
                'name' => 'Link',
                'required' => true,
                'placeholder' => 'e.g. https://www.github.com/johnappleseed'
            ],
            $icon_code
        ); ?>
    <?php endif; ?>
</div>
