// https://returnstring.com/articles/puppeteer-elements-and-values
// https://stackoverflow.com/questions/64578952/puppeteer-returns-empty-objects

// make it so that your data object looks like that :

/*
{
  articleTitle: 'The best vegan restaurants in Sydney',
  articleDate: 'Tuesday 26 April 2022',
  restaurants: [
    'Gigi Pizzeria',
    'Lonely Mouth',
    "Mary's CQ",
    'Comeco Foods',
    'Yellow',
    "Peppe's",
    'Shift Eatery',
    'Otto Ristorante Sydney',
    "Mark and Vinny's Spaghetti and Spritz Bar",
    'Bad Hombres',
    'Alibi Bar and Dining',
    'Bodhi Restaurant Bar',
    'Little Turtle',
    "Yulli's",
    'Golden Lotus',
    'The Green Lion',
    'Soul Burger Glebe',
    'Funky Pies'
  ]
}
*/

const puppeteer = require('puppeteer');

async function scrape() {
  const data = {};

  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  await page.goto(
    'https://www.timeout.com/sydney/restaurants/the-best-vegan-restaurants-in-sydney'
  );

  data.articleTitle = await page.evaluate(
    (el) => el.textContent,
    await page.$('h1')
  );
  data.articleDate = await page.evaluate(
    (el) => el.textContent,
    await page.$('time')
  );
  data.restaurants = await page.evaluate(() =>
    Array.from(document.querySelectorAll('._h3_cuogz_1'), (element) =>
      element.textContent.replace(/(\d+\.\s)/g, '')
    )
  );

  console.log(data);
  browser.close();
}
scrape();
