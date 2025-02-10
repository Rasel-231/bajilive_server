const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors());
app.use(express.json({ limit: "25mb" }));




const uri = "mongodb+srv://halifax980:8tN5KRUbBQzeQzVq@crud.tebgs.mongodb.net/?retryWrites=true&w=majority&appName=Crud";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
const userCollections=client.db("UserData").collection("information")
const gamesCollections=client.db("UserData").collection("Games")
const reviewsCollections=client.db("UserData").collection("reviews")
const promotionCollections=client.db("UserData").collection("promotion")




//promotion data show from db operations
  app.get("/promotion",async(req,res)=>{
    const cursor=promotionCollections.find()
    const result=await cursor.toArray()
    res.send(result);
  })

//games data show from db operations
app.get("/games",async(req,res)=>{
  const cursor=gamesCollections.find()
  const result=await cursor.toArray()
  res.send(result);
})
  
  //reviews data show from db operations
app.get("/reviews",async(req,res)=>{
  const cursor=reviewsCollections.find();
  const result=await cursor.toArray();
  res.send(result);
})




//data post to db operations
app.post("/UserData",async(req,res)=>{
  const UserData=req.body;
  const existingUser = await userCollections.findOne({ UserName: UserData.UserName });
  if(existingUser){
    return res.status(400).send({ message: "Username already exists." });
  }
  const result=await userCollections.insertOne(UserData);
  res.send(result);
})


//UserData find from db operations
app.get("/UserData",async(req,res)=>{
  const cursor=userCollections.find()
  const result=await cursor.toArray()
  res.send(result);
})





//data delelte operations

app.delete("/UserData/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
  const result=await userCollections.deleteOne(query);
  res.send(result)
})

app.get("/UserData/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
 const result=await userCollections.findOne(query)
 res.send(result)
})



//data update operations 
app.put("/UserData/:id",async(req,res)=>{
  const id=req.params.id;
  const user=req.body;
  const filter={_id: new ObjectId(id)}
  const options = { upsert: true };
  const updateUser = {
  $set: {
    UserName:user.UserName,
    password:user.password,
    email:user.email,
    fullname:user.fullname,
    date:user.date,
  },
};
const result = await userCollections.updateOne(filter, updateUser, options);
res.send(result)
})

app.get('/', (req, res) => {
  res.send('CRUD IS RUNNING PROPERLY!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})