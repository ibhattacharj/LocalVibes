const factoryResponse = (status, message) => ({ status, message });

const isAuthenticated = (req, res, next) => {
  return req.isAuthenticated()
    ? next()
    : res.status(401).json(factoryResponse(401, "Unauthorized"));
};

module.exports = { isAuthenticated };