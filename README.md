# Узнай свою планету

Мобильная игра «Макси»: старт → 8 вопросов (карточка перетаскивается в корзинку на canvas) → результат-планета → подарки с промокодом.
Обычная статика без сборки: `index.html`, `game.css`, `game.js`, `assets/`.

## Деплой
- GitHub Pages: Settings → Pages → Source: Deploy from a branch → `main` / `(root)`.
- Свой сервер (Ubuntu/Debian): скрипт `deploy.sh` ставит nginx и забирает игру из этого репозитория; повторный запуск подтягивает свежую версию.

## Метрика и «Поделиться»
- Счётчик Top.Mail.Ru (id `3814173`): код в `index.html`, цели (`startClick`, `q1Answer…q8Answer`, `resultShown`, `resultHome/Expedition/Garden/Sweet`, `giftsClick`, `promoCopy`, `bookClick`, `rulesClick`, `restartClick`, `backClick`, `shareClick`, `shareSent`) отправляет `track()` в `game.js`.
- «Поделиться» ведёт на `p/<планета>/` — копии игры со своими OG-тегами и картинкой `assets/share-<планета>.jpg` (1200×630). Адреса в тегах абсолютные, их домен задаётся при сборке (`SITE_URL`); при смене домена теги нужно пересобрать.

## Что настраивается в `game.js`
- `QUESTIONS` — вопросы и продукты (подпись `label`, артикул `sku`, планета `planet`, фото `img`).
- `PLANETS` — тексты результатов и иллюстрация `art` для каждой планеты (сейчас у всех четырёх одна, из макета «Уют»).
- `PROMO.code` — единый промокод; `LINKS.rules` и `LINKS.book` — ссылки «Правила акции» и «Подробнее о книге».
- Текст про «промокод 30% … с 18.11 по 17.01» — в `index.html`, блок `.promo__text`.

## Ссылки на экраны (для проверки)
`#start`, `#q1` … `#q8`, `#result-home`, `#result-expedition`, `#result-garden`, `#result-sweet`, `#gifts`, `#gifts-copied`.
