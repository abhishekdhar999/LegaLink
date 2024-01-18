const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/User");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
console.log("req.user.id",req.user.id)
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
console.log("req.body.chatId",req.body.chatId)
  console.log("newmessage in message controller",newMessage)
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
console.log("message in messagecontroller",message)

   const messageControllerMessage =  await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
console.log("message controller message",messageControllerMessage)
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error( "controller" ,error.message);
  }
});

module.exports = { allMessages, sendMessage };