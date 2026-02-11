FROM bitnami/wordpress:latest

USER root

RUN install_packages unzip curl

WORKDIR /opt/bitnami/wordpress/wp-content/plugins

RUN curl -L -O https://downloads.wordpress.org/plugin/woocommerce.latest-stable.zip && \
    unzip woocommerce.latest-stable.zip && \
    rm woocommerce.latest-stable.zip


RUN mkdir -p /opt/bitnami/wordpress/wp-content/mu-plugins
COPY iframe-fix.php /opt/bitnami/wordpress/wp-content/mu-plugins/iframe-fix.php

RUN chown -R 1001:1001 /opt/bitnami/wordpress


USER 1001