const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let allChats = [
  {
    from: "Parth",
    to: "Ayush",
    message: "I am well. How are you?",
    created_at: new Date(),
  },

  {
    from: "Shiv",
    to: "Akshat",
    message: "Today it is raining",
    created_at: new Date(),
  },
  {
    from: "Bhuvnesh",
    to: "Pratham",
    message: "I cannot trust since you have betrayed me ",
    created_at: new Date(),
  },
  {
    from: "Tejas",
    to: "Daksh",
    message: "At what time will you go home ?",
    created_at: new Date(),
  },
  {
    from: "Tanmay",
    to: "Mahi",
    message: "Can I drop you home ?",
    created_at: new Date(),
  },
];

Chat.insertMany(allChats);
