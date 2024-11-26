import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bcrypt from "bcrypt";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;
  app.get("/register", function (req, res) {
    res.render("register");
  });

  app.get("/register", function (req, res) {
    res.render("register");
  });

  app.post("/register", async function (req, res) {
    // Check if email already exists
    const result = await app.locals.pool.query(
      "SELECT email FROM users WHERE email = $1",
      [req.body.email]
    );

    if (result.rows.length > 0) {
      return res.status(401).send(`
          <h3>E-Mail bereits registriert</h3>
          <p>Diese E-Mail-Adresse ist bereits in unserer Datenbank vorhanden.</p>
          <p>Bitte versuchen Sie es mit einer anderen <a href="https://y52lz4-3010.csb.app/register">E-Mail Adresse</a>.</p>
      `);
    }

    var passwort = bcrypt.hashSync(req.body.passwort, 10);

    // Insert new user
    await app.locals.pool.query(
      "INSERT INTO users (vorname, nachname, email, passwort) VALUES ($1, $2, $3, $4)",
      [req.body.vorname, req.body.nachname, req.body.email, passwort]
    );
    res.redirect("/login");
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.post("/login", async function (req, res) {
    const result = await app.locals.pool.query(
      "SELECT * FROM users WHERE email = $1",
      [req.body.email]
    );

    if (
      result.rows.length > 0 &&
      bcrypt.compareSync(req.body.passwort, result.rows[0].passwort)
    ) {
      req.session.userid = result.rows[0].id;
      res.redirect("/account");
    } else {
      res.status(401).send(`
      <h3>Passwort oder E-Mail ist falsch</h3>
      <p>Bitte versuchen Sie es mit einer anderen E-Mail oder Passwort. Zurück zum <a href="https://y52lz4-3010.csb.app/login">Login</a>.</p>
  `);
    }
  });

  return app;
}

export { upload };
