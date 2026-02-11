<?php
/*
Plugin Name: Force Iframe Fix
Description: Removes X-Frame-Options to allow iframe embedding.
*/

add_action('send_headers', function() {
    // 1. Remove the blocking header
    header_remove("X-Frame-Options");
    
    // 2. Add the allowing header
    header("Content-Security-Policy: frame-ancestors *");
});
?>