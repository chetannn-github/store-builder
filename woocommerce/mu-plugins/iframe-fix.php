<?php
/*
Plugin Name: Force Iframe Fix
Description: Removes X-Frame-Options to allow iframe embedding.
*/

add_action('send_headers', function() {
    header_remove("X-Frame-Options");
    header("Content-Security-Policy: frame-ancestors *");
});
?>