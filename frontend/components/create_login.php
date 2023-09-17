<main class="create-login">
    <?php 

        // Load Logo

        Component::logo();

    ?>

    <section class="box-section">

    <?php

        // Heading

        if ($props['page'] === 'create') {
            echo "
                <h3>Create account</h3>
                <h5>Let's get you started sharing your links!</h5>
            ";
        } else {
            echo "
                <h3>Login</h3>
                <h5>Add your details below to get back into the app</h5>
            ";
        }
    ?>

        <form data-type="<?php echo $props['page']; ?>">
            <?php 

                // Email Field

                Component::form_field([
                    'name' => 'email',
                    'label' => 'Email address',
                    'type' => 'email',
                    'icon' => 'email',
                    'placeholder' => 'e.g. alex@email.com',
                    'required' => true
                ]);

                // Password Fields On Create Page

                if ($props['page'] === 'create') {
                    Component::form_field([
                        'name' => 'create_password',
                        'label' => 'Create password',
                        'type' => 'password',
                        'icon' => 'password',
                        'placeholder' => 'At least 8 characters',
                        'required' => true,
                        'errMsg' => 'Please check again'
                    ]);
                    Component::form_field([
                        'name' => 'confirm_password',
                        'label' => 'Confirm password',
                        'type' => 'password',
                        'icon' => 'password',
                        'placeholder' => 'At least 8 characters',
                        'required' => false
                    ]);

                    // Password creation note on create page

                    echo '<p class="note">Password must contain at least 8 characters</p>';

                } else {

                // Password Field On Login Page

                    Component::form_field([
                        'name' => 'password',
                        'label' => 'Password',
                        'type' => 'password',
                        'icon' => 'password',
                        'placeholder' => 'Enter your password',
                        'required' => true
                    ]);
                }
            ?>

            <button type="submit"><?php echo $props['page'] === 'create' ? 'Create new account' : 'Login'?></button>
        </form>
        <h5 class="page-switch"><?php echo $props['page'] === 'create' ? "Already have an account?" : "Don't have an account?"; ?></h5>
        <a href="<?php echo $props['page'] === 'create' ? '/login' : '/create'; ?>" class="page-switch"><?php echo $props['page'] === 'create' ? "Login" : "Create account"; ?></h5>
        <script src="/frontend/scripts/form_submission.js"></script>
    </section>
</main>
