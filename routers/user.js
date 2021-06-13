require("dotenv").config();
const router = require("express").Router();
const shortid = require("shortid");
const validUrl = require("valid-url");
const Uri = require("../connectDB");

router.post("/shrink", async (req, res) => {
  const { longUrl } = req.body;
  if (!validUrl.isUri(longUrl)) {
    return res.status(401).json({
      status: "failure",
      message: "Invalid Url",
    });
  }

  const shortCode = shortid.generate();
  const baseUrl = process.env.BASE_URL;
  if (validUrl.isUri(baseUrl)) {
    try {
      let response = await Uri.findOne({ longUrl });
      if (response) {
        return res.json(response);
      } else {
        const tinyUrl = baseUrl + "/" + shortCode;
        response = new Uri({
          longUrl,
          shortCode,
          tinyUrl,
          date: Date(),
        });
        await response.save();
        return res.json(response);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("Server error");
    }
  } else {
    res.status(401).json("Invalid long url");
  }
});

module.exports = router;
