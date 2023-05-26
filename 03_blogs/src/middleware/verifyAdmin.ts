const verifyAdmin = (req, res, next) => {
  if (req.user.role === "user") {
    throw new Error("Not Authorized");
  }
  next();
};

export default verifyAdmin;
