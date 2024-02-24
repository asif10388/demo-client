#!/bin/sh

cd /root

git clone https://github.com/asif10388/demo-client.git

cd /root/demo-client

yarn install

./make-urls.sh http://127.0.0.1:8080/api/v1

yarn build

serve ./root.drio/out -p 3001 &
serve ./saas.drio/out -p 3000
