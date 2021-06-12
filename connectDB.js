require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Connected to mongoDB Atlas Successfully!!");
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
}

connectDB();

const schema = new mongoose.Schema({
  longUrl: { type: String },
  shortCode: { type: String },
  tinyUrl: { type: String },
  date: { type: String },
});

const Uri = mongoose.model("Uri", schema);

module.exports = Uri;