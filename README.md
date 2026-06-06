# VK Quiz — Frontend

React-приложение для платформы интерактивных викторин VK Quiz.

---

## Запуск через Docker


### 1. Убедись, что `.env` заполнен

Подробнее — в [README.md](../README.md) корневого проекта.

### 2. Собери и запусти

```bash
docker compose up --build -d
```


Фронтенд будет доступен по адресу: **http://localhost:5173**

---

Переменные окружения передаются как `ARG` во время сборки:

| Переменная              | Описание                          | Значение по умолчанию          |
|-------------------------|-----------------------------------|--------------------------------|
| `PUBLIC_API_BASE_URL`   | Базовый URL бэкенд API            | `http://localhost:8000/api`    |
| `PUBLIC_WS_BASE_URL`    | Базовый URL WebSocket             | `ws://localhost:8000/api/ws`   |


> **Важно:** эти переменные вшиваются в JS-бандл **на этапе сборки**, а не в рантайме.  
> Если изменил URL — нужно пересобрать образ.

---


## Частые проблемы

**Фронтенд собрался, но API не отвечает**

Убедись, что бэкенд запущен и `PUBLIC_API_BASE_URL` указывает на правильный адрес.

**Изменил URL бэкенда, но фронтенд всё равно шлёт на старый адрес**

Пересобери образ — переменные вшиваются в бандл при сборке:

```bash
docker compose build --no-cache frontend
```

**WebSocket не подключается**

Проверь `PUBLIC_WS_BASE_URL` — протокол должен быть `ws://` (или `wss://` для HTTPS).

# Rsbuild project

## Setup

Install the dependencies:

```bash
yarn install
```

## Get started

Start the dev server, and the app will be available at [http://localhost:5173](http://localhost:5173).

```bash
yarn run dev
```

Build the app for production:

```bash
yarn run build
```

Preview the production build locally:

```bash
yarn run preview
```

## Learn more

To learn more about Rsbuild, check out the following resources:

- [Rsbuild documentation](https://rsbuild.rs) - explore Rsbuild features and APIs.
- [Rsbuild GitHub repository](https://github.com/web-infra-dev/rsbuild) - your feedback and contributions are welcome!
