-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 12, 2024 at 12:28 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bank_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` enum('Login','Transaction','Investment','Loan Payment','Bill Payment','OTP Requested','Password Reset') DEFAULT NULL,
  `action_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `action_status` enum('Success','Failed') DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

CREATE TABLE `bank_accounts` (
  `account_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `account_number` varchar(20) NOT NULL,
  `account_type` enum('Savings','Current','Investment') DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `bill_type` enum('Water','Electricity','Internet','Other') DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `bill_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_status` enum('Paid','Pending','Failed') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `other_names` varchar(255) DEFAULT NULL,
  `national_id` varchar(20) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `residential_address` text DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `first_name`, `other_names`, `national_id`, `date_of_birth`, `gender`, `contact_number`, `email`, `residential_address`, `occupation`, `status`, `created_at`) VALUES
(1, 'Lucy', 'Mbuluma', '22884512', '1999-02-12', 'Female', '0701010101', 'lucymbuluma@gmail.com', 'Thika town', 'farmer', 'Active', '2024-12-11 13:35:40'),
(2, 'Emmah', 'Odongo', '32884517', '2004-01-06', 'Female', '0706467785', 'emmaeodongo@gmail.com', '85432', 'Doctor', 'Active', '2024-12-11 22:06:38');

-- --------------------------------------------------------

--
-- Table structure for table `customer_credentials`
--

CREATE TABLE `customer_credentials` (
  `credential_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expiry` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `password_hash` varchar(255) DEFAULT NULL,
  `password_reset` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `dependants`
--

CREATE TABLE `dependants` (
  `dependant_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `relationship` enum('Child','Spouse','Other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dependants`
--

INSERT INTO `dependants` (`dependant_id`, `customer_id`, `full_name`, `relationship`, `date_of_birth`) VALUES
(1, 1, 'Faith Akinyi', 'Spouse', '2024-06-11'),
(2, 1, 'Baraza Davin', 'Spouse', '2024-12-10'),
(7, 1, 'Caroline Kamau', 'Child', '2020-02-18'),
(8, 2, 'Caroline Kamau', 'Spouse', '1995-06-06');

-- --------------------------------------------------------

--
-- Table structure for table `investments`
--

CREATE TABLE `investments` (
  `investment_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `investment_type` enum('Money Market','Shares','Lock Savings','Deposit') DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` enum('Active','Inactive','Completed') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `loan_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `loan_type` enum('School Fee Loan','Development Loan','Personal Loan') DEFAULT NULL,
  `loan_amount` decimal(10,2) DEFAULT NULL,
  `interest_rate` decimal(5,2) DEFAULT NULL,
  `loan_balance` decimal(10,2) DEFAULT 0.00,
  `status` enum('Active','Paid','Pending') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `otp_validation`
--

CREATE TABLE `otp_validation` (
  `otp_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expiry` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `validated` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `otp_validation`
--

INSERT INTO `otp_validation` (`otp_id`, `customer_id`, `otp`, `otp_expiry`, `validated`) VALUES
(1, 1, '468511', '2024-12-11 22:03:59', 0),
(2, 1, '447714', '2024-12-12 11:07:36', 0);

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `payment_method_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `payment_type` enum('Airtime','Bill Payment') DEFAULT NULL,
  `payment_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('Success','Failed','Pending') DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `transaction_type` enum('Balance Inquiry','Fund Transfer','Investment','Loan Payment','Bill Payment','Airtime') DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `transaction_status` enum('Success','Failed','Pending') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`) VALUES
(7, 'admin', 'admin@gmail.com', '$2b$10$3j8xZc97JwayZDF56EBt..wAiZ2c7SrzQnb9Jxz4.vJBmjbgyLvki');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account_number` (`account_number`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `national_id` (`national_id`);

--
-- Indexes for table `customer_credentials`
--
ALTER TABLE `customer_credentials`
  ADD PRIMARY KEY (`credential_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `dependants`
--
ALTER TABLE `dependants`
  ADD PRIMARY KEY (`dependant_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `investments`
--
ALTER TABLE `investments`
  ADD PRIMARY KEY (`investment_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`loan_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `otp_validation`
--
ALTER TABLE `otp_validation`
  ADD PRIMARY KEY (`otp_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`payment_method_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customer_credentials`
--
ALTER TABLE `customer_credentials`
  MODIFY `credential_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dependants`
--
ALTER TABLE `dependants`
  MODIFY `dependant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `investments`
--
ALTER TABLE `investments`
  MODIFY `investment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `loan_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_validation`
--
ALTER TABLE `otp_validation`
  MODIFY `otp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `payment_method_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD CONSTRAINT `bank_accounts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `customer_credentials`
--
ALTER TABLE `customer_credentials`
  ADD CONSTRAINT `customer_credentials_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `dependants`
--
ALTER TABLE `dependants`
  ADD CONSTRAINT `dependants_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `investments`
--
ALTER TABLE `investments`
  ADD CONSTRAINT `investments_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `otp_validation`
--
ALTER TABLE `otp_validation`
  ADD CONSTRAINT `otp_validation_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `bank_accounts` (`account_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
