const express = require("express");
const router = express.Router();
const userRoute = require("./UserRoute");
const authRoute = require("./AuthRoute");
const ApiError = require("../app/middlewares/ApiError");
const httpStatus = require("http-status");

const defaultRoutes = [
  {
    path: "/api/v1/user",
    route: userRoute,
  },
  {
    path: "/api/v1/auth",
    route: authRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// health check
router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

router.all("*", () => {
  throw new ApiError(httpStatus.NOT_FOUND, "Route not found");
});

module.exports = router;
