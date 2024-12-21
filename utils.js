function mapRequestToDatabaseFormat(requestData) {
    const preJSON = {
      nome: "Nome",
      telefone: "Telefone",
      email: "E-mail",
      Tipo: "Tipo",
      registrationDate: "Data de Cadastro",
      inicial: "inicial"
    };
  
    const mappedJSON = {};
    for (const key in requestData) {
      if (preJSON[key]) {
        mappedJSON[preJSON[key]] = requestData[key];
      }
    }
    return mappedJSON;
  }

module.exports ={
    mapRequestToDatabaseFormat
}