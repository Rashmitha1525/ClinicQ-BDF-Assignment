
const express = require("express");
const router = express.Router();
const db = require("../database");

// GET all bookings
router.get("/", (req, res) => {
    const sql = `
        SELECT
            bookings.*,
            doctors.name AS doctor_name,
            rooms.name AS room_name,
            rooms.floor AS room_floor
        FROM bookings
        JOIN doctors ON bookings.doctor_id = doctors.id
        JOIN rooms ON bookings.room_id = rooms.id
        ORDER BY bookings.id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving bookings"
            });
        }

        res.status(200).json({
            count: rows.length,
            bookings: rows
        });
    });
});

// GET booking by ID
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid booking ID"
        });
    }

    db.get(
        "SELECT * FROM bookings WHERE id = ?",
        [id],
        (err, booking) => {
            if (err) {
                return res.status(500).json({
                    message: "Error retrieving booking"
                });
            }

            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found"
                });
            }

            res.status(200).json({ booking });
        }
    );
});

// POST create booking
router.post("/", (req, res) => {
    const {
        doctor_id,
        room_id,
        booking_date,
        booking_time
    } = req.body || {};

    const doctorId = Number(doctor_id);
    const roomId = Number(room_id);

    if (
        !Number.isInteger(doctorId) || doctorId <= 0 ||
        !Number.isInteger(roomId) || roomId <= 0 ||
        !booking_date ||
        !/^\d{4}-\d{2}-\d{2}$/.test(booking_date) ||
        !booking_time ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(booking_time)
    ) {
        return res.status(400).json({
            message: "Valid doctor ID, room ID, booking date (YYYY-MM-DD) and time (HH:MM) are required"
        });
    }

    db.run(
        `INSERT INTO bookings
        (doctor_id, room_id, booking_date, booking_time)
        VALUES (?, ?, ?, ?)`,
        [doctorId, roomId, booking_date, booking_time],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        message: "This room is already booked for the selected date and time"
                    });
                }

                if (err.message.includes("FOREIGN KEY")) {
                    return res.status(400).json({
                        message: "Doctor or room does not exist"
                    });
                }

                return res.status(500).json({
                    message: "Error creating booking"
                });
            }

            res.status(201).json({
                message: "Booking created successfully",
                booking: {
                    id: this.lastID,
                    doctor_id: doctorId,
                    room_id: roomId,
                    booking_date,
                    booking_time,
                    status: "pending"
                }
            });
        }
    );
});

// PUT update booking status
router.put("/:id/status", (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body || {};

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid booking ID"
        });
    }

    if (!["approved", "done"].includes(status)) {
        return res.status(400).json({
            message: "Status must be approved or done"
        });
    }

    db.get(
        "SELECT status FROM bookings WHERE id = ?",
        [id],
        (err, booking) => {
            if (err) {
                return res.status(500).json({
                    message: "Error checking booking"
                });
            }

            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found"
                });
            }

            const validTransition =
                (booking.status === "pending" && status === "approved") ||
                (booking.status === "approved" && status === "done");

            if (!validTransition) {
                return res.status(400).json({
                    message: `Cannot change status from ${booking.status} to ${status}`
                });
            }

            db.run(
                "UPDATE bookings SET status = ? WHERE id = ?",
                [status, id],
                function (updateErr) {
                    if (updateErr) {
                        return res.status(500).json({
                            message: "Error updating booking status"
                        });
                    }

                    res.status(200).json({
                        message: "Booking status updated successfully",
                        booking_id: id,
                        status
                    });
                }
            );
        }
    );
});

module.exports = router;
