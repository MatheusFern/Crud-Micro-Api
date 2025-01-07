const tiposValidos = ["Hóspede", "Fornecedor", "Operador", "Proprietário"];

const validateUserType = (req, res, next) => {
  const { tipo } = req.params;
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ err: "Tipo inválido." });
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ err: "Erro interno do servidor." });
};

module.exports = { validateUserType, errorHandler };
