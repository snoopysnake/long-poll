require('dotenv').config()
const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const { Client } = require('pg')
const client = new Client()
const app = express()
const port = 8000
const QUESTION_TIME = 11500
const SCORE_TIME = 5000
const responses = {
  users: [],
  answers: [],
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
        'INSERT INTO users(id, name, winstreak, submitted, active) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [id, name, 0, 0, true]
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
    res.status(200).json({ status: !!users.rows[0], submitted: users.rows[0].submitted })
  } catch (err) {
    res.status(400).json({})
  }
})

app.post('/active', async (req, res) => {
  try {
    const name = req.body.name + ''
    const id = req.body.id + ''
    const user = await client.query(
      'SELECT * FROM users WHERE id = $1 AND name = $2',
      [id, name]
    )
    if (user.rows.length > 0)
      client.query(
        'UPDATE users SET active = true WHERE id = $1 AND name = $2',
        [id, name]
      )
    res.status(200).json({ active: !!user.rows[0] })
  } catch (err) {
    res.status(400).json({})
  }
})

app.post('/send', (req, res) => {
  const id = req.body.id + ''
  const num = +req.body.num
  if (!isNaN(num) && num > 0 && num <= 4) {
    client.query(
      'UPDATE users SET submitted = $1 WHERE id = $2',
      [num, id]
    )
    responses.answers.push({ num, res })
  }
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
  responses.end.push(res) // TODO
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

const idle = () => setInterval(async () => {
  const users = await client.query(
    'SELECT * FROM users WHERE active = false'
  )
  console.log(`Kicking inactive players... ${users.rows.length > 0 ? 'goodbye ' : ''}${users.rows.map(u => u.name).join(', ')}`)
  await client.query(
    'DELETE FROM users WHERE active = false'
  )
  client.query(
    'UPDATE users SET active = false'
  )
}, 120000)

const startTimer = () => {
  number = Math.floor(Math.random() * 3 + 1)
  console.log('Start!', `CORRECT NUMBER: ${number}`)
  started = true
  timeEnd = new Date(+new Date() + 10000)
  setTimeout(() => {
    started = false
    timeEnd = new Date(+new Date() + 10000)
    console.log('Scoring...')
    responses.answers.forEach(ans => {
      ans.res.json({ correct: ans.num === number, answer: number })
    })
    responses.answers = []
    setTimeout(() => {
      responses.start.forEach(res => {
        res.status(200).end()
      })
      responses.start = []
      client.query(
        'UPDATE users SET submitted = 0',
      )
      startTimer()
    }, SCORE_TIME)
  }, QUESTION_TIME)
}

let timeEnd
let started
let number

app.listen(port, async () => {
  console.log(`Long Poll demo listening at http://localhost:${port}`)
  try {
    await client.connect()
    await client.query('LISTEN new_user_event')
    startTimer()
    idle()
    client.on('notification', async res => {
      if (res.channel === 'new_user_event') {
        const guests = await updatedGuests()
        responses.users.forEach(res => {
          res.json({ guests })
        })
        responses.users = []
      }
    })
  } catch (err) {
    console.log('ERROR SETTING UP SERVER:\n', err)
  }
})
