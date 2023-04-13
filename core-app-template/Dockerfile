FROM node:16

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /opt/app

COPY bin /opt/bin
RUN chmod +x /opt/bin/*

CMD [ "/opt/bin/start.sh" ]
