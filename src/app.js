const express = require('express');

const app = express();


app.get('/user/:userID', (req,res) => {
    console.log(req.params)    //{ userID: '700' }
    res.send({firstName:"Sunny",lastName:"Singh"})
})

// app.post('/user', (req,res) => {
//     res.send('User data is saved to DB.')
// })

// app.delete('/user', (req,res) => {
//     res.send('User data deleted successfully')
// })

// app.put('/user', (req,res) => {
//     res.send('User data updated')
// })

// app.use('/user', (req,res) => {
//     res.send('Hello from user')
// })


app.listen(3000, () => {
    console.log('Server is successfully listening to port 3000');
})