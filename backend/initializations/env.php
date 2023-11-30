<?php

// Set Environment Variables in $_ENV superglobal from the .env file

ENV::load(get_full_path() . '/.env');