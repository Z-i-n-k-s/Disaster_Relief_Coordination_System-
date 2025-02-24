-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS rescue_tracking_volunteers;
DROP TABLE IF EXISTS rescue_tracking;
DROP TABLE IF EXISTS aid_preparation_volunteers;
DROP TABLE IF EXISTS aid_preparation_resources;
DROP TABLE IF EXISTS aid_preparation;
DROP TABLE IF EXISTS aid_requests;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS affected_areas;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS volunteers;
DROP TABLE IF EXISTS relief_centers;
DROP TABLE IF EXISTS users;

-- Create tables with consistent column names


CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Manager', 'User', 'Volunteer') NOT NULL,
    PhoneNo VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE relief_centers (
    CenterID INT AUTO_INCREMENT PRIMARY KEY,
    CenterName VARCHAR(255) NOT NULL,
    Location VARCHAR(255) NOT NULL,
    NumberOfVolunteersWorking INT DEFAULT 0,
    MaxVolunteersCapacity INT NOT NULL,
    ManagerID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_relief_centers_manager FOREIGN KEY (ManagerID)
         REFERENCES users(UserID) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE volunteers (
    VolunteerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    ContactInfo VARCHAR(255) NOT NULL,
    AssignedCenter INT,
    Status ENUM('Active','Inactive') NOT NULL,
    UserID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_volunteers_assigned_center FOREIGN KEY (AssignedCenter)
         REFERENCES relief_centers(CenterID) ON DELETE SET NULL,
    CONSTRAINT fk_volunteers_user FOREIGN KEY (UserID)
         REFERENCES users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE resources (
    ResourceID INT AUTO_INCREMENT PRIMARY KEY,
    ResourceType VARCHAR(255) NOT NULL,
    Quantity INT NOT NULL,
    ExpirationDate DATETIME NOT NULL,
    ReliefCenterID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_resources_relief_centers FOREIGN KEY (ReliefCenterID)
         REFERENCES relief_centers(CenterID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE affected_areas (
    AreaID INT AUTO_INCREMENT PRIMARY KEY,
    AreaName VARCHAR(255) NOT NULL,
    AreaType ENUM('Flood', 'Earthquake', 'Fire') NOT NULL,
    SeverityLevel ENUM('Low', 'Medium', 'High') NOT NULL,
    Population INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE donations (
    DonationID INT AUTO_INCREMENT PRIMARY KEY,
    DonorName VARCHAR(255) NOT NULL,
    DonationType ENUM('Water', 'Food', 'Money', 'Clothes') NOT NULL,
    Quantity INT NOT NULL,
    DateReceived DATETIME NOT NULL,
    AssociatedCenter INT,
    UserID INT,
    ResourceID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_donations_center FOREIGN KEY (AssociatedCenter)
         REFERENCES relief_centers(CenterID) ON DELETE SET NULL,
    CONSTRAINT fk_donations_user FOREIGN KEY (UserID)
         REFERENCES users(UserID) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE aid_requests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    AreaID INT NOT NULL,
    RequesterName VARCHAR(255) NOT NULL,
    ContactInfo VARCHAR(255) NOT NULL,
    RequestType ENUM('Aid', 'Rescue') NOT NULL,
    Description TEXT,
    UrgencyLevel ENUM('Low','Medium','High') NOT NULL,
    Status ENUM('Pending','In Progress','Completed') NOT NULL,
    NumberOfPeople INT NOT NULL,
    RequestDate DATETIME NOT NULL,
    ResponseTime DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_aid_requests_user FOREIGN KEY (UserID)
         REFERENCES users(UserID) ON DELETE SET NULL,
    CONSTRAINT fk_aid_requests_area FOREIGN KEY (AreaID)
         REFERENCES affected_areas(AreaID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE aid_preparation (
    PreparationID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT NOT NULL,
    PreparedBy INT NOT NULL,
    DepartureTime DATETIME NOT NULL,
    EstimatedArrival DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_aid_preparation_request FOREIGN KEY (RequestID)
         REFERENCES aid_requests(RequestID) ON DELETE CASCADE,
    CONSTRAINT fk_aid_preparation_volunteer FOREIGN KEY (PreparedBy)
         REFERENCES volunteers(VolunteerID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE aid_preparation_resources (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PreparationID INT NOT NULL,
    ResourceID INT NOT NULL,
    QuantityUsed INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_aid_prep_resources_preparation FOREIGN KEY (PreparationID)
         REFERENCES aid_preparation(PreparationID) ON DELETE CASCADE,
    CONSTRAINT fk_aid_prep_resources_resource FOREIGN KEY (ResourceID)
         REFERENCES resources(ResourceID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE aid_preparation_volunteers (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PreparationID INT NOT NULL,
    VolunteerID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_aid_prep_volunteers_preparation FOREIGN KEY (PreparationID)
         REFERENCES aid_preparation(PreparationID) ON DELETE CASCADE,
    CONSTRAINT fk_aid_prep_volunteers_volunteer FOREIGN KEY (VolunteerID)
         REFERENCES volunteers(VolunteerID) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE rescue_tracking (
    TrackingID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT NOT NULL,
    TrackingStatus ENUM('In Progress','Completed') NOT NULL,
    CurrentLocation VARCHAR(255) NOT NULL,
    OperationStartTime DATETIME NOT NULL,
    NumberOfPeopleHelped INT NOT NULL,
    SuppliesDelivered TEXT,
    CompletionTime DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rescue_tracking_request FOREIGN KEY (RequestID)
         REFERENCES aid_requests(RequestID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE rescue_tracking_volunteers (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    TrackingID INT NOT NULL,
    VolunteerID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rescue_tracking_volunteers_tracking FOREIGN KEY (TrackingID)
         REFERENCES rescue_tracking(TrackingID) ON DELETE CASCADE,
    CONSTRAINT fk_rescue_tracking_volunteers_volunteer FOREIGN KEY (VolunteerID)
         REFERENCES volunteers(VolunteerID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Triggers with correct column names
-- First add unique constraint to prevent duplicate resources
ALTER TABLE resources
ADD UNIQUE INDEX idx_resource_unique (ResourceType, ReliefCenterID);
ALTER TABLE donations DROP COLUMN ResourceID;

-- Drop existing trigger
DROP TRIGGER IF EXISTS trg_update_resource_after_donation;

-- Create  trigger
DELIMITER $$
CREATE TRIGGER trg_update_resource_after_donation
AFTER INSERT ON donations
FOR EACH ROW
BEGIN
    -- Handle all donation types including Money
    INSERT INTO resources (ResourceType, Quantity, ExpirationDate, ReliefCenterID, created_at, updated_at)
    VALUES (
        NEW.DonationType,
        NEW.Quantity,
        DATE_ADD(NEW.DateReceived, INTERVAL 1 YEAR),
        NEW.AssociatedCenter,
        NOW(),
        NOW()
    )
    ON DUPLICATE KEY UPDATE 
        Quantity = Quantity + NEW.Quantity,
        updated_at = NOW();
END$$
DELIMITER ;

-- Optional: Update deduction trigger for consistency
DROP TRIGGER IF EXISTS trg_deduct_resource_after_aid_prep;

DELIMITER $$
CREATE TRIGGER trg_deduct_resource_after_aid_prep
AFTER INSERT ON aid_preparation_resources
FOR EACH ROW
BEGIN
    UPDATE resources
    SET Quantity = GREATEST(Quantity - NEW.QuantityUsed, 0),  -- Prevent negative quantities
        updated_at = NOW()
    WHERE ResourceID = NEW.ResourceID;
END$$
DELIMITER ;