-- Users Table
CREATE TABLE users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role ENUM('admin','librarian','student','faculty') NOT NULL,
status ENUM('active','inactive') DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
category_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
description TEXT
);

-- Books Table
CREATE TABLE books (
book_id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(200) NOT NULL,
author VARCHAR(150) NOT NULL,
isbn VARCHAR(20) UNIQUE,
publisher VARCHAR(150),
year INT,
category_id INT,
total_copies INT DEFAULT 1,
available_copies INT DEFAULT 1,
status ENUM('available','unavailable') DEFAULT 'available',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Members Table
CREATE TABLE members (
member_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
member_type ENUM('student','faculty') NOT NULL,
max_books INT DEFAULT 3,
status ENUM('active','inactive') DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Book Issues Table
CREATE TABLE book_issues (
issue_id INT AUTO_INCREMENT PRIMARY KEY,
book_id INT NOT NULL,
member_id INT NOT NULL,
issue_date DATE NOT NULL,
due_date DATE NOT NULL,
return_date DATE,
status ENUM('issued','returned','overdue') DEFAULT 'issued',
FOREIGN KEY (book_id) REFERENCES books(book_id),
FOREIGN KEY (member_id) REFERENCES members(member_id)
);

-- Fines Table
CREATE TABLE fines (
fine_id INT AUTO_INCREMENT PRIMARY KEY,
issue_id INT NOT NULL,
amount DECIMAL(10,2) DEFAULT 0,
paid_amount DECIMAL(10,2) DEFAULT 0,
status ENUM('pending','paid','waived') DEFAULT 'pending',
paid_date DATE,
FOREIGN KEY (issue_id) REFERENCES book_issues(issue_id)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
log_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
action VARCHAR(255),
module VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(user_id)
);