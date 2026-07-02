-- =================================================================================
-- CRIMEGPT: ZOHO CATALYST DATA STORE SCHEMA (BASED ON KSP FIR ER DIAGRAM)
-- =================================================================================
-- Note: Zoho Catalyst uses a relational database compatible with standard SQL.
-- Foreign Key constraints should be configured in the Catalyst Console UI.
-- =================================================================================

-- 1. GEO & ADMIN LOOKUPS
CREATE TABLE State (
    StateID INT PRIMARY KEY,
    StateName VARCHAR(255),
    NationalityID INT,
    Active BOOLEAN
);

CREATE TABLE District (
    DistrictID INT PRIMARY KEY,
    DistrictName VARCHAR(255),
    StateID INT,
    Active BOOLEAN
);

CREATE TABLE Court (
    CourtID INT PRIMARY KEY,
    CourtName VARCHAR(255),
    DistrictID INT,
    StateID INT,
    Active BOOLEAN
);

CREATE TABLE UnitType (
    UnitTypeID INT PRIMARY KEY,
    UnitTypeName VARCHAR(255),
    CityDistState VARCHAR(100),
    Hierarchy INT,
    Active BOOLEAN
);

CREATE TABLE Unit (
    UnitID INT PRIMARY KEY,
    UnitName VARCHAR(255),
    TypeID INT,
    ParentUnit INT,
    NationalityID INT,
    StateID INT,
    DistrictID INT,
    Active BOOLEAN
);

-- 2. PERSONNEL LOOKUPS
CREATE TABLE Rank (
    RankID INT PRIMARY KEY,
    RankName VARCHAR(255),
    Hierarchy INT,
    Active BOOLEAN
);

CREATE TABLE Designation (
    DesignationID INT PRIMARY KEY,
    DesignationName VARCHAR(255),
    Active BOOLEAN,
    SortOrder INT
);

CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    DistrictID INT,
    UnitID INT,
    RankID INT,
    DesignationID INT,
    KGID VARCHAR(100),
    FirstName VARCHAR(255),
    EmployeeDOB DATE,
    GenderID INT,
    BloodGroupID INT,
    PhysicallyChallenged BOOLEAN,
    AppointmentDate DATE
);

-- 3. CLASSIFICATION LOOKUPS
CREATE TABLE CaseCategory (
    CaseCategoryID INT PRIMARY KEY,
    LookupValue VARCHAR(255)
);

CREATE TABLE GravityOffence (
    GravityOffenceID INT PRIMARY KEY,
    LookupValue VARCHAR(255)
);

CREATE TABLE CaseStatusMaster (
    CaseStatusID INT PRIMARY KEY,
    CaseStatusName VARCHAR(255)
);

CREATE TABLE CrimeHead (
    CrimeHeadID INT PRIMARY KEY,
    CrimeGroupName VARCHAR(255),
    Active BOOLEAN
);

CREATE TABLE CrimeSubHead (
    CrimeSubHeadID INT PRIMARY KEY,
    CrimeHeadID INT,
    CrimeHeadName VARCHAR(255),
    SeqID INT
);

CREATE TABLE Act (
    ActCode VARCHAR(50) PRIMARY KEY,
    ActDescription VARCHAR(255),
    ShortName VARCHAR(100),
    Active BOOLEAN
);

CREATE TABLE Section (
    SectionCode VARCHAR(50) PRIMARY KEY,
    ActCode VARCHAR(50),
    SectionDescription VARCHAR(500),
    Active BOOLEAN
);

-- 4. DEMOGRAPHIC LOOKUPS
CREATE TABLE CasteMaster (
    caste_master_id INT PRIMARY KEY,
    caste_master_name VARCHAR(255)
);

CREATE TABLE ReligionMaster (
    ReligionID INT PRIMARY KEY,
    ReligionName VARCHAR(255)
);

CREATE TABLE OccupationMaster (
    OccupationID INT PRIMARY KEY,
    OccupationName VARCHAR(255)
);

-- 5. CORE CASE DATA
CREATE TABLE CaseMaster (
    CaseMasterID INT PRIMARY KEY,
    CrimeNo VARCHAR(100),
    CaseNo VARCHAR(100),
    CrimeRegisteredDate DATE,
    PolicePersonID INT,
    PoliceStationID INT,
    CaseCategoryID INT,
    GravityOffenceID INT,
    CrimeMajorHeadID INT,
    CrimeMinorHeadID INT,
    CaseStatusID INT,
    CourtID INT,
    IncidentFromDate DATETIME,
    IncidentToDate DATETIME,
    InfoReceivedPSDate DATETIME,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    BriefFacts TEXT
);

CREATE TABLE ActSectionAssociation (
    AssociationID INT PRIMARY KEY AUTO_INCREMENT,
    CaseMasterID INT,
    ActID VARCHAR(50),
    SectionID VARCHAR(50),
    ActOrder INT,
    SectionOrder INT
);

CREATE TABLE ComplainantDetails (
    ComplainantID INT PRIMARY KEY,
    CaseMasterID INT,
    ComplainantName VARCHAR(255),
    AgeYear INT,
    OccupationID INT,
    ReligionID INT,
    CasteID INT,
    GenderID INT
);

CREATE TABLE Victim (
    VictimMasterID INT PRIMARY KEY,
    CaseMasterID INT,
    VictimName VARCHAR(255),
    AgeYear INT,
    GenderID INT,
    VictimPolice BOOLEAN
);

CREATE TABLE Accused (
    AccusedMasterID INT PRIMARY KEY,
    CaseMasterID INT,
    AccusedName VARCHAR(255),
    AgeYear INT,
    GenderID INT,
    PersonID VARCHAR(50)
);

CREATE TABLE ArrestSurrender (
    ArrestSurrenderID INT PRIMARY KEY,
    CaseMasterID INT,
    ArrestSurrenderTypeID INT,
    ArrestSurrenderDate DATE,
    ArrestSurrenderStateId INT,
    ArrestSurrenderDistrictId INT,
    PoliceStationID INT,
    IOID INT,
    CourtID INT,
    AccusedMasterID INT,
    IsAccused BOOLEAN,
    IsComplainantAccused BOOLEAN
);

CREATE TABLE ChargesheetDetails (
    CSID INT PRIMARY KEY,
    CaseMasterID INT,
    csdate DATETIME,
    cstype CHAR(1),
    PolicePersonID INT
);
