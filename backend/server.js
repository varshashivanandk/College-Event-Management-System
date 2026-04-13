const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const User = require("./models/User");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
const Login = require("./models/login");
mongoose.connect("mongodb+srv://veenashanmukh:Veena2006@cluster0.t9fxogz.mongodb.net/eventDB")
.then(() => console.log("DB Connected ✅"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Backend Running");
});

app.post("/events", async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      timeStart,
      timeEnd,
      location, // Save location field instead of venue
      category,
      maxParticipants,
      coordinator,
      status, // Set default status to pending
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !timeStart || !timeEnd || !location || !category || !maxParticipants || !coordinator) {
      return res.status(400).send("All fields are required");
    }

    console.log("Data received in /events endpoint:", req.body);
    console.log("Location received in request body:", location);

    const event = new Event({
      title,
      description,
      date,
      timeStart,
      timeEnd,
      location, // Save location field instead of venue
      category,
      maxParticipants,
      coordinator,
      status:"pending" // Set default status to pending
    });

    await event.save();

    res.send("Event Created Successfully ✅");

  } catch (err) {
    console.log("Error creating event:", err);
    res.status(500).send("Error creating event");
  }
});

app.get("/events", async (req, res) => {
 try {
  const events = await Event.find({ status: "approved" });
   const updatedEvents = events.map(event => ({
     ...event._doc,
     venue: event.location // Map location to venue for frontend compatibility
   }));
   console.log("Events fetched from database:", events);
   res.json(updatedEvents);  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching events");  }
});

app.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      name,
      email,
      password,
      role,
      usn,
      department
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User already exists");
    }

    const user = new User({
  firstName,
  lastName,
  name,
  email,
  password,
  role: role.toLowerCase(),
  usn,
  department,
  status: role.toLowerCase() === "user" ? "approved" : "pending"
});

    await user.save();

    res.send("User Registered Successfully ✅");

  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

// EVENT REGISTRATION
app.post("/event-register", async (req, res) => {
  try {
    console.log("Request received at /event-register with body:", req.body);

    const { firstName, lastName, usn, email, department, year, eventId } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !usn || !email || !department || !year || !eventId) {
      console.log("Validation failed: Missing fields");
      return res.status(400).send("All fields are required");
    }

    // Check if the user is already registered for the event
    const existingRegistration = await Registration.findOne({ email, eventId });
    if (existingRegistration) {
      console.log("User already registered for this event:", email, eventId);
      return res.status(409).send("User already registered for this event");
    }

    // Save the registration
    const registration = new Registration({
  firstName,
  lastName,
  usn,
  email,
  department,
  year,
  eventId
});

await registration.save();

console.log("Registration successful for:", email);

res.json({ message: "User Registered Successfully" });
  } catch (err) {
    console.error("Error in /event-register endpoint:", err);
    res.status(500).send("Server error");
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ message: "Incorrect password" });
    }if (user.status !== "approved") {
  return res.json({ message: "Waiting for admin approval" });
}

    // ✅ Save login record (optional)
    const loginRecord = new Login({
      email: user.email,
      role: user.role
    });
    await loginRecord.save();

    // 🔥 IMPORTANT: send user name + role
    res.json({
  message: "Login Successful",
  name: user.firstName + " " + user.lastName,
  role: user.role.toLowerCase()
});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET pending events

app.put("/approve-event/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).send("Error approving event");
  }
});
app.put("/reject-event/:id", async (req, res) => {
  try {
    const { reason } = req.body;

    await Event.findByIdAndUpdate(req.params.id, {
      status: "rejected",
      rejectReason: reason
    });

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting event" });
  }
});
app.get("/all-events", async (req, res) => {
  try {
    const events = await Event.find();
    console.log("All events:", events);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
app.get("/coordinator-requests", async (req, res) => {
  const users = await User.find({
    role: { $in: ["coordinator", "Coordinator"] },
    status: { $in: ["pending", "Pending"] }
  });

  console.log("COORDINATORS:", users); // 👈 ADD THIS

  res.json(users);
});

app.get("/faculty-requests", async (req, res) => {
  const users = await User.find({
    role: { $in: ["faculty", "Faculty"] },
    $or: [
      { status: "pending" },
      { status: { $exists: false } }
    ]
  });
  res.json(users);
});
app.put("/approve-user/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    status: "approved"
  });
  res.send("User approved");
});
app.delete("/delete-user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("User deleted");
});
app.get("/admin-events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});
app.delete("/delete-event/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.send("Event deleted");
});
app.get("/event-registrations/:eventId", async (req, res) => {
  try {
    const registrations = await Registration.find({
      eventId: req.params.eventId
    });

    res.json(registrations);
  } catch (err) {
    res.status(500).send("Error fetching registrations");
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});