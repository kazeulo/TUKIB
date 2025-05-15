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
DROP TABLE IF EXISTS equipmentsTable CASCADE;
DROP TABLE IF EXISTS usersTable CASCADE;
DROP TABLE IF EXISTS messagesTable CASCADE;
DROP TABLE IF EXISTS news_table CASCADE;
DROP TABLE IF EXISTS facilitiesTable CASCADE;
DROP TABLE IF EXISTS laboratories CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS feedback_table CASCADE;
DROP TABLE IF EXISTS rates_and_services CASCADE;
DROP TABLE IF EXISTS calendar CASCADE;

DROP TYPE IF EXISTS roles CASCADE;
DROP TYPE IF EXISTS payment_option CASCADE;
DROP TYPE IF EXISTS service_type CASCADE;

DROP TYPE IF EXISTS gender_enum CASCADE;
DROP TYPE IF EXISTS role_enum CASCADE;
DROP TYPE IF EXISTS servicetype_enum CASCADE;
DROP TYPE IF EXISTS satisfaction_enum CASCADE;
DROP TYPE IF EXISTS yesno_enum CASCADE;
DROP TYPE IF EXISTS system_enum CASCADE;

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
  'Pay at University Registrar',
  'Charged to Project'
);

CREATE TYPE service_type AS ENUM(
    'Training',
    'Sample Processing',
    'Use of Equipment',
    'Use of Facility'
);

-- ENUM for feedback
CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE role_enum AS ENUM ('SR', 'RA', 'Other');
CREATE TYPE servicetype_enum AS ENUM ('sample-processing', 'equipment-rental', 'facility-rental', 'training');
CREATE TYPE satisfaction_enum AS ENUM ('Very satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very unsatisfied');
CREATE TYPE yesno_enum AS ENUM ('Yes', 'No');
CREATE TYPE system_enum AS ENUM ('Manual System', 'Online System');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'inactive');

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
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status user_status DEFAULT 'pending',
    failed_attempts INTEGER DEFAULT 0,
    last_failed_attempt TIMESTAMP,
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

-- Calendar Table
CREATE TABLE calendar (
    calendar_id SERIAL PRIMARY KEY,
    calendar_type VARCHAR(50) NOT NULL, -- 'system', 'lab', 'equipment'
    calendar_owner_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_restricted BOOLEAN DEFAULT FALSE,
    restrict_equipment BOOLEAN DEFAULT FALSE, -- for lab-level only
    description TEXT
);

-- Equipments Table
CREATE TABLE equipmentsTable (
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    quantity INT NOT NULL,
    model VARCHAR(255),
    serial_number VARCHAR(255),
    staff_name VARCHAR(255),
    laboratory_id INT NOT NULL,
    sticker_paper_printed BOOLEAN NOT NULL,
    remarks TEXT,
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(laboratory_id) ON DELETE SET NULL
);

-- Facilities table
CREATE TABLE facilitiesTable (
    facility_id SERIAL PRIMARY KEY,
    facility_name VARCHAR(100) NOT NULL, 
    capacity INT NOT NULL, 
    resources TEXT[]
);

CREATE TABLE serviceRequestTable (
    request_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    request_code VARCHAR(20),
    service_name service_type NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_option payment_option NOT NULL,
    start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP,
    approved_by INT,
    rejection_reason TEXT,
    payment_receipt TEXT,
    charge_slip TEXT,
    result TEXT,
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
    location VARCHAR(255),
    created_by INT,
    officer VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT,
    recurrence VARCHAR(50) DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedback_table (
    feedback_id SERIAL PRIMARY KEY,
    age INT NOT NULL,
    gender gender_enum NOT NULL,
    role role_enum NOT NULL,
    servicetype servicetype_enum NOT NULL,
    satisfaction satisfaction_enum NOT NULL,
    staffResponsiveness satisfaction_enum NOT NULL,
    equipmentCondition satisfaction_enum NOT NULL,
    facilityCleanliness satisfaction_enum NOT NULL,
    serviceEfficiency satisfaction_enum NOT NULL,
    waitingTime satisfaction_enum NOT NULL,
    systemHelpfulness yesno_enum NOT NULL,
    systemPreference system_enum NOT NULL,
    additionalComments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the rates_and_services table (data taken from rates.docx) (to use in forms)
CREATE TABLE rates_and_services (
    service_id SERIAL PRIMARY KEY,
    service_type VARCHAR(50) NOT NULL,
    laboratory VARCHAR(100) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    rate_fee VARCHAR(100) NOT NULL,
    inclusions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restricted_dates (
    id SERIAL PRIMARY KEY,
    resource_type VARCHAR(50) NOT NULL,  -- 'equipment', 'laboratory', 'facility'
    resource_id INTEGER NOT NULL,
    restricted_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (resource_type, resource_id, restricted_date)
);



-- Indexes for performance
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_end_time ON events(end_time);
CREATE INDEX idx_rates_services_type ON rates_and_services(service_type);
CREATE INDEX idx_rates_services_lab ON rates_and_services(laboratory);

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
GRANT ALL PRIVILEGES ON rates_and_services TO tukib;
GRANT USAGE, SELECT ON SEQUENCE rates_and_services_service_id_seq TO tukib;
-- ======== INSERTING DUMMY DATA ========

INSERT INTO laboratories (laboratory_name)
VALUES
    ('Applied Chemistry'),
    ('Biology'),
    ('Foods, Feeds and Functional Nutrition'),
    ('Material Science'),
    ('Microbiology and Bioengineering');

-- Inserting dummy data into the 'users' table
-- refer to commented passwords when loggin in since i implemented hashing na
INSERT INTO usersTable (name, email, role, password, laboratory_id, institution, contact_number)
VALUES
    ('John Doe', 'johndoe@example.com', 'Admin Staff', '$2b$10$DkvpcVu.7X9Xb2xOCSY0VeBT7UAB1YGVQ.HOKiLRmPO5FnF3mbcw2', NULL, 'University A', '123-456-7890'), 
    -- password: adminpassword
    ('Jane Smith', 'janesmith@example.com', 'Client', '$2b$10$7tGvGvbCzIHkcjogqYy4CeIwI9bNtkFF4/9.Ifu6x5zbCojqtzzei', NULL, 'University B', '234-567-8901'),
    -- password: clientpassword
    ('Bob Brown', 'bob.brown@example.com', 'TECD Staff', '$2b$10$uUNkJvyx5wR/ALJg4F66Cu42VXaIHarJ7v31GsIFmXGN7JImlszDe', NULL, 'University A', '456-789-0123'),
    -- password: tecdpassword
    ('Charlie Lee', 'charlie.lee@example.com', 'Director', '$2b$10$25eXOjKIZkEmFi5o9cjmY.8WEl2eFZW0GCMdL1Cezwz7GF1.j2i62', NULL, 'Institution D', '567-890-1234'),
    -- password: directorpassword

    -- University Researchers: Each one in a different lab
    ('Chemistry Lab', 'chem@example.com', 'University Researcher', '$2b$10$98XG8za6HJAMA3uLgaVlz.UrA2nT09TlbfyhtUnlZ13tr61h2Kjty', '1', 'Inst A', '111-111-1111'),
    -- password: chemistryrrc
    ('Biology Lab', 'bio@example.com', 'University Researcher', '$2b$10$NR9q5BMMmuy01IOepqvKvefsXpnOJE4WRjK0G6O1CrthKv4TUdaIC', '2', 'Inst B', '222-222-2222'),
    -- password: biologyrrc
    ('Food Lab', 'food@example.com', 'University Researcher', '$2b$10$Q83dNjmIJlfUUtOjZ.ubfOCiSuhVC/lcrn.N3tsU59fNWUvEAYFWe', '3', 'Inst C', '333-333-3333'),
    -- password: foodrrc
    ('Nano Lab', 'nano@example.com', 'University Researcher', '$2b$10$hunAg90OYnaOQTy5owf4c.6J6GyZZ/QAPej1g04DHtFsYujJGoE6C', '4', 'Inst D', '444-444-4444'),
    -- password: nanorrc
    ('Micro Lab', 'micro@example.com', 'University Researcher', '$2b$10$wRtBanxhTk9RGAzVA7CqauYIVQ811cbKuiRWAg9ppChVXbaoDZLsK', '5', 'Inst E', '555-555-5555');
    -- password: microrrc

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

-- Insert dummy data into 'facilities' table
INSERT INTO facilitiesTable (facility_name, capacity, resources)
VALUES
    ('Audio/Visual Room', 50, ARRAY['Projector', 'Speakers', 'Microphones']),
    ('Collaboration Room', 20, ARRAY['Whiteboard', 'Projector', 'Video Conferencing Equipment']),
    ('Conference Room A', 30, ARRAY['Projector', 'Table', 'Chairs']);

-- Insert Dummy Equipments
-- Inserting Equipment for Applied Chemistry Lab
INSERT INTO equipmentsTable (equipment_name, brand, quantity, model, serial_number, staff_name, laboratory_id, sticker_paper_printed)
VALUES
    ('Analytical Balance', 'BrandA', 1, 'ModelA', 'SN201', 'Alice Chem', 1, TRUE),
    ('Homogenizer', 'BrandB', 1, 'ModelB', 'SN202', 'Alice Chem', 1, TRUE),
    ('HPLC', 'BrandC', 1, 'ModelC', 'SN203', 'Alice Chem', 1, TRUE),
    ('Microplate Reader', 'BrandD', 1, 'ModelD', 'SN204', 'Alice Chem', 1, TRUE),
    ('pH Meter', 'BrandE', 1, 'ModelE', 'SN205', 'Alice Chem', 1, TRUE),
    ('Preparative HPLC', 'BrandF', 1, 'ModelF', 'SN206', 'Alice Chem', 1, TRUE),
    ('Refrigerated Centrifuge', 'BrandG', 1, 'ModelG', 'SN207', 'Alice Chem', 1, TRUE),
    ('Shaking Incubator', 'BrandH', 1, 'ModelH', 'SN208', 'Alice Chem', 1, TRUE),
    ('Ultrasonicator (probe-type)/ Ultrasonic Homogenizer', 'BrandI', 1, 'ModelI', 'SN209', 'Alice Chem', 1, TRUE),
    ('UPLC-QTof/MS', 'BrandJ', 1, 'ModelJ', 'SN210', 'Alice Chem', 1, TRUE),
    ('Vacuum Evaporation System', 'BrandK', 1, 'ModelK', 'SN211', 'Alice Chem', 1, TRUE);

-- Inserting Equipment for Biology Lab
INSERT INTO equipmentsTable (equipment_name, brand, quantity, model, serial_number, staff_name, laboratory_id, sticker_paper_printed)
VALUES
    ('Biochemical Incubator', 'BrandA', 1, 'ModelA', 'SN101', 'Bobby Brown', 2, TRUE),
    ('Diamond Saw', 'BrandB', 1, 'ModelB', 'SN102', 'Bobby Brown', 2, TRUE),
    ('Drying Oven', 'BrandC', 1, 'ModelC', 'SN103', 'Bobby Brown', 2, TRUE),
    ('Microanalytical Balance', 'BrandD', 1, 'ModelD', 'SN104', 'Bobby Brown', 2, TRUE),
    ('Microtome', 'BrandE', 1, 'ModelE', 'SN105', 'Bobby Brown', 2, TRUE),
    ('Paraffin Dispenser', 'BrandF', 1, 'ModelF', 'SN106', 'Bobby Brown', 2, TRUE),
    ('Slide Drying Bench', 'BrandG', 1, 'ModelG', 'SN107', 'Bobby Brown', 2, TRUE),
    ('Stereomicroscopes', 'BrandH', 1, 'ModelH', 'SN108', 'Bobby Brown', 2, TRUE);

-- Inserting Equipment for Foods, Feeds, and Functional Lab
INSERT INTO equipmentsTable (equipment_name, brand, quantity, model, serial_number, staff_name, laboratory_id, sticker_paper_printed)
VALUES
    ('Analytical Balance', 'BrandA', 1, 'ModelA', 'SN001', 'Carol Anderson', 3, TRUE),
    ('Chamber Vacuum Sealer', 'BrandB', 1, 'ModelB', 'SN002', 'Carol Anderson', 3, TRUE),
    ('Chemical Fume Hood', 'BrandC', 1, 'ModelC', 'SN003', 'Carol Anderson', 3, TRUE),
    ('Constant Climate Chamber', 'BrandD', 1, 'ModelD', 'SN004', 'Carol Anderson', 3, TRUE),
    ('Constant Temperature Drying Oven', 'BrandE', 1, 'ModelE', 'SN005', 'Carol Anderson', 3, TRUE),
    ('Forced Air Drying Oven', 'BrandF', 1, 'ModelF', 'SN006', 'Carol Anderson', 3, TRUE),
    ('HPLC', 'BrandG', 1, 'ModelG', 'SN007', 'Carol Anderson', 3, TRUE),
    ('Ice Cream Maker', 'BrandH', 1, 'ModelH', 'SN008', 'Carol Anderson', 3, TRUE),
    ('Moisture Analyzer', 'BrandI', 1, 'ModelI', 'SN009', 'Carol Anderson', 3, TRUE),
    ('pH Meter', 'BrandJ', 1, 'ModelJ', 'SN010', 'Carol Anderson', 3, TRUE),
    ('Refractometer', 'BrandK', 1, 'ModelK', 'SN011', 'Carol Anderson', 3, TRUE),
    ('Rheometer', 'BrandL', 1, 'ModelL', 'SN012', 'Carol Anderson', 3, TRUE),
    ('Rotary Evaporator', 'BrandM', 1, 'ModelM', 'SN013', 'Carol Anderson', 3, TRUE),
    ('Spray Dryer', 'BrandN', 1, 'ModelN', 'SN014', 'Carol Anderson', 3, TRUE),
    ('Texture Analyzer', 'BrandO', 1, 'ModelO', 'SN015', 'Carol Anderson', 3, TRUE),
    ('Ultrasonic Bath', 'BrandP', 1, 'ModelP', 'SN016', 'Carol Anderson', 3, TRUE),
    ('UV-Vis Spectrophotometer, 6-placer (190-1100nm)', 'BrandQ', 1, 'ModelQ', 'SN017', 'Carol Anderson', 3, TRUE),
    ('Water Activity Meter', 'BrandR', 1, 'ModelR', 'SN018', 'Carol Anderson', 3, TRUE);

-- Inserting Equipment for Material Science & Nanotechnology Lab
INSERT INTO equipmentsTable (equipment_name, brand, quantity, model, serial_number, staff_name, laboratory_id, sticker_paper_printed)
VALUES
    ('Atomic Force Microscope (AFM)', 'BrandA', 1, 'ModelA', 'SN301', 'Dave Miller', 4, TRUE),
    ('Microwave Synthesizer', 'BrandB', 1, 'ModelB', 'SN302', 'Dave Miller', 4, TRUE),
    ('MidIR-NIR-Raman Spectrometer', 'BrandC', 1, 'ModelC', 'SN303', 'Dave Miller', 4, TRUE),
    ('Muffle Furnace', 'BrandD', 1, 'ModelD', 'SN304', 'Dave Miller', 4, TRUE),
    ('Scanning Electron Microscope - Energy Dispersive Spectrometer (SEM-EDS)', 'BrandE', 1, 'ModelE', 'SN305', 'Dave Miller', 4, TRUE),
    ('Spectrofluorometer', 'BrandF', 1, 'ModelF', 'SN306', 'Dave Miller', 4, TRUE),
    ('STA-DSC', 'BrandG', 1, 'ModelG', 'SN307', 'Dave Miller', 4, TRUE),
    ('UV-Vis Spectrophotometer, (200-1800nm; UV-Vis, NIR, with DRA)', 'BrandH', 1, 'ModelH', 'SN308', 'Dave Miller', 4, TRUE);

-- Inserting Equipment for Microbiology & Bioengineering Lab
INSERT INTO equipmentsTable (equipment_name, brand, quantity, model, serial_number, staff_name, laboratory_id, sticker_paper_printed)
VALUES
    ('Autoclave', 'BrandA', 1, 'ModelA', 'SN401', 'Eve Odair', 5, TRUE),
    ('Biosafety Cabinet', 'BrandB', 1, 'ModelB', 'SN402', 'Eve Odair', 5, TRUE),
    ('Compound Microscope', 'BrandC', 1, 'ModelC', 'SN403', 'Eve Odair', 5, TRUE),
    ('Incubators (Shaker & Standard)', 'BrandD', 1, 'ModelD', 'SN404', 'Eve Odair', 5, TRUE),
    ('Laminar Flow Hood', 'BrandE', 1, 'ModelE', 'SN405', 'Eve Odair', 5, TRUE),
    ('pH Meter', 'BrandF', 1, 'ModelF', 'SN406', 'Eve Odair', 5, TRUE);

-- Inserting dummy data into 'serviceRequestTable'
INSERT INTO serviceRequestTable (user_id, service_name, request_code, status, payment_option, start, "end", approved_by)
VALUES
    (6, 'Training', 'RRC-25-TR001', 'Pending for Approval','Charged to Project', '2025-02-01 09:00:00', '2025-03-01 12:00:00', 4),
    (2, 'Sample Processing', 'RRC-25-SP001', 'Completed', 'Charged to Project', '2025-01-02 10:00:00', '2025-03-02 15:00:00', 3),
    (2, 'Use of Equipment', 'RRC-25-EQ001', 'Approved', 'Charged to Project', '2025-01-05 08:00:00', '2025-03-05 17:00:00', 3),
    (6, 'Use of Facility', 'RRC-25-FAC001', 'Pending for Approval', 'Charged to Project', '2025-03-10 09:00:00', '2025-03-10 18:00:00', 1),
    (6, 'Use of Facility', 'RRC-25-FAC002', 'Pending for Approval', 'Charged to Project', '2025-03-10 09:00:00', '2025-04-10 18:00:00', 1);

-- Inserting dummy data into 'trainingRequests'
INSERT INTO trainingRequests (request_id, trainingTitle, trainingDate, participantCount, acknowledgeTerms, partnerLab, project_title, project_budget_code, proofOfFunds, paymentConforme, additionalInformation, necessaryDocuments)
VALUES
    (1, 'Advanced Chemistry Training', '2025-03-01 18:00:00', 15, TRUE, 'Applied Chemistry', 'Chemistry Research', 
        'AC123', '/uploads/proofOfFunds/Proof_of_funds_sample_file_1744951998395.pdf', '/uploads/paymentConforme/Payment_conforme_sample_file_1744951998395.pdf', 
        'Additional info for training', ARRAY['/uploads/necessaryDocuments/Necessary_document_sample_file_1744951782626.pdf']),
    (2, 'Biology Sample Processing Training', '2025-04-30 18:00:00', 10, TRUE, 'Biology', 'Bio Research', 'BR456', 
        'NA', 'NA', 'Additional info for training', ARRAY['Document9.pdf', 'Document10.pdf']);

-- Inserting dummy data into 'equipmentRentalRequests'
INSERT INTO equipmentRentalRequests (request_id, authorized_representative, laboratory, equipment_name, equipment_settings, sample_type, sample_description, sample_volume, sample_hazard_description, schedule_of_use, estimated_use_duration, project_title, project_budget_code, proofOfFunds, paymentConforme, additional_information, necessaryDocuments)
VALUES
    (3, 'John Doe', 'Material Science and Nanotechnology', 'Electron Microscope', 'High magnification', 
    'Tissue', 'Electron microscopy for tissue sample analysis', '10 ml', 'Handle with care', '2025-04-05 18:00:00', 
    '5 hours', 'Nano Research', 'NR789', '/uploads/proofOfFunds/Proof_of_funds_sample_file_1744951998395.pdf', '/uploads/paymentConforme/Payment_conforme_sample_file_1744951998395.pdf', 
    'Additional equipment details', ARRAY['/uploads/necessaryDocuments/Necessary_document_sample_file_1744951782626.pdf']);

-- Inserting dummy data into 'facilityRentalRequests'
INSERT INTO facilityRentalRequests (
    request_id, purpose_of_use, project_title, project_budget_code, proofOfFunds, 
    paymentConforme, selected_facility, start_of_use, end_of_use, participant_count, 
    additional_information, acknowledge_terms, necessaryDocuments)
VALUES
    (4, 'Research Presentation', 'Title', 'Budget code', '/uploads/proofOfFunds/Proof_of_funds_sample_file_1744951998395.pdf', 
    '/uploads/paymentConforme/Payment_conforme_sample_file_1744951998395.pdf', 1, '2025-05-10 09:00:00', '2025-05-10 18:00:00', 30, 
    'Conference presentation details', TRUE, ARRAY['/uploads/necessaryDocuments/Necessary_document_sample_file_1744951782626.pdf']),
    (5, 'Hybrid Seminar', 'Title', 'Budget', '/uploads/proofOfFunds/Proof_of_funds_sample_file_1744951998395.pdf', 
    '/uploads/paymentConforme/Payment_conforme_sample_file_1744951998395.pdf', 2, '2025-04-30 09:00:00', '2025-04-30 18:00:00', 30, 
    'Seminar presentation details', TRUE, ARRAY['/uploads/necessaryDocuments/Necessary_document_sample_file_1744951782626.pdf']);

-- Inserting dummy data into 'sampleProcessingRequests' table
INSERT INTO sampleProcessingRequests 
    (laboratory, request_id, type_of_analysis, sample_type, sample_description, sample_volume, 
     method_settings, sample_hazard_description, schedule_of_sample_submission, project_title, 
     project_budget_code, proofOfFunds, paymentConforme, additional_information, necessaryDocuments)
VALUES
    ('Microbiology and Bioengineering', 2, 'Bacterial Identification', 'Water Sample', 
     'Testing for bacteria in water', '500 ml', 'Incubation at 37°C for 48 hours', 
     'Handle with care. Potential for contamination', '2025-04-30 18:00:00', 'Water Quality Research', 
     'WQ123', '/uploads/proofOfFunds/Proof_of_funds_sample_file_1744951998395.pdf', 
     '/uploads/paymentConforme/Payment_conforme_sample_file_1744951998395.pdf', 'Water sample testing for bacteria', 
     ARRAY['/uploads/necessaryDocuments/Necessary_document_sample_file_1744951782626.pdf']);

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


-- Insert data for SAMPLE PROCESSING SERVICES
-- Foods, Feeds and Functional Nutrition
INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
VALUES
    ('Sample Processing', 'Foods, Feeds and Functional Nutrition', 'Texture Analysis (Basic Compression)', 'Php130.00/sample', NULL),
    ('Sample Processing', 'Foods, Feeds and Functional Nutrition', 'Texture Analysis (Basic Tensile)', 'Php130.00/sample', NULL),
    ('Sample Processing', 'Foods, Feeds and Functional Nutrition', 'Freeze Drying', 'Php250.00/hour', NULL),
    ('Sample Processing', 'Foods, Feeds and Functional Nutrition', 'Spray Drying', 'Php1,410.00/liter of sample', NULL);

-- Material Science
INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
VALUES
    ('Sample Processing', 'Material Science', 'AFM Imaging', 'Php6,410.00/sample', '2 scans per sample'),
    ('Sample Processing', 'Material Science', 'Surface Profilometry', 'Php8,010.00/sample', '2 scans per sample'),
    ('Sample Processing', 'Material Science', 'Surface Roughness', 'Php8,010.00/sample', '2 scans per sample'),
    ('Sample Processing', 'Material Science', 'Topography', 'Php8,010.00/sample', '2 scans per sample'),
    ('Sample Processing', 'Material Science', 'FTIR-ATR Analysis (No ID)', 'Php4,260.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'FT-MidIR Analysis (No ID)', 'Php4,260.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'FT-NIR Analysis (No ID)', 'Php4,260.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Raman Analysis (No ID)', 'Php4,260.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'SEM Imaging', 'Php5,040.00/sample', '5 SEM images and 2 EDS scans per sample'),
    ('Sample Processing', 'Material Science', 'SEM Imaging -EDS Point Analysis', 'Php6,300.00/sample', '5 SEM images and 2 EDS scans per sample'),
    ('Sample Processing', 'Material Science', 'SEM Imaging -EDS Line Analysis', 'Php7,560.00/sample', '5 SEM images and 2 EDS scans per sample'),
    ('Sample Processing', 'Material Science', 'SEM Imaging -EDS Mapping Analysis', 'Php8,820.00/sample', '5 SEM images and 2 EDS scans per sample'),
    ('Sample Processing', 'Material Science', 'Sputter Coater', 'Php590.00/sample', NULL),
    ('Sample Processing', 'Material Science', 'Spin Coater', 'Php590.00/sample', NULL),
    ('Sample Processing', 'Material Science', 'Fluorescence Analysis', 'Php3,470.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Phosphorescence Analysis', 'Php3,470.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Lifetime Measurements', 'Php3,470.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Thermogravimetric Analysis', 'Php4,140.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Differential Scanning Calorimetry', 'Php4,140.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Absorbance Measurements (UV-Vis)', 'Php430.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Absorbance Measurements (UV-Vis-NIR)', 'Php860.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Reflectance Measurements', 'Php1,710.00/sample', '2 replicates per sample'),
    ('Sample Processing', 'Material Science', 'Transmission Analysis', 'Php1,710.00/sample', '2 replicates per sample');

-- Applied Chemistry
INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
VALUES
    ('Sample Processing', 'Applied Chemistry', 'Type 1 (Ultrapure) water (per L)', 'Php900.00/3 liter', NULL),
    ('Sample Processing', 'Applied Chemistry', 'Type 2 (Pure) water (per L)', 'Php280.00/liter', NULL);

-- USE OF EQUIPMENT SERVICES
-- Foods, Feeds and Functional Nutrition
INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
VALUES
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Analytical Balance', 'Php120.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Chamber Vacuum Sealer', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Chemical Fume Hood', 'Php170.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Constant Climate Chamber', 'Php240.00 – Php330.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Constant Temperature Drying Oven', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Forced Air Drying Oven', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'HPLC', 'Php1,300.00 – Php1,600.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Ice Cream Maker', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Moisture Analyzer', 'Php140.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'pH Meter', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Refractometer', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Rheometer', 'Php1,040.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Rotary Evaporator', 'Php440.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Spray Dryer', 'Php560.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Texture Analyzer', 'Php240.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Ultrasonic Bath', 'Php260.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'UV-Vis Spectrophotometer, 6-placer (190-1100nm)', 'Php550.00/hour', NULL),
    ('Use of Equipment', 'Foods, Feeds and Functional Nutrition', 'Water Activity Meter', 'Php140.00/hour', NULL);

-- Biology
INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
VALUES
    ('Use of Equipment', 'Biology', 'Biochemical incubator', 'Php150.00/hour', NULL),
    ('Use of Equipment', 'Biology', 'Diamond saw', 'Php280.00/hour', NULL),
    ('Use of Equipment', 'Biology', 'Drying oven', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Biology', 'Microanalytical balance', 'Php350.00/hour', NULL),
    ('Use of Equipment', 'Biology', 'Microtome', 'Php280.00/hour', NULL),
    ('Use of Equipment', 'Biology', 'Paraffin dispenser', 'Php140.00/hour', NULL),
    ('Use of Equipment', 'Biology', 'Slide drying bench', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Biology', 'Stereomicroscopes', 'Php140.00 – Php420.00/hour', NULL);

-- Applied Chemistry
INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
VALUES
    ('Use of Equipment', 'Applied Chemistry', 'Analytical Balance', 'Php120.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'Homogenizer', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'HPLC', 'Php1,300.00 – Php1,600.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'Microplate Reader', 'Php580.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'pH meter', 'Php100.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'Preparative HPLC', 'Php1,300.00 – Php1,600.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'Refrigerated Centrifuge', 'Php450.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'Shaking Incubator', 'Php200.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'Ultrasonicator (probe-type)/ Ultrasonic Homogenizer', 'Php230.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'UPLC-Tof/MS', 'Php6,840.00 – Php6,970.00/hour', NULL),
    ('Use of Equipment', 'Applied Chemistry', 'Vacuum Evaporation System', 'Php190.00/hour', NULL);

-- Material Science
INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
VALUES
    ('Use of Equipment', 'Material Science', 'Atomic Force Microscope (AFM)', 'Php2,040.00/hour', NULL),
    ('Use of Equipment', 'Material Science', 'Microwave Synthesizer', 'Php940.00/hour', NULL),
    ('Use of Equipment', 'Material Science', 'MidIR-NIR-Raman Spectrometer', 'Php1,970.00/hour', NULL),
    ('Use of Equipment', 'Material Science', 'Muffle Furnace', 'Php250.00/hour', NULL),
    ('Use of Equipment', 'Material Science', 'Scanning Electron Microscope - Energy Dispersive Spectrometer (SEM-EDS)', 'Php2,360.00/hour', NULL),
    ('Use of Equipment', 'Material Science', 'Spectrofluorometer', 'Php2,100.00/hour', NULL),
    ('Use of Equipment', 'Material Science', 'STA-DSC', 'Php1,920.00/hour', NULL),
    ('Use of Equipment', 'Material Science', 'UV-Vis Spectrophotometer, (200-1800nm; UV-Vis, NIR, with DRA)', 'Php930.00/hour', NULL);

-- Microbiology and Bioengineering
INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
VALUES
    ('Use of Equipment', 'Microbiology and Bioengineering', 'Autoclave', 'Php240.00/hour', NULL),
    ('Use of Equipment', 'Microbiology and Bioengineering', 'Biosafety Cabinet', 'Php270.00/hour', NULL),
    ('Use of Equipment', 'Microbiology and Bioengineering', 'Compound Microscope', 'Php280.00/hour', NULL),
    ('Use of Equipment', 'Microbiology and Bioengineering', 'Incubators (Shaker & Standard)', 'Php200.00/hour', NULL),
    ('Use of Equipment', 'Microbiology and Bioengineering', 'Laminar Flow Hood', 'Php170.00/hour', NULL),
    ('Use of Equipment', 'Microbiology and Bioengineering', 'pH meter', 'Php100.00/hour', NULL);

-- Dummy Events --
INSERT INTO events (title, description, location, officer, start_time, end_time, recurrence)
VALUES
  ('Team Meeting', 'Weekly sync-up with the team.', 'Conference Room A', 'Alice Johnson', '2025-05-10 10:00:00', '2025-05-10 11:00:00', 'Weekly'),
  ('Marketing Presentation', 'Quarterly marketing update.', 'Hall B', 'Bob Smith', '2025-05-12 14:00:00', '2025-05-12 15:30:00', 'None'),
  ('HR Orientation', 'New employee onboarding.', 'Training Room', 'Cathy Lee', '2025-05-15 09:00:00', '2025-05-15 12:00:00', 'None');

-- ======== ALTERS ========

-- Add a foreign key reference if there’s a related table (optional example)
-- Note: Only run if your project has an 'institutions' table
-- ALTER TABLE users ADD CONSTRAINT fk_institution FOREIGN KEY (institution) REFERENCES institutions(id);

-- Example of adding a column to an existing table (you can add more ALTER commands as needed)
-- This example adds an 'address' column to the 'users' table.
-- ALTER TABLE users ADD COLUMN address VARCHAR(255);