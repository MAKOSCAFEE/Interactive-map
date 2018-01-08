#!/usr/bin/env bash
ng build --prod --aot
mv dist/assets/manifest.webapp dist/
cp -r dist/* /opt/dhis/config/apps/hisptzMaps/
cd dist
#Compress the file
echo "Compress the file"
zip -r -D hisptzMaps.zip .
echo "Install the app into DHIS hisptz"
curl -X POST -u admin:district -F file=@hisptzMaps.zip https://play.hisptz.org/27/api/apps
echo "app installed into DHIS"