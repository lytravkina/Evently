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
Один раз выполните в корне проекта
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### Запуск
Сервер и frontend запускаются одной командой из корня проекта
```bash
npm run dev
```
- frontend: http://localhost:5173
- API (JSON Server): http://localhost:3000

Остановить оба процесса можно через `Ctrl+C`.
