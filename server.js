const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

const database = {
  users: [

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

  bcrypt.compare("cookies", '$2a$10$qHTry1ad8oi22vGPIiycVe3GXXsDtdolMJJko59P/Hf9a.HMdkH5K', function (err, res) {
    console.log('first guess', res)
  });
  bcrypt.compare("veggies", '$2a$10$qHTry1ad8oi22vGPIiycVe3GXXsDtdolMJJko59P/Hf9a.HMdkH5K', function (err, res) {
    console.log('second guess', res)
  });

  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
    res.json('success')
  } else {
    res.status(400).json('error logging in')
  }
})

// Register
app.post('/register', (req, res) => {
  const { email, name, password } = req.body
  // bcrypt.hash(password, null, null, function (err, hash) {
  //   console.log(hash)
  // });
  const newUser = {
    id: '125',
    name,
    email,
    password,
    entries: 0,
    joined: new Date()
  }
  database.users.push(newUser)
  res.json(database.users[database.users.length - 1])
})

// Profile/:id
app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  let found = false
  database.users.forEach(user => {
    if (user.id === id) {
      found = true
      return res.json(user)
    }
  })
  if (!found) {
    res.status(404).json('user not found')
  }
})


// Image
app.put('/image', (req, res) => {
  const { id } = req.body
  let found = false
  database.users.forEach(user => {
    if (user.id === id) {
      found = true
      user.entries++
      return res.json(user.entries)
    }
  })
  if (!found) {
    res.status(404).json('user not found')
  }
})









app.listen(3000, () => {
  console.log('App is running on port 3000')
})