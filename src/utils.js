const mapRequestToDatabaseFormat = (user) => {
    return {
      id: user.id,
      "E-mail": user.email,
      "Data de Cadastro": user.Datacadastro,
      ...user,
    };
  };
  
  const formatUsersResponse = (users) => {
    return users.map((user) => {
      const { "E-mail": email, "Data de Cadastro": Datacadastro, ...rest } = user;
      return { email, Datacadastro, ...rest };
    });
  };
  
  module.exports = { mapRequestToDatabaseFormat, formatUsersResponse };
  