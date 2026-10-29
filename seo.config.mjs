// seo.config.mjs
// Настройки для поисковиков и роботов: используются при сборке (scripts/prerender.mjs).
// Здесь только публичные данные. Секретов нет.

export const seo = {
  // Адрес сайта без слеша в конце: от него строятся canonical, карта сайта и превью ссылок
  siteUrl: 'https://dvbstudio.ru',

  siteName: 'dvb studio',
  locale: 'ru_RU',

  // Заголовок вкладки и поисковой выдачи (до ~60 символов) и описание (до ~160 символов)
  title: 'Дмитрий — Full-Stack разработчик | dvb studio',
  description:
    'Независимый full-stack разработчик Дмитрий: React, TypeScript, NestJS, PostgreSQL, Docker. Интерфейсы, API и автодеплой от идеи до production. Проекты: DVMail, DVChat.',

  // Кто это (для структурированных данных «Человек»)
  person: {
    name: 'Дмитрий',
    alternateName: 'dvb studio',
    jobTitle: 'Full-Stack разработчик',
  },

  // Коды подтверждения прав на сайт. Получаются в Яндекс.Вебмастере и Google Search Console.
  // Код не секрет, но пока поля пустые, метатеги не выводятся.
  verification: {
    yandex: '',
    google: '',
  },
}
