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
DROP TABLE IF EXISTS sampleProcessingRequests CASCADE;
DROP TABLE IF EXISTS equipmentRentalRequests CASCADE;
DROP TABLE IF EXISTS facilityRentalRequests CASCADE;
DROP TABLE IF EXISTS serviceRequestTable CASCADE;
DROP TABLE IF EXISTS user_tokens CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS usersTable CASCADE;
DROP TABLE IF EXISTS messagesTable CASCADE;
DROP TABLE IF EXISTS news_table CASCADE;
DROP TABLE IF EXISTS equipmentsTable CASCADE;
DROP TABLE IF EXISTS facilitiesTable CASCADE;
DROP TABLE IF EXISTS laboratories CASCADE;
DROP TYPE IF EXISTS roles CASCADE;
DROP TYPE IF EXISTS payment_option CASCADE;
DROP TYPE IF EXISTS service_type CASCADE;

-- ======== ENUM TYPES ========

CREATE TYPE roles as ENUM (
    'Admin Staff',
    'Client',
    'University Researcher',
    'TECD Staff',
    'Director'
);
-- Creating ENUM for laboratories
CREATE TYPE payment_option AS ENUM (
  'Cash',
  'Charged to Project'
);

CREATE TYPE service_type AS ENUM(
    'Training',
    'Sample Processing',
    'Use of Equipment',
    'Use of Facility'
);

-- ======== TABLE CREATION ========

-- Laboratories Table
CREATE TABLE laboratories (
    laboratory_id SERIAL PRIMARY KEY,
    laboratory_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE usersTable (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role roles NOT NULL,
    password VARCHAR(255) NOT NULL,
    laboratory_id INTEGER,
    institution VARCHAR(255),
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(laboratory_id) ON DELETE CASCADE
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

-- Facilities table
CREATE TABLE facilitiesTable (
    facility_id SERIAL PRIMARY KEY,
    facility_name VARCHAR(100) NOT NULL, 
    capacity INT NOT NULL, 
    resources TEXT[]
);

-- Service Request Table
CREATE TABLE serviceRequestTable (
    request_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    service_name service_type NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_option payment_option NOT NULL,
    start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP,
    approved_by INT,
    FOREIGN KEY (user_id) REFERENCES usersTable(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (approved_by) REFERENCES usersTable(user_id) ON DELETE CASCADE
);

-- Training Requests Table
CREATE TABLE trainingRequests (
    trainingrequest_id SERIAL PRIMARY KEY,
    request_id INT NOT NULL,
    trainingTitle VARCHAR(255) NOT NULL,
    trainingDate DATE NOT NULL,
    participantCount INT NOT NULL,
    acknowledgeTerms BOOLEAN NOT NULL,
    partnerLab VARCHAR(100) NOT NULL,
    project_title VARCHAR(255),
    project_budget_code VARCHAR(50),
    proofOfFunds TEXT,
    paymentConforme TEXT,
    additionalInformation TEXT,
    necessaryDocuments TEXT[],
    FOREIGN KEY (request_id) REFERENCES serviceRequestTable(request_id) ON DELETE CASCADE
);

-- Sample Processing Requests Table
CREATE TABLE sampleProcessingRequests (
    sampleprocessing_request_id SERIAL PRIMARY KEY,
    laboratory VARCHAR(100) NOT NULL,
    request_id INT NOT NULL,
    type_of_analysis VARCHAR(50) NOT NULL,
    sample_type VARCHAR (50) NOT NULL,
    sample_description TEXT NOT NULL,
    sample_volume VARCHAR(100),
    method_settings VARCHAR NOT NULL,
    sample_hazard_description TEXT NOT NULL,
    schedule_of_sample_submission DATE NOT NULL,
    project_title VARCHAR(255),
    project_budget_code VARCHAR(50),
    proofOfFunds TEXT,
    paymentConforme TEXT,
    additional_information TEXT,
    necessaryDocuments TEXT[],
    FOREIGN KEY (request_id) REFERENCES serviceRequestTable(request_id) ON DELETE CASCADE
);

-- Equipment rental requests table
CREATE TABLE equipmentRentalRequests (
    equipmentRental_request_id SERIAL PRIMARY KEY,
    request_id INT NOT NULL,
    authorized_representative VARCHAR(50) NOT NULl,
    laboratory VARCHAR(255) NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_settings TEXT NOT NULL,
    sample_type VARCHAR(255) NOT NULL,
    sample_description TEXT NOT NULL,
    sample_volume VARCHAR(100) NOT NULL,
    sample_hazard_description TEXT NOT NULL,
    schedule_of_use DATE NOT NULL,
    estimated_use_duration VARCHAR(50) NOT NULL,
    project_title VARCHAR(255),
    project_budget_code VARCHAR(50),
    proofOfFunds TEXT,
    paymentConforme TEXT,
    additional_information TEXT,
    necessaryDocuments TEXT[],
    FOREIGN KEY (request_id) REFERENCES serviceRequestTable(request_id) ON DELETE CASCADE
);

-- Facility rental requests table
CREATE TABLE facilityRentalRequests (
    facilityRental_request_id SERIAL PRIMARY KEY,
    request_id INT NOT NULL,
    selected_facility INT NOT NULL,
    purpose_of_use VARCHAR(255),
    project_title VARCHAR(255),
    project_budget_code VARCHAR(50),
    proofOfFunds TEXT,
    paymentConforme TEXT,
    start_of_use TIMESTAMP NOT NULL,
    end_of_use TIMESTAMP NOT NULL,
    participant_count INT NOT NULL,
    additional_information TEXT,
    acknowledge_terms BOOLEAN NOT NULL DEFAULT FALSE,
    necessaryDocuments TEXT[],
    FOREIGN KEY (request_id) REFERENCES serviceRequestTable(request_id) ON DELETE CASCADE,
    FOREIGN KEY (selected_facility) REFERENCES facilitiesTable(facility_id) ON DELETE CASCADE
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
CREATE TABLE news_table (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Service Requests Table
-- CREATE TABLE  (
--     id SERIAL PRIMARY KEY,
--     service TEXT,
--     first_name TEXT,
--     last_name TEXT,
--     email TEXT,
--     affiliation TEXT,
--     lab_partner TEXT,
--     facility TEXT,
--     start_date DATE,
--     end_date DATE
-- );

-- ======== PRIVILEGES ========
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tukib;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tukib;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tukib;

-- ======== INSERTING DUMMY DATA ========

INSERT INTO laboratories (laboratory_name)
VALUES
    ('Applied Chemistry'),
    ('Biology'),
    ('Foods, Feeds and Functional Nutrition'),
    ('Material Science'),
    ('Microbiology and Bioengineering');

-- Inserting dummy data into the 'users' table
INSERT INTO usersTable (name, email, role, password, laboratory_id, institution, contact_number)
VALUES
    ('John Doe', 'johndoe@example.com', 'Admin Staff', 'adminpassword', NULL, 'University A', '123-456-7890'),
    ('Jane Smith', 'janesmith@example.com', 'Client', 'clientpassword', NULL, 'University B', '234-567-8901'),
    ('Bob Brown', 'bob.brown@example.com', 'TECD Staff', 'tecdpassword', NULL, 'University A', '456-789-0123'),
    ('Charlie Lee', 'charlie.lee@example.com', 'Director', 'directorpassword', NULL, 'Institution D', '567-890-1234'),
    ('Marc Hualde', 'client@example.com', 'Client', 'password', NULL, 'UPV', '09123456789'),

    -- University Researchers: Each one in a different lab
    ('Alice Chem', 'alice.chem@example.com', 'University Researcher', 'pass1', '1', 'Inst A', '111-111-1111'),
    ('Bob Bio', 'bob.bio@example.com', 'University Researcher', 'pass2', '2', 'Inst B', '222-222-2222'),
    ('Carol Food', 'carol.food@example.com', 'University Researcher', 'pass3', '3', 'Inst C', '333-333-3333'),
    ('Dave Nano', 'dave.nano@example.com', 'University Researcher', 'pass4', '4', 'Inst D', '444-444-4444'),
    ('Eve Micro', 'eve.micro@example.com', 'University Researcher', 'pass5', '5', 'Inst E', '555-555-5555');

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

-- Insert dummy data into 'facilities' table
INSERT INTO facilitiesTable (facility_name, capacity, resources)
VALUES
    ('Audio/Visual Room', 50, ARRAY['Projector', 'Speakers', 'Microphones']),
    ('Collaboration Room', 20, ARRAY['Whiteboard', 'Projector', 'Video Conferencing Equipment']),
    ('Conference Room A', 30, ARRAY['Projector', 'Table', 'Chairs']);

-- Inserting dummy data into 'serviceRequestTable'
INSERT INTO serviceRequestTable (user_id, service_name, status, payment_option, start, "end", approved_by)
VALUES
    (6, 'Training', 'Pending', 'Cash', '2025-03-01 09:00:00', '2025-03-01 12:00:00', 4),
    (2, 'Sample Processing', 'Completed', 'Cash', '2025-03-02 10:00:00', '2025-03-02 15:00:00', 3),
    (2, 'Use of Equipment', 'Approved', 'Cash', '2025-03-05 08:00:00', '2025-03-05 17:00:00', 3),
    (6, 'Use of Facility', 'Pending', 'Cash', '2025-03-10 09:00:00', '2025-03-10 18:00:00', 1),
    (6, 'Use of Facility', 'Pending', 'Cash', '2025-04-10 09:00:00', '2025-04-10 18:00:00', 1);

-- Inserting dummy data into 'trainingRequests'
INSERT INTO trainingRequests (request_id, trainingTitle, trainingDate, participantCount, acknowledgeTerms, partnerLab, project_title, project_budget_code, proofOfFunds, paymentConforme, additionalInformation, necessaryDocuments)
VALUES
    (1, 'Advanced Chemistry Training', '2025-03-01 18:00:00', 15, TRUE, 'Applied Chemistry', 'Chemistry Research', 
        'AC123', 'NA', 'NA', 'Additional info for training', ARRAY['Document9.pdf', 'Document10.pdf']),
    (2, 'Biology Sample Processing Training', '2025-04-30 18:00:00', 10, TRUE, 'Biology', 'Bio Research', 'BR456', 
        'NA', 'NA', 'Additional info for training', ARRAY['Document9.pdf', 'Document10.pdf']);

-- Inserting dummy data into 'equipmentRentalRequests'
INSERT INTO equipmentRentalRequests (request_id, authorized_representative, laboratory, equipment_name, equipment_settings, sample_type, sample_description, sample_volume, sample_hazard_description, schedule_of_use, estimated_use_duration, project_title, project_budget_code, proofOfFunds, paymentConforme, additional_information, necessaryDocuments)
VALUES
    (3, 'John Doe', 'Material Science and Nanotechnology', 'Electron Microscope', 'High magnification', 
    'Tissue', 'Electron microscopy for tissue sample analysis', '10 ml', 'Handle with care', '2025-04-05 18:00:00', 
    '5 hours', 'Nano Research', 'NR789', 'Proof of funds document', 'Payment conforms', 
    'Additional equipment details', ARRAY['Document9.pdf', 'Document10.pdf']);

-- Inserting dummy data into 'facilityRentalRequests'
INSERT INTO facilityRentalRequests (
    request_id, purpose_of_use, project_title, project_budget_code, proofOfFunds, 
    paymentConforme, selected_facility, start_of_use, end_of_use, participant_count, 
    additional_information, acknowledge_terms, necessaryDocuments)
VALUES
    (4, 'Research Presentation', 'NA', 'NA', 'NA', 'NA', 1, '2025-05-10 09:00:00', '2025-05-10 18:00:00', 30, 'Conference presentation details', TRUE, ARRAY['Document9.pdf', 'Document10.pdf']),
    (5, 'Hybrid Seminar', 'NA', 'NA', 'NA', 'NA', 2, '2025-04-30 09:00:00', '2025-04-30 18:00:00', 30, 'Seminar presentation details', TRUE, ARRAY['Document9.pdf', 'Document10.pdf']);

-- Inserting dummy data into 'sampleProcessingRequests' table
INSERT INTO sampleProcessingRequests 
    (laboratory, request_id, type_of_analysis, sample_type, sample_description, sample_volume, 
     method_settings, sample_hazard_description, schedule_of_sample_submission, project_title, 
     project_budget_code, proofOfFunds, paymentConforme, additional_information, necessaryDocuments)
VALUES
    -- Sample 1: Linked to 'serviceRequestTable' request_id 2 (Sample Processing)
    ('Microbiology and Bioengineering', 2, 'Bacterial Identification', 'Water Sample', 
     'Testing for bacteria in water', '500 ml', 'Incubation at 37°C for 48 hours', 
     'Handle with care. Potential for contamination', '2025-04-30 18:00:00', 'Water Quality Research', 
     'WQ123', 'NA', 'NA', 'Water sample testing for bacteria', ARRAY['Sample1.pdf', 'ConsentForm.pdf']);

-- inserting dummy data on news table
INSERT INTO news_table (title, content, category, type, created_at)
VALUES
    ('RRC welcomes its new additional researchers', 
    'The University of the Philippines Visayas - Regional Research Center welcomes its two (2) new additional researchers for the Material Science and Nanotechnology Laboratory. 
Engr. Leonard King Jao is an alumnus of the B.S. in Chemical Engineering program of the UPV School of Technology, and is also currently taking up his Master of Chemistry under the UPV Graduate School and UPV Department of Chemistry - College of Arts and Sciences. Engr. Jao is the newly appointed University Researcher 1 and laboratory-in-charge of the MSN Laboratory. Ms. Joanna Mae C. Mong, RFP, is an alumna of the B.S. in Fisheries program of the College of Fisheries and Ocean Sciences, UP Visayas. Ms. Mong is the newly appointed Science Research Analyst of the MSN Laboratory.
Their appointment to the UPV RRC MSN Laboratory also signifies the reopening of the services of the said laboratory. To avail these services or for future collaborative activities, please follow our Facebook page or email us at rrc.upvisayas@up.edu.ph. 
#RRCUPdates #UPVRRC #SDG17PartnershipsfortheGoals', 
    'General', 
    'News', 
    NOW()),
    ('RRC Conducts Lab Tour for Aqua Sci 1 Students', 
    'The UP Visayas Regional Research Center conducted a laboratory and facilities tour last November 4, 2024 for a General Education (GE) course – Aquatic Science 1 (<i>People and the Aquatic World</i>) Section 4 students under the class of Prof. Liah Catedrilla of the College of Fisheries and Ocean Sciences, UP Visayas. The students got to know UPV RRC more, especially its services, and the people through a quick audio-visual presentation. It was then followed with a quick building tour and a short research presentation on some of the completed and ongoing research projects at the UPV RRC, specifically the Farm to Fashion (Natural Textile Fiber yarn value chain), Product optimization of <i>Tegillarca granosa</i> (Blood cockle – Litob), and Dried Microalgae Biomass. The facility tour had also a quick stop at the Philippine Genome Center - Visayas prior to wrapping it up.', 
    'General', 
    'News', 
    NOW());

-- Insert two announcements
INSERT INTO news_table (title, content, category, type, created_at)
VALUES
  ('Important Announcement 1', 'Content for Important Announcement 1...', 'Biology', 'Announcement', NOW()),
  ('2025 RRC Open House and Launching of the RRC i2i Makerspace (Idea to Innovation)', 
  'The UPV Regional Research Center (RRC), together with its building partners SERDAC, TTBDO, NICER and PGC-Visayas, will be hosting the 2025 RRC Open House and the Launching of the RRC i2i Makerspace (Idea to Innovation) and RRC Phase IV Architecture Plan on February 26, 2025.
    The open house aims to showcase the center’s capabilities, state-of-the-art laboratories, and existing equipment and instruments to the UPV community and external stakeholders.
    Those who are interested are encouraged to register through the following links, according to the corresponding time schedule. The open house is open to all UPV employees and students, limited to 80 slots per batch only.
    Batch 1 - https://forms.gle/7PzKqyoGhyB2cRk86
    Batch 2 - https://forms.gle/oL6ZnF2JDjnMGUBn9
    Batch 3 - https://forms.gle/Qz7gXbyK56gPrkRMA
    Batch 4 - https://forms.gle/HHXmcjUS7AWPVr3b9', 
  'General', 
  'Announcement', 
  NOW());
-- ======== ALTERS ========

-- Add a foreign key reference if there’s a related table (optional example)
-- Note: Only run if your project has an 'institutions' table
-- ALTER TABLE users ADD CONSTRAINT fk_institution FOREIGN KEY (institution) REFERENCES institutions(id);

-- Example of adding a column to an existing table (you can add more ALTER commands as needed)
-- This example adds an 'address' column to the 'users' table.
-- ALTER TABLE users ADD COLUMN address VARCHAR(255);