const router = require("express").Router();

const { signup, login } = require("../controllers/authController");
const { checkBody } = require("../utils/helpers");

router.post(
  "/signup",
  checkBody(["name", "email", "password", "passwordConfirm"]),
  signup
);
router.post("/login", checkBody(["email", "password"]), login);

module.exports = router;
