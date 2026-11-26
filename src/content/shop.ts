export type Slot = 'hat' | 'glasses' | 'neck' | 'back';

export type Fur = {
  id: string;
  name: string;
  base: string;
  dark: string;
  belly: string;
  stripes?: boolean;
  price: number;
};

export const FURS: Fur[] = [
  { id: 'ginger', name: 'Рыжий', base: '#f6a04d', dark: '#d9762b', belly: '#ffe2c2', stripes: true, price: 0 },
  { id: 'gray', name: 'Серый', base: '#a3adb8', dark: '#7d8793', belly: '#eef1f4', stripes: true, price: 0 },
  { id: 'black', name: 'Чёрный', base: '#3b3a44', dark: '#25242c', belly: '#5b5a66', price: 0 },
  { id: 'white', name: 'Белый', base: '#fbf7f0', dark: '#e3dacb', belly: '#ffffff', price: 0 },
  { id: 'cream', name: 'Кремовый', base: '#f3d9b1', dark: '#ddb98a', belly: '#fff3e1', price: 0 },
  { id: 'lilac', name: 'Сиреневый', base: '#c7a8f0', dark: '#a47fd9', belly: '#efe4ff', price: 60 },
  { id: 'mint', name: 'Мятный', base: '#9de3c8', dark: '#6cc6a5', belly: '#e3fbf1', price: 60 },
  { id: 'pinky', name: 'Розовый', base: '#f7a8c8', dark: '#e57fab', belly: '#ffe6f0', price: 60 },
  { id: 'sky', name: 'Небесный', base: '#9cc9f5', dark: '#6ea6e0', belly: '#e6f3ff', stripes: true, price: 80 },
  { id: 'gold', name: 'Золотой', base: '#ffd24a', dark: '#e8a91c', belly: '#fff4c4', stripes: true, price: 150 },
  { id: 'peach', name: 'Персиковый', base: '#ffc3a0', dark: '#f29b74', belly: '#fff0e6', price: 60 },
  { id: 'chocolate', name: 'Шоколадный', base: '#8d5b3f', dark: '#6b4029', belly: '#c79c7f', stripes: true, price: 70 },
  { id: 'silver', name: 'Серебристый', base: '#d4dbe3', dark: '#9aa8b8', belly: '#f6f8fa', stripes: true, price: 90 },
  { id: 'lemon', name: 'Лимонный', base: '#fff176', dark: '#f6d743', belly: '#fffde7', price: 80 },
  { id: 'night', name: 'Звёздная ночь', base: '#3f4a8a', dark: '#7b88d8', belly: '#6c78c4', stripes: true, price: 200 },
  // Премиальные окрасы
  { id: 'ruby', name: 'Рубиновый', base: '#e0475f', dark: '#a8233c', belly: '#ffd6de', stripes: true, price: 250 },
  { id: 'emerald', name: 'Изумрудный', base: '#3fbf8a', dark: '#1f8a60', belly: '#d4f7e8', stripes: true, price: 280 },
  { id: 'royal', name: 'Королевский', base: '#7b4fc9', dark: '#ffd23f', belly: '#e9dcff', stripes: true, price: 350 },
];

export const FUR_BY_ID: Record<string, Fur> = Object.fromEntries(FURS.map((f) => [f.id, f]));

export type Item = { id: string; slot: Slot; name: string; price: number };

export const ITEMS: Item[] = [
  { id: 'bow', slot: 'neck', name: 'Бантик', price: 20 },
  { id: 'bell', slot: 'neck', name: 'Колокольчик', price: 25 },
  { id: 'scarf', slot: 'neck', name: 'Шарфик', price: 35 },
  { id: 'flower', slot: 'hat', name: 'Цветочек', price: 25 },
  { id: 'party', slot: 'hat', name: 'Колпачок', price: 30 },
  { id: 'beret', slot: 'hat', name: 'Берет', price: 40 },
  { id: 'wizard', slot: 'hat', name: 'Шляпа волшебника', price: 60 },
  { id: 'crown', slot: 'hat', name: 'Корона', price: 90 },
  { id: 'round', slot: 'glasses', name: 'Круглые очки', price: 30 },
  { id: 'heart', slot: 'glasses', name: 'Очки-сердечки', price: 40 },
  { id: 'star', slot: 'glasses', name: 'Очки-звёздочки', price: 50 },
  { id: 'cape', slot: 'back', name: 'Плащ супергероя', price: 70 },
  { id: 'cap', slot: 'hat', name: 'Кепка', price: 30 },
  { id: 'bunny', slot: 'hat', name: 'Ушки зайчика', price: 45 },
  { id: 'chef', slot: 'hat', name: 'Колпак повара', price: 40 },
  { id: 'cowboy', slot: 'hat', name: 'Ковбойская шляпа', price: 55 },
  { id: 'pirate', slot: 'hat', name: 'Пиратская шляпа', price: 65 },
  { id: 'santa', slot: 'hat', name: 'Новогодний колпак', price: 50 },
  { id: 'headphones', slot: 'hat', name: 'Наушники', price: 70 },
  { id: 'unicorn', slot: 'hat', name: 'Рог единорога', price: 100 },
  { id: 'halo', slot: 'hat', name: 'Нимб ангела', price: 120 },
  { id: 'sun', slot: 'glasses', name: 'Тёмные очки', price: 35 },
  { id: 'nerd', slot: 'glasses', name: 'Очки отличника', price: 30 },
  { id: 'monocle', slot: 'glasses', name: 'Монокль', price: 60 },
  { id: 'mask', slot: 'glasses', name: 'Маска героя', price: 55 },
  { id: 'bowtie', slot: 'neck', name: 'Бабочка', price: 25 },
  { id: 'tie', slot: 'neck', name: 'Галстук', price: 30 },
  { id: 'bandana', slot: 'neck', name: 'Бандана', price: 30 },
  { id: 'pearls', slot: 'neck', name: 'Бусы', price: 50 },
  { id: 'medal', slot: 'neck', name: 'Медаль чемпиона', price: 80 },
  { id: 'balloon', slot: 'back', name: 'Воздушный шарик', price: 40 },
  { id: 'butterfly', slot: 'back', name: 'Крылья бабочки', price: 90 },
  { id: 'angel', slot: 'back', name: 'Крылья ангела', price: 110 },
  { id: 'jetpack', slot: 'back', name: 'Реактивный ранец', price: 150 },
  // Премиальные вещи
  { id: 'tiara', slot: 'hat', name: 'Тиара принцессы', price: 250 },
  { id: 'diamondcrown', slot: 'hat', name: 'Бриллиантовая корона', price: 400 },
  { id: 'rainbowglasses', slot: 'glasses', name: 'Радужные очки', price: 260 },
  { id: 'locket', slot: 'neck', name: 'Золотой медальон', price: 270 },
  { id: 'dragon', slot: 'back', name: 'Крылья дракона', price: 320 },
  { id: 'rainbow', slot: 'back', name: 'Радуга', price: 450 },
];

export const SLOT_NAMES: Record<Slot, string> = {
  hat: 'Голова',
  glasses: 'Очки',
  neck: 'Шея',
  back: 'Спина',
};
