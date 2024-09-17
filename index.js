import { createApp } from "./config.js";

const app = createApp({
  user: "autumn_star_7622",
  host: "168.119.168.41",
  database: "demo",
  password: "uaioysdfjoysfdf",
  port: 18324,
});

/* Startseite */
app.get("/post", async function (req, res) {
  res.render("post", {});
});

app.get("/", async function (req, res) {
  res.render("home", {});
});

app.get("/home", async function (req, res) {
  res.render("home", {});
});

app.get("/savepost", async function (req, res) {
  res.render("savepost", {});
});

app.get("/newpost", async function (req, res) {
  res.render("newpost", {});
});

app.get("/account", async function (req, res) {
  res.render("account", {});
});

app.get("/login", async function (req, res) {
  res.render("login_register", {});
});

app.get("/register", async function (req, res) {
  res.render("login_register", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
