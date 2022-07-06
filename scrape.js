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

const mainPage =
  'https://www.timeout.com/sydney/restaurants/the-best-vegan-restaurants-in-sydney';

async function scrape() {
  const data = {};

  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  await page.goto(mainPage);

  data.title = await page.$eval('h1', (el) => el.textContent);
  data.date = await page.$eval('time', (el) => el.textContent);

  /*
  data.restaurants = await page.evaluate(() =>
    Array.from(document.querySelectorAll('._h3_cuogz_1'), (element) =>
      element.textContent.replace(/(\d+\.\s)/g, '')
    )
  );
  */

  const visitRestaurant = async ({ name, link }) => {
    const detailPage = await browser.newPage();
    await detailPage.goto(link);
    const description = await detailPage.$eval(
      '#content p',
      (el) => el.textContent
    );
    const rating = await detailPage.$$eval(
      '._star_k40fn_15._filled_k40fn_19',
      (el) => el.length
    );
    const address = await detailPage.$$eval(
      '[data-section="details"] ._list_1fhdc_5 dd',
      (els) =>
        Array.from(els)
          .map((el) => el.textContent)
          .join(' - ')
    );

    const restaurantInfo = {
      name,
      description,
      address,
    };

    if (rating) restaurantInfo.rating = rating / 2;

    return restaurantInfo;
  };

  /*
  const restaurants = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.tile'), (a) => ({
      name: a.querySelector('h3').textContent.replace(/(\d+\.\s)/g, ''),
      link: a.querySelector('._a_12eii_1').href,
    }))
  );
  */

  data.restaurants = await Promise.all(restaurants.map(visitRestaurant));

  console.log(data);
  browser.close();
}
scrape();
