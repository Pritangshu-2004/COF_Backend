-- User table
DROP TABLE IF EXISTS User;
CREATE TABLE User (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Email VARCHAR(255) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  Role ENUM('admin', 'user', 'guest') DEFAULT 'user',
  Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  Updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Client table
DROP TABLE IF EXISTS Client;
CREATE TABLE Client (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  Phone VARCHAR(50),
  Company VARCHAR(255),
  Notes TEXT,
  Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  Updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Created_by INT,
  FOREIGN KEY (Created_by) REFERENCES User(Id)
);

-- Event Log table
DROP TABLE IF EXISTS EventLog;
CREATE TABLE EventLog (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  User_id INT,
  Event_type ENUM('create', 'update', 'delete', 'login', 'logout'),
  Entity_type VARCHAR(255),
  Entity_id INT,
  Metadata JSON,
  Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (User_id) REFERENCES User(Id)
);

-- StageType table
DROP TABLE IF EXISTS StageType;
CREATE TABLE StageType (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255),
  Description TEXT,
  Icon_class VARCHAR(255),
  Average_Duration DATETIME
);

-- Project table
DROP TABLE IF EXISTS Project;
CREATE TABLE Project (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255),
  Description TEXT,
  Client_id INT,
  Project_type VARCHAR(255),
  Start_date DATETIME,
  Due_date DATETIME,
  Completion_Date DATETIME,
  Status ENUM('print', 'proofing', 'approved', 'briefed', 'dispatched'),
  Priority VARCHAR(255),
  Progress INT,
  Current_stage VARCHAR(36), -- UUID string
  Notes TEXT,
  Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  Updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Created_by INT,
  FOREIGN KEY (Client_id) REFERENCES Client(Id),
  FOREIGN KEY (Created_by) REFERENCES User(Id)
);

-- ProjectStage table
DROP TABLE IF EXISTS ProjectStage;
CREATE TABLE ProjectStage (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Project_id INT,
  Stage_type VARCHAR(255),
  Is_completed BOOLEAN DEFAULT FALSE,
  Completed_at DATETIME,
  Notes TEXT,
  Sequence_order INT,
  FOREIGN KEY (Project_id) REFERENCES Project(Id)
);

-- File table
DROP TABLE IF EXISTS File;
CREATE TABLE File (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Project_id INT,
  Name VARCHAR(255),
  Type ENUM('pdf', 'image', 'doc', 'other'),
  URL_Link VARCHAR(255),
  Notes TEXT,
  Uploaded_by VARCHAR(255),
  Uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Project_id) REFERENCES Project(Id)
);

-- Communication table
DROP TABLE IF EXISTS Communication;
CREATE TABLE Communication (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Project_id INT,
  Type ENUM('email', 'call', 'meeting', 'other'),
  Notes TEXT,
  Date DATETIME,
  Created_by VARCHAR(255),
  Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Project_id) REFERENCES Project(Id)
);

-- ProjectSnapshot table
DROP TABLE IF EXISTS ProjectSnapshot;
CREATE TABLE ProjectSnapshot (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Project_id INT,
  Date DATETIME,
  Status VARCHAR(255),
  Progress INT,
  Risk_level VARCHAR(255),
  Delay_days INT,
  FOREIGN KEY (Project_id) REFERENCES Project(Id)
);
