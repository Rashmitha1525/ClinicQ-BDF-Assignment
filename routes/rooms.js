
const express = require("express");
const router = express.Router();
const db = require("../database");

// GET all rooms (with optional floor search)
router.get("/", (req, res) => {
    const { floor } = req.query;

    let sql = "SELECT * FROM rooms";
    let params = [];

    if (floor !== undefined) {
        const floorNumber = Number(floor);

        if (!Number.isInteger(floorNumber) || floorNumber <= 0) {
            return res.status(400).json({
                message: "Invalid floor number"
            });
        }

        sql += " WHERE floor = ?";
        params.push(floorNumber);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving rooms"
            });
        }

        res.status(200).json({
            count: rows.length,
            rooms: rows
        });
    });
});

// GET room by ID
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid room ID"
        });
    }

    db.get("SELECT * FROM rooms WHERE id = ?", [id], (err, room) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving room"
            });
        }

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json({ room });
    });
});

// POST add room
router.post("/", (req, res) => {
    const { name, floor } = req.body;
    const floorNumber = Number(floor);

    if (!name || !name.trim() || floor === undefined ||
        floor === null || !Number.isInteger(floorNumber) ||
        floorNumber <= 0) {
        return res.status(400).json({
            message: "Room name and a valid positive floor are required"
        });
    }

    db.run(
        "INSERT INTO rooms (name, floor) VALUES (?, ?)",
        [name.trim(), floorNumber],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        message: "This room already exists on this floor"
                    });
                }

                return res.status(500).json({
                    message: "Error adding room"
                });
            }

            res.status(201).json({
                message: "Room added successfully",
                room: {
                    id: this.lastID,
                    name: name.trim(),
                    floor: floorNumber
                }
            });
        }
    );
});

// PUT update room
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, floor } = req.body;
    const floorNumber = Number(floor);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid room ID"
        });
    }

    if (!name || !name.trim() || floor === undefined ||
        floor === null || !Number.isInteger(floorNumber) ||
        floorNumber <= 0) {
        return res.status(400).json({
            message: "Room name and a valid positive floor are required"
        });
    }

    db.run(
        "UPDATE rooms SET name = ?, floor = ? WHERE id = ?",
        [name.trim(), floorNumber, id],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        message: "This room already exists on this floor"
                    });
                }

                return res.status(500).json({
                    message: "Error updating room"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            res.status(200).json({
                message: "Room updated successfully"
            });
        }
    );
});

// DELETE room
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid room ID"
        });
    }

    db.run("DELETE FROM rooms WHERE id = ?", [id], function (err) {
        if (err) {
            if (err.message.includes("FOREIGN KEY")) {
                return res.status(409).json({
                    message: "Cannot delete a room with existing bookings"
                });
            }

            return res.status(500).json({
                message: "Error deleting room"
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json({
            message: "Room deleted successfully"
        });
    });
});

module.exports = router;
