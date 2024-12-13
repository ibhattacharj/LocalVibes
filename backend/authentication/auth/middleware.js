const factoryResponse = (status, message) => ({ status, message });

//Create a middleware function that checks if the user is authenticated
const isAuthenticated = (req, res, next) => {
  return req.isAuthenticated()
    ? next()
    : res.status(401).json(factoryResponse(401, "Unauthorized"));
};

module.exports = { isAuthenticated };