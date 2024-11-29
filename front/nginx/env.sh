# front/nginx/env.sh
if [ "$SERVER_NAME" = "localhost" ]; then
    envsubst '${SERVER_NAME}' < /etc/nginx/templates/local-nginx.conf.template > /etc/nginx/nginx.conf
else
    envsubst '${SERVER_NAME}' < /etc/nginx/templates/server-nginx.conf.template > /etc/nginx/nginx.conf
fi

# locations.conf의 내용으로 # INSERT_LOCATIONS_HERE를 교체
sed -i -e '/# INSERT_LOCATIONS_HERE/r /etc/nginx/locations.conf' -e '/# INSERT_LOCATIONS_HERE/d' /etc/nginx/nginx.conf