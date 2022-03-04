const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://mina412:minaahmadi77@project.itbja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const movieSchema = new mongoose.Schema(
    {
        "Id": {
          "type": "Number"
        },
        "name": {
          "type": "String"
        },
        "director": {
          "type": "String"
        },
        "poster": {
          "type": "String"
        }
      }
    );
module.exports = mongoose.model("movie",movieSchema)