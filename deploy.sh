#!/bin/sh
cd /usr/share/nginx/html/zhicharthimphuFrontend/
git pull
ng build --prod
chmod -R 755 dist/