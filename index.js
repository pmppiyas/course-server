const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB setup
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fk8o9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const database = client.db("course-server");
    const courseCollection = database.collection("courses");

    // Get All Courses
    app.get("/courses", async (req, res) => {
      const cursor = courseCollection.find({});
      const courses = await cursor.toArray();
      if (!courses) {
        return res.status(404).send({ message: "No courses found" });
      }
      res.send(courses);
    });

    // Post a Course
    app.post("/courses", async (req, res) => {
      const course = req.body;
      const result = await courseCollection.insertOne(course);
      res.status(201).send(result);
    });

    // Get Single Course
    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const course = await courseCollection.findOne(query);
      if (!course) {
        return res.status(404).send({ message: "Course not found" });
      }
      res.send(course);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.status(200).send("This is our course server!");
});

app.listen(port, () => {
  console.log("Course server is running on", port);
});
