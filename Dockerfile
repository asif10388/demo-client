FROM node:lts-bookworm-slim AS drioui

WORKDIR /root
RUN apt update -y && \
    apt install git -y && \
    npm install --global concurrently next
    
COPY ./uistart.sh /
ENTRYPOINT ["/uistart.sh"]
