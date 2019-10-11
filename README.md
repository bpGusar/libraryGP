Конфиг сервера находится по пути **backend\server\config\server.example.json** необходимо переименовать **server.example.json** в **server.json** и заполнить своими данными

Роуты сервера генерируются автоматически в файл **backend\server\routes\routesPaths.js** на основе файлов в папке **backend\server\routes**
Все что нужно делать это создавать новые файлы с роутами а скрипт их сам подтянет.

Роуты пишутся по принципу **/api/<имя_модели>/<действие>**, например **/api/bookedBooks/get**
