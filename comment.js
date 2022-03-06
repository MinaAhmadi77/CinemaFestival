const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://mina412:minaahmadi77@project.itbja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const commentSchema = new mongoose.Schema(
    {
        "username": {
          "type": "String"
        },
        "movieid": {
          "type": "Number"
        },
        "text":{
          "type": "String" 
        }

      }
    );
module.exports = mongoose.model("comment",commentSchema)