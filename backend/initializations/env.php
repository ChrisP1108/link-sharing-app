<?php

// Set Environment Variables in $_ENV superglobal from the .env file

ENV::load(dirname(dirname(__DIR__)) . '\.env');