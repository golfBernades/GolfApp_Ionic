#  Si aún no se ha generado la llave:
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

# Borrar apks anteriores:
rm *.apk

# Generar el apk:
ionic cordova build android --release

# Mover el apk generado al directorio de trabajo actual:
mv ./platforms/android/build/outputs/apk/android-release-unsigned.apk .

# Firmar el apk:
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name
passphrase: $greenbetapp$

# Realizar la verificación del apk:
$ANDROID_HOME/build-tools/25.0.0/zipalign -v 4 android-release-unsigned.apk GreenBet.apk





