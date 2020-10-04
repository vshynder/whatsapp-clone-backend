const express = require("express");
const app = express();
const server = require("http").Server(app);

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipient = recipients.filter((r) => r !== recipient);
      newRecipient.push(id);
      socket.broadcast.to(recipient).emit("recieve-message", {
        recipients: newRecipient,
        sender: id,
        text,
      });
    });
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
