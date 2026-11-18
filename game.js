/*
  «Узнай свою планету»: старт → 8 вопросов (выбор и перетаскивание в корзинку) → результат → подарки.
  На экране вопроса DOM рисует карточки в покое. Как только карточку берут в руку, она исчезает из DOM
  (на её месте пунктирная лунка), а на canvas рисуется её «двойник»: наклон, тень, инерция.
  Корзина внизу — часть иллюстрации, поэтому зону попадания и край, за которым карточка
  «падает внутрь», задают координаты BASKET в пикселях макета (390×844).
*/
(() => {
  'use strict';

  /* ------------------------------ данные ------------------------------ */
  // Вопросы из файла «Узнай свою планету» (8 штук, по 4 продукта).
  //  label  — подпись на карточке (короткая, без граммовки); full — название из каталога «Макси» для скринридеров
  //  sku    — артикул из файла и из каталога; planet — связь с планетой, участнику не показывается
  const QUESTIONS = [
    {
      title: ['Что возьмёшь', 'перекусить в дорогу?'],
      products: [
        { sku: '599755-142241', planet: 'Свежий сад',          label: 'Батончик-мюсли ПроПользу',               full: 'Батончик-мюсли ПроПользу многозлаковый яблочно-грушевый 55г', img: 'assets/599755-142241.webp' },
        { sku: '581221-7',      planet: 'Вкусовая экспедиция', label: 'Шаурма с курицей',                        full: 'Шаурма с курицей Производство Макси',                         img: 'assets/581221-7.webp' },
        { sku: '631035-7',      planet: 'Домашний очаг',       label: 'Смесь жареных орехов и изюма ПроПользу',  full: 'Смесь жареных орехов и изюма ПроПользу 150г',                 img: 'assets/631035-7.webp' },
        { sku: '563691-7',      planet: 'Сладкая жизнь',       label: 'Кукуруза воздушная Ёшки-Матрёшки',        full: 'Кукуруза воздушная Ёшки-Матрёшки Сладкая карамель 200г',      img: 'assets/563691-7.webp' },
      ],
    },
    {
      title: ['Какой напиток поднимет', 'тебе настроение?'],
      products: [
        { sku: '631773-7', planet: 'Вкусовая экспедиция',  label: 'Нектар из апельсина и манго Акси',
          full: 'Нектар из апельсина и манго Акси 0,97л',
          img: 'assets/631773-7.webp' },
        { sku: '650900-7', planet: 'Домашний очаг',        label: 'Снежок из Великого Устюга Родные луга',
          full: 'Продукт кисломолочный Снежок из Великого Устюга 2,5% Родные луга 470г БЗМЖ',
          img: 'assets/650900-7.webp' },
        { sku: '649420-7', planet: 'Свежий сад',           label: 'Морс ягодный из клюквы',
          full: 'Морс ягодный из клюквы 1л производство Макси',
          img: 'assets/649420-7.webp' },
        { sku: '652125-7', planet: 'Сладкая жизнь',        label: 'Напиток Пина\u00A0Колада Акси',
          full: 'Напиток газированный Пина Колада Акси 0,5л',
          img: 'assets/652125-7.webp' },
      ],
    },
    {
      title: ['Что выберешь', 'на обед?'],
      products: [
        { sku: 'combo-soup-main', planet: 'Домашний очаг',        label: 'Комбо суп+второе',
          full: 'Комбо: суп и второе блюдо (борщ с говядиной и гуляш с рожками)',
          img: 'assets/combo-soup-main.webp' },
        { sku: '570147-7', planet: 'Вкусовая экспедиция',  label: 'Удон со свининой в кисло-сладком соусе',
          full: 'Лапша удон со свининой в кисло-сладком соусе производство Макси',
          img: 'assets/570147-7.webp' },
        { sku: '423116-7', planet: 'Свежий сад',           label: 'Кабачки фаршированные',
          full: 'Кабачки фаршированные запеченные производство Макси',
          img: 'assets/423116-7.webp' },
        { sku: '616487-7', planet: 'Сладкая жизнь',        label: 'Паста карбонара',
          full: 'Паста карбонара 280г производство Макси',
          img: 'assets/616487-7.webp' },
      ],
    },
    {
      title: ['Что выберешь на', 'завтрак в выходной?'],
      products: [
        { sku: '446231-7', planet: 'Свежий сад',           label: 'Хлопья 4 злака Семья довольна',
          full: 'Хлопья 4 злака Семья довольна 400г',
          img: 'assets/446231-7.webp' },
        { sku: '499205-7', planet: 'Сладкая жизнь',        label: 'Буженина пряная Сытый боярин',
          full: 'Буженина пряная Сытый боярин 325г',
          img: 'assets/499205-7.webp' },
        { sku: '630740-7', planet: 'Вкусовая экспедиция',  label: 'Форель слабой соли Щедрая бухта',
          full: 'Форель филе-кусок слабой соли Щедрая бухта 150г',
          img: 'assets/630740-7.webp' },
        { sku: '112429-7', planet: 'Домашний очаг',        label: 'Блины с творогом',
          full: 'Блины с творогом производство Макси',
          img: 'assets/112429-7.webp' },
      ],
    },
    {
      title: ['Какой салат', 'выберешь?'],
      products: [
        { sku: '108737-7', planet: 'Домашний очаг',        label: 'Салат Оливье',
          full: 'Салат Оливье производство Макси',
          img: 'assets/108737-7.webp' },
        { sku: '590305-7', planet: 'Вкусовая экспедиция',  label: 'Салат с морепродуктами',
          full: 'Салат с морепродуктами 200г производство Макси',
          img: 'assets/590305-7.webp' },
        { sku: '126521-7', planet: 'Свежий сад',           label: 'Салат из капусты',
          full: 'Салат из белокочанной капусты производство Макси',
          img: 'assets/126521-7.webp' },
        { sku: '199444-7', planet: 'Сладкая жизнь',        label: 'Салат Цезарь с курицей',
          full: 'Салат Цезарь с курицей производство Макси',
          img: 'assets/199444-7.webp' },
      ],
    },
    {
      title: ['Какую выпечку', 'хочется попробовать?'],
      products: [
        { sku: '607311-7', planet: 'Домашний очаг',        label: 'Печенье сдобное Аранжа Svaduta',
          full: 'Печенье сдобное Аранжа Svaduta 350г',
          img: 'assets/607311-7.webp' },
        { sku: '648769-7', planet: 'Вкусовая экспедиция',  label: 'Баба ромовая с апельсином',
          full: 'Баба ромовая с апельсином 190г производство Макси',
          img: 'assets/648769-7.webp' },
        { sku: '632058-7', planet: 'Свежий сад',           label: 'Мюсличенье ПроПользу',
          full: 'Продукт зерновой Мюсличенье классические ПроПользу 500г',
          img: 'assets/632058-7.webp' },
        { sku: '574435-7', planet: 'Сладкая жизнь',        label: 'Вафли со сгущенкой Svaduta',
          full: 'Вафли с вареной сгущенкой в карамельной глазури Svaduta 250г',
          img: 'assets/574435-7.webp' },
      ],
    },
    {
      title: ['Какое мороженое', 'выберешь?'],
      products: [
        { sku: '636707-7', planet: 'Сладкая жизнь',        label: 'Эскимо Ферма братьев Петровых',
          full: 'Мороженое эскимо пломбир ванильный в глазури 15% Ферма братьев Петровых 70г БЗМЖ',
          img: 'assets/636707-7.webp' },
        { sku: '108171-7', planet: 'Вкусовая экспедиция',  label: 'Вкусландия пломбир с грецким орехом',
          full: 'Мороженое Вкусландия пломбир с грецким орехом и кленовым сиропом Айсберри 450г БЗМЖ',
          img: 'assets/108171-7.webp' },
        { sku: '636687-7', planet: 'Домашний очаг',        label: 'Стаканчик Ферма братьев Петровых',
          full: 'Мороженое пломбир ванильный в вафельном стаканчике 15% Ферма братьев Петровых 90г БЗМЖ',
          img: 'assets/636687-7.webp' },
        { sku: '306770-7', planet: 'Свежий сад',           label: 'Мороженое рожок Жемчужина России',
          full: 'Мороженое рожок Жемчужина России сливочное Айсберри 110г БЗМЖ',
          img: 'assets/306770-7.webp' },
      ],
    },
    {
      title: ['Какие фрукты', 'возьмёшь домой?'],
      products: [
        { sku: '581780-7', planet: 'Свежий сад',           label: 'Курага ПроПользу',
          full: 'Фрукты сушеные Курага ПроПользу 200г',
          img: 'assets/581780-7.webp' },
        { sku: '8989-7', planet: 'Сладкая жизнь',        label: 'Мандарины',
          full: 'Мандарины',
          img: 'assets/8989-7.webp' },
        { sku: '197856-7', planet: 'Домашний очаг',        label: 'Яблоки Роял Гала',
          full: 'Яблоки Роял Гала',
          img: 'assets/197856-7.webp' },
        { sku: '645382-7', planet: 'Вкусовая экспедиция',  label: 'Ананасы кольца Jolie Lolita',
          full: 'Компот Ананасы кольца Jolie Lolita 580мл',
          img: 'assets/645382-7.webp' },
      ],
    },
  ];
  const TOTAL_QUESTIONS = QUESTIONS.length;

  // Результаты из файла. Победившая планета определяется по выбранным карточкам (см. winner()).
  //  art — иллюстрация планеты 1024×1536; box — где в ней сама планета (центр, высота вместе со стеклянным колпаком),
  //        по этим числам игра ставит каждую планету в одно и то же место экрана.
  const PLANETS = {
    'Домашний очаг': {
      key: 'home',
      headline: 'Ты создаёшь тепло даже в мелочах',
      text: 'Твой маленький мир полон заботы и любимых вкусов. Здесь пахнет домашней выпечкой, а для близких всегда найдётся место за столом.',
      art: 'assets/planet-home.webp',
      box: { cx: 513, cy: 759, h: 505 },
      alt: 'Планета с уютным домом: в окне тёплый свет, над трубой дымок, осеннее дерево и плед для пикника, а на вершине роза под стеклянным колпаком',
    },
    'Вкусовая экспедиция': {
      key: 'expedition',
      headline: 'Тебе интересно, что за следующим поворотом',
      text: 'Новый вкус, необычное сочетание или незнакомое блюдо — повод отправиться в маленькое путешествие. На твоей планете каждый день может принести открытие.',
      art: 'assets/planet-expedition.webp',
      box: { cx: 509, cy: 762, h: 460 },
      alt: 'Фиолетовая планета с кристаллами, лестницами и подзорной трубой, на вершине роза под стеклянным колпаком',
    },
    'Свежий сад': {
      key: 'garden',
      headline: 'Ты выбираешь лёгкое и свежее',
      text: 'На твоей планете растут яблони и грядки, а на столе — простые натуральные вкусы. Ты выбираешь то, что подходит именно твоему настроению.',
      art: 'assets/planet-garden.webp',
      box: { cx: 512, cy: 804, h: 462 },
      alt: 'Бирюзовая планета с водой и кувшинками, мостиком и ивой, на вершине роза под стеклянным колпаком',
    },
    'Сладкая жизнь': {
      key: 'sweet',
      headline: 'Ты умеешь наслаждаться моментом',
      text: 'На твоей планете обычный день заслуживает любимого десерта и маленького праздника. Ты находишь радость во вкусах, которые хочется попробовать снова.',
      art: 'assets/planet-sweet.webp',
      box: { cx: 510, cy: 788, h: 468 },
      alt: 'Клубничная планета с тортиками и чаем на кружевной скатерти, на вершине роза под стеклянным колпаком',
    },
  };

  // Единый промокод для всех (в файле он пока «[ЕДИНЫЙ ПРОМОКОД]»; в макете написано «ПРОМОКОД») и ссылки кнопок.
  // Где стоит планета на экране результата: центр по x и y, масштаб не меньше min (чтобы картинка закрывала экран)
  const ART_SLOT = { cx: 195, cy: 340, scale: 0.66, w: 1024, h: 1536 };
  const PROMO = { code: 'ПРОМОКОД' };
  const LINKS = { rules: 'https://maxi-retail.ru/', book: 'https://maxi-retail.ru/' };

  // Счётчик Top.Mail.Ru: сам код стоит в index.html, здесь только отправка целей.
  // Названия целей — латиница и цифры, как требует счётчик:
  //   startClick — нажата «Начать путешествие»;  q1Answer … q8Answer — выбран продукт на вопросе N;
  //   resultShown — показан результат после игры;  resultHome / resultExpedition / resultGarden / resultSweet — какая планета;
  //   giftsClick — «Забрать подарки»;  promoCopy — промокод скопирован;  promoCopyFail — скопировать не удалось, код выделен;
  //   bookClick — «Подробнее о книге»;  rulesClick — «Правила акции»;  restartClick — «Пройти ещё раз»;
  //   backClick — стрелка назад с экрана подарков;  shareClick — нажата «Поделиться»;  shareSent — ссылка ушла (окно «Поделиться» завершено или ссылка скопирована).
  const COUNTER_ID = '3814173';
  function track(goal) {
    try { (window._tmr = window._tmr || []).push({ id: COUNTER_ID, type: 'reachGoal', goal }); } catch (_) { /* счётчик не должен ломать игру */ }
  }

  const TITLE = { maxW: 350, maxFont: 30, minFont: 24 };
  const W = 390, H = 844;
  const CARD = { w: 163, h: 188, r: 20, pad: 10, imgH: 125, gap: 8, nameBoxH: 33 };
  const NAME = { maxW: 141, maxFont: 15, minFont: 12, lineRatio: 1.15 };  // maxW — ширина области подписи минус запас

  // Корзина на иллюстрации (координаты экрана):
  //  x, y         — центр зева корзины
  //  openRx/Ry    — внутренний овал зева; нижняя половина овала — передний бортик, за ним карточка скрывается
  //  hitRx/Ry     — зона, в которой отпущенная карточка считается брошенной в корзину
  const BASKET = { x: 181.5, y: 713, openRx: 48, openRy: 13, hitRx: 92, hitRy: 62 };

  /* ------------------------------ утилиты ------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInQuad = (t) => t * t;
  const easeOutBack = (t) => { const c = 1.25; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const damp = (dt, rate) => 1 - Math.exp(-dt * rate);
  const inEllipse = (x, y, e) => Math.pow((x - BASKET.x) / e.rx, 2) + Math.pow((y - BASKET.y) / e.ry, 2) <= 1;
  const inBasket = (x, y) => inEllipse(x, y, { rx: BASKET.hitRx, ry: BASKET.hitRy });

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    if (g.roundRect) { g.roundRect(x, y, w, h, r); return; }
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function el(tag, cls) { const n = document.createElement(tag); if (cls) n.className = cls; return n; }

  /* ------------------------------ состояние ------------------------------ */
  const screen = $('#screen');
  const grid = $('#products');
  const bubble = $('#bubble');
  const fx = $('#fx');
  const ctx = fx.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let scale = 1;            // css-пикселей в пикселе макета
  let K = 1;                // пикселей canvas в пикселе макета
  let state = 'idle';       // idle | dragging | returning | dropping | settled
  let items = [];
  let qIndex = 0;           // номер текущего вопроса (с нуля)
  let d = null;             // карточка в руке
  let anim = null;          // текущая анимация возврата/падения
  let particles = [];
  let ring = null;
  let raf = 0;
  let last = 0;
  let view = 'start';       // start | game | result | gifts
  let answers = [];         // answers[i] — планета, выбранная на вопросе i

  const setState = (s) => { state = s; screen.dataset.state = s; };

  /* ------------------------------ сборка экрана ------------------------------ */
  function renderQuestion(q, index) {
    $('#chip').textContent = `Вопрос ${index + 1} из ${TOTAL_QUESTIONS}`;
    $('#title').replaceChildren(...q.title.map((t) => { const s = el('span'); s.textContent = t; return s; }));
    grid.replaceChildren();
    items = q.products.map(buildItem);
    for (const n of [$('.question'), grid]) { n.classList.remove('is-entering'); void n.offsetWidth; n.classList.add('is-entering'); }
  }

  function buildItem(product) {
    const slot = el('div', 'slot');
    const card = el('div', 'card');
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', product.full + '. Перетащи в корзинку или нажми Enter');

    const imgBox = el('div', 'card__img');
    const img = new Image();
    img.src = product.img; img.alt = ''; img.draggable = false;
    imgBox.append(img);

    const name = el('p', 'card__name');
    card.append(imgBox, name);

    const hole = el('div', 'slot__hole');
    const icon = new Image();
    icon.src = 'assets/icon-basket.svg'; icon.alt = ''; icon.draggable = false;
    hole.append(icon);

    slot.append(card, hole);
    grid.append(slot);
    return { product, slot, card, img, name, lines: [product.label], sprite: null };
  }

  const homeOf = (item) => ({
    x: grid.offsetLeft + item.slot.offsetLeft + CARD.w / 2,
    y: grid.offsetTop + item.slot.offsetTop + CARD.h / 2,
  });

  /* ------------------------------ подписи: перенос и размер шрифта ------------------------------ */
  // Делим название на две строки по пробелу так, чтобы строки были близки по ширине.
  function splitName(g, text, maxW) {
    const w = (s) => g.measureText(s).width;
    if (w(text) <= maxW) return [text];
    const words = text.split(' ');
    let best = null;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
      const wa = w(a), wb = w(b);
      if (wa <= maxW && wb <= maxW && (!best || Math.max(wa, wb) < best.score)) best = { lines: [a, b], score: Math.max(wa, wb) };
    }
    return best && best.lines;
  }

  // Самый крупный шрифт (до 15 px как в макете), при котором все названия помещаются в две строки.
  function fitNames(nameEl) {
    const g = document.createElement('canvas').getContext('2d');
    const family = getComputedStyle(nameEl).fontFamily;
    for (let fs = NAME.maxFont; fs >= NAME.minFont; fs -= 0.5) {
      g.font = `800 ${fs}px ${family}`;
      const lines = items.map((i) => splitName(g, i.product.label, NAME.maxW));
      if (lines.every(Boolean)) return { fs, lines };
    }
    g.font = `800 ${NAME.minFont}px ${family}`;
    return { fs: NAME.minFont, lines: items.map((i) => splitName(g, i.product.label, NAME.maxW) || [i.product.label]) };
  }

  // Заголовок: самый крупный шрифт (до 30 px), при котором обе строки укладываются в ширину.
  function fitFont(el, lines, weight, maxW, maxFont, minFont) {
    const g = document.createElement('canvas').getContext('2d');
    const family = getComputedStyle(el).fontFamily;
    for (let f = maxFont; f >= minFont; f -= 0.5) {
      g.font = `${weight} ${f}px ${family}`;
      if (lines.every((l) => g.measureText(l).width <= maxW)) return f;
    }
    return minFont;
  }

  // Сколько строк займёт текст при жадном переносе по словам в ширину maxW
  function countLines(el, text, weight, fs, maxW) {
    const g = document.createElement('canvas').getContext('2d');
    g.font = `${weight} ${fs}px ${getComputedStyle(el).fontFamily}`;
    let lines = 1, cur = '';
    for (const word of text.split(' ')) {
      const next = cur ? cur + ' ' + word : word;
      if (cur && g.measureText(next).width > maxW) { lines++; cur = word; } else cur = next;
    }
    return lines;
  }

  function applyTitle(lines) {
    screen.style.setProperty('--title-fs', fitFont($('#title'), lines, 900, TITLE.maxW, TITLE.maxFont, TITLE.minFont) + 'px');
  }

  let nameFont = NAME.maxFont;
  function applyNames() {
    const fit = fitNames(items[0].name);
    nameFont = fit.fs;
    screen.style.setProperty('--name-fs', fit.fs + 'px');
    items.forEach((item, i) => {
      item.lines = fit.lines[i];
      item.name.replaceChildren(...item.lines.map((line) => { const s = el('span'); s.textContent = line; return s; }));
    });
  }

  /* ------------------------------ спрайт карточки ------------------------------ */
  function ellipsize(g, text, maxW) {
    if (g.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && g.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return t.trimEnd() + '…';
  }

  function buildSprite(item) {
    const Q = 3;
    const c = document.createElement('canvas');
    c.width = CARD.w * Q; c.height = CARD.h * Q;
    const g = c.getContext('2d');
    g.scale(Q, Q);

    g.fillStyle = '#fff';
    roundRect(g, 0, 0, CARD.w, CARD.h, CARD.r);
    g.fill();

    // фото: object-fit: cover в области 143×125
    const ix = CARD.pad, iy = CARD.pad, iw = CARD.w - CARD.pad * 2, ih = CARD.imgH;
    const im = item.img;
    g.save();
    g.beginPath(); g.rect(ix, iy, iw, ih); g.clip();
    g.fillStyle = '#f4ede3'; g.fillRect(ix, iy, iw, ih);
    if (im.naturalWidth) {
      const k = Math.max(iw / im.naturalWidth, ih / im.naturalHeight);
      const dw = im.naturalWidth * k, dh = im.naturalHeight * k;
      g.imageSmoothingQuality = 'high';
      g.drawImage(im, ix + (iw - dw) / 2, iy + (ih - dh) / 2, dw, dh);
    }
    g.restore();

    // подпись: тот же шрифт и межстрочный, что в DOM
    const family = getComputedStyle($('.card__name', item.card)).fontFamily;
    g.font = `800 ${nameFont}px ${family}`;
    g.fillStyle = '#1c1c1c';
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    const m = g.measureText('Мgй');
    const asc = m.fontBoundingBoxAscent || nameFont * 1.0;
    const desc = m.fontBoundingBoxDescent || nameFont * 0.35;
    const lh = nameFont * NAME.lineRatio;
    let top = CARD.pad + CARD.imgH + CARD.gap + (CARD.nameBoxH - item.lines.length * lh) / 2;
    item.lines.forEach((line) => {
      g.fillText(ellipsize(g, line, iw), CARD.w / 2, top + (lh - (asc + desc)) / 2 + asc);
      top += lh;
    });
    return c;
  }

  /* ------------------------------ масштаб и canvas ------------------------------ */
  function resize() {
    const cs = getComputedStyle(document.body);
    const box = document.body.getBoundingClientRect();
    const availW = box.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const availH = box.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    scale = clamp(Math.min(availW / W, availH / H), 0.3, 1.4);
    document.documentElement.style.setProperty('--s', scale.toFixed(4));
    K = Math.min(3, Math.max(1, scale * (window.devicePixelRatio || 1)));
    const pw = Math.round(W * K), ph = Math.round(H * K);
    if (fx.width !== pw || fx.height !== ph) { fx.width = pw; fx.height = ph; }
    K = fx.width / W;
    draw(performance.now());
  }

  function toDesign(e) {
    const r = screen.getBoundingClientRect();
    const s = r.width / W;
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  }

  /* ------------------------------ перетаскивание ------------------------------ */
  function makeDrag(item, home) {
    return {
      item, home,
      x: home.x, y: home.y, vx: 0,
      angle: 0, scale: 1, lift: 0, hover: 0,
      tx: home.x, ty: home.y, px: home.x, py: home.y,
      grab: { x: 0, y: 0 }, startP: { x: home.x, y: home.y }, moved: 0,
      pointerId: null, clip: false, visible: true,
    };
  }

  grid.addEventListener('pointerdown', (e) => {
    if (state !== 'idle' || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const card = e.target.closest('.card');
    const item = card && items.find((i) => i.card === card);
    if (!item || !item.sprite) return;
    e.preventDefault();

    const p = toDesign(e);
    const home = homeOf(item);
    d = makeDrag(item, home);
    d.grab = { x: p.x - home.x, y: p.y - home.y };
    d.startP = p; d.px = p.x; d.py = p.y;
    d.pointerId = e.pointerId;

    try { screen.setPointerCapture(e.pointerId); } catch (_) { /* не критично */ }
    item.slot.classList.add('is-empty');
    setState('dragging');
    draw(performance.now()); // карточка в DOM скрылась — в этом же кадре рисуем её на canvas
    startLoop();
  });

  screen.addEventListener('pointermove', (e) => {
    if (!d || state !== 'dragging' || e.pointerId !== d.pointerId) return;
    const p = toDesign(e);
    d.px = p.x; d.py = p.y;
    d.moved = Math.max(d.moved, Math.hypot(p.x - d.startP.x, p.y - d.startP.y));
    d.tx = clamp(p.x - d.grab.x, 24, W - 24);
    d.ty = clamp(p.y - d.grab.y, 80, H - 20);
  });

  const release = (e, cancelled) => {
    if (!d || state !== 'dragging' || e.pointerId !== d.pointerId) return;
    const thrown = !cancelled && (inBasket(d.tx, d.ty) || inBasket(d.px, d.py));
    if (thrown) beginDrop(); else beginReturn(d.moved < 8 && !cancelled);
  };
  screen.addEventListener('pointerup', (e) => release(e, false));
  screen.addEventListener('pointercancel', (e) => release(e, true));
  screen.addEventListener('contextmenu', (e) => e.preventDefault());

  // с клавиатуры: Enter / пробел кладёт выбранный продукт в корзинку
  grid.addEventListener('keydown', (e) => {
    if ((e.key !== 'Enter' && e.key !== ' ') || state !== 'idle') return;
    const card = e.target.closest('.card');
    const item = card && items.find((i) => i.card === card);
    if (!item || !item.sprite) return;
    e.preventDefault();
    d = makeDrag(item, homeOf(item));
    item.slot.classList.add('is-empty');
    draw(performance.now());
    beginDrop();
  });

  /* ------------------------------ анимации ------------------------------ */
  const snapshot = () => ({ x: d.x, y: d.y, angle: d.angle, scale: d.scale, lift: d.lift });

  function beginReturn(wasTap) {
    if (wasTap) { bubble.classList.remove('is-nudged'); void bubble.offsetWidth; bubble.classList.add('is-nudged'); }
    anim = { kind: 'return', t0: performance.now(), dur: 380, from: snapshot() };
    setState('returning');
    startLoop();
  }

  function beginDrop() {
    anim = { kind: 'drop', t0: performance.now(), t1: 380, t2: 380 + 340, from: snapshot(), burst: false };
    setState('dropping');
    startLoop();
  }

  const MOUTH = { x: BASKET.x, y: BASKET.y - 50, scale: 0.5, angle: -6 };  // карточка над краем корзины, уже зева (163×0.5 < 96)
  const SUNK = { x: BASKET.x, y: BASKET.y + 62, scale: 0.3, angle: 0 };    // карточка полностью внутри

  function update(now, dt) {
    if (d && state === 'dragging') {
      const prevX = d.x;
      const k = damp(dt, 30);
      d.x += (d.tx - d.x) * k;
      d.y += (d.ty - d.y) * k;
      d.vx += ((d.x - prevX) / dt - d.vx) * damp(dt, 18);
      const sway = reduceMotion.matches ? 0 : clamp(d.vx * 0.012, -14, 14);
      d.angle += (10 + sway - d.angle) * damp(dt, 14);   // 10° — наклон из макета
      d.lift += (1 - d.lift) * damp(dt, 16);
      const over = inBasket(d.x, d.y) ? 1 : 0;
      d.hover += (over - d.hover) * damp(dt, 12);
      d.scale = lerp(1, 0.86, d.hover);
    } else if (d && anim && anim.kind === 'return') {
      const u = clamp((now - anim.t0) / anim.dur, 0, 1);
      const e = easeOutBack(u), f = anim.from;
      d.x = lerp(f.x, d.home.x, e); d.y = lerp(f.y, d.home.y, e);
      d.angle = lerp(f.angle, 0, easeOutCubic(u));
      d.scale = lerp(f.scale, 1, easeOutCubic(u));
      d.lift = lerp(f.lift, 0, u);
      d.hover *= 1 - damp(dt, 20);
      if (u >= 1) finish();
    } else if (d && anim && anim.kind === 'drop') {
      const t = now - anim.t0, f = anim.from;
      d.hover *= 1 - damp(dt, 10);
      if (t < anim.t1) {
        const u = easeOutCubic(t / anim.t1);
        d.x = lerp(f.x, MOUTH.x, u); d.y = lerp(f.y, MOUTH.y, u);
        d.scale = lerp(f.scale, MOUTH.scale, u);
        d.angle = lerp(f.angle, MOUTH.angle, u);
        d.lift = lerp(f.lift, 1, u);
      } else if (t < anim.t2) {
        const u = easeInQuad((t - anim.t1) / (anim.t2 - anim.t1));
        d.x = lerp(MOUTH.x, SUNK.x, u); d.y = lerp(MOUTH.y, SUNK.y, u);
        d.scale = lerp(MOUTH.scale, SUNK.scale, u);
        d.angle = lerp(MOUTH.angle, SUNK.angle, u);
        d.clip = true;
      } else {
        d.visible = false;
        if (!anim.burst) {
          anim.burst = true; anim.tDone = now;
          setState('settled');
          burst(now);
          const pr = d.item.product;
          answers[qIndex] = pr.planet;
          screen.dispatchEvent(new CustomEvent('choose', { detail: { question: qIndex + 1, sku: pr.sku, planet: pr.planet, label: pr.label, full: pr.full } }));
        }
        if (now - anim.tDone > 950) finish(true);
      }
    }

    // частицы и кольцо
    const sec = dt;
    particles = particles.filter((p) => (p.age += sec) < p.life);
    particles.forEach((p) => { p.vy += 260 * sec; p.x += p.vx * sec; p.y += p.vy * sec; p.rot += p.spin * sec; });
    if (ring && now - ring.t0 > 650) ring = null;
  }

  function finish(chosen) {
    const item = d.item;
    d = null; anim = null;
    // выбор сделан: следующий вопрос, а после последнего — результат
    if (chosen && qIndex + 1 < QUESTIONS.length) { loadQuestion(qIndex + 1); return; }
    if (chosen) {
      setState('idle');
      const planet = winner();
      track('resultShown');
      track('result' + PLANETS[planet].key.replace(/^./, (c) => c.toUpperCase()));
      showResult(planet);
      return;
    }
    item.slot.classList.remove('is-empty');
    setState('idle');
  }

  function burst(now) {
    if (reduceMotion.matches) return;
    ring = { t0: now };
    const colors = ['#ffd166', '#ffffff', '#ff9f1c', '#ffe9a8'];
    for (let i = 0; i < 18; i++) {
      const a = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.15;
      const v = 90 + Math.random() * 150;
      particles.push({
        x: BASKET.x + (Math.random() - 0.5) * 44, y: BASKET.y - 8,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        size: 3 + Math.random() * 4, life: 0.55 + Math.random() * 0.4, age: 0,
        rot: Math.random() * 3, spin: (Math.random() - 0.5) * 6,
        star: Math.random() < 0.65, color: colors[i % colors.length],
      });
    }
  }

  /* ------------------------------ рисование ------------------------------ */
  function drawStar(g, x, y, r, rot) {
    g.save(); g.translate(x, y); g.rotate(rot);
    g.beginPath();
    for (let i = 0; i < 8; i++) {
      const rr = i % 2 === 0 ? r : r * 0.32, a = (Math.PI / 4) * i;
      g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    g.closePath(); g.fill(); g.restore();
  }

  function drawBasketFx(now) {
    // подсветка зева, пока карточка над корзиной: тот же пунктир, что в «лунке» макета
    if (d && d.hover > 0.01) {
      const pulse = 1 + 0.035 * Math.sin(now / 160);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(BASKET.x, BASKET.y - 2, 86 * pulse, 40 * pulse, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.12 * d.hover})`; ctx.fill();
      ctx.setLineDash([7, 6]); ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(255,255,255,${0.8 * d.hover})`; ctx.stroke();
      ctx.restore();
    }
    if (ring) {
      const u = clamp((now - ring.t0) / 650, 0, 1);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(BASKET.x, BASKET.y, BASKET.openRx + 70 * easeOutCubic(u), BASKET.openRy + 30 * easeOutCubic(u), 0, 0, Math.PI * 2);
      ctx.lineWidth = 3 * (1 - u) + 0.5;
      ctx.strokeStyle = `rgba(255,236,170,${0.9 * (1 - u)})`;
      ctx.stroke();
      ctx.restore();
    }
  }

  function applyBasketClip() {
    // всё, кроме области под передним бортиком: ушедшее вниз за бортик скрыто
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    const { x, y, openRx, openRy } = BASKET;
    ctx.moveTo(x + openRx, y);
    ctx.ellipse(x, y, openRx, openRy, 0, 0, Math.PI, false);
    ctx.lineTo(x - openRx - 6, H);
    ctx.lineTo(x + openRx + 6, H);
    ctx.closePath();
    ctx.clip('evenodd');
  }

  function drawCard() {
    const sprite = d.item.sprite;
    if (!sprite) return;
    const t = clamp(d.lift, 0, 1);
    const sy = lerp(6, 14, t), blur = lerp(8, 12, t);
    const r = Math.round(lerp(10, 0, t)), gc = Math.round(lerp(43, 0, t)), b = Math.round(lerp(64, 0, t));
    ctx.save();
    if (d.clip) applyBasketClip();
    ctx.translate(d.x, d.y);
    ctx.rotate((d.angle * Math.PI) / 180);
    ctx.scale(d.scale, d.scale);
    ctx.shadowColor = `rgba(${r},${gc},${b},${lerp(0.25, 0.35, t)})`;
    ctx.shadowBlur = blur * K * d.scale;
    ctx.shadowOffsetY = sy * K * d.scale;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sprite, -CARD.w / 2, -CARD.h / 2, CARD.w, CARD.h);
    ctx.restore();
  }

  function draw(now) {
    ctx.setTransform(K, 0, 0, K, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawBasketFx(now);
    if (d && d.visible) drawCard();
    particles.forEach((p) => {
      const a = 1 - p.age / p.life;
      ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, a);
      if (p.star) drawStar(ctx, p.x, p.y, p.size * 1.5, p.rot);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2); ctx.fill(); }
    });
    ctx.globalAlpha = 1;
  }

  /* ------------------------------ цикл ------------------------------ */
  const active = () => state !== 'idle' || particles.length > 0 || ring;

  function tick(now) {
    const dt = clamp((now - last) / 1000, 0.001, 0.05);
    last = now;
    update(now, dt);
    draw(now);
    raf = active() ? requestAnimationFrame(tick) : 0;
  }

  function startLoop() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  /* ------------------------------ запуск ------------------------------ */
  const fontsReady = (document.fonts && document.fonts.load)
    ? Promise.race([
        Promise.all([
          document.fonts.load('800 15px Nunito', 'Абвгд ёЁ'),
          document.fonts.load('900 30px Nunito', 'Абвгд ёЁ'),
        ]).catch(() => {}),
        new Promise((r) => setTimeout(r, 2500)),
      ])
    : Promise.resolve();

  const preloaded = new Set();
  function preloadQuestion(i) {
    if (preloaded.has(i)) return;
    preloaded.add(i);
    const urls = QUESTIONS[i] ? QUESTIONS[i].products.map((p) => p.img) : [...new Set(Object.values(PLANETS).map((p) => p.art))];
    urls.forEach((u) => { const im = new Image(); im.src = u; });
  }

  async function loadQuestion(i) {
    qIndex = i;
    setState('loading');
    screen.dataset.q = String(i);
    setHash('q' + (i + 1));
    screen.removeAttribute('data-ready');   // подписи скрыты, пока не подобран шрифт
    renderQuestion(QUESTIONS[i], i);
    await Promise.all([fontsReady, ...items.map((it) => (it.img.decode ? it.img.decode().catch(() => {}) : Promise.resolve()))]);
    if (qIndex !== i || view !== 'game') return;
    applyTitle(QUESTIONS[i].title);
    applyNames();
    items.forEach((it) => { it.sprite = buildSprite(it); });
    screen.dataset.ready = 'true';
    setState('idle');
    preloadQuestion(i + 1);
  }

  /* ------------------------------ счёт: какая планета ------------------------------ */
  // Каждый выбранный ответ приносит 1 балл своей планете. В каждом вопросе есть все четыре планеты,
  // поэтому делить на число вопросов с планетой не нужно: знаменатель у всех одинаковый.
  // При равенстве побеждает та из лидирующих, чей ответ участник выбрал позже.
  function winner() {
    const score = {}, lastAt = {};
    answers.forEach((planet, i) => { if (planet) { score[planet] = (score[planet] || 0) + 1; lastAt[planet] = i; } });
    let best = null;
    for (const planet of Object.keys(score)) {
      if (!best || score[planet] > score[best] || (score[planet] === score[best] && lastAt[planet] > lastAt[best])) best = planet;
    }
    return best || 'Домашний очаг';
  }

  /* ------------------------------ виды и переходы ------------------------------ */
  const views = { start: $('#v-start'), game: $('#v-game'), result: $('#v-result'), gifts: $('#v-gifts') };
  const VIEW_LABEL = { start: 'Старт', game: 'Вопрос', result: 'Результат', gifts: 'Подарки' };
  Object.values(views).forEach((v) => v.setAttribute('tabindex', '-1'));

  function setHash(h) {
    if (location.hash === '#' + h) return;
    try { history.replaceState(null, '', '#' + h); } catch (_) { /* адресная строка недоступна — не критично */ }
  }

  function resetGameLayer() {
    d = null; anim = null; particles = []; ring = null;
    setState('idle');
    draw(performance.now());
  }

  function showView(name, { focus = true } = {}) {
    view = name;
    for (const [k, v] of Object.entries(views)) {
      if (k === name) {
        if (v.hidden) { v.hidden = false; v.classList.remove('is-in'); void v.offsetWidth; v.classList.add('is-in'); }
      } else v.hidden = true;
    }
    screen.dataset.view = name;
    screen.setAttribute('aria-label', `Игра «Узнай свою планету». ${VIEW_LABEL[name]}`);
    if (name !== 'game') resetGameLayer();
    if (focus && name !== 'game') views[name].focus({ preventScroll: true });
  }

  function startGame(i = 0) {
    resetGameLayer();
    if (i === 0) answers = [];
    showView('game');
    loadQuestion(i);
  }

  let lastPlanet = null;   // планета, которую игрок видел последней: сюда ведёт стрелка «назад» с экрана подарков

  function showResult(planetName) {
    lastPlanet = planetName;
    const p = PLANETS[planetName];
    const planetTitle = planetName;
    $('#result-planet').textContent = planetTitle;
    $('#result-headline').textContent = p.headline;
    $('#result-desc').textContent = p.text;
    const art = $('#result-art');
    art.src = p.art; art.alt = p.alt;
    {
      const A = ART_SLOT, bx = p.box;
      // масштаб: не меньше базового и такой, чтобы картинка дотягивалась до низа экрана
      const k = Math.max(A.scale, (H - A.cy) / (A.h - bx.cy));
      Object.assign(art.style, { width: A.w * k + 'px', height: A.h * k + 'px', left: A.cx - bx.cx * k + 'px', top: A.cy - bx.cy * k + 'px' });
    }
    screen.dataset.planet = p.key;
    // заголовок результата — не больше двух строк: подбираем кегль от 28 до 24
    const headEl = $('#result-headline');
    let hf = 24;
    for (let f = 28; f >= 24; f -= 0.5) { if (countLines(headEl, p.headline, 900, f, 342) <= 2) { hf = f; break; } }
    screen.style.setProperty('--rh-fs', hf + 'px');
    // «Твоя планета — <название>»: название подбираем по ширине, как заголовок вопроса
    screen.style.setProperty('--rt-fs', fitFont($('#result-title'), ['Твоя планета —', planetTitle], 900, 342, 34, 22) + 'px');
    setHash('result-' + p.key);
    showView('result');
  }

  /* ------------------------------ подарки и промокод ------------------------------ */
  const copyBtn = $('#btn-copy');
  const copyLabel = $('#btn-copy-label');
  const codeEl = $('#promo-code');

  function setCopyState(st) {   // idle | done | manual
    copyBtn.classList.toggle('btn--gray', st === 'done');
    copyBtn.dataset.state = st;
    copyLabel.textContent = st === 'done' ? 'Промокод скопирован' : st === 'manual' ? 'Скопируй вручную' : 'Забрать';
    $('#copy-status').textContent = st === 'done' ? 'Промокод скопирован'
      : st === 'manual' ? 'Автоматически скопировать не удалось. Промокод выделен, скопируй его вручную' : '';
  }

  function selectCode() {
    try {
      const r = document.createRange(); r.selectNodeContents(codeEl);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
    } catch (_) { /* не критично */ }
  }

  function legacyCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.append(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (_) { return false; }
  }

  async function copyPromo() {
    let ok = false;
    try { await navigator.clipboard.writeText(PROMO.code); ok = true; } catch (_) { ok = legacyCopy(PROMO.code); }
    if (!ok) selectCode();
    setCopyState(ok ? 'done' : 'manual');
    track(ok ? 'promoCopy' : 'promoCopyFail');
    setHash(ok ? 'gifts-copied' : 'gifts');
  }

  /* ------------------------------ поделиться результатом ------------------------------ */
  // Делимся ссылкой на страницу планеты (p/<планета>/): у неё свои метатеги, поэтому мессенджер сам показывает карточку
  // с картинкой планеты, заголовком «Моя планета — …» и описанием. Страницы и картинки делает build_share.py / make_cards.py.
  const SHARE = { text: 'Узнай свою планету в игре Макси', utm: 'utm_source=share&utm_medium=quiz' };
  const shareLabel = $('#btn-share-label');
  let shareTimer = 0;

  function shareData() {
    const p = PLANETS[lastPlanet];
    const url = new URL(`p/${p.key}/?${SHARE.utm}&utm_campaign=planet_${p.key}`, document.baseURI).href;
    return { title: `Моя планета — ${lastPlanet}`, text: SHARE.text, url };
  }

  function flashShare(label) {
    shareLabel.textContent = label;
    clearTimeout(shareTimer);
    shareTimer = setTimeout(() => { shareLabel.textContent = 'Поделиться'; }, 2600);
  }

  async function shareResult() {
    if (!lastPlanet) return;
    track('shareClick');
    const data = shareData();
    if (navigator.share) {                                   // телефоны по https: системное окно
      try { await navigator.share(data); track('shareSent'); return; }
      catch (e) { if (e && e.name === 'AbortError') return; /* закрыл окно — не ошибка; иначе копируем */ }
    }
    const text = `${data.title}\n${data.text}\n${data.url}`;   // компьютер или http: копируем текст со ссылкой
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (_) { ok = legacyCopy(text); }
    if (ok) track('shareSent');
    flashShare(ok ? 'Ссылка скопирована' : 'Не удалось скопировать');
  }

  function showGifts(copied = false) {
    setCopyState(copied ? 'done' : 'idle');
    setHash(copied ? 'gifts-copied' : 'gifts');
    showView('gifts');
  }

  /* ------------------------------ маршруты (#start, #q1…, #result-home…, #gifts) ------------------------------ */
  function go(route, opts) {
    let m;
    if ((m = /^q(\d+)$/.exec(route)) && +m[1] >= 1 && +m[1] <= QUESTIONS.length) { startGame(+m[1] - 1); return; }
    if ((m = /^result-(\w+)$/.exec(route))) {
      const name = Object.keys(PLANETS).find((n) => PLANETS[n].key === m[1]);
      if (name) { showResult(name); return; }
    }
    if (route === 'gifts' || route === 'gifts-copied') { showGifts(route === 'gifts-copied'); return; }
    showView('start', opts);
  }

  $('#btn-start').addEventListener('click', () => { track('startClick'); startGame(0); });
  $('#btn-gifts').addEventListener('click', () => { track('giftsClick'); showGifts(false); });
  $('#btn-again').addEventListener('click', () => { track('restartClick'); startGame(0); });
  $('#rules-link').addEventListener('click', () => track('rulesClick'));
  $('#btn-share').addEventListener('click', shareResult);
  $('#btn-back').addEventListener('click', () => {
    track('backClick');
    if (lastPlanet) { showResult(lastPlanet); } else { setHash('start'); showView('start'); }
  });
  $('#book-link').addEventListener('click', () => track('bookClick'));
  screen.addEventListener('choose', (e) => track('q' + e.detail.question + 'Answer'));
  copyBtn.addEventListener('click', copyPromo);
  $('#btn-copy-icon').addEventListener('click', copyPromo);
  $('#rules-link').href = LINKS.rules;
  $('#book-link').href = LINKS.book;
  codeEl.textContent = PROMO.code;
  window.addEventListener('hashchange', () => go(location.hash.slice(1)));

  /* ------------------------------ запуск ------------------------------ */
  resize();
  new ResizeObserver(resize).observe(document.body);
  preloadQuestion(0);
  go(location.hash.slice(1), { focus: false });
})();
