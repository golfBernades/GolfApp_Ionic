#!/bin/bash

if [ ! -f my-release-key.keystore ]; then
    echo "Creating the sign key..."
    echo ""
    keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
fi

echo "Deleting previous generated apks..."
echo ""
rm -f *.apk

echo "Generating the new apk..."
echo ""
ionic cordova build android --release

echo "Moving the generated apk to the curren working directory..."
echo ""
mv ./platforms/android/build/outputs/apk/android-release-unsigned.apk .

echo "Signing the apk..."
echo "passphrase: \$greenbetapp\$"
echo ""
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name

echo "Verificating the apk..."
echo ""
/home/porfirio/Android/Sdk/build-tools/25.0.0/zipalign -v 4 android-release-unsigned.apk GreenBet.apk

echo "Done"
#
#
#
#
##  Si aún no se ha generado la llave:
#keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
#
## Borrar apks anteriores:
#rm *.apk
#
## Generar el apk:
#ionic cordova build android --release
#
## Mover el apk generado al directorio de trabajo actual:
#mv ./platforms/android/build/outputs/apk/android-release-unsigned.apk .
#
## Firmar el apk:
#echo "passphrase: $greenbetapp$"
#jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name
#
#
## Realizar la verificación del apk:
#$ANDROID_HOME/build-tools/25.0.0/zipalign -v 4 android-release-unsigned.apk GreenBet.apk





