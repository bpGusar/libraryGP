Конфиг сервера находится по пути `backend\server\config\server.example.json` необходимо переименовать `server.example.json` в `server.json` и заполнить своими данными

Роуты сервера генерируются автоматически в файл `backend\server\routes\routesPaths.js` на основе файлов в папке `backend\server\routes`
Все что нужно делать это создавать новые файлы с роутами а скрипт их сам подтянет.

Роуты пишутся по принципу `/api/<имя_модели>/<действие>`, например `/api/bookedBooks`
В случаях когда роуты относятся ко многим моделям необходимо найти общую модель для них, например:
необходимо сделать роут для проверки есть ли указанная книга в забронированных либо она уже на руках у пользователя
это подразумевает что будут использоваться две модели `BookedBooks` и `OrderedBooks`
обе модели относятся к книгам, собственно общая для них модель это модель `Book`
роут будет выглядеть примерно так `/api/book/<действие>` и должен располагаться в файле с роутами относящимеся к модели `Book`
