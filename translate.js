const fetch = require('node-fetch');

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'just-translated.p.rapidapi.com',
		'X-RapidAPI-Key': '536732658bmsh829e1461c2b76adp1e7430jsnb0f3070f1ae6'
	}
};

async function translateNews(text) {
  const response = await fetch(`https://just-translated.p.rapidapi.com/?lang=ru&text=${text}`, options)
  if (response.ok) {
    const trans = await response.json();
    return trans
  } else {
    console.log(err);
  }
}

translateNews();
module.exports = translateNews;
