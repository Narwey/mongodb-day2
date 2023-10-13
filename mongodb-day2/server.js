const express = require("express");
const app = express();
const {run} = require('./db')
const products = require('./Models/products')
const port = 3000;
app.use(express.json());

app.post('/', async(req,res)=> {
    const db = await run();
    const addProduct = db.collection('product').insertMany(products);
    res.send('HAHOWA MCHA');
})

app.get('/get', async(req,res) => {
  const db = await run();
  const query = {price:{$lt:3000}}
  const ajiLhnaya = await db.collection('product').find(query).toArray();
  res.send(ajiLhnaya);
})

app.get('/search', async(req,res)=> {
  const {priceMin , priceMax} = req.body;
  let query ={};
  if(priceMin && priceMax){
    query.price = {$lte:parseFloat(priceMin),$gte:parseFloat(priceMax)}
  }else if(priceMin){
    query.price = {$gte:parseFloat(priceMin)}
  }else{
    query.price = {$lte:parseFloat(priceMax)}
  }
  const db = await run();
  const jibo = await db.collection('product').find(query).toArray();
  res.send(jibo);
})

async function createIndexes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('Products');
    await collection.dropIndexes()   //delete previous indexes
    // Create a text index on the 'name' field
    await collection.createIndex({ name: 'text' });

    console.log('Indexes created successfully.');
  } catch (err) {
    console.error('Error creating indexes:', err);
  } finally {
    client.close();
  }
}

createIndexes();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
