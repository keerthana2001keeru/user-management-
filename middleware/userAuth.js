const userAuth = function (req, res, next) {
  if(req.cookies['connect.sid']) {
    let connectionid = req.cookies['connect.sid'].split(":")[1]
    connectionid = connectionid.split(".")[0]
    if(req.session.id === connectionid){
        if(req.session.user) {
            res.setHeader('Cache-Control', 'no-cache,no-store, must-revalidate');
            next()
        }else{
            res.redirect('/admin')
        }
    }else{
        res.redirect('/login')
    }
    
}else{
    res.redirect('/login')
}
  // if (req.session.user) {
  //   next();
  // } else {
  //   res.redirect("/");
  // }
};



module.exports = userAuth;
