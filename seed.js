const axios = require("axios");
const { addOrUpdateUser } = require("./dynamo");

const seedInicialUsers = async () => {
  const url =
    "https://3ji5haxzr9.execute-api.us-east-1.amazonaws.com/dev/caseYolo";
  try {
    const users = await axios.get(url);
    const inicialUserPromises = JSON.parse(users.data.body).clientes.map(
      (user, i) => {
        addOrUpdateUser({ ...user, id: i + "",inicial:true });
      }
    );
    await Promise.all(inicialUserPromises);
  } catch (error) {
    console.error(error);
  }
};

seedInicialUsers();
