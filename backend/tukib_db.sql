-- ============================
-- Instructions for Running the SQL File
-- ============================
-- This SQL file creates the 'tukib_db' database structure
-- and inserts some dummy data for testing purposes.
-- 
-- Steps to run this SQL file:
--
-- **Option 1: Using Command Line (psql)**
-- 1. Open your terminal or command prompt.
-- 2. Connect to your PostgreSQL database using:
--
--    psql -h localhost -U tukib -d tukib_db
--
-- 3. Run the SQL file by typing:
--
--    \i C:/Users/ASUS/Desktop/TUKIB/backend/tukib_db.sql
--    (Replace the path with the correct location of your file.)
--
-- **Option 2: Using pgAdmin**
-- 1. Open pgAdmin and connect to the database 'tukib_db'.
-- 2. Open the Query Tool, paste the content of this SQL file, and click 'Execute'.
--
-- **Important Notes**: 
-- - **Do not modify** the existing SQL script. **Only add commands**.
-- - Ensure that the user 'tukib' has the necessary privileges.
-- ============================

-- ======== DROPS ========
-- Drop tables in reverse order to avoid foreign key constraints
DROP TABLE IF EXISTS trainingRequests CASCADE;
DROP TABLE IF EXISTS serviceRequestTable CASCADE;
DROP TABLE IF EXISTS user_tokens CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS usersTable CASCADE;
DROP TABLE IF EXISTS messagesTable CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS equipmentsTable CASCADE;

-- ======== ENUM TYPES ========
-- Creating ENUM for lab partners
CREATE TYPE lab_enum AS ENUM (
  'Applied Chemistry',
  'Biology',
  'Foods Feeds',
  'Functional Nutrition (Food)',
  'Material Science and Nanotechnology',
  'Microbiology and Bioengineering'
);

-- ======== TABLE CREATION ========

-- Users Table
CREATE TABLE usersTable (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Tokens Table
CREATE TABLE user_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usersTable(user_id) ON DELETE CASCADE
);

-- Service Request Table
CREATE TABLE serviceRequestTable (
    request_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_option VARCHAR(50),
    charged_to_project BOOLEAN,
    project_title VARCHAR(255),
    project_budget_code INT,
    start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES usersTable(user_id) ON DELETE CASCADE
);

-- Training Requests Table
CREATE TABLE trainingRequests (
    trainingrequest_id SERIAL PRIMARY KEY,
    request_id INT NOT NULL,
    trainingTitle VARCHAR(255) NOT NULL,
    trainingDate DATE NOT NULL,
    participantCount INT NOT NULL,
    necessaryDocuments TEXT[], -- ✅ Fixed from "TYPE TEXT[]"
    acknowledgeTerms BOOLEAN NOT NULL,
    partnerLab lab_enum NOT NULL, -- ✅ Using ENUM instead of VARCHAR
    FOREIGN KEY (request_id) REFERENCES serviceRequestTable(request_id) ON DELETE CASCADE
);

-- Messages Table
CREATE TABLE messagesTable (
    message_id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    sender VARCHAR(100) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body TEXT NOT NULL,
    remarks VARCHAR(10) CHECK (remarks IN ('read', 'unread'))
);

-- News Table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
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

-- Indexes for performance
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_end_time ON events(end_time);

-- Equipments Table
CREATE TABLE equipmentsTable (
    equipment_id SERIAL PRIMARY KEY,
    availability BOOLEAN NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    quantity INT NOT NULL,
    model VARCHAR(255),
    serial_number VARCHAR(255),
    staff_name VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    sticker_paper_printed BOOLEAN NOT NULL
);

-- ======== PRIVILEGES ========
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tukib;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tukib;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tukib;

-- ======== INSERTING DUMMY DATA ========

-- Insert Dummy Users
INSERT INTO usersTable (name, email, role, password, institution, contact_number)
VALUES
    ('John Doe', 'johndoe@example.com', 'Admin', 'adminpassword', 'University A', '123-456-7890'),
    ('Jane Smith', 'janesmith@example.com', 'Client', 'clientpassword', 'University B', '234-567-8901');

-- Insert Dummy User Tokens
INSERT INTO user_tokens (user_id, token, expires_at)
VALUES
    (1, 'dummy-jwt-token-for-johndoe', '2025-12-31 23:59:59'),
    (2, 'dummy-jwt-token-for-janesmith', '2025-12-31 23:59:59');

-- Insert Dummy Messages
INSERT INTO messagesTable (subject, sender, sender_email, body, remarks)
VALUES
    ('Hello', 'Sarah', 'sarah@example.com', 'Hi there!', 'unread'),
    ('Test', 'BBM', 'bbm@example.com', 'This is a test.', 'read');

-- Insert Dummy Events
INSERT INTO events (title, description, start_time, end_time, location, created_by, is_recurring, recurrence_pattern)
VALUES
('Project Kickoff', 'Initial meeting to discuss the project scope.', '2025-02-20 10:00:00', '2025-02-21 11:00:00', 'Conference Room A', 1, FALSE, NULL),
('Client Presentation', 'Project progress presentation.', '2025-03-05 14:00:00', '2025-03-05 15:30:00', 'Client Office', 1, FALSE, NULL);

-- Insert Dummy Equipments
INSERT INTO equipmentsTable (availability, equipment_name, brand, quantity, model, serial_number, staff_name, location, sticker_paper_printed)
VALUES
    (TRUE, 'Microbiological Incubator', 'BrandA', 5, 'Model1', 'SN123456', 'John Doe', 'Microbiology Lab', TRUE),
    (TRUE, 'Projector', 'BrandB', 3, 'ModelX', 'SN789012', 'Jane Smith', 'AV Hall', TRUE);


-- ======== ALTERS ========

-- Add a foreign key reference if there’s a related table (optional example)
-- Note: Only run if your project has an 'institutions' table
-- ALTER TABLE users ADD CONSTRAINT fk_institution FOREIGN KEY (institution) REFERENCES institutions(id);

-- Example of adding a column to an existing table (you can add more ALTER commands as needed)
-- This example adds an 'address' column to the 'users' table.
-- ALTER TABLE users ADD COLUMN address VARCHAR(255);