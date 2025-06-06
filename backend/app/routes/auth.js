const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../app/models/User");
const router = express.Router();

router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // i need to change this later
    });

    res.redirect(process.env.CLIENT_URL);
  }
);
router.get("/profile", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-__v -createdAt -googleId")
      .lean();

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Profile route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
