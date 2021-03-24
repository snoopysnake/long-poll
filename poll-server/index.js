const express = require('express')
const cors = require('cors')
const app = express()
const port = 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/sendAnswer', (req, res) => {
  const num = req.body.num;
  if (!isNaN(num) && num > 0 && num <= 4)
    res.send(`Received answer ${req.body.num}!`)
  else res.send('Not a valid number')
})

app.listen(port, () => {
  console.log(`Long Poll demo listening at http://localhost:${port}`)
})