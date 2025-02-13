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

-- Drop tables to ensure no errors when running
--====== DROPS =======
DROP TABLE IF EXISTS serviceRequestTable CASCADE;
DROP TABLE IF EXISTS usersTable CASCADE;
DROP TABLE IF EXISTS messagesTable;
DROP TABLE IF EXISTS newsTable;

-- ======== CREATES ========

-- Create the table 'users'
CREATE TABLE usersTable (
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

-- Create the 'service_request' table with requested changes already included
CREATE TABLE serviceRequestTable (
    request_id SERIAL PRIMARY KEY,                 -- Automatically generated unique ID for each request
    user_id INT NOT NULL,                          -- ID of the user who requested the service
    service_name VARCHAR(255) NOT NULL,            -- Name of the requested service
    status VARCHAR(50) NOT NULL,                   -- Status of the request (e.g., pending, completed, etc.)
    requested_by VARCHAR(100),                    -- Name of the user requesting the service
    payment_option VARCHAR(50),                    -- Payment option (e.g., credit card, invoice, etc.)
    charged_to_project BOOLEAN,                    -- Whether the charge is assigned to a project (TRUE/FALSE)
    project_title VARCHAR(255),                    -- Title of the associated project
    project_budget_code INT,                       -- Budget code for the project (integer)
    start TIMESTAMP NOT NULL,                      -- Start time of the service request
    "end" TIMESTAMP,                               -- End time of the service request
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES usersTable(user_id)  -- Foreign key referencing the 'users' table
);

-- Create the 'messagesTable' with the new columns 'sender_email' and 'body'
CREATE TABLE messagesTable (
    message_id SERIAL PRIMARY KEY,             -- Automatically generated unique ID for each message
    subject VARCHAR(255) NOT NULL,             -- Subject of the message
    sender VARCHAR(100) NOT NULL,              -- Sender of the message (name)
    sender_email VARCHAR(255) NOT NULL,        -- Sender's email address
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date when the message was sent
    body TEXT NOT NULL,                        -- Body of the message
    remarks VARCHAR(10) CHECK (remarks IN ('read', 'unread'))  -- Message status (read/unread)
);

CREATE TABLE newsTable (
    newsTable_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    dateposted TIMESTAMP,
    image BYTEA
);

-- PRIVILEGES

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tukib;

-- ======== INSERTS ========

-- Inserting dummy data into the 'users' table
INSERT INTO usersTable (name, email, role, password, institution, contact_number)
VALUES
    ('John Doe', 'johndoe@example.com', 'Admin', 'adminpassword', 'University A', '123-456-7890'),
    ('Jane Smith', 'janesmith@example.com', 'Client', 'clientpassword', 'University B', '234-567-8901'),
    ('Alice Johnson', 'alice.johnson@example.com', 'University Researcher', 'urpassword', 'Institution C', '345-678-9012'),
    ('Bob Brown', 'bob.brown@example.com', 'TECD Staff', 'tecdpassword', 'University A', '456-789-0123'),
    ('Charlie Lee', 'charlie.lee@example.com', 'Director', 'directorpassword', 'Institution D', '567-890-1234');

-- Inserting dummy data into the 'serviceRequestTable'
INSERT INTO serviceRequestTable (user_id, service_name, status, requested_by, payment_option, charged_to_project, project_title, project_budget_code, start, "end")
VALUES
    (1, 'Sample processing', 'Pending', 'John Doe', 'credit card', FALSE, NULL, 111, '2025-02-07 10:00:00', NULL),
    (1, 'Training', 'Completed', 'John Doe', 'gcash', TRUE, 'AI Project', '101', '2025-01-15 09:00:00', '2025-01-15 17:00:00'),
    (3, 'Equipment rental', 'In-progress',  'Alice Johnson', 'credit card', FALSE, NULL, NULL, '2025-02-05 08:30:00', NULL),
    (2, 'Facility rental', 'Pending', 'Jane Smith', 'credit card', TRUE, 'App Development', '102', '2025-02-10 09:00:00', NULL),
    (2, 'Sample processing', 'Completed', 'Jane Smith', 'f2f', TRUE, 'Market Research', '103', '2025-01-20 10:00:00', '2025-01-20 15:00:00');

-- Inserting dummy data into the 'messages' table
INSERT INTO messagesTable (subject, sender, sender_email, body, remarks)
VALUES
    ('Hillu', 'Sarah d', 'qws@example.com', 'hi mez hehe', 'unread'),
    ('test', 'BBM', 'qweerty.brown@example.com', 'test.', 'read');

-- ======== ALTERS ========

-- Add a foreign key reference if there’s a related table (optional example)
-- Note: Only run if your project has an 'institutions' table
-- ALTER TABLE users ADD CONSTRAINT fk_institution FOREIGN KEY (institution) REFERENCES institutions(id);

-- Example of adding a column to an existing table (you can add more ALTER commands as needed)
-- This example adds an 'address' column to the 'users' table.
-- ALTER TABLE users ADD COLUMN address VARCHAR(255);