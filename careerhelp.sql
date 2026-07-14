CREATE DATABASE IF NOT EXISTS CareerHelp;
USE CareerHelp;

CREATE TABLE industries(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL UNIQUE,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_types(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE work_modes(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE employment_levels(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users(
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL,
 role ENUM('candidate','recruiter') NOT NULL,
 is_verified BOOLEAN DEFAULT FALSE,
 is_active BOOLEAN DEFAULT TRUE,
 is_deleted BOOLEAN DEFAULT FALSE,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE companies(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(255) NOT NULL,
 description TEXT,
 website VARCHAR(255),
 logo_url VARCHAR(255),
 city VARCHAR(255),
 state VARCHAR(255),
 country VARCHAR(255),
 verification_status ENUM('pending','verified','rejected') DEFAULT 'pending',
 created_by INT,
 is_active BOOLEAN DEFAULT TRUE,
 is_deleted BOOLEAN DEFAULT FALSE,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE recruiter_profiles(
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT UNIQUE NOT NULL,
 company_id INT NOT NULL,
 full_name VARCHAR(255),
 designation VARCHAR(150),
 phone VARCHAR(20),
 subscription_type ENUM('free','premium') DEFAULT 'free',
 is_active BOOLEAN DEFAULT TRUE,
 is_deleted BOOLEAN DEFAULT FALSE,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE candidate_profiles(
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT UNIQUE NOT NULL,
 full_name VARCHAR(255),
 phone VARCHAR(20),
 city VARCHAR(255),
 state VARCHAR(255),
 country VARCHAR(255),
 headline VARCHAR(255),
 about TEXT,
 resume_url VARCHAR(255),
 experience_years INT DEFAULT 0,
 employment_level_id INT,
 subscription_type ENUM('free','premium') DEFAULT 'free',
  is_active BOOLEAN DEFAULT TRUE,
 is_deleted BOOLEAN DEFAULT FALSE,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(employment_level_id) REFERENCES employment_levels(id)
);

CREATE TABLE skills(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 UNIQUE(name)
);

CREATE TABLE job_roles(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 UNIQUE(name)
);

CREATE TABLE jobs(
 id INT AUTO_INCREMENT PRIMARY KEY,
 company_id INT NOT NULL,
 recruiter_id INT NOT NULL,
 industry_id INT NOT NULL,
 job_type_id INT NOT NULL,
 work_mode_id INT NOT NULL,
 employment_level_id INT,
 title VARCHAR(255) NOT NULL,
 description LONGTEXT,
 salary_type ENUM('fixed','range','negotiable'),
 salary_period ENUM('hour','day','week','month','year'),
 salary_min DECIMAL(10,2),
 salary_max DECIMAL(10,2),
 openings INT DEFAULT 1,
 deadline DATE,
 city VARCHAR(255),
 state VARCHAR(255),
 country VARCHAR(255),
 status ENUM('draft','active','closed','expired') DEFAULT 'draft',
 draft_step INT DEFAULT 1,
 published_at DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
 is_deleted BOOLEAN DEFAULT FALSE,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(company_id) REFERENCES companies(id),
 FOREIGN KEY(recruiter_id) REFERENCES recruiter_profiles(id),
 FOREIGN KEY(industry_id) REFERENCES industries(id),
 FOREIGN KEY(job_type_id) REFERENCES job_types(id),
 FOREIGN KEY(work_mode_id) REFERENCES work_modes(id),
 FOREIGN KEY(employment_level_id) REFERENCES employment_levels(id)
);

CREATE TABLE job_requirements(
 id INT AUTO_INCREMENT PRIMARY KEY,
 job_id INT NOT NULL,
 requirement TEXT NOT NULL,
 sort_order INT DEFAULT 1,
 FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE job_responsibilities(
 id INT AUTO_INCREMENT PRIMARY KEY,
 job_id INT NOT NULL,
 responsibility TEXT NOT NULL,
 sort_order INT DEFAULT 1,
 FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE job_skills(
 job_id INT,
 skill_id INT,
 required BOOLEAN DEFAULT TRUE,
 PRIMARY KEY(job_id,skill_id),
 FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE,
 FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE job_roles_map(
 job_id INT,
 role_id INT,
 PRIMARY KEY(job_id,role_id),
 FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE,
 FOREIGN KEY(role_id) REFERENCES job_roles(id)
);

CREATE TABLE applications(
 id INT AUTO_INCREMENT PRIMARY KEY,
 job_id INT NOT NULL,
 candidate_id INT NOT NULL,
 status ENUM('applied','screening','shortlisted','interview','offer_sent','selected','rejected','withdrawn') DEFAULT 'applied',
 cover_letter TEXT,
  is_active BOOLEAN DEFAULT TRUE,
 is_deleted BOOLEAN DEFAULT FALSE,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE(job_id,candidate_id),
 FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE,
 FOREIGN KEY(candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE
);

CREATE TABLE saved_jobs(
 id INT AUTO_INCREMENT PRIMARY KEY,
 candidate_id INT NOT NULL,
 job_id INT NOT NULL,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(candidate_id,job_id),
 FOREIGN KEY(candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
 FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE candidate_skills(
 candidate_id INT,
 skill_id INT,
 experience_years INT DEFAULT 0,
 PRIMARY KEY(candidate_id,skill_id),
 FOREIGN KEY(candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
 FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE candidate_preferred_roles(
 candidate_id INT,
 role_id INT,
 PRIMARY KEY(candidate_id,role_id),
 FOREIGN KEY(candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
 FOREIGN KEY(role_id) REFERENCES job_roles(id)
);

CREATE TABLE candidate_preferred_job_types(
 candidate_id INT,
 job_type_id INT,
 PRIMARY KEY(candidate_id,job_type_id),
 FOREIGN KEY(candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
 FOREIGN KEY(job_type_id) REFERENCES job_types(id)
);

CREATE TABLE candidate_preferred_work_modes(
 candidate_id INT,
 work_mode_id INT,
 PRIMARY KEY(candidate_id,work_mode_id),
 FOREIGN KEY(candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
 FOREIGN KEY(work_mode_id) REFERENCES work_modes(id)
);

INSERT INTO industries(name) VALUES
('Information Technology'),('Healthcare'),('Education'),('Finance'),('Construction'),
('Hospitality'),('Retail'),('Manufacturing'),('Transportation'),('Agriculture');

INSERT INTO job_types(name) VALUES
('Full Time'),('Part Time'),('Internship'),('Contract'),('Freelance'),('Temporary'),('Seasonal');

INSERT INTO work_modes(name) VALUES ('On Site'),('Remote'),('Hybrid');

INSERT INTO employment_levels(name) VALUES
('Entry Level'),('Junior'),('Mid Level'),('Senior'),('Lead'),('Manager');

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_industry ON jobs(industry_id);
CREATE INDEX idx_jobs_location ON jobs(city, state, country);