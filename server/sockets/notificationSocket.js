const Notification = require("../models/Notification");
const { sendNotificationToUser } = require("./socketManager");
const User = require("../models/User");

/**
 * Creates and delivers a real-time notification
 * @param {Object} params
 * @param {String} params.userId - Recipient user ID (optional if role-targeted)
 * @param {String} params.role - Target role (optional if user-targeted)
 * @param {String} params.type - Enum value for notification type
 * @param {String} params.title - Notification title
 * @param {String} params.message - Notification detail body
 * @param {String} params.actionUrl - Redirect path for frontend
 * @param {String} params.relatedId - Linked resource ObjectId
 */
const createAndSendNotification = async ({
  userId,
  role,
  type,
  title,
  message,
  actionUrl,
  relatedId
}) => {
  try {
    // If targeting a specific user
    if (userId) {
      const dbNotification = await Notification.create({
        userId,
        type,
        title,
        message,
        actionUrl,
        relatedId
      });

      // Emit to the specific user room
      sendNotificationToUser(userId.toString(), dbNotification);
      return dbNotification;
    }

    // If targeting a role (e.g., all admins or teachers)
    if (role) {
      const users = await User.find({ role });
      
      const notifications = await Promise.all(
        users.map(async (u) => {
          const n = await Notification.create({
            userId: u._id,
            type,
            title,
            message,
            actionUrl,
            relatedId
          });
          // Emit individually to each active user room
          sendNotificationToUser(u._id.toString(), n);
          return n;
        })
      );

      return notifications;
    }
  } catch (error) {
    console.error("Error creating and sending notification:", error);
  }
};

module.exports = {
  createAndSendNotification
};
