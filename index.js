const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//# Middleware :
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bookmart server is running....");
});

//# MongoDB Setup :

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cqqhz9d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client.db("bookmart").collection("category");
    const productsCollection = client.db("bookmart").collection("products");
    const usersCollection = client.db("bookmart").collection("users");
    const bookingCollection = client.db("bookmart").collection("booked");

    //# Find All The Category :
    app.get("/category", async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });

    //# Find All The Product Of The Categories :
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    //# Find Products To Use Category Name :

    // app.get("/products/:categoryName", async (req, res) => {
    //   const name = req.query;
    //   console.log(name);
    //   const query = { ProductCategory: name };
    //   const result = await productsCollection.find(query);
    //   res.send(result);
    // });

    // //# Find Categories Product To Use Category Name  :
    // app.get("/categories/categoryName", async (req, res) => {
    //   const categoryName = req.body.categoryName;
    //   const query = { categoryName: categoryName };
    //   const result = await productsCollection.find(query).toArray();
    //   res.send(result);
    // });

    // //# Get All The Products:
    // app.post("/products", async (req, res) => {
    //   const query = {};
    //   const result = await productsCollection.find(query).toArray();
    //   res.send(result);
    // });

    //# Product Add:
    app.post("/products", async (req, res) => {
      const products = req.body;
      console.log(products);
      const result = await productsCollection.insertOne(products);
      res.send(result);
    });

    // //# Get All Users :
    // app.get("/users", async (req, res) => {
    //   const email = req.query.email;
    //   console.log(email);

    //   const filter = { email: email };
    //   const result2 = await usersCollection.findOne(filter);

    //   res.send(result2);
    // });

    //# Get All Users :
    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();

      res.send(result);
    });

    //# Post All Users:
    app.post("/users", async (req, res) => {
      const users = req.body;
      console.log(users);
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    //# Get All Users :
    app.get("/booking", async (req, res) => {
      const email = req.query.email;

      const query = { productSellerEmail: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    //# Booking Product Add:
    app.post("/booking", async (req, res) => {
      const products = req.body;
      console.log(products);
      const result = await bookingCollection.insertOne(products);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
