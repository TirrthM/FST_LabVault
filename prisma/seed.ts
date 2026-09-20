import {
  PrismaClient,
  UserRole,
  EquipmentStatus,
  EquipmentCondition,
  EquipmentCategory,
  BorrowStatus,
  MaintenancePriority,
  MaintenanceStatus,
  CalibrationStatus,
  AuditAction,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

// Set deterministic seed for reproducible results across runs
faker.seed(123456);

const prisma = new PrismaClient();

// Academic Departments & Labs Definitions
const LAB_TEMPLATES = [
  {
    code: "LAB-ROB-01",
    name: "Autonomous Robotics & Mechatronics Lab",
    location: "Engineering Complex, Room E-204",
    department: "Mechanical & Mechatronics Engineering",
    description:
      "Facility dedicated to industrial robotics arms, ROS2 mobile robots, actuator characterization, and computer vision guidance.",
    capacity: 25,
  },
  {
    code: "LAB-MIC-02",
    name: "Advanced Microscopy & Nanoscale Imaging Lab",
    location: "Science Block B, Basement B-08",
    department: "Applied Physics & Materials Science",
    description:
      "Vibration-isolated cleanroom annex housing SEM, AFM, confocal fluorescence, and digital polarized light microscopy.",
    capacity: 15,
  },
  {
    code: "LAB-VLS-03",
    name: "VLSI, FPGA & Embedded Systems Lab",
    location: "Turing Computing Tower, Room 410",
    department: "Electrical & Computer Engineering",
    description:
      "High-speed digital oscilloscopes, spectrum analyzers, logic analyzers, FPGA development benches, and rework stations.",
    capacity: 35,
  },
  {
    code: "LAB-MAT-04",
    name: "Materials Characterization & Rheology Lab",
    location: "Materials Technology Wing, Room M-102",
    department: "Materials Science & Metallurgy",
    description:
      "Instron universal testing systems, differential scanning calorimeters, rotational rheometers, and hardness testers.",
    capacity: 20,
  },
  {
    code: "LAB-CHE-05",
    name: "Synthetic Chemistry & Chromatography Core",
    location: "Curie Chemical Sciences Hall, Room C-301",
    department: "Chemical & Biomolecular Engineering",
    description:
      "Agilent HPLC/UHPLC systems, FTIR spectrometers, automated flash chromatography, and high-vacuum Schlenk lines.",
    capacity: 30,
  },
  {
    code: "LAB-BIO-06",
    name: "Genomics, Proteomics & Cell Culture Lab",
    location: "Franklin Life Sciences Hub, Room L-115",
    department: "Biological Sciences & Bioengineering",
    description:
      "Biosafety Level 2 facility with qPCR thermal cyclers, benchtop refrigerated centrifuges, and fluorescence plate readers.",
    capacity: 22,
  },
];

// Equipment template definitions by category
const EQUIPMENT_CATALOG_TEMPLATES = [
  {
    name: "Field Emission Scanning Electron Microscope (FE-SEM)",
    category: EquipmentCategory.OPTICAL,
    manufacturer: "Thermo Fisher Scientific",
    model: "Apreo 2 S LoVac",
    costRange: [180000, 250000],
    specs: {
      resolution: "0.7 nm at 15 kV",
      accelerationVoltage: "200 V to 30 kV",
      detectors: ["In-lens T1/T2", "Low-vacuum SED", "EDX Oxford Ultim Max"],
    },
  },
  {
    name: "Digital Storage Oscilloscope (4-Channel 1 GHz)",
    category: EquipmentCategory.ELECTRICAL,
    manufacturer: "Keysight Technologies",
    model: "InfiniiVision 3000G",
    costRange: [6500, 12000],
    specs: {
      bandwidth: "1 GHz",
      channels: 4,
      sampleRate: "5 GSa/s",
      memoryDepth: "4 Mpts",
    },
  },
  {
    name: "High-Performance Liquid Chromatograph (HPLC)",
    category: EquipmentCategory.ANALYTICAL,
    manufacturer: "Agilent Technologies",
    model: "1260 Infinity II",
    costRange: [42000, 68000],
    specs: {
      maxPressure: "600 bar",
      detector: "Diode Array Detector (DAD)",
      flowRateRange: "0.001 to 5.0 mL/min",
    },
  },
  {
    name: "Fourier Transform Infrared Spectrometer (FTIR)",
    category: EquipmentCategory.ANALYTICAL,
    manufacturer: "PerkinElmer",
    model: "Spectrum Two FT-IR",
    costRange: [22000, 35000],
    specs: {
      spectralRange: "8300 to 350 cm⁻¹",
      resolution: "0.5 cm⁻¹ standard",
      crystal: "Diamond ATR crystal accessory",
    },
  },
  {
    name: "6-Axis Industrial Robotic Arm & Teach Pendant",
    category: EquipmentCategory.MECHANICAL,
    manufacturer: "Universal Robots",
    model: "UR5e Collaborative Robot",
    costRange: [32000, 48000],
    specs: {
      payload: "5 kg",
      reach: "850 mm",
      repeatability: "±0.03 mm",
      interface: "ROS2 & PolyScope",
    },
  },
  {
    name: "Real-Time Quantitative PCR System (qPCR)",
    category: EquipmentCategory.BIOLOGICAL,
    manufacturer: "Bio-Rad Laboratories",
    model: "CFX96 Touch Deep Well",
    costRange: [28000, 45000],
    specs: {
      sampleCapacity: "96 wells",
      excitationRange: "450–684 nm",
      multiplexing: "Up to 5 targets simultaneously",
    },
  },
  {
    name: "Universal Mechanical Testing System (50 kN)",
    category: EquipmentCategory.MECHANICAL,
    manufacturer: "Instron",
    model: "68SC-5 Dual Column Tabletop",
    costRange: [38000, 55000],
    specs: {
      loadCapacity: "50 kN (11,240 lbf)",
      crossheadSpeed: "0.001 to 1016 mm/min",
      dataRate: "5 kHz synchronized",
    },
  },
  {
    name: "Digital RF Spectrum Analyzer (9 kHz to 3.6 GHz)",
    category: EquipmentCategory.ELECTRICAL,
    manufacturer: "Rohde & Schwarz",
    model: "FPC1500",
    costRange: [3500, 7500],
    specs: {
      frequencyRange: "9 kHz to 3 GHz",
      danl: "-165 dBm (typ.)",
      trackingGenerator: "Integrated independent RF source",
    },
  },
  {
    name: "High-Speed Refrigerated Microcentrifuge",
    category: EquipmentCategory.BIOLOGICAL,
    manufacturer: "Eppendorf",
    model: "5427 R Multi-Rotor",
    costRange: [7800, 11500],
    specs: {
      maxRcf: "25,001 × g",
      maxSpeed: "16,220 RPM",
      temperatureRange: "-11°C to +40°C",
    },
  },
  {
    name: "Benchtop Digital pH / Conductivity / DO Meter",
    category: EquipmentCategory.MEASURING,
    manufacturer: "Mettler Toledo",
    model: "SevenExcellence S470",
    costRange: [2400, 4800],
    specs: {
      phRange: "-2.000 to 20.000",
      conductivityRange: "0.001 µS/cm to 1000 mS/cm",
      accuracy: "±0.002 pH",
    },
  },
  {
    name: "High-Precision Analytical Balance (0.01 mg)",
    category: EquipmentCategory.MEASURING,
    manufacturer: "Sartorius",
    model: "Secura 225D-1S Dual Range",
    costRange: [4500, 8200],
    specs: {
      weighingCapacity: "120 g / 220 g",
      readability: "0.01 mg / 0.1 mg",
      internalCalibration: "isoCAL automated motorized weight",
    },
  },
  {
    name: "High-Performance GPU Deep Learning Workstation",
    category: EquipmentCategory.COMPUTING,
    manufacturer: "Lambda Labs",
    model: "Tensorbook Quad RTX 4090",
    costRange: [14000, 22000],
    specs: {
      gpu: "2x NVIDIA RTX 4090 24GB",
      cpu: "AMD Threadripper PRO 5975WX (32 cores)",
      ram: "256 GB DDR5 ECC",
    },
  },
];

async function main() {
  console.log("🌱 Starting LabVault Database Seeding (Topic 4: Faker.js + Prisma)...");

  // 1. Clean existing records in reverse dependency order
  console.log("🧹 Clearing existing database records...");
  await prisma.emailEvent.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.calibrationRecord.deleteMany({});
  await prisma.maintenanceWorkLog.deleteMany({});
  await prisma.maintenanceTicket.deleteMany({});
  await prisma.borrowRequest.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.lab.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Core Deterministic Users for Role Switching and Testing
  console.log("👥 Creating Users (Admin, Lab Managers, Technicians, Students)...");
  
  const coreUsers = [
    {
      id: "usr_admin_01",
      name: "Dr. Eleanor Vance",
      email: "eleanor.vance@labvault.edu",
      role: UserRole.ADMIN,
      department: "Office of the Dean of Research & Engineering",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_mgr_01",
      name: "Dr. Marcus Sterling",
      email: "marcus.sterling@labvault.edu",
      role: UserRole.LAB_MANAGER,
      department: "Materials Science & Metallurgy",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_mgr_02",
      name: "Dr. Sophia Lin",
      email: "sophia.lin@labvault.edu",
      role: UserRole.LAB_MANAGER,
      department: "Electrical & Computer Engineering",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_tech_01",
      name: "Dave Chen",
      email: "dave.chen@labvault.edu",
      role: UserRole.TECHNICIAN,
      department: "Central Instrument Facility",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_tech_02",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@labvault.edu",
      role: UserRole.TECHNICIAN,
      department: "Central Instrument Facility",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_student_01",
      name: "Alex Rivera",
      email: "alex.rivera@student.labvault.edu",
      role: UserRole.STUDENT,
      department: "Mechanical & Mechatronics Engineering",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_student_02",
      name: "Maya Patel",
      email: "maya.patel@student.labvault.edu",
      role: UserRole.STUDENT,
      department: "Applied Physics & Nanotechnology",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
  ];

  for (const u of coreUsers) {
    await prisma.user.create({ data: u });
  }

  // Generate 25 additional realistic users using Faker.js
  const fakerUsersData = Array.from({ length: 25 }).map((_, idx) => {
    const role = faker.helpers.weightedArrayElement([
      { weight: 65, value: UserRole.STUDENT },
      { weight: 20, value: UserRole.TECHNICIAN },
      { weight: 10, value: UserRole.LAB_MANAGER },
      { weight: 5, value: UserRole.ADMIN },
    ]);

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idx + 10}`;
    const email = role === UserRole.STUDENT
      ? `${emailPrefix}@student.labvault.edu`
      : `${emailPrefix}@labvault.edu`;

    return {
      name,
      email,
      role,
      department: faker.helpers.arrayElement([
        "Mechanical Engineering",
        "Materials Science",
        "Electrical Engineering",
        "Chemical Engineering",
        "Applied Physics",
        "Bioengineering",
        "Robotics Institute",
      ]),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };
  });

  for (const u of fakerUsersData) {
    await prisma.user.create({ data: u });
  }

  const allUsers = await prisma.user.findMany();
  const students = allUsers.filter((u) => u.role === UserRole.STUDENT);
  const technicians = allUsers.filter((u) => u.role === UserRole.TECHNICIAN);
  const managers = allUsers.filter((u) => u.role === UserRole.LAB_MANAGER);
  const admins = allUsers.filter((u) => u.role === UserRole.ADMIN);

  console.log(`✅ Created ${allUsers.length} Users (Students: ${students.length}, Techs: ${technicians.length}, Managers: ${managers.length}, Admins: ${admins.length})`);

  // 3. Create Department Labs
  console.log("🏢 Creating Academic Labs...");
  const createdLabs = [];
  for (let i = 0; i < LAB_TEMPLATES.length; i++) {
    const template = LAB_TEMPLATES[i];
    const assignedManager = managers[i % managers.length] ?? admins[0];
    const lab = await prisma.lab.create({
      data: {
        code: template.code,
        name: template.name,
        location: template.location,
        department: template.department,
        description: template.description,
        capacity: template.capacity,
        managerId: assignedManager.id,
      },
    });
    createdLabs.push(lab);
  }
  console.log(`✅ Created ${createdLabs.length} Facilities`);

  // 4. Create Equipment Assets (60–75 items)
  console.log("🔬 Creating Equipment Assets with Faker.js...");
  const createdEquipment = [];
  let assetCounter = 1001;

  for (const lab of createdLabs) {
    // 10 to 12 items per lab
    const itemCount = faker.number.int({ min: 10, max: 12 });

    for (let j = 0; j < itemCount; j++) {
      const template = faker.helpers.arrayElement(EQUIPMENT_CATALOG_TEMPLATES);
      const assetId = `LV-${lab.code.split("-")[1]}-${assetCounter++}`;
      const serialNumber = `SN-${faker.string.alphanumeric({ length: 10, casing: "upper" })}`;
      
      const status = faker.helpers.weightedArrayElement([
        { weight: 55, value: EquipmentStatus.AVAILABLE },
        { weight: 20, value: EquipmentStatus.BORROWED },
        { weight: 10, value: EquipmentStatus.UNDER_MAINTENANCE },
        { weight: 10, value: EquipmentStatus.UNDER_CALIBRATION },
        { weight: 5, value: EquipmentStatus.RESERVED },
      ]);

      const condition = status === EquipmentStatus.UNDER_MAINTENANCE
        ? faker.helpers.arrayElement([EquipmentCondition.DAMAGED, EquipmentCondition.NEEDS_REPAIR, EquipmentCondition.POOR])
        : faker.helpers.arrayElement([EquipmentCondition.NEW, EquipmentCondition.GOOD, EquipmentCondition.FAIR]);

      const purchaseDate = faker.date.past({ years: 4 });
      const warrantyExpiry = new Date(purchaseDate);
      warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + faker.number.int({ min: 2, max: 5 }));

      // If borrowed, assign current custodian to a student
      const currentCustodianId = status === EquipmentStatus.BORROWED
        ? faker.helpers.arrayElement(students).id
        : null;

      const equipment = await prisma.equipment.create({
        data: {
          assetId,
          name: `${template.name} (${faker.science.chemicalElement().name} Bench Edition)`,
          category: template.category,
          manufacturer: template.manufacturer,
          model: template.model,
          serialNumber,
          status,
          condition,
          locationDetails: `Bench ${faker.number.int({ min: 1, max: 12 })}, Station ${faker.string.alpha({ length: 1, casing: "upper" })}`,
          purchaseDate,
          purchaseCost: faker.number.float({
            min: template.costRange[0],
            max: template.costRange[1],
            fractionDigits: 2,
          }),
          warrantyExpiry,
          labId: lab.id,
          currentCustodianId,
          lastInspectionAt: faker.date.recent({ days: 60 }),
          specifications: JSON.stringify(template.specs),
        },
      });

      createdEquipment.push(equipment);
    }
  }
  console.log(`✅ Created ${createdEquipment.length} Equipment Assets`);

  // 5. Create Borrow Requests (80–100 requests)
  console.log("📋 Generating Realistic Borrow Requests...");
  let reqCounter = 2001;
  const createdRequests = [];

  for (let k = 0; k < 90; k++) {
    const student = faker.helpers.arrayElement(students);
    const eq = faker.helpers.arrayElement(createdEquipment);
    const manager = faker.helpers.arrayElement(managers);
    const tech = faker.helpers.arrayElement(technicians);

    const requisitionNumber = `REQ-2026-${reqCounter++}`;
    const status = faker.helpers.weightedArrayElement([
      { weight: 35, value: BorrowStatus.INSPECTED }, // Completed historical
      { weight: 25, value: BorrowStatus.BORROWED },  // Currently active
      { weight: 20, value: BorrowStatus.APPROVED },  // Awaiting pickup
      { weight: 15, value: BorrowStatus.REQUESTED }, // Pending approval
      { weight: 5, value: BorrowStatus.REJECTED },   // Rejected
    ]);

    const startDate = faker.date.recent({ days: status === BorrowStatus.INSPECTED ? 120 : 15 });
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 3, max: 14 }));

    const actualReturnDate = status === BorrowStatus.INSPECTED
      ? new Date(endDate.getTime() + faker.number.int({ min: -1, max: 2 }) * 86400000)
      : null;

    const req = await prisma.borrowRequest.create({
      data: {
        requisitionNumber,
        equipmentId: eq.id,
        userId: student.id,
        purpose: faker.helpers.arrayElement([
          "Senior Capstone Project: Autonomous trajectory tracking under external wind disturbances.",
          "Graduate Thesis: High-resolution EDS mapping of grain boundaries in titanium-aluminide alloys.",
          "Coursework Laboratory: Lab 4 VLSI timing jitter measurements and signal integrity verification.",
          "Faculty Research Grant: In-situ spectroscopy of catalytic intermediate states.",
          "Undergraduate Summer Fellowship: Real-time kinetic PCR quantification of CRISPR-edited loci.",
        ]),
        projectCourseName: faker.helpers.arrayElement([
          "MECH-480 Senior Capstone",
          "MATS-720 Advanced Electron Microscopy",
          "ECE-512 High-Speed Digital Systems",
          "CHEM-630 Advanced Catalysis Lab",
          "BIO-440 Molecular Genetics & CRISPR",
        ]),
        requestedStartDate: startDate,
        requestedEndDate: endDate,
        actualReturnDate,
        status,
        approvedById: status !== BorrowStatus.REQUESTED ? manager.id : null,
        approvalNotes: status === BorrowStatus.REJECTED
          ? "Scheduling conflict with Departmental Teaching Lab session."
          : status !== BorrowStatus.REQUESTED
          ? "Approved for academic research. Follow standard laser/radiation safety protocols."
          : null,
        returnCondition: status === BorrowStatus.INSPECTED
          ? faker.helpers.arrayElement([EquipmentCondition.GOOD, EquipmentCondition.FAIR])
          : null,
        inspectionNotes: status === BorrowStatus.INSPECTED
          ? "Equipment returned in clean condition. Optical paths verified and dust covers reinstalled."
          : null,
        inspectedById: status === BorrowStatus.INSPECTED ? tech.id : null,
        createdAt: new Date(startDate.getTime() - 2 * 86400000),
      },
    });
    createdRequests.push(req);
  }
  console.log(`✅ Created ${createdRequests.length} Borrow Requisitions`);

  // 6. Create Maintenance Work Orders (30–40 tickets)
  console.log("🔧 Generating Maintenance Tickets and Work Logs...");
  let ticketCounter = 3001;
  const createdTickets = [];

  for (let m = 0; m < 35; m++) {
    const eq = faker.helpers.arrayElement(createdEquipment);
    const reporter = faker.helpers.arrayElement(allUsers);
    const tech = faker.helpers.arrayElement(technicians);
    const ticketNumber = `TKT-2026-${ticketCounter++}`;

    const priority = faker.helpers.weightedArrayElement([
      { weight: 40, value: MaintenancePriority.MEDIUM },
      { weight: 30, value: MaintenancePriority.HIGH },
      { weight: 20, value: MaintenancePriority.LOW },
      { weight: 10, value: MaintenancePriority.CRITICAL },
    ]);

    const status = faker.helpers.weightedArrayElement([
      { weight: 45, value: MaintenanceStatus.RESOLVED },
      { weight: 25, value: MaintenanceStatus.IN_REPAIR },
      { weight: 15, value: MaintenanceStatus.OPEN },
      { weight: 10, value: MaintenanceStatus.ASSIGNED },
      { weight: 5, value: MaintenanceStatus.TESTING },
    ]);

    const createdAt = faker.date.recent({ days: 90 });
    const resolvedAt = status === MaintenanceStatus.RESOLVED
      ? new Date(createdAt.getTime() + faker.number.int({ min: 1, max: 7 }) * 86400000)
      : null;

    const ticket = await prisma.maintenanceTicket.create({
      data: {
        ticketNumber,
        equipmentId: eq.id,
        reportedById: reporter.id,
        assignedTechnicianId: status !== MaintenanceStatus.OPEN ? tech.id : null,
        issue: faker.helpers.arrayElement([
          "Channel 3 input BNC connector loose causing intermittent baseline signal noise > 15 mV.",
          "Turbo-molecular vacuum pump exhibiting abnormal harmonic vibration at 1500 Hz.",
          "Internal Peltier cooling element failing to stabilize temperature below 4.0°C under continuous load.",
          "Stepper motor axis Y missing steps during high-speed return-to-home cycle.",
          "Optical detector baseline drift exceeding ±0.05 AU/hr during solvent gradient elution.",
        ]),
        priority,
        status,
        resolution: status === MaintenanceStatus.RESOLVED
          ? "Replaced damaged SMA connector, cleaned optical flow cell with HPLC-grade methanol, and calibrated baseline."
          : null,
        resolvedAt,
        estimatedCost: faker.number.float({ min: 150, max: 2500, fractionDigits: 2 }),
        actualCost: status === MaintenanceStatus.RESOLVED
          ? faker.number.float({ min: 120, max: 2400, fractionDigits: 2 })
          : null,
        createdAt,
      },
    });

    // Create 1-3 work logs for assigned/in-repair/resolved tickets
    if (status !== MaintenanceStatus.OPEN) {
      const logCount = faker.number.int({ min: 1, max: 3 });
      for (let l = 0; l < logCount; l++) {
        await prisma.maintenanceWorkLog.create({
          data: {
            ticketId: ticket.id,
            technicianId: tech.id,
            notes: faker.helpers.arrayElement([
              "Disassembled front panel assembly. Traced fault to degraded surface-mount decoupling capacitor.",
              "Completed ultrasonic cleaning of aspiration nozzle. Replaced silicone O-rings with Viton seals.",
              "Executed manufacturer diagnostic self-test suite. All 18 sensor channels passed within 0.2% tolerance.",
            ]),
            partsReplaced: faker.helpers.arrayElement([
              "Viton High-Vacuum O-Ring Set (Part #VK-902)",
              "Keysight Low-Noise BNC Receptacle (Part #5061-0054)",
              "Semiconductor Peltier Module 12V 60W",
              null,
            ]),
            timeSpentHours: faker.number.float({ min: 0.5, max: 4.5, fractionDigits: 1 }),
            loggedAt: new Date(createdAt.getTime() + (l + 1) * 3600000 * 12),
          },
        });
      }
    }

    createdTickets.push(ticket);
  }
  console.log(`✅ Created ${createdTickets.length} Maintenance Work Orders & Diagnostic Logs`);

  // 7. Create Metrology & ISO-17025 Calibration Records (30–40 records)
  console.log("⚖️ Generating ISO-17025 Calibration Records...");
  let certCounter = 4001;
  const createdCalibrations = [];

  for (let c = 0; c < 35; c++) {
    const eq = faker.helpers.arrayElement(createdEquipment);
    const tech = faker.helpers.arrayElement(technicians);
    const certificateNumber = `NIST-CAL-2026-${certCounter++}`;

    const calibrationStatus = faker.helpers.weightedArrayElement([
      { weight: 60, value: CalibrationStatus.CALIBRATED },
      { weight: 25, value: CalibrationStatus.DUE_SOON },
      { weight: 15, value: CalibrationStatus.OVERDUE },
    ]);

    const calibrationDate = calibrationStatus === CalibrationStatus.OVERDUE
      ? faker.date.past({ years: 2 })
      : calibrationStatus === CalibrationStatus.DUE_SOON
      ? faker.date.recent({ days: 340 })
      : faker.date.recent({ days: 90 });

    const nextDueDate = new Date(calibrationDate);
    nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);

    const cal = await prisma.calibrationRecord.create({
      data: {
        certificateNumber,
        equipmentId: eq.id,
        technicianId: tech.id,
        calibrationDate,
        nextDueDate,
        standardUsed: faker.helpers.arrayElement([
          "NIST Traceable Class E2 Precision Mass Standard Set (Cert #NIST-98214)",
          "Fluke 5522A Multi-Product Calibrator with Oscilloscope Option (Cert #FLK-001)",
          "NIST Standard Reference Material SRM 2034 Holmium Oxide Spectral Solution",
          "Mitutoyo Optical Gauge Block Set Grade 0 (Cert #MT-4881)",
        ]),
        accuracyReading: faker.helpers.arrayElement([
          "±0.002% reading across full dynamic range (Pass)",
          "±0.015 mg deviation from nominal mass (Pass)",
          "±0.05 nm wavelength accuracy at 241.1 nm (Pass)",
        ]),
        calibrationStatus,
        certificateUrl: `/certificates/${certificateNumber}.pdf`,
        notes: "ISO/IEC 17025:2017 compliant calibration. Environmental conditions: 20.2°C, 44% RH.",
      },
    });
    createdCalibrations.push(cal);
  }
  console.log(`✅ Created ${createdCalibrations.length} Calibration Records`);

  // 8. Create Immutable Chain-of-Custody Audit Logs (120+ events)
  console.log("🛡️ Generating Immutable Chain-of-Custody Audit Log Stream...");
  const auditActions = [
    AuditAction.EQUIPMENT_CREATED,
    AuditAction.EQUIPMENT_STATUS_CHANGED,
    AuditAction.BORROW_REQUESTED,
    AuditAction.BORROW_APPROVED,
    AuditAction.EQUIPMENT_CHECKED_OUT,
    AuditAction.EQUIPMENT_RETURNED,
    AuditAction.INSPECTION_COMPLETED,
    AuditAction.MAINTENANCE_CREATED,
    AuditAction.MAINTENANCE_ASSIGNED,
    AuditAction.MAINTENANCE_RESOLVED,
    AuditAction.CALIBRATION_SCHEDULED,
    AuditAction.CALIBRATION_COMPLETED,
  ];

  for (let a = 0; a < 130; a++) {
    const actor = faker.helpers.arrayElement(allUsers);
    const eq = faker.helpers.arrayElement(createdEquipment);
    const action = faker.helpers.arrayElement(auditActions);
    const timestamp = faker.date.recent({ days: 90 });

    await prisma.auditLog.create({
      data: {
        action,
        entity: "Equipment",
        entityId: eq.id,
        actorId: actor.id,
        details: JSON.stringify({
          assetId: eq.assetId,
          equipmentName: eq.name,
          actorRole: actor.role,
          note: `System recorded lifecycle operation: ${action}`,
          previousStatus: eq.status,
          newStatus: eq.status,
        }),
        ipAddress: `192.168.10.${faker.number.int({ min: 10, max: 240 })}`,
        timestamp,
      },
    });
  }
  console.log(`✅ Created 130 Immutable Audit Log Events`);

  // 9. Create Sample Email Event records (Demonstrating Resend delivery tracking)
  console.log("📧 Generating Email Delivery Event Logs...");
  const sampleEmailRecipients = [
    "alex.rivera@student.labvault.edu",
    "dave.chen@labvault.edu",
    "marcus.sterling@labvault.edu",
    "sophia.lin@labvault.edu",
  ];

  for (let e = 0; e < 25; e++) {
    const recipient = faker.helpers.arrayElement(sampleEmailRecipients);
    const eventType = faker.helpers.weightedArrayElement([
      { weight: 70, value: "DELIVERED" },
      { weight: 15, value: "OPENED" },
      { weight: 10, value: "SENT" },
      { weight: 5, value: "BOUNCED" },
    ]) as any;

    await prisma.emailEvent.create({
      data: {
        providerEventId: `resend_evt_${faker.string.alphanumeric({ length: 16 })}`,
        messageId: `msg_${faker.string.alphanumeric({ length: 20 })}`,
        eventType,
        recipient,
        subject: faker.helpers.arrayElement([
          "Requisition Approved: Field Emission Scanning Electron Microscope",
          "Action Required: High-Speed Centrifuge Return Due Tomorrow",
          "Service Order Assigned: Spectrum Analyzer Signal Baseline",
          "Urgent Notice: ISO-17025 Calibration Overdue for Analytical Balance",
        ]),
        emailType: faker.helpers.arrayElement([
          "BORROW_APPROVED",
          "DUE_REMINDER",
          "MAINTENANCE_ASSIGNED",
          "CALIBRATION_DUE",
        ]),
        payload: JSON.stringify({
          provider: "Resend",
          timestamp: new Date().toISOString(),
          simulated: true,
        }),
        timestamp: faker.date.recent({ days: 14 }),
      },
    });
  }
  console.log(`✅ Created 25 Transactional Email Delivery Records`);

  console.log("\n=======================================================");
  console.log("🎉 LabVault Database Seeding Completed Successfully!");
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
