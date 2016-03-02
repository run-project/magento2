#!/bin/bash

sed -i \
	-e 's/;always_populate_raw_post_data =.*/always_populate_raw_post_data = -1/' \
	/etc/php5/fpm/php.ini

sed -i \
	-e 's/group =.*/group = root/' \
	-e 's/user =.*/user = root/' \
	-e 's/listen\.owner.*/listen\.owner = root/' \
	-e 's/listen\.group.*/listen\.group = root/' \
	-e 's/error_log =.*/error_log = \/dev\/stdout/' \
	-e 's/;clear_env = no/clear_env = no/g' \
	/etc/php5/fpm/php-fpm.conf

exec /run.sh
