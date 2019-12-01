import puppeteer from 'puppeteer';

export const getUserLastPics = async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`https://instagram.com/${req.params.username}/`);
  
    const imageLinks = await page.evaluate(() => {
      const links = [];
      const elements = document.querySelectorAll('a > div > div > img');
      for(const el of elements) {
        links.push(el.src)
      }
      return links;
    });
    
  res.status(200).send( { data: imageLinks.length ? imageLinks : 'no available data' } );
  await browser.close();

};

export const getUserProfilePic = async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://instagram.com/${req.params.username}/`);

  const profilePic = await page.evaluate(() => {
    const element = document.querySelector('header img');
    return element.src;
  })


  res.status(200).send( { data: profilePic ? profilePic : 'no available data' } );
  //await browser.close();

};

// export default { getUserLastPics, getUserProfilePic };