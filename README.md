# Evently
Веб-приложение Evently для работы с мероприятиями.
## Требования
Перед началом работы необходимо установить:

- Node.js версии 18 или выше
- Git

## Установка
### Клонирование репозитория 
```bash
git clone https://github.com/lytravkina/Evently.git
```

### Установка зависимостей 
Перейдите в папку server в корневой папке проекта
```bash
cd [путь к папке server]
```
Один раз выполните
```bash
npm install
```
После выполнения команды автоматически создастся папка ```node_modules```.

### Запуск сервера
Для запуска JSON Server выполните
```bash
npm run server
```
После запуска API будет доступно по адресу:
```text
http://localhost:3000
```
### Запуск frontend
Для локального запуска frontend можно использовать расширение **Live Server** в Visual Studio Code.

Откройте папку ```client/src``` и запустите файл ```index.html``` через **Open with Live Server**
