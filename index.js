const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const client = require("./db/connectDB");
const { ObjectId } = require('mongodb');

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
    // Connect to MongoDB Atlas
    await client.connect();

    // Select database
    const db = client.db("onlineLearningDB");
    const coursesCollection = db.collection("courses");
    const usersCollection = db.collection("users"); 

    // ======================
    //  USERS ROUTES
    // ======================
     // Add a new user (Register)
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: user.email });
        if (existingUser) {
          return res.send({ message: "User already exists" });
        }

        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error("Error saving user:", error);
        res.send({ message: "Error saving user" });
      }
    });

    // Get all users
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    // Get single user by email
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send(user);
    });

    // ======================
    //  COURSE ROUTES
    // ======================
    // Get all courses /courses
    app.get('/courses', async (req, res) => {
        const cursor = coursesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    // Get a single course by ID /courses/:id
    app.get('/courses/:id', async (req, res) => {
        const id = req.params.id; //getting id from url
        const query = { _id: new ObjectId(id) };
        const result = await coursesCollection.findOne(query);
        res.send(result);
    });


    // Add a new course /courses
    app.post('/courses', async (req, res) => {
        const newCourse = req.body; 
        const result = await coursesCollection.insertOne(newCourse);
        res.send(result);
    });

    // Update a course by ID /courses/:id
    app.patch('/update-course/:id', async(req, res) => {
        const id = req.params.id;
        const updatedCourse = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: updatedCourse,
        };
        const result = await coursesCollection.updateOne(filter, updateDoc);
        res.send(result);
    });

    // Delete a course by ID /courses/:id
    app.delete('/delete-course/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coursesCollection.deleteOne(query);
        res.send(result);
    });

    // Get courses by enrolled user email /my-enrolled-courses
    app.get('/my-enrolled-courses', async (req, res) => {
        const email = req.query.email; 
        const query = { enrolledUsers: email }; 
        const cursor = coursesCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });

    
    app.get('/my-courses', async (req, res) => {
        const email = req.query.email; // instructor email
        const query = { instructorEmail: email };
        const cursor = coursesCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");



    // routes
    app.get("/courses", async(req, res) => {

    })

   
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
