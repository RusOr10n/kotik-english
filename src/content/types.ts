export type Word = {
  id: string;
  en: string;
  ru: string;
  /** Эмодзи-картинка (или текст, например «11») */
  pic: string;
};

export type Phrase = {
  en: string;
  ru: string;
  /** грамматический пропуск: слово из фразы, которое нужно выбрать */
  gap?: string;
  /** варианты для пропуска (включая правильный), например ['am', 'is', 'are'] */
  choices?: string[];
};

export type Lesson = {
  id: string;
  title: string;
  /** id слов из словаря */
  words: string[];
  phrases: Phrase[];
  /** добавить в конец мини-игру «Поймай рыбку» */
  minigame?: boolean;
  /** правило для грамматических уроков: строки «english — перевод» или пояснения */
  rule?: string[];
};

export type Boss = {
  name: string;
  pic: string;
  story: string;
  winText: string;
  hp: number;
};

export type Friend = {
  name: string;
  fur: string;
  accessories: Partial<Record<'hat' | 'glasses' | 'neck' | 'back', string>>;
};

export type World = {
  id: string;
  name: string;
  pic: string;
  story: string;
  /** CSS-градиент фона */
  bg: string;
  accent: string;
  decor: string[];
  lessons: Lesson[];
  boss: Boss;
  friend: Friend;
  /** тема, загруженная родителем: всегда открыта */
  custom?: boolean;
};
