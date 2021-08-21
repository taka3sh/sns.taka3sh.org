FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-16-buster

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends golang

USER node
RUN go get golang.org/dl/go1.13.8
RUN /home/node/go/bin/go1.13.8 download
RUN ln -s /home/node/go/bin/go1.13.8 /home/node/go/bin/go
USER root
