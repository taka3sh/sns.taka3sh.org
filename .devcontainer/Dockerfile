FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-16-buster

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends golang

USER node
RUN go get golang.org/dl/go1.13.15
RUN /home/node/go/bin/go1.13.15 download
RUN ln -s /home/node/go/bin/go1.13.15 /home/node/go/bin/go

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"
