import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ضع بيانات API الخاصة بك هنا
const WHATSAPP_TOKEN = "ضع_هنا_التوكين_من_Meta";
const WHATSAPP_PHONE_ID = "ضع_هنا_PhoneNumberID";
const STORE_URL = "https://YOURSTORE.com"; // رابط متجرك
const DISCOUNT_CODE = "WELCOME15"; // كود الخصم

app.post("/customer-created", async (req, res) => {
  const customer = req.body;
  const phone = customer.phone?.replace(/\D/g, ""); // تنظيف الرقم من الرموز
  const name = customer.first_name || "عميلنا العزيز";

  if (!phone) {
    return res.status(400).send("No phone number found.");
  }

  const message = `مرحباً ${name}! 🎉
شكرًا لتسجيلك في Novella.
هديتك الترحيبية: خصم 15٪ على أول طلب.
استخدم الكود: ${DISCOUNT_CODE}
تسوق الآن: ${STORE_URL}/discount/${DISCOUNT_CODE}`;

  try {
    await fetch(`https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message },
      }),
    });

    res.status(200).send("WhatsApp message sent!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending WhatsApp message.");
  }
});

app.get("/", (req, res) => {
  res.send("WhatsApp Automation is running!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
