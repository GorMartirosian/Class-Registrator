let obj = { c: 12, d: 123 };

let a = Object.keys(obj);
console.log(a)
for (let key in a) {

  console.log(obj[key]);
}
