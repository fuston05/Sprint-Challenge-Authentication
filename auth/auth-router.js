const router = require('express').Router();
const users= require('../auth/users_model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

function generateToken(user){
  const payload= {
    subject: user.id,
    username: user.username
  }
  const options= {
    expiresIn: '1h'
  }
  const secret= 'keep it secret!';

  return jwt.sign(payload, secret, options);
}//end gererateToken

router.post('/register', (req, res) => {
  // implement registration
  const newUser= req.body;
  //hash password
  const rounds= parseInt(8);
  const hash = bcrypt.hashSync(newUser.password, rounds);
  //set new pass
  newUser.password= hash;
  //send to db
  users.add(newUser)
  .then( user => {
    res.status(201).json({message: "User successfully added"});
  })
  .catch(error => {
    console.log('error: ', error);
    res.status(500).json({error: "Could not process your request"});
  })
});

router.post('/login', (req, res) => {
  // implement login
  const {username, password}= req.body;
  //check password
  users.findBy({username}).first()
  .then(authUser => {
    if( authUser && bcrypt.compareSync(password, authUser.password) ){
      //create a token
      console.log('authUser: ', authUser)
      const token= generateToken(authUser);
      console.log('token:', token);
      res.status(200).json({
        message: `Welcome ${authUser.username}`,
        token
      })
    }else{
      res.status(500).json({error: "Invalid credentials"});
    }
    
  })
  .catch(error => {
    console.log("logIn error: ", error);
    res.status(500).json({error: "Could not process your request"})
  })
});



module.exports = router;
