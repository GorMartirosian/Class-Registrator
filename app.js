const puppeteer = require("puppeteer");
const operationsLib = require("./element-operations");
const io = require("./utils/io");
const { timeout } = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  const page = await browser.newPage();
  await page.goto("https://auasonis.jenzabarcloud.com/");
  //operationsLib.dismissUpcomingAlerts(page);

  //login button
  let loginHandle = await page.$('a[href*="studsect.cfm"]');
  await operationsLib.click(page, loginHandle);

  await login(page);
  await openRegistrationPanel(page);

  //get the classes to register from user
  //loop and register for each one
  //for each registration, notify the user
  
})();

async function login(page) {
  while (true) {
    //let jenzMail = await io.getUserInput("Your Jenzabar mail: ");
    await operationsLib.type(page, "#id_login", "gor_martirosyan@edu.aua.am");
    console.log("\n");
    //let jenzPassword = await io.getUserInput(
    //   "Your Jenzabar password (I won't steal it (tghu xosq)): "
    //);
    await operationsLib.type(page, "#id_pin", "200218");
    await operationsLib.click(page, await page.$("#Submit"));
    try {
      await page.waitForSelector("#sonis-portal-body-container", {
        timeout: 4000,
      });
      console.log("Successfully logged in!");
      break; // Exit the loop if login is successful
    } catch (error) {
      console.log("Wrong login or password, try again.\n");
    }
  }
}

async function openRegistrationPanel(page) {
  let academicsPanel = await page.$('#nmreg > a');
  await operationsLib.click(page, academicsPanel);
}

async function getClassesToRegister() {
  return (await io.getUserInput("PLease, type the classes you want to register(Ex. <!todo> )")).split(" ");
}

//Returns boolean of wether the class was successfully registered or not.
async function registerForClass(page, classSelector ) {
  //if no register button available return false
  //else 
  // click the register button
  // click the checkpoint button
  //return true 
}

async function registerForClasses(page, classes ){
  //while the classes are not empty
  //try to register
  //if successfully registered, pop the class from the array
  //else continue to the next class
}