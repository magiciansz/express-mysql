// const ApiError = require("../utils/ApiError");
const catchAsync = require("../helpers/catchAsync");
const userService = require("../services/UserService");
const httpStatus = require("http-status");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
