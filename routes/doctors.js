
const express = require("express");
const router = express.Router();
const db = require("../database");

// GET all doctors
router.get("/", (req, res) => {
    db.all("SELECT * FROM doctors", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving doctors"
            });
        }

        res.status(200).json({
            count: rows.length,
            doctors: rows
        });
    });
});

// GET doctor by ID
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid doctor ID"
        });
    }

    db.get(
        "SELECT * FROM doctors WHERE id = ?",
        [id],
        (err, doctor) => {
            if (err) {
                return res.status(500).json({
                    message: "Error retrieving doctor"
                });
            }

            if (!doctor) {
                return res.status(404).json({
                    message: "Doctor not found"
                });
            }

            res.status(200).json({ doctor });
        }
    );
});

// POST add new doctor
router.post("/", (req, res) => {
    const { name, specialization } = req.body;

    if (
        !name || !name.trim() ||
        !specialization || !specialization.trim()
    ) {
        return res.status(400).json({
            message: "Doctor name and specialization are required"
        });
    }

    db.run(
        "INSERT INTO doctors (name, specialization) VALUES (?, ?)",
        [name.trim(), specialization.trim()],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Error adding doctor"
                });
            }

            res.status(201).json({
                message: "Doctor added successfully",
                doctor: {
                    id: this.lastID,
                    name: name.trim(),
                    specialization: specialization.trim()
                }
            });
        }
    );
});

module.exports = router;
