const {User} = require('../models/user.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.addUser = async (req, res) => {
  
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  })
  user = await user.save();
  
  if(!user)
    return res.status(400).send('the user cannot be created!')

  res.send(user);
}

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if(!user) {
      res.status(500).json({message: 'The user with the given ID was not found.'})
  } 
  res.status(200).send(user);
}

exports.getAllUser = async (req, res) => {
  const userList = await User.find().select('-passwordHash');
  if(!userList) {
      res.status(500).json({success: false})
  } 
  res.send(userList);
}

exports.updateUser = async (req, res) => {
  const userExist = await User.findById(req.params.id);

  let newPassword;
  if(req.body.password){
    newPassword = bcrypt.hashSync(req.body.password, 10);
  }else{
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    {new: true}
  )

  if(!user)
    return res.status(404).json({status: false, message: 'User not found!'})

  return res.status(200).send(user)
}

// login user
exports.login = async function(req, res) {
  const user = await User.findOne({email: req.body.email});

  if(!user){
    return res.status(400).send('The user not found!');
  }

  const secret = process.env.secret;

  if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      },
      secret,
      {expiresIn: '1d'}
    )
    res.status(200).send({message: 'user authenticated!', email: user.email, token: token});
  }
  else
    res.status(401).send('passwords do not match');
}

exports.getCount = async (req, res) => {
  const userCount = await User.count();
  
  if(!userCount)
    res.status(500).json({success: false})
  res.send({userCount: userCount})
}