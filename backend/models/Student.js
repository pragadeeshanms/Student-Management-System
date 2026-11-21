
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    reg_no: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
