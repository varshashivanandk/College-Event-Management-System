const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const User = require("./models/User");
const Event = require("./models/Event");

mongoose.connect("mongodb+srv://veenashanmukh:Veena2006@cluster0.t9fxogz.mongodb.net/eventDB")
.then(() => console.log("DB Connected ✅"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Backend Running");
});

// CREATE EVENT
app.post("/events", async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.send("Event Created ✅");
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET EVENTS
app.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).send(err);
    }
});
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("User already exists ❌");
        }

        // create new user
        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.send("User Registered Successfully ✅");

    } catch (err) {
        res.status(500).send(err);
    }
});
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.send("Invalid credentials ❌");
        }

        res.send("Login Successful ✅");

    } catch (err) {
        res.status(500).send(err);
    }
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});