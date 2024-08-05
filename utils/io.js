const readline = require("readline");

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (input) => {
      rl.close();
      resolve(input);
    });
  });
}

async function getUserInput(message) {
  return await askQuestion(message);
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

module.exports = { getUserInput, getClassesToRegister };
