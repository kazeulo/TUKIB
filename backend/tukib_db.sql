-- ============================
-- Instructions for Running the SQL File
-- ============================
-- This SQL file contains the commands to create the contents of the 'tukib_db' database
-- and insert some dummy data for testing purposes.
--
-- Steps to run this SQL file:
--
-- **Option 1: Using Command Line (psql)**
-- 1. Open your terminal or command prompt.
-- 2. Connect to your PostgreSQL database using the command line tool (psql) by running:
--
--    psql -h localhost -U tukib -d tukib_db
--
-- 3. Once connected, run the SQL file by typing:
--
--    \i C:/Users/ASUS/Desktop/TUKIB/backend/tukib_db.sql
--    (Make sure to replace the path with the correct location of your file.)
--
-- **Option 2: Using pgAdmin**
-- 1. Open pgAdmin and connect to the database 'tukib_db'.
-- 2. Open the Query Tool, paste the content of this SQL file, and click 'Execute'.
--
-- 2. Once executed, all the scripts in this file will be executed.
--
-- **Important Note**: 
-- - **Do not modify** the existing SQL script. **Only add commands**.
-- - This script assumes that the PostgreSQL server is running and accessible.
-- - Ensure that the user 'tukib' has the necessary privileges to create tables and insert data.
-- ============================

-- ======== CREATES ========

-- Drop the 'users' table if it already exists, to prevent errors when re-running the script.
DROP TABLE IF EXISTS users;

-- Create the table 'users'
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,            -- Automatically generated unique ID for each user
    name VARCHAR(100) NOT NULL,            -- Name of the user
    email VARCHAR(255) NOT NULL UNIQUE,    -- Email must be unique
    role VARCHAR(50),                      -- Role of the user
    password VARCHAR(255) NOT NULL,        -- User password
    institution VARCHAR(255),              -- Institution the user is associated with
    contact_number VARCHAR(20),            -- User's contact number 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp for the last update
);

-- Add more CREATE statements here to create other tables (if needed)

-- ======== INSERTS ========

-- Inserting dummy data into the 'users' table
INSERT INTO users (name, email, role, password, institution, contact_number)
VALUES
    ('John Doe', 'johndoe@example.com', 'admin', 'adminpassword', 'University A', '123-456-7890'),
    ('Jane Smith', 'janesmith@example.com', 'client', 'clientpassword', 'University B', '234-567-8901'),
    ('Alice Johnson', 'alice.johnson@example.com', 'ur', 'urpassword', 'Institution C', '345-678-9012'),
    ('Bob Brown', 'bob.brown@example.com', 'tecd', 'tecdpassword', 'University A', '456-789-0123'),
    ('Charlie Lee', 'charlie.lee@example.com', 'director', 'directorpassword', 'Institution D', '567-890-1234');

-- ======== ALTERS ========

-- Add a foreign key reference if there’s a related table (optional example)
-- Note: Only run if your project has an 'institutions' table
-- ALTER TABLE users ADD CONSTRAINT fk_institution FOREIGN KEY (institution) REFERENCES institutions(id);

-- Example of adding a column to an existing table (you can add more ALTER commands as needed)
-- This example adds an 'address' column to the 'users' table.
-- ALTER TABLE users ADD COLUMN address VARCHAR(255);

-- ============================
-- Further Commands or ALTERs
-- ============================
-- Add any additional CREATE, INSERT, or ALTER commands here as necessary.
-- Be sure to test new changes to avoid conflicts and ensure synchronization with team members.
