const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express ()

app.use(express.static(path.join(__dirname, "/../public")));

app.get('/',function(req,res){
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 4005

app.listen(port, () => {console.log(`Listening on port ${port}`)})