require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;
const path = require('path')

const pinsRouter = require('./routes/pins');
const userRouter = require('./routes/users')


app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> {
    console.log('Mongodb connected.')
})
.catch(error=> {
    console.log(error)
})


// all router
app.use('/api/pins', pinsRouter);
app.use('/api/users', userRouter);
app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})