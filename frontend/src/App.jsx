
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '',
    reg_no: '',
    department: '',
    email: ''
  })

  const API = 'http://127.0.0.1:5000/students'
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API}?search=${encodeURIComponent(search)}`)
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [search])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addStudent = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Unable to add student')
        return
      }

      setForm({ name: '', reg_no: '', department: '', email: '' })
      fetchStudents()
      alert('Student added successfully!')
    } catch (error) {
      console.error('Add Student Error:', error)
      alert('Backend connection failed: ' + error.message)
    }
  }

  const deleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        alert('Unable to delete student')
        return
      }

      fetchStudents()
    } catch (error) {
      alert('Backend connection failed')
    }
  }

  return (
    <div className="app">
      <h1>Student Management System</h1>

      <form onSubmit={addStudent}>
        <input name="name" placeholder="Student Name" value={form.name} onChange={handleChange} required />
        <input name="reg_no" placeholder="Register Number" value={form.reg_no} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <button type="submit">Add Student</button>
      </form>

      <input
        type="text"
        placeholder="Search by name or register number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Student Records</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Register Number</th>
            <th>Department</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.reg_no}</td>
              <td>{student.department}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => deleteStudent(student._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
