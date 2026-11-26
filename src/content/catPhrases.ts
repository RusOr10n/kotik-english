import type { Phrase } from './types';

/** Что котик говорит, когда его тапают в домике */
export const CAT_TAP_PHRASES: Phrase[] = [
  { en: 'Meow! I love my home!', ru: 'Мяу! Я люблю свой домик!' },
  { en: 'Hello! How are you?', ru: 'Привет! Как дела?' },
  { en: 'Let’s play!', ru: 'Давай поиграем!' },
  { en: 'Fish, please!', ru: 'Рыбку, пожалуйста!' },
  { en: 'You are my best friend!', ru: 'Ты мой лучший друг!' },
  { en: 'Purr... I like it!', ru: 'Мур-р... Мне нравится!' },
  { en: 'Hee-hee! That tickles!', ru: 'Хи-хи! Щекотно!' },
  { en: 'Look at me!', ru: 'Посмотри на меня!' },
  { en: 'I want to sleep.', ru: 'Я хочу спать.' },
  { en: 'Let’s learn English!', ru: 'Давай учить английский!' },
  { en: 'You are so clever!', ru: 'Ты такая умница!' },
  { en: 'I like milk!', ru: 'Я люблю молоко!' },
  { en: 'What a nice day!', ru: 'Какой хороший день!' },
  { en: 'Pet me again!', ru: 'Погладь меня ещё!' },
];

/** Случайная фраза, но не та же, что была только что */
export function randomCatPhrase(previous?: Phrase | null): Phrase {
  const pool = CAT_TAP_PHRASES.filter((p) => p !== previous);
  return pool[Math.floor(Math.random() * pool.length)];
}
