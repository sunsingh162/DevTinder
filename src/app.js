const express = require('express');

const app = express();

app.use('/',(req,res) => {
    res.send('Hello from dashboard')
})

app.use('/test',(req,res) => {
    res.send('Hello from server test')
})

app.listen(3000, () => {
    console.log('Server is successfully listening to port 3000');
})