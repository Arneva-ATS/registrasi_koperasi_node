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
const convertB64 = require('convert-base64-to-image')

apps.use(bodyParser.json({ limit: '5mb' }))
apps.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
apps.use(cookieParser());

apps.use(express.static('public'));

apps.get('/register/:name', (req, res) => {
    // console.log(req.params.name);
    res.sendFile(path.resolve('./views/register.html'));
})

apps.post('/register/insert', async (req, res) => {
    
    const nis = req.body.nis;
    const nik = req.body.nik;
    const nama_lengkap = req.body.nama_lengkap;
    const tempat_lahir = req.body.tempat_lahir;
    const tanggal_lahir = req.body.tanggal_lahir;
    const jenis_kelamin = req.body.jenis_kelamin;
    const rt_rw = req.body.rt_rw;
    const kelurahan = req.body.kelurahan;
    const kecamatan = req.body.kecamatan;
    const kota = req.body.kota;
    const provinsi = req.body.provinsi;
    const kode_pos = req.body.kode_pos;
    const agama = req.body.agama;
    const status_pernikahan = req.body.status_pernikahan;
    const pekerjaan = req.body.pekerjaan;
    const kewarganegaraan = req.body.kewarganegaraan;
    const alamat = req.body.alamat;
    const nomor_hp = req.body.nomor_hp;
    const email = req.body.email;
    const base64selfie = req.body.selfie;
    const base64ktp = req.body.ktp;
    const roles = req.body.roles;
    const type1 = req.body.type1;
    const type2 = req.body.type2;

    const pathToSaveImage = './public/' + roles + '/' + new Date().getTime() + '.' + type1;
    const img_url = '/' + roles + '/' + new Date().getTime() + '.' + type1;
    convertB64.converBase64ToImage(base64selfie, pathToSaveImage);
    const pathToSaveImages = './public/' + roles + '/' + new Date().getTime() + '.' + type2;
    const img_urls = '/' + roles + '/' + new Date().getTime() + '.' + type2;
    convertB64.converBase64ToImage(base64ktp, pathToSaveImages)

    try {
        await executeQuery("insert into tbl_anggota(nis,nik,nama_lengkap,tempat_lahir,tanggal_lahir, jenis_kelamin, rt_rw, kelurahan, kecamatan, kota, provinsi, kode_pos, agama, status_pernikahan, pekerjaan, kewarganegaraan, alamat, nomor_hp, email, selfie, ktp, roles) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [nis, nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, rt_rw, kelurahan, kecamatan, kota, provinsi, kode_pos, agama, status_pernikahan, pekerjaan, kewarganegaraan, alamat, nomor_hp, email, img_url, img_urls, roles]);
        res.status(200).json({ "message": "success" });
    } catch (err) {
        res.status(400).json(err);
    }
})

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
        res.cookie('roles', "inkop");
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }

})

apps.get('/dashboard', (req, res) => {
    //  console.log(req.cookies);
    if (req.cookies?.roles == 'rki') {
        res.sendFile(path.resolve('./views/rki/rki.html'));
    } else if (req.cookies?.roles == 'inkop') {
        res.sendFile(path.resolve('./views/inkop/inkop.html'));
    } else if (req.cookies?.roles == 'puskop') {
        res.sendFile(path.resolve('./views/puskop/puskop.html'));
    } else if (req.cookies?.roles == 'primkop') {
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

apps.get('/inkop/add', (req, res) => {
    res.sendFile(path.resolve('./views/inkop/add.html'));
})

apps.get('/inkop/edit', (req, res) => {
    res.sendFile(path.resolve('./views/inkop/edit.html'));
})

//-----------------------PUSKOP-----------------------------

apps.get('/puskop/list', (req, res) => {
    res.sendFile(path.resolve('./views/puskop/list.html'));
})

apps.get('/puskop/primkop', (req, res) => {
    res.sendFile(path.resolve('./views/puskop/primkop.html'));
})

apps.get('/puskop/add', (req, res) => {
    res.sendFile(path.resolve('./views/puskop/add.html'));
})

apps.get('/puskop/edit', (req, res) => {
    res.sendFile(path.resolve('./views/puskop/edit.html'));
})

//-----------------------PRIMKOP-----------------------------

apps.get('/primkop/list', (req, res) => {
    res.sendFile(path.resolve('./views/primkop/list.html'));

    apps.get('/primkop/add', (req, res) => {
        res.sendFile(path.resolve('./views/primkop/add.html'));
    })

    apps.get('/primkop/edit', (req, res) => {
        res.sendFile(path.resolve('./views/primkop/edit.html'));
    })

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