<?php
/*
Plugin Name: SaaS Super Business Agent
Description: AI Agent to handle Design, Payments, Shipping, Legal & Content.
Version: 3.0
Author: Chetan
*/

define('SAAS_API_SECRET', 'my-super-secret-key-123');

add_action('rest_api_init', function () {
    register_rest_route('saas/v1', '/execute', [
        'methods' => 'POST',
        'callback' => 'saas_handle_ai_command',
        'permission_callback' => '__return_true',
    ]);
});

function saas_handle_ai_command($request) {
    // 🔒 1. Security Check
    $auth = $request->get_header('X-SaaS-Secret');
    if ($auth !== SAAS_API_SECRET) {
        return new WP_Error('forbidden', 'Invalid API Key', ['status' => 403]);
    }

    $params = $request->get_json_params();
    $actions = $params['actions'] ?? [];
    $logs = [];

    foreach ($actions as $action) {
        try {
            switch ($action['type']) {
                
                // ====================================================
                // 🎨 DESIGN & BASICS
                // ====================================================
                case 'UPDATE_CSS':
                    $css = $action['payload']['css'];
                    $file = wp_upload_dir()['basedir'] . '/saas-custom.css';
                    file_put_contents($file, $css);
                    $logs[] = "✅ Design Updated";
                    break;

                case 'UPDATE_OPTION':
                    update_option($action['payload']['option'], $action['payload']['value']);
                    $logs[] = "✅ Settings Updated";
                    break;

                // ====================================================
                // 💳 PAYMENTS (COD & Methods)
                // ====================================================
                case 'SETUP_PAYMENT':
                    if (!class_exists('WC_Payment_Gateways')) throw new Exception("WooCommerce missing");
                    
                    $method = $action['payload']['method']; // e.g., 'cod'
                    $enabled = $action['payload']['enabled'] ? 'yes' : 'no';
                    
                    // WooCommerce settings update logic
                    $settings = get_option("woocommerce_{$method}_settings", []);
                    $settings['enabled'] = $enabled;
                    
                    if(isset($action['payload']['title'])) {
                        $settings['title'] = $action['payload']['title']; // e.g., "Cash on Delivery (India)"
                    }
                    
                    update_option("woocommerce_{$method}_settings", $settings);
                    $logs[] = "✅ Payment Method '$method' is now " . ($enabled === 'yes' ? 'Enabled' : 'Disabled');
                    break;

                // ====================================================
                // 🚚 SHIPPING (Free Shipping Logic)
                // ====================================================
                case 'SETUP_SHIPPING':
                    if (!class_exists('WC_Shipping_Zones')) throw new Exception("WooCommerce missing");
                    
                    $min_amount = $action['payload']['min_amount'] ?? 0;
                    
                    // Zone 0 is "Rest of the World" (Default Zone)
                    $zone = new WC_Shipping_Zone(0); 
                    
                    // Add Free Shipping Method
                    $instance_id = $zone->add_shipping_method('free_shipping');
                    
                    // Settings update
                    $option_key = "woocommerce_free_shipping_{$instance_id}_settings";
                    $settings = array(
                        'title' => 'Free Shipping',
                        'requires' => 'min_amount',
                        'min_amount' => $min_amount
                    );
                    update_option($option_key, $settings);
                    
                    $logs[] = "✅ Shipping: Free above " . get_woocommerce_currency_symbol() . $min_amount;
                    break;

                // ====================================================
                // 📜 LEGAL PAGES (Privacy, Terms)
                // ====================================================
                case 'CREATE_LEGAL_PAGES':
                    $store_name = get_option('blogname');
                    $email = get_option('admin_email');
                    
                    $pages = [
                        'Privacy Policy' => "<h1>Privacy Policy</h1><p>Welcome to $store_name. We respect your privacy. Contact: $email</p>",
                        'Refund Policy' => "<h1>Refund Policy</h1><p>We offer 7-day returns at $store_name.</p>",
                        'About Us' => "<h1>About Us</h1><p>We are $store_name, dedicated to providing the best products.</p>"
                    ];

                    foreach($pages as $title => $content) {
                        // Check if page exists to avoid duplicates
                        if(!get_page_by_title($title)) {
                            wp_insert_post([
                                'post_title'    => $title,
                                'post_content'  => $content,
                                'post_status'   => 'publish',
                                'post_type'     => 'page'
                            ]);
                            $logs[] = "✅ Page Created: $title";
                        }
                    }
                    break;

                // ====================================================
                // 📍 NAVIGATION MENU
                // ====================================================
                case 'SETUP_MENU':
                    $menu_name = 'Primary Menu';
                    $menu_exists = wp_get_nav_menu_object($menu_name);
                    
                    if(!$menu_exists) {
                        $menu_id = wp_create_nav_menu($menu_name);
                        
                        // Add Home, Shop, About
                        wp_update_nav_menu_item($menu_id, 0, ['menu-item-title' => 'Home', 'menu-item-url' => home_url(), 'menu-item-status' => 'publish']);
                        
                        $shop_page = get_option('woocommerce_shop_page_id');
                        if($shop_page) {
                            wp_update_nav_menu_item($menu_id, 0, ['menu-item-title' => 'Shop', 'menu-item-object-id' => $shop_page, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-status' => 'publish']);
                        }
                        
                        // Set location
                        $locations = get_theme_mod('nav_menu_locations');
                        $locations['primary'] = $menu_id; // Theme dependent key
                        set_theme_mod('nav_menu_locations', $locations);
                        
                        $logs[] = "✅ Navigation Menu Created & Assigned";
                    }
                    break;

                // ====================================================
                // 📦 INVENTORY (Products & Coupons) - Purana Code
                // ====================================================
                case 'CREATE_COUPON':
                    if (!class_exists('WC_Coupon')) throw new Exception("WooCommerce missing");
                    $code = strtoupper($action['payload']['code']);
                    $amount = $action['payload']['amount'];
                    
                    $coupon = new WC_Coupon($code); // Loads if exists, new if not
                    $coupon->set_amount($amount);
                    $coupon->set_discount_type('percent');
                    $coupon->save();
                    $logs[] = "✅ Coupon: $code";
                    break;

                case 'ADD_PRODUCT':
                    if (!class_exists('WC_Product')) throw new Exception("WooCommerce missing");
                    $product = new WC_Product_Simple();
                    $product->set_name($action['payload']['name']);
                    $product->set_regular_price($action['payload']['price']);
                    $product->set_status('publish');
                    $product->save();
                    $logs[] = "✅ Product Added: " . $action['payload']['name'];
                    break;

                default:
                    $logs[] = "⚠️ Unknown Action: " . $action['type'];
            }
        } catch (Exception $e) {
            $logs[] = "❌ Error in " . $action['type'] . ": " . $e->getMessage();
        }
    }

    return rest_ensure_response(['success' => true, 'logs' => $logs]);
}


add_action('wp_enqueue_scripts', function() {
    $file = wp_upload_dir()['basedir'] . '/saas-custom.css';
    if (file_exists($file)) {
        wp_enqueue_style('saas-ai-style', wp_upload_dir()['baseurl'] . '/saas-custom.css', [], time());
    }
});
?>