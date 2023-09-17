
<main class="create-login">
    <?php 

        // Load Logo

        Component::logo();

        // Heading

        if ($props) {
            echo "
                <h3>Create</h3>
                <h5>Let's get you started sharing your links!</h5>
            ";
        } else {
            echo "
                <h3>Login</h3>
                <h5>Add your details below to get back into the app</h5>
            ";
        }
    ?>

    <form>
        <?php 

            // Email Field

            Component::form_field([
                'name' => 'email',
                'label' => 'Email address',
                'type' => 'email',
                'icon' => 'email',
                'placeholder' => 'e.g. alex@email.com'
            ]);

            // Password Fields On Create Page

            if ($props) {
                Component::form_field([
                    'name' => 'create_password',
                    'label' => 'Create password',
                    'type' => 'password',
                    'icon' => 'password',
                    'placeholder' => 'At least 8 characters'
                ]);
                Component::form_field([
                    'name' => 'confirm_password',
                    'label' => 'Confirm password',
                    'type' => 'password',
                    'icon' => 'password',
                    'placeholder' => 'At least 8 characters'
                ]);
            } else {

            // Password Field On Login Page

                Component::form_field([
                    'name' => 'password',
                    'label' => 'Password',
                    'type' => 'password',
                    'icon' => 'password',
                    'placeholder' => 'Enter your password'
                ]);
            }
        ?>

        <button type="submit"><?php echo $props ? 'Create new account' : 'Login'?></button>
    </form>
</main>
