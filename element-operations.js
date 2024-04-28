const { timeout } = require("puppeteer");
const utils = require("./utils/objUtils");

/* An asynchronous function, which moves the cursor to the middlepoint of the element box. */
async function moveCursorOntoElement(page, element) {
  throwIfNull(element, "Cannot move the cursor because the element is null!");
  const boundingBox = await element.boundingBox();
  throwIfNull(boundingBox, "There is no bounding box!");
  // Calculate the coordinates for the resting position (center of the element)
  const x = boundingBox.x + boundingBox.width / 2;
  const y = boundingBox.y + boundingBox.height / 2;

  // Move the mouse to the resting position
  page.mouse.move(x, y);
}

function throwIfNull(element, message = "Element is null!") {
  if (element === null) {
    throw new Error(message);
  }
}

async function handleInnerText(page, handle) {
  throwIfNull(element);
  return (await elementInfo(page, handle)).innerText;
}

async function handleTag(page, handle) {
  throwIfNull(handle);
  return (await elementInfo(page, handle)).tagName;
}

async function className(page, handle) {
  throwIfNull(handle);
  return (await elementInfo(page, handle)).tagName;
}

async function link(page, handle) {
  throwIfNull(handle);
  return (await elementInfo(page, handle)).href;
}

/* Clicks on the element even if it is not visible.*/
async function click(handle) {
  throwIfNull(handle);
  handle.evaluate((el) => el.click());
}

async function type(page, selector, text) {
  await page.waitForSelector(selector, { timeout: 4000 });
  await page.type(selector, text);
}

/* Gets a JSHandle object. Returns a promise of an object which contains attributes of the element. */
async function elementInfo(page, handle) {
  if (handle === null) {
    return "\nThe element is null.\n";
  }
  return page.evaluate((element) => {
    return {
      tagName: element.tagName,
      id: element.id,
      classList: element.classList,
      className: element.className,
      innerText: element.innerText,
      href: element.href,
    };
  }, handle);
}

function dismissUpcomingAlerts(page) {
  page.on("dialog", async (dialog) => {
    console.log(`Blocked alert: ${dialog.message()}`);
    await dialog.dismiss();
  });
}

/* Returns an array of all subelements*/
async function enumSubhandles(handle) {
  throwIfNull(handle);
  return handle.$$("*");
}

async function map(operation, elements) {
  return Promise.all(elements.map(operation));
}

async function filterElements(predicate, elements) {
  let filtered = [];
  for (let nth = 0; nth < elements.length; nth++) {
    if (await predicate(elements[nth])) {
      filtered.push(elements[nth]);
    }
  }
  return filtered;
}

//The search object should contain: tags - all uppercase, hrefs - full path
async function findHandlesBy(page, topmostHandle, searchObj) {
  return await enumSubhandles(topmostHandle)
    .then((subHandles) => {
      return map(
        async (hndl) => [hndl, await elementInfo(page, hndl)],
        subHandles
      );
    })
    .then((handleAndInfoPairs) => {
      return filterElements((pair) => {
        let elmInfo = pair[1];
        return utils.isSubObject(searchObj, elmInfo);
      }, handleAndInfoPairs);
    })
    .then((filteredPairs) => {
      return map((pair) => pair[0], filteredPairs); // separate handles from element info and return
    });
}

module.exports = {
  moveCursorOntoElement,
  dismissUpcomingAlerts,
  elementInfo,
  click,
  map,
  filterElements,
  findHandlesBy,
  handleTag,
  handleInnerText,
  className,
  enumSubhandles,
  link,
  type,
};
