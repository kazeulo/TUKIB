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

DROP TABLE IF EXISTS trainingRequests CASCADE;
DROP TABLE IF EXISTS serviceRequestTable CASCADE;
DROP TABLE IF EXISTS user_tokens CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS usersTable;
DROP TABLE IF EXISTS messagesTable;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS equipmentsTable;

-- ======== CREATES ========

-- Create the table 'usersTable'
CREATE TABLE usersTable (
    user_id SERIAL PRIMARY KEY,            -- Automatically generated unique ID for each user
    name VARCHAR(100) NOT NULL,            -- Name of the user
    email VARCHAR(255) NOT NULL UNIQUE,    -- Email must be unique
    role VARCHAR(50),                      -- Role of the user
    password VARCHAR(255) NOT NULL,        -- User password
    institution VARCHAR(255),              -- Institution the user is associated with
    contact_number VARCHAR(20),            -- User's contact number 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the user was created
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp for the last update
);

-- Create the table 'user_tokens'
CREATE TABLE user_tokens (
    token_id SERIAL PRIMARY KEY,            -- Automatically generated unique ID for each token
    user_id INT NOT NULL,                   -- ID of the user who owns the token
    token VARCHAR(255) NOT NULL,            -- The token (e.g., JWT)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the token was created
    expires_at TIMESTAMP,                  -- The expiration time for the token
    FOREIGN KEY (user_id) REFERENCES usersTable(user_id) ON DELETE CASCADE
);

-- Create the table 'serviceRequestTable'
CREATE TABLE serviceRequestTable (
    request_id SERIAL PRIMARY KEY,                 -- Automatically generated unique ID for each request
    user_id INT NOT NULL,                          -- ID of the user who requested the service
    service_name VARCHAR(255) NOT NULL,            -- Name of the requested service
    status VARCHAR(50) NOT NULL,                   -- Status of the request (e.g., pending, completed, etc.)
    payment_option VARCHAR(50),                    -- Payment option (e.g., credit card, invoice, etc.)
    charged_to_project BOOLEAN,                    -- Whether the charge is assigned to a project (TRUE/FALSE)
    project_title VARCHAR(255),                    -- Title of the associated project
    project_budget_code INT,                       -- Budget code for the project (integer)
    start TIMESTAMP NOT NULL,                      -- Start time of the service request
    "end" TIMESTAMP,                               -- End time of the service request
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES usersTable(user_id) ON DELETE CASCADE  -- Foreign key referencing the 'users' table
);

-- Create the table 'trainingRequests'
CREATE TABLE trainingRequests (
    trainingrequest_id SERIAL PRIMARY KEY,
    request_id INT NOT NULL,                            -- Automatically generated unique ID for each request
    trainingTitle VARCHAR(255) NOT NULL,                       -- Training title (required)
    trainingDate DATE NOT NULL,                                -- Training date (required)
    participantCount INT NOT NULL,                             -- Number of participants (required)
    necessaryDocuments VARCHAR(255),                           -- Path or filename of the uploaded document (nullable)
    acknowledgeTerms BOOLEAN NOT NULL,                         -- Acknowledgement of terms and conditions (required)
    partnerLab partner_lab NOT NULL,                     -- Partner lab (required)
    FOREIGN KEY (request_id) REFERENCES serviceRequestTable(request_id) ON DELETE CASCADE  -- Foreign key referencing the 'usersTable'
);

-- Create the table 'messagesTable'
CREATE TABLE messagesTable (
    message_id SERIAL PRIMARY KEY,             -- Automatically generated unique ID for each message
    subject VARCHAR(255) NOT NULL,             -- Subject of the message
    sender VARCHAR(100) NOT NULL,              -- Sender of the message (name)
    sender_email VARCHAR(255) NOT NULL,        -- Sender's email address
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date when the message was sent
    body TEXT NOT NULL,                        -- Body of the message
    remarks VARCHAR(10) CHECK (remarks IN ('read', 'unread'))  -- Message status (read/unread)
);

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the table 'eventsTable'
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_by INT NOT NULL, 
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create an index to speed up queries on frequently searched columns
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_end_time ON events(end_time);

-- Create the table 'equipmentsTable'
CREATE TABLE equipmentsTable (
    equipment_id SERIAL PRIMARY KEY,               -- Automatically generated unique ID for each equipment
    availability BOOLEAN NOT NULL,                 -- Availability status of the equipment (TRUE/FALSE)
    equipment_name VARCHAR(255) NOT NULL,          -- Name of the equipment
    brand VARCHAR(255),                            -- Brand of the equipment
    quantity INT NOT NULL,                         -- Quantity of the equipment
    model VARCHAR(255),                            -- Model of the equipment
    serial_number VARCHAR(255),                    -- Serial number of the equipment
    staff_name VARCHAR(255),                       -- Name of the staff responsible (accountable officer)
    location VARCHAR(255) NOT NULL,                -- Location where the equipment is used/stored
    sticker_paper_printed BOOLEAN NOT NULL         -- Whether a sticker is printed for the equipment (TRUE/FALSE)
);

-- ======== PRIVILEGES ========

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tukib;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tukib;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tukib;

-- ======== INSERTS ========

-- Inserting dummy data into the 'users' table
INSERT INTO usersTable (name, email, role, password, institution, contact_number)
VALUES
    ('John Doe', 'johndoe@example.com', 'Admin', 'adminpassword', 'University A', '123-456-7890'),
    ('Jane Smith', 'janesmith@example.com', 'Client', 'clientpassword', 'University B', '234-567-8901'),
    ('Alice Johnson', 'alice.johnson@example.com', 'University Researcher', 'urpassword', 'Institution C', '345-678-9012'),
    ('Bob Brown', 'bob.brown@example.com', 'TECD Staff', 'tecdpassword', 'University A', '456-789-0123'),
    ('Charlie Lee', 'charlie.lee@example.com', 'Director', 'directorpassword', 'Institution D', '567-890-1234');

-- Inserting dummy data into the 'user_tokens' table
INSERT INTO user_tokens (user_id, token, expires_at)
VALUES
    (1, 'dummy-jwt-token-for-johndoe', '2025-12-31 23:59:59'),
    (2, 'dummy-jwt-token-for-janesmith', '2025-12-31 23:59:59'),
    (3, 'dummy-jwt-token-for-alicejohnson', '2025-12-31 23:59:59'),
    (4, 'dummy-jwt-token-for-bobbrown', '2025-12-31 23:59:59'),
    (5, 'dummy-jwt-token-for-charlielee', '2025-12-31 23:59:59');

-- Inserting dummy data into the 'messages' table
INSERT INTO messagesTable (subject, sender, sender_email, body, remarks)
VALUES
    ('Hillu', 'Sarah d', 'qws@example.com', 'hi mez hehe', 'unread'),
    ('test', 'BBM', 'qweerty.brown@example.com', 'test.', 'read');

-- Inserting dummy data into the 'events' table
INSERT INTO events (title, description, start_time, end_time, location, created_by, is_recurring, recurrence_pattern)
VALUES
('Project Kickoff', 'Initial meeting to discuss the project scope and goals.', '2025-02-20 10:00:00', '2025-02-21 11:00:00', 'Conference Room A', 1, FALSE, NULL),
('Weekly Standup', 'Team standup meeting for project updates.', '2025-02-21 09:00:00', '2025-02-21 09:30:00', 'Online', 2, TRUE, 'weekly'),
('Client Presentation', 'Presentation of project progress to the client.', '2025-03-05 14:00:00', '2025-03-10 15:30:00', 'Client Office', 1, FALSE, NULL),
('Code Review', 'Weekly code review session.', '2025-02-24 11:00:00', '2025-02-26 12:00:00', 'Online', 3, TRUE, 'weekly'),
('Team Outing', 'Team bonding event at a local restaurant.', '2025-02-25 17:00:00', '2025-02-25 19:00:00', 'Downtown Restaurant', 4, FALSE, NULL);


-- Inserting dummy data into the 'equuipments' table
INSERT INTO equipmentsTable (availability, equipment_name, brand, quantity, model, serial_number, staff_name, location, sticker_paper_printed)
VALUES
    (TRUE, 'Microbiological Incubator', 'BrandA', 5, 'Incubator-Model1', 'SN123456', 'John Doe', 'Microbiology Lab', TRUE),
    (TRUE, 'Projector', 'BrandB', 3, 'Projector-ModelX', 'SN789012', 'Jane Smith', 'AV Hall', TRUE),
    (TRUE, 'Spray Dryer', 'Buchi', 2, 'Mini Spray Dryer B_290', 'SN345678', 'Alice Johnson', 'Food, Feeds, Functional, Nutrition Lab', TRUE);

-- ======== ALTERS ========

-- Add a foreign key reference if there’s a related table (optional example)
-- Note: Only run if your project has an 'institutions' table
-- ALTER TABLE users ADD CONSTRAINT fk_institution FOREIGN KEY (institution) REFERENCES institutions(id);

-- Example of adding a column to an existing table (you can add more ALTER commands as needed)
-- This example adds an 'address' column to the 'users' table.
-- ALTER TABLE users ADD COLUMN address VARCHAR(255);