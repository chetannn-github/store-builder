# 1. Bitnami Base Image (Tere logs ke hisab se ye perfect hai)
FROM bitnami/wordpress:latest

# 2. Root ban jao plugin install karne ke liye
USER root

# 3. Zip tool install karo
RUN install_packages unzip curl

# 4. Plugins folder mein jao
WORKDIR /opt/bitnami/wordpress/wp-content/plugins

# 5. WooCommerce Download & Extract
RUN curl -L -O https://downloads.wordpress.org/plugin/woocommerce.latest-stable.zip && \
    unzip woocommerce.latest-stable.zip && \
    rm woocommerce.latest-stable.zip

# 6. 🔥 IMPORTANT: Permissions Fix
# Bitnami user (1001) ko in files ka malik banao, warna CRASH hoga
RUN chown -R 1001:1001 /opt/bitnami/wordpress/wp-content/plugins

# 7. Wapis normal user ban jao
USER 1001