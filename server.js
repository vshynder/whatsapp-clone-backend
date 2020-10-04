require("dotenv").config();

const io = require("socket.io")(PORT);

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
