require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const translateNews = require('./translate');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/news/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Выберите категорию', {
    reply_markup: {
      inline_keyboard: [

        [
          {
            text: 'Бизнес',
            callback_data: 'business',
          },
          {
            text: 'Общие новости',
            callback_data: 'home',
          },
        ],
        [

          {
            text: 'Тем временем',
            callback_data: 'meanwhile',
          },

          {
            text: 'Все новости',
            callback_data: 'news',
          },

          {
            text: 'Климат',
            callback_data: 'climate',
          },
        ],

      ],
    },
  });
});

bot.on('callback_query', (query) => {
  const id = query.message.chat.id;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'russian-news.p.rapidapi.com',
      'X-RapidAPI-Key': '536732658bmsh829e1461c2b76adp1e7430jsnb0f3070f1ae6',
    },
  };

  async function newNews() {
    const response = await fetch('https://russian-news.p.rapidapi.com/news', options);

    if (response.ok) {
      const res = await response.json();
      const resTheme = res.filter((item) => item.source === query.data);
      function randomInteger(min, max) {
        const rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
      }
      const f = (arr) => {
        const randNum = randomInteger(0, resTheme.length);
        if (!arr[randNum]?.title) {
          return f(arr);
        } return arr[randNum];
      };
      const result = f(resTheme);

      const tr = await translateNews(result.title + result.description);
      const md = `
      ${tr.text} 
      ${result.image}   
      `;
      bot.sendMessage(id, md);
    } else {
      console.log(err);
    }
  }
  newNews(options);
});

