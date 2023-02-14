const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const authJwt = require('./helpers/jwt')



app.use(cors())
app.options('*', cors())

// middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt());
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({message: 'error in server'});
  }
})

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
  console.log("Database Connection is ready...")
})
.catch((err) => {
  console.log(err)
})

const api = process.env.API_URL
const categoryRoutes = require('./routes/category.route')
const productRoutes = require('./routes/product.route')
const userRoutes = require('./routes/user.route')

app.use(`${api}/categories`, categoryRoutes)
app.use(`${api}/products`,productRoutes)
app.use(`${api}/users`,userRoutes)

app.listen(3000, ()=> {
  console.log('server is running')
}) 