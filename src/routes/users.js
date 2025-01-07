
const express = require("express");
const router = express.Router();
const { validateUserType } = require("../middleware")
const {
  getUsers,
  getUserByid,
  addOrUpdateUser,
  deleteUser,
  getUserByType,
} = require("../../dynamo");
const { mapRequestToDatabaseFormat, formatUsersResponse } = require("../utils.js");

router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(formatUsersResponse(users.Items));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await getUserByid(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/filter/:tipo", validateUserType, async (req, res, next) => {
  const { tipo } = req.params;
  try {
    const users = await getUserByType(tipo);
    if (users.Items.length === 0) {
      return res.status(404).json({ err: "Nenhum usuário encontrado." });
    }
    res.json(formatUsersResponse(users.Items));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const user = req.body;
  try {
    const formattedUser = mapRequestToDatabaseFormat(user);
    const newUser = await addOrUpdateUser(formattedUser);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const user = { ...req.body, id };
  try {
    const updatedUser = await addOrUpdateUser(user);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.json({ message: "Usuário deletado com sucesso." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
