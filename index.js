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
const { query } = require("express");
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
      const name = req.query.categoryName;
      let query = {};
      if (name) {
        query = {
          ProductCategory: name,
        };
      }

      const email = req.query.email;
      if (email) {
        query = {
          SellerEmail: email,
        };
      }
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    //# Product Add:
    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.send(result);
    });

    //# Get All Users :
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const seller = req.query.role;
      const buyer = req.query.role;
      let query = {};
      if (seller) {
        query = {
          role: seller,
        };
      }

      if (buyer) {
        query = {
          role: buyer,
        };
      }

      if (email) {
        query = {
          email: email,
        };
      }
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    //# Post All Users:
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    //# Get All Users :
    app.get("/booking", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = {
          productSellerEmail: email,
        };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    //# Booking Product Add:
    app.post("/booking", async (req, res) => {
      const products = req.body;
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
