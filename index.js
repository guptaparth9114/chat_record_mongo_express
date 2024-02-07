const express = require("express");
const app = express();

const port = 3000;

const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const exp = require("constants");
const methodOverride = require("method-override");

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
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

//INDEX ROUTE

app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  console.log(chats);
  res.render("chat.ejs", { chats: chats });
});

//NEW ROUTE
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

//CREATE ROUTE It will insert data where all other data is being shown
app.post("/chats", (req, res) => {
  let { from, to, message } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    message: message,
    created_at: new Date(),
  });

  newChat
    .save()
    .then((res) => {
      console.log("chat was saved");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/chats");
});

//EDIT ROUTE

app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat: chat });
});

//UPDATE ROUTE
app.put("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { message: newMsg } = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(
    id,
    { message: newMsg },
    { runValidators: true, new: true }
  );
  console.log(updatedChat);
  res.redirect("/chats");
});

//Destroy Route
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let deleted_chat = await Chat.findByIdAndDelete(id);
  console.log(deleted_chat);
  res.redirect("/chats");
});

app.get("/", (req, res) => {
  res.send("Root is working");
});

app.listen(port, () => {
  console.log(`Listening Port ${port}`);
});
