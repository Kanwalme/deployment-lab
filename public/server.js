const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express ()

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '87116032edb240818276f04824b5696a',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('success!')

app.use(express.json())

const outdoorItems = ['bike', 'Binoculars', 'helmet']



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/outdoorItems', (req, res) => {
    rollbar.info("items was requested", outdoorItems)
    res.status(200).send(outdoorItems)
})

app.post('/api/outdoorItems', (req, res) => {
   let {item} = req.body

   const index = outdoorItems.findIndex(item => {
       return outdoorItems === item
   })

   try {
       if (index === -1 && item !== '') {
        outdoorItems.push(item)
           rollbar.info('A new item was created', item)
           res.status(200).send(outdoorItems)
       } else if (item === ''){
        rollbar.error('A item was posted without a name')
           res.status(400).send('You must enter a name.')
       } else {
        rollbar.critical('A item that already exists was posted',item)
           res.status(400).send('That item already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/outdoorItems/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    outdoorItems.splice(targetIndex, 1)
    res.status(200).send(outdoorItems)
})

const port = process.env.PORT || 4004

app.use(rollbar.errorHandler())
app.listen(port, () => console.log(`Server listening on ${port}`))
