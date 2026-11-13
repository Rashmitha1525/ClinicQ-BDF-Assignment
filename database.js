
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Connect to SQLite database
const db = new sqlite3.Database(
    path.join(__dirname, "clinicq.db"),
    (err) => {
        if (err) {
            console.error("Database connection failed:", err.message);
        } else {
            console.log("Database connected successfully!");
        }
    }
);

// Create database tables
db.serialize(() => {

    // Enable foreign key support
    db.run("PRAGMA foreign_keys = ON");

    // Doctors table
    db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialization TEXT NOT NULL
        )
    `);

    // Rooms table
    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            floor INTEGER NOT NULL CHECK(floor > 0),
            UNIQUE(name, floor)
        )
    `);

    // Bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_id INTEGER NOT NULL,
            room_id INTEGER NOT NULL,
            booking_date TEXT NOT NULL,
            booking_time TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending'
                CHECK(status IN ('pending', 'approved', 'done')),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        )
    `);

    // Prevent duplicate active room bookings
    db.run(`
        CREATE UNIQUE INDEX IF NOT EXISTS
        unique_active_room_booking
        ON bookings(room_id, booking_date, booking_time)
        WHERE status IN ('pending', 'approved')
    `, (err) => {
        if (err) {
            console.error("Table creation error:", err.message);
        } else {
            console.log("All three database tables created successfully!");
        }
    });

});

module.exports = db;
