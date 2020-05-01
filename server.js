const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')


const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test',
    database: 'smart-brain'
  }
})

// db.select('*').from('users').then(data => console.log(data))

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors())

const database = {
  users: [
    {
      id: '1',
      name: 'John1',
      email: '1',
      password: '1',
      entries: 0,
      joined: new Date()
    },
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

// Root
app.get('/', (req, res) => { res.send(database.users) })

// SingIn
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

// Register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// Profile/:id
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

// Image
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// Image Url
app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) })






app.listen(3000, () => {
  console.log('App is running on port 3000')
})