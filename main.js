require("dotenv").config();
const express = require("express");
const apps = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;
const { executeQuery } = require("./config/db");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
// const md5 = require('md5');
const convertB64 = require("convert-base64-to-image");
const base64 = require("base64topdf");

apps.use(bodyParser.json({ limit: "5mb" }));
apps.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
apps.use(cookieParser());

apps.use(express.static("public"));

// apps.get("/register/:name", (req, res) => {
//   // console.log(req.params.name);
//   res.sendFile(path.resolve("./views/register.html"));
// });

apps.post("/register/koperasi/insert/:tingkat", async (req, res) => {
  const {
    singkatan_koperasi,
    nama_koperasi,
    email,
    no_telp,
    no_wa,
    no_fax,
    web,
    bidang_koperasi,
    alamat,
    kelurahan,
    kecamatan,
    kabupaten,
    provinsi,
    kode_pos,
    no_ktp_pengurus,
    nama_pengurus,
    no_anggota_pengurus,
    jabatan_pengurus,
    no_wa_pengurus,
    no_ktp_pengawas,
    nama_pengawas,
    no_anggota_pengawas,
    jabatan_pengawas,
    no_wa_pengawas,
    no_akta,
    tanggal_akta,
    no_skk,
    tanggal_skk,
    no_spkk,
    tanggal_spkk,
    no_akta_perubahan,
    masa_berlaku_perubahan,
    no_siup,
    masa_berlaku_siup,
    no_skdu,
    masa_berlaku_skdu,
    no_npwp,
    no_pkp,
    bpjs_kesehatan,
    bpjs_ketenagakerjaan,
    no_sertifikat,
    ktp,
    logo,
    type1,
    type2,
    dokumen,
    slug,
  } = req.body;
  const tingkat_koperasi = req.params.tingkat;

  const pathToSaveImage =
    "./public/koperasi/" + new Date().getTime() + "." + type1;
  const imgs_logo = "/koperasi/" + new Date().getTime() + "." + type2;
  convertB64.converBase64ToImage(logo, pathToSaveImage);
  const pathToSaveImages =
    "./public/koperasi/" + new Date().getTime() + "." + type1;
  const imgs_ktp = "/koperasi/" + new Date().getTime() + "." + type2;
  convertB64.converBase64ToImage(ktp, pathToSaveImages);

  base64.base64Decode(
    dokumen,
    "./public/koperasi/" + new Date().getTime() + ".pdf"
  );
  const url_pdf = "/koperasi/" + new Date().getTime() + ".pdf";

  try {
    let query = "";
    let queryPengawas;
    let queryPengurus;
    let values = [
      nama_koperasi,
      singkatan_koperasi,
      email,
      no_telp,
      no_wa,
      no_fax,
      web,
      bidang_koperasi,
      alamat,
      kelurahan,
      kecamatan,
      kabupaten,
      provinsi,
      kode_pos,
      no_akta,
      tanggal_akta,
      no_skk,
      tanggal_skk,
      no_akta_perubahan,
      masa_berlaku_perubahan,
      no_spkk,
      tanggal_spkk,
      no_siup,
      masa_berlaku_siup,
      no_skdu,
      masa_berlaku_skdu,
      no_npwp,
      no_pkp,
      bpjs_kesehatan,
      bpjs_ketenagakerjaan,
      no_sertifikat,
      imgs_logo,
      imgs_ktp,
      url_pdf,
      slug,
    ];

    if (tingkat_koperasi == "inkop") {
      query = `INSERT INTO koperasi_induk (
        nama_koperasi,singkatan_koperasi,email_koperasi, no_phone, hp_wa, hp_fax, url_website, bidang_koperasi, alamat, kelurahan, kecamatan, kota, provinsi, kode_pos,
        no_akta_pendirian, tanggal_akta_pendirian, no_sk_kemenkumham, tanggal_sk_kemenkumham, no_akta_perubahan, tanggal_akta_perubahan, no_spkum, tanggal_spkum, 
        no_siup, masa_berlaku_siup, no_sk_domisili, masa_berlaku_sk_domisili, no_npwp, no_pkp, no_bpjs_kesehatan, no_bpjs_tenaga_kerja, no_sertifikat_koperasi, image_logo, ktp , doc_url,slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?)`;
    } else if (tingkat_koperasi == "puskop") {
      query = `INSERT INTO koperasi_pusat (
        nama_koperasi,singkatan_koperasi, email_koperasi, no_phone, hp_wa, hp_fax, url_website, bidang_koperasi, alamat, kelurahan, kecamatan, kota, provinsi, kode_pos,
        no_akta_pendirian, tanggal_akta_pendirian, no_sk_kemenkumham, tanggal_sk_kemenkumham, no_akta_perubahan, tanggal_akta_perubahan, no_spkum, tanggal_spkum, 
        no_siup, masa_berlaku_siup, no_sk_domisili, masa_berlaku_sk_domisili, no_npwp, no_pkp, no_bpjs_kesehatan, no_bpjs_tenaga_kerja, no_sertifikat_koperasi, image_logo, ktp , doc_url,slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?)`;
      // values.push(dokumen);
    } else if (tingkat_koperasi == "primkop") {
      query = `INSERT INTO koperasi_primer (
        nama_koperasi,singkatan_koperasi, email_koperasi, no_phone, hp_wa, hp_fax, url_website, bidang_koperasi, alamat, kelurahan, kecamatan, kota, provinsi, kode_pos,
        no_akta_pendirian, tanggal_akta_pendirian, no_sk_kemenkumham, tanggal_sk_kemenkumham, no_akta_perubahan, tanggal_akta_perubahan, no_spkum, tanggal_spkum, 
        no_siup, masa_berlaku_siup, no_sk_domisili, masa_berlaku_sk_domisili, no_npwp, no_pkp, no_bpjs_kesehatan, no_bpjs_tenaga_kerja, no_sertifikat_koperasi,image_logo, ktp , doc_url,slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?)`;
      // values.push(dokumen);
    }

    let result = await executeQuery(query, values);
    let koperasiId = result.insertId;

    if (tingkat_koperasi == "inkop") {
      queryPengurus = `INSERT INTO anggota(nik, nama_lengkap, no_anggota, roles, nomor_hp, id_koperasi_induk)VALUES (?, ?, ?, ?, ?,?)`;
      queryPengawas = `INSERT INTO anggota(nik, nama_lengkap, no_anggota, roles, nomor_hp, id_koperasi_induk)VALUES (?, ?, ?, ?, ?,?)`;
    } else if (tingkat_koperasi == "puskop") {
      queryPengurus = `INSERT INTO anggota(nik, nama_lengkap, no_anggota, roles, nomor_hp, id_koperasi_pusat)VALUES (?, ?, ?, ?, ?,?)`;
      queryPengawas = `INSERT INTO anggota(nik, nama_lengkap, no_anggota, roles, nomor_hp, id_koperasi_pusat)VALUES (?, ?, ?, ?, ?,?)`;

      // values.push(dokumen);
    } else if (tingkat_koperasi == "primkop") {
      queryPengurus = `INSERT INTO anggota(nik, nama_lengkap, no_anggota, roles, nomor_hp, id_koperasi_primer)VALUES (?, ?, ?, ?, ?,?)`;
      queryPengawas = `INSERT INTO anggota(nik, nama_lengkap, no_anggota, roles, nomor_hp, id_koperasi_primer)VALUES (?, ?, ?, ?, ?,?)`;
    }

    const valuesPengurus = [
      no_ktp_pengurus,
      nama_pengurus,
      no_anggota_pengurus,
      jabatan_pengurus,
      no_wa_pengurus,
      koperasiId,
    ];
    await executeQuery(queryPengurus, valuesPengurus);
    const valuesPengawas = [
      no_ktp_pengawas,
      nama_pengawas,
      no_anggota_pengawas,
      jabatan_pengawas,
      no_wa_pengawas,
      koperasiId,
    ];
    await executeQuery(queryPengawas, valuesPengawas);

    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

apps.post("/register/insert", async (req, res) => {
  const slug_url = req.body.slug_url;
  const no_anggota = req.body.no_anggota;
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
  const base64profil = req.body.selfie;
  const base64ktp = req.body.ktp;
  const roles = req.body.roles;
  const type1 = req.body.type1;
  const type2 = req.body.type2;

  let inkop = await executeQuery(
    "select * from koperasi_induk where slug = " + "'" + slug_url + "'"
  );
  let puskop = await executeQuery(
    "select * from koperasi_pusat where slug =" + "'" + slug_url + "'"
  );
  let primkop = await executeQuery(
    "select * from koperasi_primer where slug = " + "'" + slug_url + "'"
  );

  const pathToSaveImage =
    "./public/" + roles + "/" + new Date().getTime() + "." + type1;
  const img_url = "/" + roles + "/" + new Date().getTime() + "." + type1;
  convertB64.converBase64ToImage(base64profil, pathToSaveImage);
  const pathToSaveImages =
    "./public/" + roles + "/" + new Date().getTime() + "." + type2;
  const img_urls = "/" + roles + "/" + new Date().getTime() + "." + type2;
  convertB64.converBase64ToImage(base64ktp, pathToSaveImages);

  try {
    if (inkop) {
      await executeQuery(
        "insert into anggota(no_anggota,nik,nama_lengkap,tempat_lahir,tanggal_lahir, jenis_kelamin, rt_rw, kelurahan, kecamatan, kota, provinsi, kode_pos, agama, status_pernikahan, pekerjaan, kewarganegaraan, alamat, nomor_hp, email, selfie, ktp, roles,id_koperasi_induk) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          no_anggota,
          nik,
          nama_lengkap,
          tempat_lahir,
          tanggal_lahir,
          jenis_kelamin,
          rt_rw,
          kelurahan,
          kecamatan,
          kota,
          provinsi,
          kode_pos,
          agama,
          status_pernikahan,
          pekerjaan,
          kewarganegaraan,
          alamat,
          nomor_hp,
          email,
          img_url,
          img_urls,
          roles,
          inkop.id,
        ]
      );
    } else if (puskop) {
      await executeQuery(
        "insert into anggota(no_anggota,nik,nama_lengkap,tempat_lahir,tanggal_lahir, jenis_kelamin, rt_rw, kelurahan, kecamatan, kota, provinsi, kode_pos, agama, status_pernikahan, pekerjaan, kewarganegaraan, alamat, nomor_hp, email, selfie, ktp, roles,id_koperasi_pusat) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          no_anggota,
          nik,
          nama_lengkap,
          tempat_lahir,
          tanggal_lahir,
          jenis_kelamin,
          rt_rw,
          kelurahan,
          kecamatan,
          kota,
          provinsi,
          kode_pos,
          agama,
          status_pernikahan,
          pekerjaan,
          kewarganegaraan,
          alamat,
          nomor_hp,
          email,
          img_url,
          img_urls,
          roles,
          puskop.id,
        ]
      );
    } else if (primkop) {
      await executeQuery(
        "insert into anggota(no_anggota,nik,nama_lengkap,tempat_lahir,tanggal_lahir, jenis_kelamin, rt_rw, kelurahan, kecamatan, kota, provinsi, kode_pos, agama, status_pernikahan, pekerjaan, kewarganegaraan, alamat, nomor_hp, email, selfie, ktp, roles,id_koperasi_primer) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          no_anggota,
          nik,
          nama_lengkap,
          tempat_lahir,
          tanggal_lahir,
          jenis_kelamin,
          rt_rw,
          kelurahan,
          kecamatan,
          kota,
          provinsi,
          kode_pos,
          agama,
          status_pernikahan,
          pekerjaan,
          kewarganegaraan,
          alamat,
          nomor_hp,
          email,
          img_url,
          img_urls,
          roles,
          primkop.id,
        ]
      );
    }

    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

apps.get("/", (req, res) => {
  // console.log(md5('12345'));
  res.sendFile(path.resolve("./views/index.html"));
});

apps.post("/dologin", (req, res) => {
  const { email, password, setroles } = req.body;
  if (email == "admin@arneva.co.id" && password == "12345") {
    const isLogin = true;
    res.cookie("token", uuidv4());
    res.cookie("islogin", isLogin);
    res.cookie("roles", setroles);
    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});

apps.get("/dashboard", (req, res) => {
  //  console.log(req.cookies);
  if (req.cookies?.roles == "rki") {
    res.sendFile(path.resolve("./views/rki/rki.html"));
  } else if (req.cookies?.roles == "inkop") {
    res.sendFile(path.resolve("./views/inkop/inkop.html"));
  } else if (req.cookies?.roles == "puskop") {
    res.sendFile(path.resolve("./views/puskop/puskop.html"));
  } else if (req.cookies?.roles == "primkop") {
    res.sendFile(path.resolve("./views/primkop/primkop.html"));
  } else {
    res.redirect("/logout");
  }
});
apps.get("/registrasi/anggota/:name", (req, res) => {
  res.sendFile(path.resolve("./views/register-new.html"));
});

apps.get("/register-anggota/:name", (req, res) => {
  res.sendFile(path.resolve("./views/register-new.html"));
});
apps.get("/register/rki/:tingkatan", (req, res) => {
  res.sendFile(path.resolve("./views/registrasi-koperasi.html"));
});
apps.get("/koperasi/:name/:tingkatan", (req, res) => {
  res.sendFile(path.resolve("./views/registrasi-koperasi.html"));
});
//----------------------RKI-----------------------------

apps.get("/rki", (req, res) => {
  res.sendFile(path.resolve("./views/rki/list.html"));
});

apps.get("/rki/inkop", (req, res) => {
  res.sendFile(path.resolve("./views/rki/inkop.html"));
});

apps.get("/rki/puskop", (req, res) => {
  res.sendFile(path.resolve("./views/rki/puskop.html"));
});

apps.get("/rki/primkop", (req, res) => {
  res.sendFile(path.resolve("./views/rki/primkop.html"));
});

//------------------------INKOP---------------------------

apps.get("/inkop/list", (req, res) => {
  res.sendFile(path.resolve("./views/inkop/list.html"));
});

apps.get("/inkop/puskop", (req, res) => {
  res.sendFile(path.resolve("./views/inkop/puskop.html"));
});

apps.get("/inkop/primkop", (req, res) => {
  res.sendFile(path.resolve("./views/inkop/primkop.html"));
});

apps.get("/inkop/add", (req, res) => {
  res.sendFile(path.resolve("./views/inkop/add.html"));
});

apps.get("/inkop/edit", (req, res) => {
  res.sendFile(path.resolve("./views/inkop/edit.html"));
});

//-----------------------PUSKOP-----------------------------

apps.get("/puskop/list", (req, res) => {
  res.sendFile(path.resolve("./views/puskop/list.html"));
});

apps.get("/puskop/primkop", (req, res) => {
  res.sendFile(path.resolve("./views/puskop/primkop.html"));
});

apps.get("/puskop/add", (req, res) => {
  res.sendFile(path.resolve("./views/puskop/add.html"));
});

apps.get("/puskop/edit", (req, res) => {
  res.sendFile(path.resolve("./views/puskop/edit.html"));
});

//-----------------------PRIMKOP-----------------------------

apps.get("/primkop/list", (req, res) => {
  res.sendFile(path.resolve("./views/primkop/list.html"));

  apps.get("/primkop/add", (req, res) => {
    res.sendFile(path.resolve("./views/primkop/add.html"));
  });

  apps.get("/primkop/edit", (req, res) => {
    res.sendFile(path.resolve("./views/primkop/edit.html"));
  });
});

apps.get("/api/list/inkop", async (req, res) => {
  try {
    let ind = await executeQuery("select * from koperasi_induk");
    res.status(200).json(ind);
  } catch (err) {
    res.status(500).json(err);
  }
});

apps.get("/api/list/puskop", async (req, res) => {
  try {
    let pus = await executeQuery("select * from koperasi_pusat");
    res.status(200).json(pus);
  } catch (err) {
    res.status(500).json(err);
  }
});

apps.get("/api/list/primkop", async (req, res) => {
  try {
    let prim = await executeQuery("select * from koperasi_primer");
    res.status(200).json(prim);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ---------------------Detail -------------------------------

apps.get("/detail_inkop/:id", async (req, res) => {
  const idTx = req.params.id;
  try {
    let koperasi = await executeQuery(
      "select * from koperasi_inkop where id=?",
      [idTx]
    );
    const arr = {
      id: koperasi[0].id,
      nama_koperasi: koperasi[0].nama_koperasi,
      no_phone: koperasi[0].no_phone,
      hp_wa: koperasi[0].hp_wa,
      hp_fax: koperasi[0].hp_fax,
      email_koperasi: koperasi[0].email_koperasi,
      url_website: koperasi[0].url_website,
      bidang_koperasi: koperasi[0].bidang_koperasi,
      alamat: koperasi[0].alamat,
      provinsi: koperasi[0].provinsi,
      kota: koperasi[0].kota,
      kecamatan: koperasi[0].kecamatan,
      kelurahan: koperasi[0].kelurahan,
      kode_pos: koperasi[0].kode_pos,
      image_logo: koperasi[0].image_logo,
      no_akta_pendirian: koperasi[0].no_akta_pendirian,
      tanggal_akta_pendirian: koperasi[0].tanggal_akta_pendirian,
      no_akta_perubahan: koperasi[0].no_akta_perubahan,
      tanggal_akta_perubahan: koperasi[0].tanggal_akta_perubahan,
      no_sk_kemenkumham: koperasi[0].no_sk_kemenkumham,
      tanggal_sk_kemenkumham: koperasi[0].tanggal_sk_kemenkumham,
      no_spkum: koperasi[0].no_spkum,
      tanggal_spkum: koperasi[0].tanggal_spkum,
      no_siup: koperasi[0].no_siup,
      masa_berlaku_siup: koperasi[0].masa_berlaku_siup,
      no_sk_domisili: koperasi[0].no_sk_domisili,
      masa_berlaku_sk_domisili: koperasi[0].masa_berlaku_sk_domisili,
      no_npwp: koperasi[0].no_npwp,
      no_pkp: koperasi[0].no_pkp,
      no_bpjs_kesehatan: koperasi[0].no_bpjs_kesehatan,
      no_bpjs_tenaga_kerja: koperasi[0].no_bpjs_tenaga_kerja,
      no_sertifikat_koperasi: koperasi[0].no_sertifikat_koperasi,
      approval: koperasi[0].approval,
      singkatan_koperasi: koperasi[0].singkatan_koperasi,
      ktp: koperasi[0].ktp,
    };

    res.status(200).json(arr);
  } catch (err) {
    res.status(500).json(err);
  }
});

apps.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("roles");
  res.clearCookie("islogin");
  res.redirect("/");
});

apps.listen(port);
