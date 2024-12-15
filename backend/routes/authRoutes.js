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
        
        return res.status(201).json({message : "Admin LogIn successfully",token: token})
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

// Helper function to log actions
async function logAudit(userId, action, status, details) {
   const db = await connectToDatabase()
  const query = `
    INSERT INTO audit_logs (user_id, action, action_status, details)
    VALUES (?, ?, ?, ?)
  `;
  await db.query(query, [userId, action, status, details]);
}

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

// Validate OTP on phone

router.post('/customers/:id/validate-otp', async (req, res) => {
    const { id } = req.params; // Customer ID from the URL
    const { otp } = req.body; // OTP from the frontend

    // Validate input
    if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
    }

    try {
      const db = await connectToDatabase();

        // Fetch the latest OTP details for the customer
        const [rows] = await db.query(
            `
            SELECT otp, otp_expiry, validated 
            FROM otp_validation 
            WHERE customer_id = ? 
            ORDER BY otp_expiry DESC 
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            await logAudit(id, "OTP Validation", "Failed", "No OTP found for the customer");
            return res.status(404).json({ message: 'No OTP found for the customer' });
        }

        const { otp: storedOtp, otp_expiry: otpExpiry, validated } = rows[0];
        console.log('Stored OTP from database:', storedOtp);

        // Check if the OTP is already validated
        if (validated) {
            await logAudit(id, "OTP Validation", "Failed", "OTP has already been validated");
            return res.status(400).json({ message: 'OTP has already been validated' });
        }

        // Ensure both OTPs are strings and trimmed
        if (otp.toString().trim() !== storedOtp.toString().trim()) {
            console.log('Mismatch - Input OTP:', otp, 'Stored OTP:', storedOtp);
            await logAudit(id, "OTP Validation", "Failed", "Invalid OTP");
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if the OTP has expired
        if (new Date() > new Date(otpExpiry)) {
            await logAudit(id, "OTP Validation", "Failed", "OTP has expired");
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Mark OTP as validated
        await db.query('UPDATE otp_validation SET validated = ? WHERE customer_id = ? AND otp = ?', [true, id, storedOtp]);
        const token = jwt.sign({id: rows[0].id}, process.env.JWT_KEY, {expiresIn: '6h'})

        // Log successful OTP validation
        await logAudit(id, "OTP Validation", "Success", "OTP validated successfully");
        res.status(200).json({ token:token, message: 'OTP validated successfully' });
    } catch (err) {
        console.error('Error validating OTP:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/customers/:id/generate-otp', async (req, res) => {
    const { id } = req.params;
    console.log('id: ' + id);

    if (!id) {
        return res.status(400).json({ message: 'Customer id is required' });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    const validated = false;

    let db; // Declare `db` outside the try block

    try {
        db = await connectToDatabase();

        // Validate that the customer exists
        const [customer] = await db.query(`SELECT * FROM customers WHERE customer_id = ?`, [id]);
        if (customer.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Insert or update OTP for the customer
        const query = `
            INSERT INTO otp_validation (customer_id, otp, otp_expiry, validated)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE otp = VALUES(otp), otp_expiry = VALUES(otp_expiry), validated = VALUES(validated)
        `;
        const values = [id, otp, otpExpiry, validated];

        await db.execute(query, values);

        // Log the action to `audit_logs`
        const logQuery = `
            INSERT INTO audit_logs (user_id, action, action_status, details)
            VALUES (?, 'OTP Requested', 'Success', ?)
        `;
        const logDetails = `Generated OTP: ${otp} (Valid until ${otpExpiry.toISOString()})`;
        await db.execute(logQuery, [id, logDetails]);

        // Send the OTP (example: via SMS or Email)
        console.log(`Generated OTP for customer id ${id}: ${otp}`);

        res.status(201).json({ message: 'OTP generated successfully', otp }); // Remove OTP in production
    } catch (err) {
        console.error('Error generating OTP:', err);

        if (db) {
            // Log the failed action to `audit_logs`
            const logQuery = `
                INSERT INTO audit_logs (user_id, action, action_status, details)
                VALUES (?, 'OTP Requested', 'Failed', ?)
            `;
            const logDetails = `Error: ${err.message}`;
            await db.execute(logQuery, [id, logDetails]).catch((logErr) => {
                console.error('Error logging to audit_logs:', logErr);
            });
        }

        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/customers/:id/generate-otp', async (req, res) => {
    const { id } = req.params;
    console.log('id: ' + id);

    if (!id) {
        return res.status(400).json({ message: 'Customer id is required' });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    const validated = false;

    let db; // Declare `db` outside the try block

    try {
        db = await connectToDatabase();

        // Validate that the customer exists
        const [customer] = await db.query(`SELECT * FROM customers WHERE customer_id = ?`, [id]);
        if (customer.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Insert or update OTP for the customer
        const query = `
            INSERT INTO otp_validation (customer_id, otp, otp_expiry, validated)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE otp = VALUES(otp), otp_expiry = VALUES(otp_expiry), validated = VALUES(validated)
        `;
        const values = [id, otp, otpExpiry, validated];

        await db.execute(query, values);

        // Log the action to `audit_logs`
        const logQuery = `
            INSERT INTO audit_logs (user_id, action, action_status, details)
            VALUES (?, 'OTP Requested', 'Success', ?)
        `;
        const logDetails = `Generated OTP: ${otp} (Valid until ${otpExpiry.toISOString()})`;
        await db.execute(logQuery, [id, logDetails]);

        // Send the OTP (example: via SMS or Email)
        console.log(`Generated OTP for customer id ${id}: ${otp}`);

        res.status(201).json({ message: 'OTP generated successfully', otp }); // Remove OTP in production
    } catch (err) {
        console.error('Error generating OTP:', err);

        if (db) {
            // Log the failed action to `audit_logs`
            const logQuery = `
                INSERT INTO audit_logs (user_id, action, action_status, details)
                VALUES (?, 'OTP Requested', 'Failed', ?)
            `;
            const logDetails = `Error: ${err.message}`;
            await db.execute(logQuery, [id, logDetails]).catch((logErr) => {
                console.error('Error logging to audit_logs:', logErr);
            });
        }

        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Customer register

router.post('/customer/register', async (req, res) => {
    const { first_name, other_names, email, contact_number, national_id, password, account_type } = req.body;

    // Validate input fields
    if (!first_name || !other_names || !email || !contact_number || !national_id || !password || !account_type ) {
        return res.status(400).json({
            message: "Missing required fields. 'first_name', 'other_names','email', 'contact_number', 'national_id', 'password', 'account_type' are mandatory."
        });
    }

    try {
         const db = await connectToDatabase();

        // Check if user already exists
        const [existingUser] = await db.query(
            'SELECT * FROM customers WHERE email = ? OR national_id = ?',
            [email, national_id]
        );

        if (existingUser.length > 0) {
            const duplicateField = existingUser[0].email === email ? 'email' : 'national_id';
            return res.status(409).json({
                message: `A user with this ${duplicateField} already exists.`
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into customers table
        const [userResult] = await db.query(
            `
            INSERT INTO customers (first_name, other_names, email, contact_number, national_id, password)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [first_name, other_names || null, email, contact_number || null, national_id, hashedPassword]
        );

        const customerId = userResult.insertId;

        // Generate a unique account number
        const accountNumber = 'AC' + Math.floor(100000000 + Math.random() * 900000000); // Example: AC123456789

        // Insert into bank_accounts table
        const [accountResult] = await db.query(
            `
            INSERT INTO bank_accounts (customer_id, account_number, account_type, balance, status)
            VALUES (?, ?, ?, ?, ?)
            `,
            [customerId, accountNumber, account_type || 'Savings', 0.00, 'Active']
        );

        // Log actions in audit_logs table
        await db.query(
            `
            INSERT INTO audit_logs (user_id, action, action_status, details)
            VALUES (?, ?, ?, ?)
            `,
            [
                customerId,
                'User Registration',
                'Success',
                `User registered successfully with account number ${accountNumber}`
            ]
        );

        res.status(201).json({
            message: 'User registered successfully',
            customer: {
                customerId,
                first_name,
                other_names,
                email,
                contact_number,
                national_id
            },
            bank_account: {
                accountId: accountResult.insertId,
                accountNumber,
                accountType: account_type || 'Savings',
                balance: 0.00,
                status: 'Active'
            }
        });
    } catch (err) {
        console.error('Error registering user:', err);

        if (err.code === 'ER_DUP_ENTRY') {
            const duplicateField = err.sqlMessage.includes('email') ? 'email' : 'national_id';
            res.status(409).json({
                message: `A user with this ${duplicateField} already exists.`
            });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

router.post("/customer/login", async (req, res) => {
  try {

    const { contact_number} = req.body;

    if (!contact_number) {
      console.error("contact_number is undefined or missing");
      return res.status(400).json({ message: "Contact number is required" });
    }

    const db = await connectToDatabase();

    // Check if the user exists in the database
    const [rows] = await db.query(
      `
      SELECT * FROM customers WHERE contact_number = ?
      `,
      [contact_number]
    );

    if (rows.length === 0) {
      console.error("No user found with the provided contact_number:", contact_number);
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    console.log("User found:", user);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    const validated = false;

    console.log("Generated OTP:", otp);

    // Insert or update OTP in the database
    const otpQuery = `
      INSERT INTO otp_validation (customer_id, otp, otp_expiry, validated)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE otp = VALUES(otp), otp_expiry = VALUES(otp_expiry), validated = VALUES(validated)
    `;
    await db.execute(otpQuery, [user.customer_id, otp, otpExpiry, validated]);
    console.log("OTP stored/updated in database");

    // Generate JWT token
    const token = jwt.sign({ id: user.customer_id }, process.env.JWT_KEY, { expiresIn: "6h" });
    console.log("Generated JWT token:", token);

    // Log successful login
    await logAudit(user.id, "Login", "Success", "Customer logged in successfully");

    // Send response with customer data, OTP, and token
    return res.status(200).json({
      message: "Login successful",
      token: token,
      otp: otp,
      customer: {
        id: user.customer_id,
        first_name: user.first_name,
        other_names: user.other_names,
        email: user.email,
        contact_number: user.contact_number,
        national_id: user.national_id,
        status:user.status,
        date_of_birth: user.date_of_birth,
        gender: user.date_of_birth,
        national_id: user.national_id,
        residential_address:user.residential_address,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);

    // Log failed login attempt
    await logAudit(null, "Login", "Failed", error.message);

    // Respond with error
    return res.status(500).json({ message: "Login failed", error: error.message });
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

//Transaction
// {
//   "customer_id": 4,
//   "account_id": 13,
//   "transaction_type": "Fund Transfer",
//   "amount": 100.00
// }

router.post('/transaction',  async (req, res) => {
    const { customer_id, account_id, transaction_type, amount } = req.body;
    console.log('customer_id',customer_id)

    try {
        const db = await connectToDatabase();

        // Validate the account exists and belongs to the customer
        const [account] = await db.query(
            `SELECT * FROM bank_accounts WHERE account_id = ? AND customer_id = ?`,
            [account_id, customer_id]
        );

        if (account.length === 0) {
            return res.status(404).json({
                message: 'Account not found for the given customer.'
            });
        }

        const { balance, status } = account[0];

        // Ensure the account is active
        if (status !== 'Active') {
            return res.status(400).json({
                message: 'The account is inactive. Transactions are not allowed.'
            });
        }

        // Handle specific transaction types
        let newBalance = balance;
        const transactionStatus = 'Success';
        const transactionDetails = [];

        if (transaction_type === 'Fund Transfer' || transaction_type === 'Bill Payment' || transaction_type === 'Airtime') {
            if (balance < amount) {
                return res.status(400).json({
                    message: 'Insufficient balance for the transaction.'
                });
            }
            newBalance -= amount;
            transactionDetails.push(`Debited ${amount} from account.`);
        } else if (transaction_type === 'Investment' || transaction_type === 'Loan Payment') {
            newBalance -= amount; // Debiting amount
            transactionDetails.push(`Processed ${transaction_type}. Amount: ${amount}`);
        } else if (transaction_type === 'Balance Inquiry') {
            transactionDetails.push(`Balance Inquiry performed. Current balance: ${balance}`);
        } else {
            return res.status(400).json({
                message: 'Invalid transaction type.'
            });
        }

        // Begin Transaction
        await db.beginTransaction();

        // Insert into transactions table
        const [transactionResult] = await db.query(
            `
            INSERT INTO transactions (customer_id, account_id, transaction_type, amount, transaction_status)
            VALUES (?, ?, ?, ?, ?)
            `,
            [customer_id, account_id, transaction_type, amount, transactionStatus]
        );

        const transactionId = transactionResult.insertId;

        // Update the bank_accounts table (for balance-changing transactions)
        if (transaction_type !== 'Balance Inquiry') {
            await db.query(
                `UPDATE bank_accounts SET balance = ? WHERE account_id = ?`,
                [newBalance, account_id]
            );
        }

        // Insert into audit_logs table
        const auditDetails = transactionDetails.join(' ');
        await db.query(
            `
            INSERT INTO audit_logs (user_id, action, action_status, details)
            VALUES (?, ?, ?, ?)
            `,
            [customer_id, transaction_type, transactionStatus, auditDetails]
        );

        // Commit Transaction
        await db.commit();

        res.status(201).json({
            message: 'Transaction processed successfully.',
            transaction: {
                transactionId,
                customer_id,
                account_id,
                transaction_type,
                amount,
                transaction_status: transactionStatus,
                updated_balance: newBalance
            }
        });
    } catch (err) {
        console.error('Error processing transaction:', err);

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized. Token has expired.' });
        }

        try {
            // Rollback in case of failure
            await db.rollback();
        } catch (rollbackErr) {
            console.error('Error rolling back transaction:', rollbackErr);
        }

        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// updates the balance
// {
//   "customer_id": 4,
//   "account_id": 13,
//   "amount": 500.00
// }
router.post('/accounts/deposit', async (req, res) => {
    const { customer_id, account_id, amount } = req.body;

    // Validate input
    if (!customer_id || !account_id || amount == null || amount <= 0) {
        return res.status(400).json({ message: 'Invalid input. Please provide customer_id, account_id, and a positive amount.' });
    }

    let db;
    try {
        db = await connectToDatabase();

        // Start transaction
        await db.beginTransaction();

        // Fetch account details
        const [accountRows] = await db.query('SELECT * FROM bank_accounts WHERE account_id = ? AND customer_id = ?', [account_id, customer_id]);
        if (accountRows.length === 0) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        const account = accountRows[0];
        if (account.status !== 'Active') {
            return res.status(400).json({ message: 'Account is not active.' });
        }

        // Update the balance
        const newBalance = parseFloat(account.balance) + parseFloat(amount);
        await db.query('UPDATE bank_accounts SET balance = ? WHERE account_id = ?', [newBalance, account_id]);

        // Insert the deposit transaction
        const transactionQuery = `
            INSERT INTO transactions (customer_id, account_id, transaction_type, amount, transaction_status)
            VALUES (?, ?, 'Deposit', ?, 'Success')
        `;
        await db.query(transactionQuery, [customer_id, account_id, amount]);

        // Log the action to audit_logs
        const logQuery = `
            INSERT INTO audit_logs (user_id, action, action_status, details)
            VALUES (?, 'Deposit', 'Success', ?)
        `;
        const logDetails = `Deposited amount: ${amount}. New balance: ${newBalance}.`;
        await db.query(logQuery, [customer_id, logDetails]);

        // Commit the transaction
        await db.commit();

        res.status(200).json({ message: 'Deposit successful', new_balance: newBalance });
    } catch (err) {
        console.error('Error processing deposit:', err);

        if (db) {
            await db.rollback();
        }

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