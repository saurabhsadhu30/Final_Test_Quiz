const { protect } = require("../controllers/authController");
const { dashboard } = require("../controllers/dashboardController");

const router = require("express").Router();

router.get("/", protect, dashboard);

module.exports = router;
