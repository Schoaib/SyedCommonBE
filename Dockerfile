FROM node:8.2.1
RUN mkdir -p /SyedCommonBE
RUN     apt-get -y update && apt-get -y install \
        vim
RUN npm install -g forever
RUN chown -R node:node /SyedCommonBE
USER node
COPY ./package.json /SyedCommonBE/package.json
RUN cd /SyedCommonBE && npm install
WORKDIR /SyedCommonBE
COPY ./ /SyedCommonBE
CMD ["npm","run","forever"]
EXPOSE 8080
