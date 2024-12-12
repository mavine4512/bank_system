import express from 'express';
import {connectToDatabase} from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const salt = 10;
router.post('/admin/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email])
        if(rows.length > 0) {
            return res.status(409).json({message : "user already existed"})
        }
        const hashPassword = await bcrypt.hash(password, salt)
        await db.query("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", 
            [username, email, hashPassword])
        
        return res.status(201).json({message: "user created successfully"})
    } catch(err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post('/admin/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username])
        if(rows.length === 0) {
            return res.status(404).json({message : "user does not existed"})
        }
        const isMatch = await bcrypt.compare(password, rows[0].password)
        if(!isMatch){
            return res.status(401).json({message : "Wrong password"})
        }
        const token = jwt.sign({id: rows[0].id}, process.env.JWT_KEY, {expiresIn: '6h'})
        
        return res.status(201).json({token: token})
    } catch(err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Token not provided' });
    }
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.userId = decoded.id;
      next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
            console.error('Token expired:', err.expiredAt);
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        console.error('Error in verifyToken middleware:', err);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

router.get('/admin/home', verifyToken, async (req,res) => {
    try{
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [req.userId])
        if(rows.length === 0) {
            return res.status(404).json({message : "user not existed"})
        }
        return res.status(201).json({user:rows[0]})
    } catch(err){
        return res.status(500).json({message: 'Server Error'});
    }
})

// Create a new customer
// paramitors: first_name,other_names,national_id,date_of_birth,gender,contact_number,email,residential_address,occupation,status
router.post('/create/customer', verifyToken, async (req, res) => {
    const { first_name,other_names,national_id,date_of_birth,gender,contact_number,email,residential_address,occupation,status, } = req.body;
    if (!first_name || !other_names || !national_id || !date_of_birth || !gender || !contact_number || !email || !residential_address || !occupation || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = await connectToDatabase();
        const query = 'INSERT INTO customers (first_name,other_names,national_id,date_of_birth,gender,contact_number,email,residential_address,occupation,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [first_name,other_names,national_id,date_of_birth,gender,contact_number,email,residential_address,occupation,status];

        const [result] = await db.execute(query, values);

        res.status(201).json({ message: 'New customer added', taskId: result.insertId });
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// edit customers 
router.put('/customers/:id', verifyToken, async (req, res) => {
    const { first_name, other_names, national_id, date_of_birth, gender, contact_number, email, residential_address, occupation, status } = req.body;
    const { id  } = req.params;// Get the customer ID from the URL parameter

    const customer_id = id
    // Ensure that all required fields are provided
    if (!first_name || !other_names || !national_id || !date_of_birth || !gender || !contact_number || !email || !residential_address || !occupation || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = await connectToDatabase();

        // Update the customer details
        const query = `
            UPDATE customers 
            SET first_name = ?, other_names = ?, national_id = ?, date_of_birth = ?, gender = ?, contact_number = ?, email = ?, residential_address = ?, occupation = ?, status = ?
            WHERE customer_id = ?
        `;
        const values = [first_name, other_names, national_id, date_of_birth, gender, contact_number, email, residential_address, occupation, status, customer_id ];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            // If no rows were affected, it means the customer ID was not found
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get customers with pagination
router.get('/pagination', verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = 10; // Number of tasks per page
  const offset = (page - 1) * limit; // Starting point for the current page

  try {
    const db = await connectToDatabase();

    // Query to fetch paginated tasks
    const [customers] = await db.query(
      'SELECT * FROM customers ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    // Query to count total tasks
    const [countResult] = await db.query('SELECT COUNT(*) AS total FROM customers');
    const totalCustomers = countResult[0].total;
    const totalPages = Math.ceil(totalCustomers / limit);

    res.json({
      customers ,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Generate OTP 
router.post('/customers/:id/generate-otp', verifyToken, async (req, res) => {
    const { id } = req.params;
 console.log('id: ' + id);
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    const validated = false;

    try {
        const db = await connectToDatabase();

        // Insert or update OTP for the customer
        const query = `
            INSERT INTO otp_validation (customer_id, otp, otp_expiry, validated)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE otp = VALUES(otp), otp_expiry = VALUES(otp_expiry), validated = VALUES(validated)
        `;
        const values = [id, otp, otpExpiry, validated];

        await db.execute(query, values);

        // Send the OTP (example: via SMS or Email)
        console.log(`Generated OTP for customer id ${id}: ${otp}`);

        res.status(201).json({ message: 'OTP generated successfully', otp }); // Remove otp in production
    } catch (err) {
        console.error('Error generating OTP:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Validate OTP on phone
router.post('/customers/:id/validate-otp', async (req, res) => {
    const { id } = req.params;
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
    }

    try {
        const db = await connectToDatabase();

        // Fetch OTP details for the customer
        const [rows] = await db.query(
            'SELECT otp, otp_expiry, validated FROM customer_otps WHERE customer_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No OTP found for the customer' });
        }

        const { otp: storedOtp, otp_expiry: otpExpiry, validated } = rows[0];

        // Check if the OTP is valid
        if (validated) {
            return res.status(400).json({ message: 'OTP has already been validated' });
        }
        if (otp !== storedOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (new Date() > otpExpiry) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Mark OTP as validated
        await db.query('UPDATE customer_otps SET validated = ? WHERE customer_id = ?', [true, id]);

        res.status(200).json({ message: 'OTP validated successfully' });
    } catch (err) {
        console.error('Error validating OTP:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Add Dependant (POST)
router.post('/create/customers/:customerId/dependants', verifyToken, async (req, res) => {
    const { customerId } = req.params;
    const { full_name, relationship, date_of_birth } = req.body;

    if (!full_name || !relationship || !date_of_birth) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = await connectToDatabase();
        const query = 'INSERT INTO dependants (customer_id, full_name, relationship, date_of_birth) VALUES (?, ?, ?, ?)';
        const values = [customerId, full_name, relationship, date_of_birth];

        const [result] = await db.execute(query, values);
        res.status(201).json({ message: 'Dependant added successfully', dependantId: result.insertId });
    } catch (err) {
        console.error('Error adding dependant:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//  List Dependants (GET)
router.get('/customers/:customerId/dependants', verifyToken, async (req, res) => {
    const { customerId } = req.params;

    try {
        const db = await connectToDatabase();
        const query = 'SELECT * FROM dependants WHERE customer_id = ?';
        const [dependants] = await db.execute(query, [customerId]);

        res.status(200).json(dependants);
    } catch (err) {
        console.error('Error fetching dependants:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Edit Dependant (PUT)
router.put('/edit/customers/:customerId/dependants/:dependantId', verifyToken, async (req, res) => {
  const { customerId, dependantId } = req.params;
  const { full_name, relationship, date_of_birth } = req.body;

  if (!full_name || !relationship || !date_of_birth) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = await connectToDatabase();
    const query = 'UPDATE dependants SET full_name = ?, relationship = ?, date_of_birth = ? WHERE customer_id = ? AND dependant_id = ?';
    const values = [full_name, relationship, date_of_birth, customerId, dependantId];

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dependant not found' });
    }

    res.status(200).json({
      dependant: { full_name, relationship, date_of_birth, customer_id: customerId, dependant_id: dependantId },
    });
  } catch (err) {
    console.error('Error updating dependant:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Remove Dependant (DELETE)
router.delete('/delete/customers/:customerId/dependants/:dependantId', verifyToken, async (req, res) => {
    const { customerId, dependantId } = req.params;

    try {
        const db = await connectToDatabase();
        const query = 'DELETE FROM dependants WHERE customer_id = ? AND dependant_id = ?';
        const values = [customerId, dependantId];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Dependant not found' });
        }

        res.status(200).json({ message: 'Dependant removed successfully' });
    } catch (err) {
        console.error('Error removing dependant:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;