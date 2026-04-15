import pool from '../config/db.js';





// ✅ NEW: Get all interest messages for business owner's businesses
export const getOwnerInterestMessages = async (req, res) => {
  try {
    const userId = req.user.id; // Business owner's user_id from token
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log('Fetching interest messages for user_id:', userId);

    // Get total count of messages for this owner's businesses
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total
       FROM interest_messages im
       JOIN businesses b ON im.business_id = b.Business_id
       WHERE b.user_id = ?`,
      [userId]
    );

    const totalMessages = countResult[0].total;
    const totalPages = Math.ceil(totalMessages / limit);

    // Get paginated interest messages with marketer details
    const [messages] = await pool.query(
      `SELECT 
        im.id,
        im.business_id,
        im.marketer_id,
        im.message,
        im.business_name,
        im.business_owner_email,
        im.status,
        im.sent_at,
        b.business_name as actual_business_name,
        b.Business_Address,
        m.address as marketer_address,
        m.contact_number as marketer_phone,
        u.user_id as marketer_user_id,
        u.name as marketer_name,
        u.email as marketer_email,
        DATE_FORMAT(im.sent_at, '%M %d, %Y %h:%i %p') as formatted_date,
        DATE_FORMAT(im.sent_at, '%Y-%m-%d') as date_only
       FROM interest_messages im
       JOIN businesses b ON im.business_id = b.Business_id
       JOIN marketers m ON im.marketer_id = m.marketer_id
       JOIN users u ON m.user_id = u.user_id
       WHERE b.user_id = ?
       ORDER BY im.sent_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    console.log(`✅ Found ${messages.length} messages for owner`);

    res.status(200).json({
      success: true,
      messages: messages,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalMessages: totalMessages,
        limit: limit,
        hasMore: page < totalPages
      }
    });

  } catch (error) {
    console.error(' Error fetching owner interest messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interest messages',
      error: error.message
    });
  }
};

// ✅ NEW: Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Verify the message belongs to one of the owner's businesses
    const [checkResult] = await pool.query(
      `SELECT im.id 
       FROM interest_messages im
       JOIN businesses b ON im.business_id = b.Business_id
       WHERE im.id = ? AND b.user_id = ?`,
      [messageId, userId]
    );

    if (checkResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or unauthorized'
      });
    }

    // Update status to 'read'
    await pool.query(
      `UPDATE interest_messages SET status = 'read' WHERE id = ?`,
      [messageId]
    );

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('❌ Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status'
    });
  }
};

// ✅ NEW: Get message statistics
export const getOwnerMessageStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as unread,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied
       FROM interest_messages im
       JOIN businesses b ON im.business_id = b.Business_id
       WHERE b.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      stats: stats[0]
    });

  } catch (error) {
    console.error('❌ Error fetching message stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};