const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.get('/signedCookie', (req,res)=>{
    // to avoid tampering with cookies we need to sign them.
    res.cookie('name','value',{signed:true});
    res.send('Signed Cookie Set')
})

app.get('/verifySignedCookie',(req,res)=>{
    console.log(req.signedCookies);
    res.send('Signed Cookies Verified');
})

app.get('/getCookie', (req,res) => {
    res.cookie('name','value');  // use to send cookies to the client side.
    res.cookie('name1','value1'); // once cookie is sent it will be stored in browser and can be accessed by any other request.
    res.send('cookie set');
})

// Note! cookies cannot be parsed on its own. It needs to be parsed using a middleware called cookie-parser which is in npm.
app.use(cookieParser());

app.get('/', (req, res) => {
    console.dir(req.cookies);   // req.cookies contains all the cookies that are sent from the client side.
    console.log("Hello World");
})

app.listen(3000 ,() =>{
    console.log("Server is running on port 3000");
});

// to avoid tampering with cookies we need to sign them.