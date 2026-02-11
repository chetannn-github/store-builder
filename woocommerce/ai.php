<?php
/*
Plugin Name: SaaS Universal AI Agent
Description: A dynamic engine that allows AI to manipulate Pages, Options, and Code Injection.
Version: 4.0
Author: Chetan
*/

define('SAAS_API_SECRET', 'my-super-secret-key-123');

add_action('rest_api_init', function () {
    register_rest_route('saas/v1', '/execute', [
        'methods' => 'POST',
        'callback' => 'saas_universal_handler',
        'permission_callback' => '__return_true',
    ]);
});

function saas_universal_handler($request) {
    // 🔒 Security Check
    if ($request->get_header('X-SaaS-Secret') !== SAAS_API_SECRET) {
        return new WP_Error('forbidden', 'Invalid API Key', ['status' => 403]);
    }

    $params = $request->get_json_params();
    $actions = $params['actions'] ?? [];
    $logs = [];

    foreach ($actions as $action) {
        try {
            switch ($action['type']) {
                
                // ====================================================
                // 📝 1. DYNAMIC PAGE MANAGER (Create or Update ANY Page)
                // ====================================================
                case 'MANAGE_PAGE':
                    $slug = sanitize_title($action['payload']['title']); // e.g., 'about-us'
                    $title = $action['payload']['title'];
                    $content = $action['payload']['content']; // HTML allowed
                    
                    // Check if page exists
                    $existing_page = get_page_by_path($slug);
                    
                    $page_data = [
                        'post_title'    => $title,
                        'post_content'  => $content,
                        'post_status'   => 'publish',
                        'post_type'     => 'page',
                        'post_name'     => $slug
                    ];

                    if ($existing_page) {
                        $page_data['ID'] = $existing_page->ID;
                        wp_update_post($page_data);
                        $logs[] = "✅ Page Updated: $title";
                    } else {
                        wp_insert_post($page_data);
                        $logs[] = "✅ Page Created: $title";
                    }
                    break;

                // ====================================================
                // 💉 2. CODE INJECTOR (Header/Footer/CSS)
                // ====================================================
                case 'INJECT_CODE':
                    $location = $action['payload']['location']; // 'head', 'footer', 'css'
                    $code = $action['payload']['code'];
                    
                    if($location === 'css') {
                        $file = wp_upload_dir()['basedir'] . '/saas-custom.css';
                        file_put_contents($file, $code); // Overwrite CSS
                    } else {
                        // Store in DB options to retrieve later in hooks
                        update_option("saas_inject_$location", $code);
                    }
                    $logs[] = "✅ Code Injected into $location";
                    break;

                // ====================================================
                // ⚙️ 3. OPTION MANAGER (Settings, WooCommerce, Etc)
                // ====================================================
                case 'UPDATE_OPTION':
                    $option = $action['payload']['option'];
                    $value = $action['payload']['value'];
                    update_option($option, $value);
                    $logs[] = "✅ Option '$option' updated";
                    break;
                
                // ====================================================
                // 📦 4. PRODUCT MANAGER (Simplified)
                // ====================================================
                case 'ADD_PRODUCT':
                    if (!class_exists('WC_Product')) throw new Exception("WooCommerce missing");
                    $product = new WC_Product_Simple();
                    $product->set_name($action['payload']['name']);
                    $product->set_regular_price($action['payload']['price']);
                    $product->set_description($action['payload']['description'] ?? '');
                    if(isset($action['payload']['image_url'])) {
                        // Image upload logic can go here (complex, skipping for now)
                    }
                    $product->save();
                    $logs[] = "✅ Product Added: " . $action['payload']['name'];
                    break;

                default:
                    $logs[] = "⚠️ Unknown Action: " . $action['type'];
            }
        } catch (Exception $e) {
            $logs[] = "❌ Error: " . $e->getMessage();
        }
    }

    return rest_ensure_response(['success' => true, 'logs' => $logs]);
}

// 🔄 DYNAMIC HOOKS (Yeh wo code chalayega jo DB mein save hua hai)
add_action('wp_head', function() {
    echo get_option('saas_inject_head', '');
});

add_action('wp_footer', function() {
    echo get_option('saas_inject_footer', '');
});

add_action('wp_enqueue_scripts', function() {
    $file = wp_upload_dir()['basedir'] . '/saas-custom.css';
    if (file_exists($file)) {
        wp_enqueue_style('saas-ai-style', wp_upload_dir()['baseurl'] . '/saas-custom.css', [], time());
    }
});
?>