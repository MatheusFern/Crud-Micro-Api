const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/users");
const { errorHandler } = require("./src/middleware");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/users", userRoutes);
app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});
app.use(errorHandler);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});

module.exports = app;