const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require("cors")

const port = 5000
// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxyjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)
async function run() {
    try {
        await client.connect();
        const database = client.db('tourism');
        const packagesCollection = database.collection('packages');

        // Get Api
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            // console.log(packages)
            res.send(packages)
        })
        // POST API
        app.post('/packages', async (req, res) => {
            const packages = req.body
            // console.log("hit the post api", packages)
            const result = await packagesCollection.insertOne(packages)
            res.json(result)

        });

        // Get Single Package
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package)
        })
        // Delete Api
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.deleteOne(query);
            res.json(result);
        })
    } finally {
        // await client.close()
    }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Get ready to the tourism")
})

app.listen(port, () => {
    console.log("Running the server", port)
})