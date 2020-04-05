const mongoose = require("mongoose");
const config = require("config");
let ar = config.has("mongoURI");
console.log(ar);
// const db = config.get('mongoURI');

const db =
  "mongodb+srv://cheg:Iddqtkfa@cluster0-skzfz.mongodb.net/test?retryWrites=true&w=majority";

<<<<<<< HEAD

 const db= "";

mongoose.connect(db,{
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true


=======
mongoose.connect(db, {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
>>>>>>> get All Profiles
});
const connectDB = async () => {
  try {
    console.log("MongoDB Connected.....");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
<<<<<<< HEAD
}
}
=======
  }
};
>>>>>>> get All Profiles
module.exports = connectDB;
