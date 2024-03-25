const express = require("express");
const app = express();

const port = 3000;

const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const exp = require("constants");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//FOR CSS attachment from public folder
app.use(express.static(path.join(__dirname, "public")));
//To parse data
app.use(express.urlencoded({ extended: true }));
// TO USE METHOD OVERRIDE
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

//INDEX ROUTE

app.get("/chats", async (req, res) => {
  try {
    let chats = await Chat.find();
    console.log(chats);
    res.render("chat.ejs", { chats: chats });
  } catch (err) {
    next(err);
  }
});

//NEW ROUTE
app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "Page not found");
  res.render("new.ejs");
});

//CREATE ROUTE It will insert data where all other data is being shown
app.post("/chats", async (req, res, next) => {
  try {
    let { from, to, message } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      message: message,
      created_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

//SHOW ROUTE

app.get("/chats/:id/", async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(id);
    if (!chat) {
      throw new Error("Chat not found");
    }
    res.render("edit.ejs", { chat: chat }); // Pass 'chat' as an object to the template
  } catch (error) {
    console.log(error);
    res.status(404).send("Chat not found");
  }
});

//EDIT ROUTE

app.get("/chats/:id/edit", async (req, res, next) => {
  try {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat: chat });
  } catch (err) {
    next(err);
  }
});

//UPDATE ROUTE
app.put("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { message: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { message: newMsg },
      { runValidators: true, new: true }
    );
    console.log(updatedChat);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

//Destroy Route
app.delete("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deleted_chat = await Chat.findByIdAndDelete(id);
    console.log(deleted_chat);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.send("Root is working");
});

//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error Occoured" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Listening Port ${port}`);
});
