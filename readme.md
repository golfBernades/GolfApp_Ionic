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

#### Error: spawn EACCES

> Ejecutar el comando ```sudo chmod -R 777 my_project_folder```

#### No se muestra el splash
```
ionic plugin remove cordova-plugin-splashscreen
ionic plugin add cordova-plugin-splashscreen
```

## Plugins a instalar

> ```ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git```

> ```ionic plugin add ionic-plugin-keyboard```

> ```cordova plugin add https://github.com/litehelpers/Cordova-sqlite-storage#storage-master```

> ```cordova plugin add cordova-plugin-screen-orientation```

> ```ionic plugin add cordova-plugin-splashscreen```

## Inspeccionar aplicación con Chrome

> Ejecutar la aplicación así: ```ionic run android -c```

> Abrir Chrome e ingresar en la barra de direcciones esto: 
```chrome://inspect```

## Correr la aplicación en un dispositivo específico:

> ```sudo ANDROID_HOME="/home/porfirio/android_sdk_tools" ionic run android  --target=192.168.1.87:5555```

## Instalar versiones específicas de Ionic y Cordova
> ```sudo npm install -g ionic@2.2.1```
> ```sudo npm install -g cordova@6.5.0```