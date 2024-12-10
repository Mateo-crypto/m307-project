import { createApp, upload } from "./config.js";

const app = createApp({
  user: "fragrant_tree_7413",
  host: "bbz.cloud",
  database: "fragrant_tree_7413",
  password: "480154dbe6eebef9db21cb22f74e8f3e",
  port: 30211,
});

app.get("/", async function (req, res) {
  const posts = await app.locals.pool.query("select * from posts");
  res.render("home", { posts: posts.rows });
});

/* Startseite */
app.get("/post/:id", async function (req, res) {
  const posts = await app.locals.pool.query(
    `select * from posts WHERE id = ${req.params.id}`
  );
  res.render("post", { posts: posts.rows });
});

app.get("/datenschutz", async function (req, res) {
  res.render("datenschutz", {});
});

app.get("/newpost", async function (req, res) {
  res.render("newpost", {});
});

app.post("/createpost", upload.single("bild"), async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO posts (bild, name, beschreibung, link, ort) VALUES ($1, $2, $3, $4, $5)",
    [
      req.file.filename,
      req.body.name,
      req.body.beschreibung,
      req.body.link,
      req.body.ort,
    ]
  );
  res.redirect("/");
});

app.get("/login", async function (req, res) {
  res.render("login", {});
});

app.get("/register", async function (req, res) {
  res.render("register", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.post("/like/:id", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  await app.locals.pool.query(
    "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
    [req.params.id, req.session.userid]
  );
  res.redirect(`/account`);
});

/*TEST*/
/*
app.get("/account", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  const userResult = await app.locals.pool.query(
    "SELECT vorname FROM users WHERE id = $1",
    [req.session.userid]
  );

  const user = userResult.rows[0];

  res.render("account", { user });
});*/
/* Account */
app.get("/account", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  const userResult = await app.locals.pool.query(
    "SELECT vorname, nachname, email FROM users WHERE id = $1",
    [req.session.userid]
  );
  const user = userResult.rows[0];

  // Fetch posts liked by the logged-in user
  const likesResult = await app.locals.pool.query(
    "SELECT posts.* FROM posts INNER JOIN likes ON posts.id = likes.post_id WHERE likes.user_id = $1",
    [req.session.userid]
  );
  const like = likesResult.rows;

  res.render("account", { user, like });
});

app.post("/account/update-email", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  const newEmail = req.body.email;

  // Validierung der neuen E-Mail
  if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    res.status(400).send("Ungültige E-Mail-Adresse.");
    return;
  }

  try {
    // Prüfen, ob die E-Mail bereits existiert
    const emailCheckResult = await app.locals.pool.query(
      "SELECT id FROM users WHERE email = $1",
      [newEmail]
    );

    if (emailCheckResult.rows.length > 0) {
      res.status(400).send("Diese E-Mail-Adresse wird bereits verwendet.");
      return;
    }

    // E-Mail-Adresse aktualisieren (4. Spalte wird durch die `email`-Spaltenbezeichnung adressiert)
    await app.locals.pool.query("UPDATE users SET email = $1 WHERE id = $2", [
      newEmail,
      req.session.userid,
    ]);

    res.redirect("/account");
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Aktualisieren der E-Mail-Adresse.");
  }
});

/*TEST*/

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
