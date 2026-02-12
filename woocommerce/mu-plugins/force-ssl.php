
<?php
/*
Plugin Name: Force HTTPS & Fix Mixed Content
Description: Forces WordPress to recognize HTTPS behind Nginx Proxy.
Version: 1.0
Author: Chetan
*/


$_SERVER['HTTPS'] = 'on';
$_SERVER['SERVER_PORT'] = 443;
