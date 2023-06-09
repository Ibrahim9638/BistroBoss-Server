const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Pass}@cluster0.nyrtlyj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const menuCollection = client.db("BistroBoss").collection("menu");
    const reviewsCollection = client.db("BistroBoss").collection("reviews");
    const cartsCollection = client.db("BistroBoss").collection("carts");
    const usersCollection = client.db("BistroBoss").collection("users");

    // User APIs
    app.post('/users', async(req, res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })



    // Menu APIs
    app.get('/menu', async(req, res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })

    // Reviews APIs
    app.get('/reviews', async(req, res)=>{
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    })

    // Cart Collection API
    app.get('/carts', async(req, res)=>{
    const email = req.query.email;
    if(!email){
      res.send([])
    }
    const query = { email: email };
    const result = await cartsCollection.find(query).toArray();
    res.send(result);
    }),


    app.post('/carts', async(req, res)=>{
      const item = req.body;
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    }),
    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('BistroBoss is running')
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})