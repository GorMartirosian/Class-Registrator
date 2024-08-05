const puppeteer = require("puppeteer");
const opLib = require("./element-operations");
const io = require("./utils/io");
const { toTitleCase } = require("./utils/str-manipulation");
const { getRandomNumber } = require("./utils/num-manipulation");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  // const userLogin = await io.getUserInput(
  //   "Your Jenzabar mail (or login idc): "
  // );
  // const userPassword = await io.getUserInput(
  //   "Your Jenzabar password (I won't steal it): "
  // );
  // const classesToRegister = await io.getClassesToRegister();
  // const userName = toTitleCase(await io.getUserInput("Your name: "));
  // const userSurname = toTitleCase(await io.getUserInput("Your surname: "));

  //MOCK SAMPLES
  const userLogin = "gor_martirosyan@edu.aua.am";
  const userPassword = "200218";
  const classesToRegister = ["ESS101", "FND102"];
  const userName = "Gor";
  const userSurname = "Martirosyan";

  const page = await browser.newPage();
  await page.goto("https://auasonis.jenzabarcloud.com/");
  opLib.dismissUpcomingAlerts(page);

  while (await loginPageNotLoaded(page)) {
    await page.reload();
  }

  //login button
  await page.locator("a ::-p-text(LOGIN)").hover();
  await page.locator("div ::-p-text(Student)").click();

  await login(page, userLogin, userPassword, userName, userSurname);
  await openRegistrationPanel(page);

  //loop and register for each one
  //for each registration, notify the user
})();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getClassesToRegister() {
  return (
    await io.getUserInput(
      "Type the classes you want to register separated by COMAS (,)(Example: CS121 , ESS101 ,..., FND101 ):\n\n"
    )
  )
    .replace(/\s+/g, "")
    .split(",")
    .map((className) => className.toUpperCase());
}

async function loginPageNotLoaded(page) {
  return !(await checkIfElementExists(
    page,
    'a[href*="studsect"]',
    getRandomNumber(3000, 5000)
  ));
}

async function checkIfElementExists(page, selector, timeout = 3000) {
  try {
    await page.waitForSelector(selector, {
      timeout: timeout,
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function isTextVisible(page, uniqueTextInsidePage, timeout = 3000) {
  return await checkIfElementExists(
    page,
    `::-p-xpath(//*[contains(text(), "${uniqueTextInsidePage}")])`,
    timeout
  );
}

async function login(page, login, password, name, surname) {
  const loginPrompt = "Repeat your login man : ";
  const passwordPrompt = "Repeat you password: ";
  let needToRepreatCredentials = false;
  while (true) {
    // if(needToRepreatCredentials){
    //let loginName = await io.getUserInput(loginPrompt); | will go down
    //console.log("\n");
    //let password = await io.getUserInput(passwordPrompt); | wiil go down
    // }
    await page.locator("#id_login").fill("gor_martirosyan@edu.aua.am");
    await page.locator("#id_pin").fill("200218");
    await opLib.click(await page.$("#Submit"));
    if (await checkLogin(page, name + " " + surname)) {
      console.log("Successfully logged in!");
      break;
    }
    console.log("\nWrong login or password, try again!\n");
    //needToRepreatCredentials = true;
  }
}

async function checkLogin(page, uniqueTextInsidePage) {
  return await isTextVisible(page, uniqueTextInsidePage);
}

async function openRegistrationPanel(page) {
  await page.locator("#sidebar > header").hover();
  await page.locator("a ::-p-text(Registration)").click();
}

//Returns boolean of wether the class was successfully registered or not.
async function registerForClass(page, className) {
  while (!(await isTextVisible(page, className, getRandomNumber(3000, 6000)))) {
    await page.reload();
  }

  await page.locator(`::-p-text(${className})`).hover();
  if (await checkIfElementExists(page, `a ::-p-text(${className})`)) {
    await page.locator(`a ::-p-text(${className})`).click();
    return true;
  }
  if (await checkIfElementExists(page, `button ::-p-text(${className})`)) {
    await page.locator(`button ::-p-text(${className})`).click();
    return true;
  }
  return false;
}

async function registerForClasses(page, classes) {
  while (classes.length !== 0) {
    for (let i = 0; i < classes.length; i++) {
      await sleep(getRandomNumber(4000, 8000));
      if (await registerForClass(page, classes[i])) {
        classes.splice(i, 1);
      }
    }
  }
  console.log("Registered for all the classes!");
}