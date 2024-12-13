const factoryResponse = (status, message) => ({ status, message });

//middleware function to validate authorization 
const isAuthenticated = (req, res, next) => {
  return req.isAuthenticated()
    ? next()
    : res.status(401).json(factoryResponse(401, "Unauthorized"));
};

module.exports = { isAuthenticated };
