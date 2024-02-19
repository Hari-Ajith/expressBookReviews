const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { authenticatedUser, users } = require("./router/auth_users.js");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    jwt.sign(
      {
        username,
      },
      "agjhgafbakcbvnbajkbvkjasbvjaksb",
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) throw err;
        res
          .status(200)
          .cookie("token", token, { sameSite: "none", secure: true })
          .json({
            message: "Login successful",
            user: {
              username,
              token
            },
          });
      }
    );
  } else {
    return res
      .status(401)
      .json({ message: "Invalid login. Please check username and password." });
  }
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
});

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running " + PORT));
