function isAdmin(req, res, next) {
  // this function will be called after the authoriastion web token function
  // so the req.user will have the paylod (id and isAdmin) of the current user
  if (!req.user.isAdmin)
    return res.status(403).send("Access denied, you're not Admin !");

  next();
}

module.exports = isAdmin;
