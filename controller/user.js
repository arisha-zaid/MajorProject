const User=require('../models/user.js');

module.exports.signup=async (req,res) => {
        try{
            const {username,email,password} = req.body;
            const newUser = new User({username,email});
            let registeredUser=await User.register(newUser,password);
            console.log(registeredUser);
            // now to make process smooth i.e as signup so does the login(auto-login
          //   // when sign-up)
            req.login(registeredUser, (e) =>{
                if(e){
                  return next(e);
                }
                req.flash("success","Welcome to Airbnb!");
                res.redirect("/listings");
            })
        }
        catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
        }
};

module.exports.login=  async (req,res) =>{
    // if the user has been successfully logged in then redirect them to listings page
    req.flash("success","Welcome back!");
    let redirectUrl=res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);

};

module.exports.logout= (req,res,next) =>{
    req.logout((e) => {
       if(e){
           return next(e);
       }
   req.flash("success" ,"You logged out!");
   res.redirect('/listings');
})
};

