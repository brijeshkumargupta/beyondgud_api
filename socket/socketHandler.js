/**
 * Socket.io Handler for Beyond Gud
 *
 * Events Emitted by Server:
 *  - orderStatusUpdate  → { orderId, status, message }
 *  - stockAlert         → { productId, productName, stock }
 *  - notification       → { message, type }
 *
 * Events Listened from Client:
 *  - joinRoom           → userId (join personal notification room)
 *  - sendMessage        → { senderId, receiverId, message } (live chat)
 *  - orderPlaced        → { orderId, userId } (trigger order notification)
 */

const socketHandler = (io) => {
  // Track connected users: { userId -> socketId }
  const connectedUsers = {};

  io.on('connection', (socket) => {
    console.log(`🔌 New socket connected: ${socket.id}`);

    // ─── Join personal room ─────────────────────────────────────────
    // Client emits: socket.emit('joinRoom', userId)
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      connectedUsers[userId] = socket.id;
      console.log(`👤 User ${userId} joined their room`);

      // Confirm connection to client
      socket.emit('notification', {
        message: 'Connected to Beyond Gud real-time updates!',
        type: 'success',
      });
    });

    // ─── Live Chat ──────────────────────────────────────────────────
    // Client emits: socket.emit('sendMessage', { senderId, receiverId, message })
    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
      console.log(`💬 Message from ${senderId} to ${receiverId}: ${message}`);

      // Send message to the receiver's room
      io.to(receiverId).emit('receiveMessage', {
        senderId,
        message,
        timestamp: new Date().toISOString(),
      });

      // Confirm delivery to sender
      socket.emit('messageSent', {
        status: 'delivered',
        to: receiverId,
        timestamp: new Date().toISOString(),
      });
    });

    // ─── Order Placed Notification ──────────────────────────────────
    // Client emits: socket.emit('orderPlaced', { orderId, userId })
    socket.on('orderPlaced', ({ orderId, userId }) => {
      console.log(`📦 Order placed: ${orderId} by user ${userId}`);

      // Notify the user
      io.to(userId).emit('orderStatusUpdate', {
        orderId,
        status: 'confirmed',
        message: '🎉 Your order has been placed successfully!',
      });

      // Notify all admins (broadcast to admin room)
      io.to('admin-room').emit('notification', {
        message: `New order #${orderId} received!`,
        type: 'info',
      });
    });

    // ─── Admin: Update Order Status ─────────────────────────────────
    // Admin emits: socket.emit('updateOrderStatus', { orderId, userId, status })
    socket.on('updateOrderStatus', ({ orderId, userId, status }) => {
      const messages = {
        processing: '⚙️ Your order is being processed.',
        shipped: '🚚 Your order has been shipped!',
        delivered: '✅ Your order has been delivered!',
        cancelled: '❌ Your order has been cancelled.',
      };

      io.to(userId).emit('orderStatusUpdate', {
        orderId,
        status,
        message: messages[status] || `Order status updated to: ${status}`,
      });

      console.log(`📬 Order ${orderId} status updated to ${status} for user ${userId}`);
    });

    // ─── Stock Alert ────────────────────────────────────────────────
    // Server can call: io.emit('stockAlert', { productId, productName, stock })
    // to broadcast low stock warnings to all connected clients

    // ─── Admin Room Join ────────────────────────────────────────────
    // Admin clients emit: socket.emit('joinAdminRoom', adminToken)
    socket.on('joinAdminRoom', (adminToken) => {
      // In production: verify adminToken via JWT
      socket.join('admin-room');
      console.log(`🔑 Admin joined admin-room (socket: ${socket.id})`);
      socket.emit('notification', {
        message: 'Joined admin room. You will receive all order notifications.',
        type: 'success',
      });
    });

    // ─── Disconnect ─────────────────────────────────────────────────
    socket.on('disconnect', () => {
      // Remove user from connectedUsers map
      const userId = Object.keys(connectedUsers).find(
        (key) => connectedUsers[key] === socket.id
      );
      if (userId) {
        delete connectedUsers[userId];
        console.log(`🔴 User ${userId} disconnected`);
      } else {
        console.log(`🔴 Socket ${socket.id} disconnected`);
      }
    });
  });

  // Helper: emit stock alert to all clients (call from any route/controller)
  io.emitStockAlert = (productId, productName, stock) => {
    io.emit('stockAlert', { productId, productName, stock });
  };
};

module.exports = socketHandler;
