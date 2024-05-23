
const passUserToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null
    next()
  }
  
  module.exports = passUserToView
  
  //req.session.user is equivalent the mongoDb user id, established by express session during auth. 