const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ADMIN_NUMBER = process.env.ADMIN_NUMBER;

exports.sendAdminOrderMessage = async (order) => {
  try {
    let itemsText = "";

    order.items.forEach((item) => {
      itemsText += `• ${item.name} x${item.quantity}\n`;
    });

    const message = `
🛒 *New Order Received*

👤 Customer: ${order.shippingAddress.fullName}
📞 Phone: ${order.shippingAddress.phone}

📦 Items:
${itemsText}

💰 Total: ₹${order.total}

📍 Address:
${order.shippingAddress.address}
${order.shippingAddress.city} - ${order.shippingAddress.pincode}
`;

    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: ADMIN_NUMBER,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("WhatsApp send failed:", error.message);
  }
};