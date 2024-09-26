const Resend = require("resend").Resend;
const resend = new Resend("re_JC4PowT4_MbrRK1PmsCAvawtJqteTW6oS"); // Replace with your actual Resend API key
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const eventRoutes = require('./routes/events');


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);




// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected successfully!");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

// Connect to the database before starting the server
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("App is running on port " + process.env.PORT);
  });
});


const sendEventsNotification = async (e) => {
  const sampleEvent = e;
  const mailTemplate = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sampleEvent.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 600px;
            margin: auto;
        }
        h1 {
            color: #4CAF50;
        }
        .event-details {
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Event Reminder</h1>
    <div class="event-details">
        <h2>Title: ${sampleEvent.title}</h2>
        <p><strong>Description:</strong> ${sampleEvent.desc}</p>
        <p><strong>Date:</strong> ${sampleEvent.startDate}</p>
        <p><strong>Time:</strong> ${sampleEvent.startTime}</p>
        <p><strong>Tag:</strong> ${sampleEvent.tag}</p>
    </div>
    <div class="footer">
        <p>You're receiving this reminder because you have an upcoming event scheduled.</p>
        <p>If you have any questions, feel free to reach out.</p>
    </div>
</div>

</body>
</html>
  `

  try {
    const response = await resend.emails.send({
      from: "Urgent@Reminderly <aviral@aviral.ishn.link>", // Update with your sender info
      to: sampleEvent.owner,
      subject: "Event Reminder",
      html: mailTemplate,
      headers: { "X-Category": "Event Reminder" },
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
}

const getEvents = async (req, res) => {
  const Event = require('./models/Event');
  const User = require('./models/User');
  const moment = require('moment');

  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
  const events = await Event.find({ startDate: tomorrow });

  const eventsWithOwner = await Promise.all(events.map(async event => {
    const owner = await User.findById(event.userId);
    return {
      ...event._doc,
      owner: owner.email
    }
  }));

  const response = {
    events: eventsWithOwner
  }
  return response;
}
app.get("/api/test-email", async (req, res) => {
  const events = await getEvents();
  events.events.forEach(async (e) => {
    await sendEventsNotification(e);
  });
  res.json(events);
});

setInterval(async () => {
  const events = await getEvents();
  events.events.forEach(async (e) => {
    await sendEventsNotification(e);
  });

}, 1000 * 60 * 60 * 24);