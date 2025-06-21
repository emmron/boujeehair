import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransporter(config);
};

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: any;
}

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  duration: number;
  price: number;
  notes?: string;
}

export const sendOrderConfirmationEmail = async (orderData: OrderEmailData) => {
  try {
    const transporter = createTransporter();
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d946ef; margin: 0;">Bad & Boujee Hair</h1>
          <h2 style="color: #333; margin: 10px 0;">Order Confirmation</h2>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Hi ${orderData.customerName}!</h3>
          <p style="margin: 0; color: #666;">Thank you for your order. We've received your purchase and will process it shortly.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #d946ef; padding-bottom: 10px;">Order Details</h3>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #d946ef; padding-bottom: 10px;">Items Ordered</h3>
          ${orderData.items.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
              <div>
                <strong>${item.name}</strong><br>
                <span style="color: #666;">Quantity: ${item.quantity}</span>
              </div>
              <div style="text-align: right;">
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            </div>
          `).join('')}
          
          <div style="display: flex; justify-content: space-between; padding: 15px 0; font-size: 18px; font-weight: bold; border-top: 2px solid #333;">
            <span>Total:</span>
            <span>$${orderData.total.toFixed(2)} AUD</span>
          </div>
        </div>
        
        ${orderData.shippingAddress ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 2px solid #d946ef; padding-bottom: 10px;">Shipping Address</h3>
            <p>
              ${orderData.shippingAddress.address}<br>
              ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postcode}<br>
              ${orderData.shippingAddress.country}
            </p>
          </div>
        ` : ''}
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li>We'll process your order within 1-2 business days</li>
            <li>You'll receive a shipping confirmation with tracking details</li>
            <li>Estimated delivery: 3-7 business days</li>
          </ul>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666;">
            Questions? Contact us at <a href="mailto:${process.env.BUSINESS_EMAIL || 'orders@badboujee.com'}" style="color: #d946ef;">${process.env.BUSINESS_EMAIL || 'orders@badboujee.com'}</a>
          </p>
          <p style="margin: 10px 0 0 0; color: #666;">
            Thank you for choosing Bad & Boujee Hair! 💖
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"${process.env.BUSINESS_NAME || 'Bad & Boujee Hair'}" <${process.env.SMTP_USER}>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendBookingConfirmationEmail = async (bookingData: BookingEmailData) => {
  try {
    const transporter = createTransporter();
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d946ef; margin: 0;">Bad & Boujee Hair</h1>
          <h2 style="color: #333; margin: 10px 0;">Booking Confirmation</h2>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Hi ${bookingData.customerName}!</h3>
          <p style="margin: 0; color: #666;">Your appointment has been confirmed. We look forward to seeing you!</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #d946ef; padding-bottom: 10px;">Appointment Details</h3>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #d946ef;">
            <p><strong>Service:</strong> ${bookingData.serviceName}</p>
            <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${bookingData.timeSlot}</p>
            <p><strong>Duration:</strong> ${bookingData.duration} minutes</p>
            <p><strong>Price:</strong> $${bookingData.price.toFixed(2)} AUD</p>
            ${bookingData.notes ? `<p><strong>Notes:</strong> ${bookingData.notes}</p>` : ''}
          </div>
        </div>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Before Your Appointment</h3>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li>Please arrive 5-10 minutes early</li>
            <li>Bring any inspiration photos or references</li>
            <li>Let us know if you need to reschedule at least 24 hours in advance</li>
          </ul>
        </div>
        
        <div style="text-align: center; background: #d946ef; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: white; font-weight: bold;">
            Need to reschedule or cancel?
          </p>
          <p style="margin: 5px 0 0 0; color: white;">
            Call us at ${process.env.BUSINESS_PHONE || '+61400000000'}
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666;">
            Questions? Contact us at <a href="mailto:${process.env.BUSINESS_EMAIL || 'bookings@badboujee.com'}" style="color: #d946ef;">${process.env.BUSINESS_EMAIL || 'bookings@badboujee.com'}</a>
          </p>
          <p style="margin: 10px 0 0 0; color: #666;">
            Thank you for choosing Bad & Boujee Hair! 💖
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"${process.env.BUSINESS_NAME || 'Bad & Boujee Hair'}" <${process.env.SMTP_USER}>`,
      to: bookingData.customerEmail,
      subject: `Appointment Confirmed - ${bookingData.serviceName}`,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendAdminNotificationEmail = async (type: 'order' | 'booking', data: any) => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@badboujee.com';
    
    let subject = '';
    let htmlContent = '';
    
    if (type === 'order') {
      subject = `New Order: ${data.orderNumber}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d946ef;">New Order Received</h2>
          <p><strong>Order:</strong> ${data.orderNumber}</p>
          <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
          <p><strong>Total:</strong> $${data.total.toFixed(2)} AUD</p>
          <p><strong>Items:</strong> ${data.items.length}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${data.id}" style="color: #d946ef;">View Order in Admin</a></p>
        </div>
      `;
    } else {
      subject = `New Booking: ${data.serviceName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d946ef;">New Booking Received</h2>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
          <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${data.timeSlot}</p>
          <p><strong>Price:</strong> $${data.price.toFixed(2)} AUD</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings" style="color: #d946ef;">View Booking in Admin</a></p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"${process.env.BUSINESS_NAME || 'Bad & Boujee Hair'}" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};