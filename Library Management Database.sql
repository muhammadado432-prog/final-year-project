CREATE DATABASE library_db;
USE library_db;

-- Students table
CREATE TABLE students (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    MatricNumber VARCHAR(20) UNIQUE NOT NULL,
    FullName VARCHAR(100),
    Department VARCHAR(100),
    IsActive BOOLEAN DEFAULT TRUE
);

-- Librarians table
CREATE TABLE librarians (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    StaffId VARCHAR(20) UNIQUE NOT NULL,
    FullName VARCHAR(100),
    Department VARCHAR(100),
    IsActive BOOLEAN DEFAULT TRUE
);

-- Insert sample students
INSERT INTO students (Email, Password, MatricNumber, FullName, Department)
VALUES 
('john.doe@uniabuja.edu.ng', 'student123', 'UJ/2020/001', 'John Doe', 'Computer Science'),
('jane.smith@uniabuja.edu.ng', 'student123', 'UJ/2020/002', 'Jane Smith', 'Mathematics');

-- Insert sample librarians
INSERT INTO librarians (Email, Password, StaffId, FullName, Department)
VALUES 
('sarah.johnson@uniabuja.edu.ng', 'staff123', 'STF001', 'Dr. Sarah Johnson', 'Library Services'),
('ahmed.musa@uniabuja.edu.ng', 'staff123', 'STF002', 'Dr. Ahmed Musa', 'Library Services');