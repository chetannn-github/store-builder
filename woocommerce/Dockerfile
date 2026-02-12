FROM bitnami/wordpress:latest

USER root

RUN install_packages unzip curl

RUN sed -i "/<?php/a if (isset(\$_SERVER['HTTP_X_FORWARDED_PROTO']) && strpos(\$_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false) { \$_SERVER['HTTPS'] = 'on'; }" /opt/bitnami/wordpress/wp-config.php

WORKDIR /opt/bitnami/wordpress/wp-content/plugins


RUN curl -L -O https://downloads.wordpress.org/plugin/woocommerce.latest-stable.zip && \
    unzip woocommerce.latest-stable.zip && \
    rm woocommerce.latest-stable.zip


RUN mkdir -p /opt/bitnami/wordpress/wp-content/mu-plugins
COPY mu-plugins/iframe-fix.php /opt/bitnami/wordpress/wp-content/mu-plugins/iframe-fix.php
COPY mu-plugins/force-ssl.php /opt/bitnami/wordpress/wp-content/mu-plugins/force-ssl.php

RUN chown -R 1001:1001 /opt/bitnami/wordpress

USER 1001