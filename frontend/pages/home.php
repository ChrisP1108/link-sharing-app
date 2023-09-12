<?php

    /* 
        Homepage performs redirect only to either the login page or the edit page.  
        If user has a valid token, they will be redirected to the edit page.
        If the user does not have a valid token or no token, they will be redirected to the login page.
    */

    if (user_page_authenticate()) {
        header('Location: /edit');
    } else {
        header('Location: /login');
    }
