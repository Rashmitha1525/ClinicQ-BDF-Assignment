
const express = require("express");

const doctorsRoutes = require("./routes/doctors");
const roomsRoutes = require("./routes/rooms");
const bookingsRoutes = require("./routes/bookings");

const app = express();
const PORT = 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to ClinicQ Health Centre API!"
    });
});

// Health route
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "ClinicQ server is running successfully"
    });
});

// Doctors API
app.use("/doctors", doctorsRoutes);

// Rooms API
app.use("/rooms", roomsRoutes);

// Bookings API
app.use("/bookings", bookingsRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
