const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const client = require("./db/connectDB");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//rahim
//tcs1c59CpE7cdgOg
// Middleware
app.use(cors());
app.use(express.json());

// Routes 
app.get("/", (req, res) => {
  res.send("Online Learning Platform Server is Running");
});

// MongoDB connection
async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

   
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
