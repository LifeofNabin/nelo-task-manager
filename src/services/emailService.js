// src/services/emailService.js

/**
 * Email Service for Task Notifications
 * In production, this would integrate with a real email service like:
 * - SendGrid
 * - AWS SES
 * - Nodemailer
 * - EmailJS
 */

export const sendTaskEmail = async (tasks, userEmail) => {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Format tasks for email
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    
    if (pendingTasks.length === 0) {
      return {
        success: true,
        message: 'No pending tasks to send',
        taskCount: 0
      };
    }

    // In production, this would call your email API
    // Example with EmailJS or SendGrid:
    /*
    const response = await fetch('YOUR_EMAIL_API_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject: `NELO Task Reminder - ${pendingTasks.length} Pending Tasks`,
        html: formatEmailHTML(pendingTasks)
      })
    });
    */

    // For demo: Log to console (simulating email sent)
    console.log('📧 EMAIL SENT TO:', userEmail);
    console.log('📋 PENDING TASKS:', pendingTasks.length);
    console.log('─────────────────────────────────────');
    pendingTasks.forEach(task => {
      console.log(`• ${task.title} [${task.priority.toUpperCase()}] - Due: ${task.dueDate}`);
    });
    console.log('─────────────────────────────────────');

    return {
      success: true,
      message: `Email sent successfully to ${userEmail}`,
      taskCount: pendingTasks.length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    };
  }
};

/**
 * Format tasks into HTML email template
 */
export const formatEmailHTML = (tasks) => {
  const taskRows = tasks.map(task => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${task.title}</strong>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <span style="
          padding: 4px 8px;
          border-radius: 4px;
          background: ${task.priority === 'high' ? '#fee' : task.priority === 'medium' ? '#fef9e7' : '#e8f5e9'};
          color: ${task.priority === 'high' ? '#c00' : task.priority === 'medium' ? '#f57c00' : '#2e7d32'};
        ">
          ${task.priority.toUpperCase()}
        </span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${new Date(task.dueDate).toLocaleDateString()}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border: 1px solid #ddd; border-top: none; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🥬 NELO Task Reminder</h1>
          <p>You have ${tasks.length} pending task${tasks.length > 1 ? 's' : ''}</p>
        </div>
        <div class="content">
          <table>
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Task</th>
                <th style="padding: 10px; text-align: left;">Priority</th>
                <th style="padding: 10px; text-align: left;">Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${taskRows}
            </tbody>
          </table>
          <p style="margin-top: 20px; color: #666;">
            Login to NELO to manage your tasks: 
            <a href="http://localhost:3000" style="color: #667eea;">Open NELO</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};