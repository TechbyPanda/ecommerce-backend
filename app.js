const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')



app.use(cors())
app.options('*', cors())

// middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt());
app.use(errorHandler);

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
const orders = require('./routes/order.route');

app.use(`${api}/users`,userRoutes)
app.use(`${api}/categories`, categoryRoutes)
app.use(`${api}/products`,productRoutes)
app.use(`${api}/orders`, orders);

app.listen(3000, ()=> {
  console.log('server is running')
}) 