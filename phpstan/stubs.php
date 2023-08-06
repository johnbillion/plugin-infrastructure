<?php

// WP core constants:

define( 'DB_HOST', '' );
define( 'DB_NAME', '' );
define( 'DB_PASSWORD', '' );
define( 'DB_USER', '' );

define( 'SAVEQUERIES', false );
define( 'WP_CONTENT_DIR', '' );
define( 'WP_MEMORY_LIMIT', '' );
define( 'WP_PLUGIN_DIR', '' );
define( 'WPINC', '' );

define( 'AUTH_COOKIE', '' );
define( 'COOKIE_DOMAIN', '' );
define( 'COOKIEHASH', '' );
define( 'COOKIEPATH', '' );
define( 'LOGGED_IN_COOKIE', '' );
define( 'SECURE_AUTH_COOKIE', '' );
define( 'SITECOOKIEPATH', '' );

// WPBrowser compatibility:

class_alias(
	'\\Codeception\\Test\\Unit',
	'\\tad\\WPBrowser\\Compat\\Codeception\\Unit'
);
