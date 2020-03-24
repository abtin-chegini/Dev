const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const User = require('../../models/User');
const {check,validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
//@route Get api/auth
//@desc Test Route
//@access Public

router.get('/',auth,async (req, res) => {

// try {
//   const user = await User.findById(req.user.id).select('-password');
//   res.json(user);
// } catch (err) {
//   console.error(err.message);
//   res.status(500).send('Server Error');
// }


});


router.post('/',[

  check('email','Please include a valid email ').isEmail(),
  check('password','password is Required').exists()
], 
async(req, res) => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({errors:errors.array()});
 }



const {email,password} = req.body;



try {

// See if User Exists
let user = await User.findOne({email})

if (!user) {
  res.status(400).json({errors:[{msg:"Invalid Credential"}]})
}
//Get Users gravatar


const isMatch = await bcrypt.compare(password,user.password);
if (!isMatch) {
  res.status(400).json({errors:[{msg:"Invalid Credential"}]})
  
}
const payload = {
user:{

  id:user.id,

}

  
}
  
jwt.sign(payload,
  config.get('jwtSecret')
  ,{expiresIn:360000}
  ,(err,token)=>{
  if (err)   console.error(err.message);

  res.json({token});
    


});

 
  
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server error')
}












});
module.exports = router;