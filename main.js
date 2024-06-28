require('dotenv').config();
const express = require('express');
const apps = express();
const bodyParser = require('body-parser')
const port = process.env.PORT;
const { executeQuery } = require('./config/db');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require("cookie-parser");
// const md5 = require('md5');

apps.use(bodyParser.json())
apps.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
apps.use(cookieParser());

apps.use(express.static('public'));
apps.get('/', (req, res) => {
    // console.log(md5('12345'));
    res.sendFile(path.resolve('./views/index.html'));
})

apps.post('/dologin', (req, res) => {
    const { email, password } = req.body;
    if (email == 'admin@arneva.co.id' && password == '12345') {
        const isLogin = true;
        res.cookie('token', uuidv4());
        res.cookie('islogin', isLogin);
        res.cookie('roles', "puskop");
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }

})

apps.get('/dashboard', (req, res) => {
    //  console.log(req.cookies);
    if(req.cookies?.roles == 'rki'){
        res.sendFile(path.resolve('./views/rki/rki.html'));
    } else if(req.cookies?.roles == 'inkop'){
        res.sendFile(path.resolve('./views/inkop/inkop.html'));
    } else if(req.cookies?.roles == 'puskop'){
        res.sendFile(path.resolve('./views/puskop/puskop.html'));
    } else if(req.cookies?.roles == 'primkop'){
        res.sendFile(path.resolve('./views/primkop/primkop.html'));
    } else {
        res.redirect('/logout');
    }
    
})

//----------------------RKI-----------------------------

apps.get('/rki', (req, res) => {
    res.sendFile(path.resolve('./views/rki/list.html'));
})

apps.get('/rki/inkop', (req, res) => {
    res.sendFile(path.resolve('./views/rki/inkop.html'));
})

apps.get('/rki/puskop', (req, res) => {
    res.sendFile(path.resolve('./views/rki/puskop.html'));
})

apps.get('/rki/primkop', (req, res) => {
    res.sendFile(path.resolve('./views/rki/primkop.html'));
})

//------------------------INKOP---------------------------

apps.get('/inkop/list', (req, res) => {
    res.sendFile(path.resolve('./views/inkop/list.html'));
})

apps.get('/inkop/puskop', (req, res) => {
    res.sendFile(path.resolve('./views/inkop/puskop.html'));
})

apps.get('/inkop/primkop', (req, res) => {
    res.sendFile(path.resolve('./views/inkop/primkop.html'));
})

//-----------------------PUSKOP-----------------------------

apps.get('/puskop/list', (req, res) => {
    res.sendFile(path.resolve('./views/puskop/list.html'));
})

apps.get('/puskop/primkop', (req, res) => {
    res.sendFile(path.resolve('./views/puskop/primkop.html'));
})

// ---------------------Detail -------------------------------


// apps.get('/detail/:id', (req, res) => {
//     res.sendFile(path.resolve('./views/detail.html'));
    // const idTx = req.params.id;
    // try {
    //     let employeeData = await executeQuery(
    //       "select * from user where id_user=?",
    //       [id]
    //     );
  
    //   //   console.log(employeeData[0].id_user);
  
    //     const arr =  {
    //       "id_user": employeeData[0].id_user,
    //       "id_warung": employeeData[0].id_warung,
    //       "username": employeeData[0].username,
    //       "email": employeeData[0].email,
    //       "password": employeeData[0].password,
    //       "status": employeeData[0].status,
    //       "token": employeeData[0].token
    //     };
  
  
    //     res.status(200).json(arr);
    //   } catch (err) {
    //     res.status(500).json(err);
    //   }
// })


// apps.get("/pengguna", async (req, res) => {
//     try {
//       let employeeData = await executeQuery("select * from user");
//       res.status(200).json(employeeData);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

apps.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('roles');
    res.clearCookie('islogin');
    res.redirect('/');
})

apps.listen(port);