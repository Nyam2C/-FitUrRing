FROM mongo:latest

COPY ./init.js.template /docker-entrypoint-initdb.d/init.js.template
COPY ./init.sh /docker-entrypoint-initdb.d/init.sh

CMD ["mongod", "--auth"]