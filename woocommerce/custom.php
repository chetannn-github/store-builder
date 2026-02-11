<?php
/*
Plugin Name: SaaS Lovable Builder
Description: Turns WordPress into a Blank Canvas for AI-generated Tailwind Designs.
Version: 5.0
Author: Chetan
*/

define('SAAS_API_SECRET', 'my-super-secret-key-123');

add_action('rest_api_init', function () {
    register_rest_route('saas/v1', '/execute', [
        'methods' => 'POST',
        'callback' => 'saas_lovable_handler',
        'permission_callback' => '__return_true',
    ]);
});

function saas_lovable_handler($request) {
    if ($request->get_header('X-SaaS-Secret') !== SAAS_API_SECRET) {
        return new WP_Error('forbidden', 'Invalid API Key', ['status' => 403]);
    }

    $params = $request->get_json_params();
    $actions = $params['actions'] ?? [];
    $logs = [];

    foreach ($actions as $action) {
        try {
            switch ($action['type']) {
                
                // 🎨 1. BUILD PAGE (Lovable Style)
                // AI will send full HTML structure with Tailwind Classes
                case 'BUILD_PAGE':
                    $slug = $action['payload']['slug'] ?? 'home';
                    $html_content = $action['payload']['html']; // Raw HTML from AI
                    
                    // Wrap in a div to ensure Tailwind works cleanly
                    $full_content = "<div class='saas-ai-generated-content'>
                        $html_content
                    </div>
                    ";

                    $page = get_page_by_path($slug);
                    $page_data = [
                        'post_title'    => ucfirst($slug),
                        'post_content'  => $full_content,
                        'post_status'   => 'publish',
                        'post_type'     => 'page',
                        'post_name'     => $slug
                    ];

                    if ($page) {
                        $page_data['ID'] = $page->ID;
                        wp_update_post($page_data);
                        $logs[] = "✅ Page '$slug' Re-built with new Design";
                    } else {
                        $id = wp_insert_post($page_data);
                        // If it's home, set as front page
                        if($slug === 'home') {
                            update_option('show_on_front', 'page');
                            update_option('page_on_front', $id);
                        }
                        $logs[] = "✅ Page '$slug' Created";
                    }
                    break;

                // ⚙️ 2. GENERIC OPTION UPDATE
                case 'UPDATE_OPTION':
                    update_option($action['payload']['option'], $action['payload']['value']);
                    $logs[] = "✅ Option Updated";
                    break;
            }
        } catch (Exception $e) {
            $logs[] = "❌ Error: " . $e->getMessage();
        }
    }

    return rest_ensure_response(['success' => true, 'logs' => $logs]);
}

// 🚀 FRONTEND: Inject Tailwind CSS (The Secret Sauce)
add_action('wp_head', function() {
    // 1. Tailwind CDN (Development Build for flexibility)
    echo '<script src="https://cdn.tailwindcss.com"></script>';
    
    // 2. Font Awesome (For Icons)
    echo '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">';
    
    // 3. Custom Config to extend Tailwind colors
    echo '<script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                brand: "#4F46E5", // Default Brand Color
              }
            }
          }
        }
    </script>';
    
    // 4. Reset WP Styles (Optional: Theme conflicts hatane ke liye)
    echo '<style>
        /* Force Full Width */
        .entry-content, .wp-block-group, .wp-site-blocks { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
    </style>';
});
?>