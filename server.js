const express = require("express");
const app = express();
const connectDB = require('./config/DB');


connectDB();

//init Middleware
app.use(express.json({
  extended: false
}))


app.get("/", (req, res) => {
  res.send("Api Running");
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 6000;


app.listen(PORT, () => {
  console.log(`server is on port ${PORT}`);
});