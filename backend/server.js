
const express = require("express");
const cors = require("cors");
const mongoose = require("./db");
const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

// Get all students and search students
app.get("/students", async (req, res) => {
    try {
        const search = req.query.search;

        let students;

        if (search) {
            students = await Student.find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { reg_no: { $regex: search, $options: "i" } }
                ]
            });
        } else {
            students = await Student.find();
        }

        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add student
app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();

        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Edit student
app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Start server after MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/student_db")
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(5000, "127.0.0.1", () => {
            console.log("Server running on http://127.0.0.1:5000");
        });
    })
    .catch((err) => {
        console.log("Connection Error:", err.message);
    });

