const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io = null;
const userSockets = new Map(); // userId -> Set of socketIds
const routeLocations = new Map(); // routeId -> { latitude, longitude, timestamp }

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id || decoded._id);
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = {
        id: user._id.toString(),
        role: user.role,
        name: user.name
      };
      next();
    } catch (err) {
      console.error("Socket authentication error:", err.message);
      return next(new Error("Authentication error: Invalid token"));
    }
  });

const { registerChatHandlers } = require("./chatSocket");

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    const userRole = socket.user.role;

    console.log(`Socket client connected: ${socket.user.name} (${userId}) as ${userRole}`);

    // Register real-time chat socket handlers
    registerChatHandlers(io, socket, userSockets);

    // Track active connection
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Join room dedicated to this user's ID
    socket.join(`user:${userId}`);

    // Join room dedicated to this user's role (for broadcasting role-targeted notifications)
    socket.join(`role:${userRole}`);

    // Join room for real-time bus tracking
    socket.on("join-route", (routeId) => {
      socket.join(`route:${routeId}`);
      console.log(`Client ${socket.user.name} joined tracking room: route:${routeId}`);
      
      // If there is a last known location for this route, emit it immediately to the joining client
      if (routeLocations.has(routeId)) {
        const lastLoc = routeLocations.get(routeId);
        socket.emit("route-location-changed", {
          routeId,
          latitude: lastLoc.latitude,
          longitude: lastLoc.longitude,
          speed: lastLoc.speed,
          timestamp: lastLoc.timestamp
        });
      }
    });

    // Listen for driver location stream
    socket.on("driver-location-update", ({ routeId, latitude, longitude, speed }) => {
      const timestamp = new Date();
      
      // Update in-memory cache
      routeLocations.set(routeId, { latitude, longitude, speed, timestamp });
      
      io.to(`route:${routeId}`).emit("route-location-changed", {
        routeId,
        latitude,
        longitude,
        speed,
        timestamp
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`Socket client disconnected: ${socket.user.name} (${userId})`);
      if (userSockets.has(userId)) {
        userSockets.get(userId).delete(socket.id);
        if (userSockets.get(userId).size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

const sendNotificationToUser = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit("notification", notification);
  }
};

const sendNotificationToRole = (role, notification) => {
  if (io) {
    io.to(`role:${role}`).emit("notification", notification);
  }
};

module.exports = {
  initSocket,
  getIO,
  sendNotificationToUser,
  sendNotificationToRole,
  userSockets
};
