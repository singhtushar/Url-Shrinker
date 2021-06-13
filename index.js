const express = require('express');
const mongoose = require('mongoose');
const { message } = require('statuses');
const shortid = require('shortid');
const validUrl = require("valid-url");
const path = require("path")
const ejs = require("ejs");
const Uri = require('./connectDB');
require("dotenv").config();

const app = express();

app.use(express.json({ extended: false })) // for parsing json data in body
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "ejs");

app.use(express.static("public"));

// method: POST
app.post('/shrink', async (req, res) => {
    const { longUrl } = req.body;
    if (!validUrl.isUri(longUrl)) {
        return res.status(401).json({
            status: "failure",
            message: "Invalid Url"
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

})

// method: GET , sendng req in url paramters
app.get("/:code", async(req, res)=>{
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

app.get("/", (req, res)=>{
    res.render('index');
})

app.listen(process.env.PORT);