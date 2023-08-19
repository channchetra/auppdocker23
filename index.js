const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const EmployeeSchema = new mongoose.Schema({
    empid: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    emailid: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

mongoose.connect('mongodb://mongo:27017/employeeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// 1. Add record/documents API
app.post('/add', async (req, res) => {
  const { empid, name, emailid, password } = req.body;

  try {
      const newEmployee = new Employee({
          empid,
          name,
          emailid,
          password
      });

      const employee = await newEmployee.save();
      res.json(employee);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

// 2. View all documents API
app.get('/employees', async (req, res) => {
  try {
      const employees = await Employee.find();
      res.json(employees);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

// 3. Login API
app.post('/login', async (req, res) => {
    const { emailid, password } = req.body;

    try {
        const user = await Employee.findOne({ emailid: emailid });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // This is the new message for successful login
        res.status(200).json({ message: 'Login successful!' });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. Search emp by empid API
app.get('/employee/:empid', async (req, res) => {
  try {
      const employee = await Employee.findOne({ empid: req.params.empid });
      if (!employee) {
          return res.status(404).json({ msg: 'Employee not found' });
      }
      res.json(employee);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

const PORT =3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));