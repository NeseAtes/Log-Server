var jwt = require('jsonwebtoken');

var token= function(data){
  var token = jwt.sign(data, 'supersecret',{expiresIn: 30});   //private key=> supersecret
  return {token:token}
}
var tokenControl=function(req, res,next) {
  var token = req.cookies.auth.token;
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
      
  jwt.verify(token, 'supersecret', function(err, decoded) {
  if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    res.locals.data={auth:true,data:decoded};
    next();
  });
}
module.exports.token=token;
module.exports.tokenControl=tokenControl;