# GolfApp

Aplicación desarrollada con el framework Ionic para el manejo de scoreboads y
apuestas en partidos de golf.

## Solución a errores

#### Android SDK Error

> Copiar la carpeta ```/android-studio-folder/plugins/android/lib/templates```
dentro del directorio ```/home/user/android_sdk_folder/tools```

> Agregar la variable de entorno ```ANDROID_HOME``` al 
path, o bien, especificar la ruta de la variable en cada ejecución de comandos
 de Ionic, de la siguiente manera:
```ANDROID_HOME="/home/porfirio/android_sdk_tools" mi_comando_ionic```

#### Npm Error

> Ejecutar el comando ```npm rebuild node-sass```

## Plugins a instalar

> ```ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git```

> ``` ionic plugin add ionic-plugin-keyboard```

> ```cordova plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git```