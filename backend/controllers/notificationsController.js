const pool = require('../backend');

// Get all notifications (e.g., for admin dashboard)
const getNotifications = async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT notification_id, message, created_at, is_read 
       FROM notifications 
       ORDER BY created_at DESC`
		);

		return res.status(200).json({
			notifications: result.rows,
		});
	} catch (error) {
		console.error('Error fetching notifications:', error);
		return res.status(500).json({ message: 'Error fetching notifications' });
	}
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
	try {
		const { notification_id } = req.params;

		await pool.query(
			`UPDATE notifications SET is_read = TRUE WHERE notification_id = $1`,
			[notification_id]
		);

		return res.status(200).json({ message: 'Notification marked as read' });
	} catch (error) {
		console.error('Error updating notification:', error);
		return res.status(500).json({ message: 'Error updating notification' });
	}
};

module.exports = {
	getNotifications,
	markNotificationAsRead,
};
