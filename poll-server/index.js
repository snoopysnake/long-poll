const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const app = express()
const port = 8000
const guests = [] // in memory array of user objects (name, id) logged on

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/join', (req, res) => {
  const name = req.body.name + ''
  // const userAgent = req.headers['user-agent']
  const user = guests.find(u => name === u.name)
  if (name && !user) {
    const id = crypto
      .createHash('sha256')
      .update(name)
      .digest('hex')
    guests.push({ name, id })
    console.log(`${name} connected!`, guests.map(u => u.name))
    res.status(200).json({ name, id })
  }
  else res.status(400).send('User already exists!')
})

app.post('/joined', (req, res) => {
  const name = req.body.name + ''
  const id = req.body.id + ''
  if (guests.find(u => name === u.name && id === u.id)) {
    res.status(200).send(true)
  }
  else res.status(400).send(false)
})

app.post('/leave', (req, res) => {
  console.log('left')
  res.send('left')
})

app.post('/send', (req, res) => {
  const num = req.body.num
  if (!isNaN(num) && num > 0 && num <= 4)
    res.status(200).send(`Received answer ${req.body.num}!`)
  else res.status(400).send('Not a valid number')
})

app.get('/guests', (req, res) => {
  res.json({guests: guests.map(u => u.name)});
})

app.listen(port, () => {
  console.log(`Long Poll demo listening at http://localhost:${port}`)
})