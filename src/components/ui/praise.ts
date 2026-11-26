import { pick } from '../../engine/random';

const GOOD = ['Мяу-отлично!', 'Супер!', 'Ты умничка!', 'Пурр-фектно!', 'Великолепно!', 'Так держать!', 'Ура!', 'Котик гордится тобой!'];
const BAD = ['Почти получилось!', 'Ничего страшного!', 'Попробуем запомнить!', 'Ошибаться — нормально!'];
const EN_GOOD = ['Great!', 'Well done!', 'Super!', 'Awesome!', 'Good job!'];

export const praise = () => pick(GOOD);
export const comfort = () => pick(BAD);
export const praiseEn = () => pick(EN_GOOD);
