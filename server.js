const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

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


app.get('/', (req, res) => {
  res.send(database.users)
})

// SingIn
app.post('/signin', (req, res) => {
  const { email, password } = req.body

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
        return db.select('*').from('users').where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('Unable to get user'))
      }
      else {
        res.status(400).json('Wrong Credentials')
      }
    })
    .catch(err => res.status(400).json('Wrong Credentials'))

  // // bcrypt.compare("cookies", '$2a$10$qHTry1ad8oi22vGPIiycVe3GXXsDtdolMJJko59P/Hf9a.HMdkH5K', function (err, res) {
  // //   console.log('first guess', res)
  // // });
  // // bcrypt.compare("veggies", '$2a$10$qHTry1ad8oi22vGPIiycVe3GXXsDtdolMJJko59P/Hf9a.HMdkH5K', function (err, res) {
  // //   console.log('second guess', res)
  // // });
  // if (req.body.email === database.users[0].email &&
  //   req.body.password === database.users[0].password) {
  //   res.json(database.users[0])
  // } else {
  //   res.status(400).json('error logging in')
  // }
})

// Register
app.post('/register', (req, res) => {
  const { email, name, password } = req.body


  const hash = bcrypt.hashSync(password)

  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('Unable to register'))
})

// Profile/:id
app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      }
      else {
        res.status(404).json('User not found.')
      }
    }).catch(err => {
      res.status(404).json('Error getting user')
    })

  // if (!found) {
  //   res.status(404).json('user not found')
  // }
})


// Image
app.put('/image', (req, res) => {
  const { id } = req.body
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => {
      res.status(400).json('Unable to get entries')
    })
  // let found = false
  // database.users.forEach(user => {
  //   if (user.id === id) {
  //     found = true
  //     user.entries++
  //     return res.json(user.entries)
  //   }
  // })
  // if (!found) {
  //   res.status(404).json('user not found')
  // }
})









app.listen(3000, () => {
  console.log('App is running on port 3000')
})