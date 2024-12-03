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

app.get("/savepost", async function (req, res) {
  res.render("savepost", {});
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
  res.redirect(`/post/${req.params.id}`);
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

/*TEST*/

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
