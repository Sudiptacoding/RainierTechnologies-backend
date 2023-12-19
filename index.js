const express = require('express')
require('dotenv').config()
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 3000


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.vdfwpbk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db("Raninier-Tecnologies");
        const users = database.collection("users");
        const course = database.collection("course");

        // user save
        app.post('/user', async (req, res) => {
            const result = await users.insertOne(req.body);
            res.send(result)
        })

        // Admin post
        app.post('/api/course', async (req, res) => {
            const result = await course.insertOne(req.body);
            res.send(result)
        })

        // delete course
        app.delete('/api/course/:id', async (req, res) => {
            const result = await course.deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })


        // is admin check
        app.get('/isAdmin', async (req, res) => {
            const result = await users.findOne({ email: req.query.email });
            let admin = false
            if (result?.email === 'rainiertechnologies@gmail.com') {
                admin = true
            }
            res.send({ admin })
        })

        // all course data
        app.get('/api/course', async (req, res) => {
            const result = await course.find().toArray();
            res.send(result)
        })

        // single course check
        app.get('/api/update/:id', async (req, res) => {
            const result = await course.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result)
        })

        // Update course
        app.put('/api/update/:id', async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...req.body
                },
            };
            const result = await course.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})