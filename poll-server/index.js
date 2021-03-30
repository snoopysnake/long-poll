require('dotenv').config()
const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const { Client } = require('pg')
const client = new Client()
const app = express()
const port = 8000
const QUESTION_TIME = 10500
const SCORE_TIME = 5000
const responses = {
  users: [],
  start: [],
  end: [],
}

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/join', async (req, res) => {
  try {
    const name = req.body.name + ''
    // const userAgent = req.headers['user-agent']
    const users = await client.query(
      'SELECT * FROM users WHERE name = $1',
      [name]
    )
    if (!users.rows[0]) {
      const id = crypto
        .createHash('sha256')
        .update(name)
        .digest('hex')
      await client.query(
        'INSERT INTO users(id, name, winstreak, submitted) VALUES($1, $2, $3, $4) RETURNING *',
        [id, name, 0, false]
      )
      console.log(`${name} connected!`)
      res.status(200).json({ name, id })
    }
    else res.status(400).send('User already exists!')
  } catch (err) {
    console.log(err)
    res.status(400).send('Error joining game!')
  }
})

app.post('/joined', async (req, res) => {
  try {
    const name = req.body.name + ''
    const id = req.body.id + ''
    const users = await client.query(
      'SELECT * FROM users WHERE id = $1 AND name = $2',
      [id, name]
    )
    res.status(200).json({ status: !!users.rows[0] })
  } catch (err) {
    res.status(400).json({})
  }
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

app.get('/guests', async (req, res) => {
  try {
    const users = await client.query(
      'SELECT * FROM users'
    )
    res.json({ guests: users.rows.map(u => u.name) })
  } catch (err) {
    res.json({ guests: [] })
  }
})

app.get('/update-guests', async (req, res) => {
  responses.users.push(res)
})

app.get('/start', async (req, res) => {
  responses.start.push(res)
})

app.get('/end', async (req, res) => {
  responses.end.push(res)
})

app.get('/time-left', async (req, res) => {
  res.json({
    time: timeEnd ? timeEnd - new Date() : 0,
    started
  })
})

const updatedGuests = async () => {
  try {
    const users = await client.query(
      'SELECT * FROM users'
    )
    return users.rows.map(u => u.name)
  } catch (err) {
    return []
  }
}

const startTimer = () => {
  console.log('Start!')
  started = true
  timeEnd = new Date(+new Date() + 10000)
  timer = setTimeout(() => {
    console.log('End!')
    started = false
    timeEnd = new Date(+new Date() + 10000)
    console.log('Scoring...')
    setTimeout(() => {
      responses.start.forEach(res => {
        res.status(200).end()
      })
      responses.start = []
      startTimer()
    }, SCORE_TIME)
  }, QUESTION_TIME)
}

let timer
let timeEnd
let started

app.listen(port, async () => {
  console.log(`Long Poll demo listening at http://localhost:${port}`)
  try {
    await client.connect()
    await client.query('LISTEN new_user_event')
    startTimer()
    client.on('notification', async res => {
      if (res.channel === 'new_user_event') {
        const guests = await updatedGuests()
        responses.users.forEach(res => {
          console.log(guests)
          res.json({ guests })
        })
        responses.users = []
      }
    })
  } catch (err) {
    console.log('ERROR SETTING UP SERVER:\n', err)
  }
})
