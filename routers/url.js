const router = require('express').Router();
const Uri = require("../connectDB");

// method: GET , sendng req in url paramters
router.get("/:code", async(req, res)=>{
    try {
        const shortCode = req.params.code;
        const url = await Uri.findOne({ shortCode });
        if(url){
            res.redirect(url.longUrl);
        } else {
            res.status(400).json({
                status: "failure",
                message: "No such url found"
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error");
    }
})

module.exports = router;