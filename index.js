
const express = require("express");
const app = express();
const cors = require("cors");
const {
  getUsers,
  getUserByid,
  addOrUpdateUser,
  deleteUser,
  getUserByType
} = require("./dynamo");
const {mapRequestToDatabaseFormat } = require("./utils")

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" })
});

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    const formattedUsers = users.Items.map((user) => ({
      email: user["E-mail"],
      Datacadastro: user["Data de Cadastro"],
      ...user,
    }));
    formattedUsers.forEach((user) => {
      delete user["E-mail"];
      delete user["Data de Cadastro"];
    });
    res.json(formattedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Ih, deu ruim" });
  }
});
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const users = await getUserByid(id);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Ih, deu ruim" });
  }
});
app.get("/users/filter/:tipo", async (req, res) => {
  const tipo = req.params.tipo
  
  const tipos = ["Hóspede", "Fornecedor", "Operador", "Proprietário"]
  if (!tipos.includes(tipo)) {
    return res.status(400).json({ err: "Tipo inválido" });
  }
  try {
    const users = await getUserByType(tipo);
    if (users.length === 0) {
      return res.status(404).json({ err: "Nenhum usuário encontrado para o tipo especificado" });
    }
    const formattedUsers = users.Items.map((user) => ({
      email: user["E-mail"],
      Datacadastro: user["Data de Cadastro"],
      ...user,
    }));
    formattedUsers.forEach((user) => {
      delete user["E-mail"];
      delete user["Data de Cadastro"];
    });
    res.json(formattedUsers);
  } catch (error) {
    console.error(`Erro ao filtrar usuários por tipo ${tipo}:`, error);
    res.status(500).json({ err: "Ih, deu ruim" });
  }

})
app.post("/users", async (req, res) => {
  const user = req.body;
  try {
    const formatJSON = mapRequestToDatabaseFormat(user)
    const newUser = await addOrUpdateUser(formatJSON);
    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Ih, deu ruim" });
  }
});
app.put("/users/:id", async (req, res) => {
  const user = req.body;
  const { id } = req.params;
  user.id = id;
  try {
    const updatedUser = await addOrUpdateUser(user);
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Ih, deu ruim" });
  }
});
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deleteUser(id));
  } catch (error) {
    console.err(error);
    res.status(500).json({ err: "Ih, deu ruim" });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => [console.log(`escutando na porta`, port)]);

module.exports = app
