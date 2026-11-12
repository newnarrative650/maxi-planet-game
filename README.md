# Узнай свою планету

Мобильная игра «Макси»: старт → 8 вопросов (карточка перетаскивается в корзинку на canvas) → результат-планета → подарки с промокодом.
Обычная статика без сборки: `index.html`, `game.css`, `game.js`, `assets/`.

## Деплой
GitHub Pages: Settings → Pages → Source: Deploy from a branch → `main` / `(root)`.

## Что настраивается в `game.js`
- `QUESTIONS` — вопросы и продукты (подпись `label`, артикул `sku`, планета `planet`, фото `img`).
- `PLANETS` — тексты результатов и иллюстрация `art` для каждой планеты (сейчас у всех четырёх одна, из макета «Уют»).
- `PROMO.code` — единый промокод; `LINKS.rules` и `LINKS.book` — ссылки «Правила акции» и «Подробнее о книге».
- Текст про «промокод 30% … с 18.11 по 17.01» — в `index.html`, блок `.promo__text`.

## Ссылки на экраны (для проверки)
`#start`, `#q1` … `#q8`, `#result-home`, `#result-expedition`, `#result-garden`, `#result-sweet`, `#gifts`, `#gifts-copied`.
