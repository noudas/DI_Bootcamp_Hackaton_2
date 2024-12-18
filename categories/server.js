const express = require("express");

const cors = require("cors");
const {catRouter}= require('./routes/catRouter.js')
const app = express();

app.use(cors());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`run on ${PORT}`);
});


app.use(express.json());
app.use(catRouter)