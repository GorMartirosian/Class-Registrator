const Table = require("./Table");

/* Deep check of two object equality (NOT IDENTITY)*/
const deepEqual = (() => {
  function initializeTable() {
    let opTable = new Table();
    opTable.set("array", "array", (arr1, arr2) => {
      if (arr1.length !== arr2.length) {
        return false;
      }
      for (let nth = 0; nth < arr1.length; nth++) {
        if (!deepEqual(arr1[nth], arr2[nth])) {
          return false;
        }
      }
      return true;
    });
    opTable.set("date", "date", (date1, date2) => {
      return date1.getTime() === date2.getTime();
    });
    opTable.set("function", "function", (f1, f2) => f1 == f2);
    opTable.set("object", "object", (obj1, obj2) => {
      let keys = Object.keys(obj1);

      if (keys.length !== Object.keys(obj2).length) {
        return false;
      }

      for (let key of keys) {
        if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
          return false;
        }
      }
      return true;
    });
    return opTable;
  }
  const operationTable = initializeTable();
  return function (obj1, obj2) {
    // compare the references
    if (obj1 === obj2) {
      return true;
    }

    //if both are primitive
    if (!(obj1 instanceof Object) && !(obj2 instanceof Object)) {
      return obj1 === obj2;
    }

    let firstObjType = getType(obj1);
    let secondObjType = getType(obj2);

    if (firstObjType !== secondObjType) {
      return false;
    }
    return operationTable.get(firstObjType, secondObjType)(obj1, obj2);
  };
})();

function isSubObject(obj1, obj2) {
  let keys = Object.keys(obj1);

  if (keys.length > Object.keys(obj2).length) {
    return false;
  }

  for (let key of keys) {
    if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

function getType(obj) {
  if (Array.isArray(obj)) {
    return "array";
  } else if (obj instanceof Date) {
    return "date";
  } else if (typeof obj === "function") {
    return "function";
  } else if (obj instanceof Object) {
    return "object";
  } else {
    // Add other types if needed
    return "unknown";
  }
}

function testResults(calculation, result) {
  console.log(`The function returned : ${calculation}`); //\nShould be : ${result}`);
}

module.exports = { deepEqual, getType, isSubObject };