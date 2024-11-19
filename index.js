import { createApp } from "./config.js";

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
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.render("newpost", {});
});

app.get("/account", async function (req, res) {
  res.render("account", {});
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

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
