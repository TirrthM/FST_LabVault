import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

import docx
from docx.shared import Inches as DocxInches, Pt as DocxPt, RGBColor as DocxRGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

OUTPUT_DIR = r"d:\LabVault\submission"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. OVERALL PPT GENERATION (COMPLETE PROJECT - 4 to 5 SLIDES)
# -------------------------------------------------------------
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

COLOR_BG = RGBColor(15, 23, 42)        # #0F172A Slate 900
COLOR_CARD = RGBColor(30, 41, 59)      # #1E293B Slate 800
COLOR_PRIMARY = RGBColor(56, 189, 248)  # #38BDF8 Sky 400
COLOR_ACCENT = RGBColor(129, 140, 248) # #818CF8 Indigo 400
COLOR_TEXT = RGBColor(241, 245, 249)   # #F1F5F9 Slate 100
COLOR_MUTED = RGBColor(148, 163, 184)  # #94A3B8 Slate 400

def create_slide_background(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_BG
    bg.line.color.rgb = COLOR_BG
    return bg

# --- SLIDE 1: Title Slide ---
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide1)

title_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.333), Inches(4.5))
tf1 = title_box.text_frame
tf1.word_wrap = True

p1 = tf1.paragraphs[0]
p1.text = "LabVault"
p1.font.size = Pt(46)
p1.font.bold = True
p1.font.color.rgb = COLOR_PRIMARY

p2 = tf1.add_paragraph()
p2.text = "Laboratory Equipment Lifecycle & Maintenance Platform"
p2.font.size = Pt(24)
p2.font.color.rgb = COLOR_TEXT
p2.space_before = Pt(8)

p3 = tf1.add_paragraph()
p3.text = "Comprehensive Project Submission: Assignments 1 & 2 Combined"
p3.font.size = Pt(18)
p3.font.color.rgb = COLOR_ACCENT
p3.space_before = Pt(14)

p4 = tf1.add_paragraph()
p4.text = "Next.js 14 App Router | React Server Components | PostgreSQL + Prisma ORM | Faker.js | Resend & React Email | RBAC"
p4.font.size = Pt(13)
p4.font.color.rgb = COLOR_MUTED
p4.space_before = Pt(24)

# --- SLIDE 2: Frontend Architecture & UI/UX (Assignment 1) ---
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide2)

hdr2 = slide2.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(11.7), Inches(0.9))
tf2 = hdr2.text_frame
p_h2 = tf2.paragraphs[0]
p_h2.text = "Frontend Architecture & Modern UI/UX (Assignment 1)"
p_h2.font.size = Pt(24)
p_h2.font.bold = True
p_h2.font.color.rgb = COLOR_PRIMARY

col_w = Inches(3.64)
col_gap = Inches(0.38)
left_base = Inches(0.8)

cards_s2 = [
    ("Next.js 14 App Router & RSC", [
        "Hybrid architecture with React Server Components (RSC) and Client Components",
        "Sub-second page loads with server-side rendering and streaming suspense",
        "Dynamic OpenGraph preview card generation at /api/og/equipment/[id]",
        "Clean, semantic routing for 13 views and operational dashboards"
    ]),
    ("shadcn/ui & Radix Primitives", [
        "18+ accessible Radix UI primitives: Dialogs, Selects, Dropdowns, Tabs, Tooltips",
        "Tailwind CSS theme tokens with high-contrast Dark & Light mode toggle",
        "Custom laboratory equipment telemetry cards with status badges",
        "Responsive data tables with real-time filtering, search, and pagination"
    ]),
    ("State & Server Mutations", [
        "Zustand store for client-side state, role switching, and shopping cart loans",
        "React Hook Form + Zod schemas for strict client-and-server validation",
        "Next.js Server Actions for secure, non-blocking mutations and revalidation",
        "Sonner toast notifications with optimistic visual feedback"
    ])
]

for idx, (title, points) in enumerate(cards_s2):
    c_left = left_base + idx * (col_w + col_gap)
    card_shape = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(1.65), col_w, Inches(5.2))
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = COLOR_CARD
    card_shape.line.color.rgb = COLOR_ACCENT

    tf_c = card_shape.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.22)
    tf_c.margin_right = Inches(0.22)
    tf_c.margin_top = Inches(0.22)
    
    p_ct = tf_c.paragraphs[0]
    p_ct.text = title
    p_ct.font.size = Pt(17)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_PRIMARY
    p_ct.space_after = Pt(12)
    
    for pt in points:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"• {pt}"
        p_pt.font.size = Pt(12.5)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(7)

# --- SLIDE 3: Relational Database & Faker.js Seeding (Assignment 2 / Topic 4) ---
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide3)

hdr3 = slide3.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(11.7), Inches(0.9))
tf3 = hdr3.text_frame
p_h3 = tf3.paragraphs[0]
p_h3.text = "Relational Data Modeling & Automated Seeding (Topic 4)"
p_h3.font.size = Pt(24)
p_h3.font.bold = True
p_h3.font.color.rgb = COLOR_PRIMARY

cards_s3 = [
    ("Normalized PostgreSQL Schema", [
        "9 Relational Models: User, Lab, Equipment, BorrowRequest, MaintenanceTicket, WorkLog, Calibration, AuditLog, EmailEvent",
        "8 Domain Enums for strict type safety",
        "30+ B-tree indexes for fast queries & joins",
        "Cascade, SetNull, and Restrict constraints"
    ]),
    ("Deterministic Seeding (Faker.js)", [
        "faker.seed(123456) for reproducible datasets",
        "32 Users across 4 institutional roles",
        "6 Academic Facilities & 66 Equipment Assets",
        "90 Borrow Requisitions (Requested to Inspected)",
        "35 Maintenance Tickets + 35 Calibration Records",
        "130 Chain-of-Custody Immutable Audit Logs"
    ]),
    ("Repository Data Access Pattern", [
        "Repository Layer (repository.ts) decouples data persistence from UI components",
        "Seamless fallback to in-memory mock-db",
        "Zero-downtime Prisma migrations (migrate dev)",
        "Prisma Studio for instant database GUI view"
    ])
]

for idx, (title, points) in enumerate(cards_s3):
    c_left = left_base + idx * (col_w + col_gap)
    card_shape = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(1.65), col_w, Inches(5.2))
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = COLOR_CARD
    card_shape.line.color.rgb = COLOR_ACCENT

    tf_c = card_shape.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.22)
    tf_c.margin_right = Inches(0.22)
    tf_c.margin_top = Inches(0.22)
    
    p_ct = tf_c.paragraphs[0]
    p_ct.text = title
    p_ct.font.size = Pt(17)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_PRIMARY
    p_ct.space_after = Pt(12)
    
    for pt in points:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"• {pt}"
        p_pt.font.size = Pt(12.5)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(7)

# --- SLIDE 4: Transactional Email, Webhooks & Security (Topic 5 & RBAC) ---
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide4)

hdr4 = slide4.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(11.7), Inches(0.9))
tf4 = hdr4.text_frame
p_h4 = tf4.paragraphs[0]
p_h4.text = "Transactional Email, Delivery Webhooks & RBAC Security"
p_h4.font.size = Pt(24)
p_h4.font.bold = True
p_h4.font.color.rgb = COLOR_PRIMARY

cards_s4 = [
    ("7 React Email Templates", [
        "Borrow Approved & Rejected notifications",
        "Equipment Due & Overdue Return Reminders",
        "Maintenance Work Order Assigned alerts",
        "Maintenance Resolved confirmation",
        "ISO-17025 Calibration Due warning",
        "Critical Equipment Failure escalation"
    ]),
    ("Resend SDK & Svix Webhook", [
        "Type-safe JSX component rendering",
        "Automated simulation mode for local dev",
        "Full dispatch telemetry stored in database",
        "Endpoint at /api/webhooks/resend",
        "Svix cryptographic signature verification"
    ]),
    ("4-Tier RBAC Architecture", [
        "Student: View catalog, request equipment",
        "Technician: Checkouts, returns, logs, calibrations",
        "Lab Manager: Approvals, allocations, tickets",
        "Admin: Full audit stream, lab & user config",
        "Protected via Edge Middleware & Server Actions"
    ])
]

for idx, (title, points) in enumerate(cards_s4):
    c_left = left_base + idx * (col_w + col_gap)
    card_shape = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(1.65), col_w, Inches(5.2))
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = COLOR_CARD
    card_shape.line.color.rgb = COLOR_ACCENT

    tf_c = card_shape.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.22)
    tf_c.margin_right = Inches(0.22)
    tf_c.margin_top = Inches(0.22)
    
    p_ct = tf_c.paragraphs[0]
    p_ct.text = title
    p_ct.font.size = Pt(17)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_PRIMARY
    p_ct.space_after = Pt(12)
    
    for pt in points:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"• {pt}"
        p_pt.font.size = Pt(12.5)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(7)

# --- SLIDE 5: Project Summary & Verification Matrix ---
slide5 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide5)

hdr5 = slide5.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(11.7), Inches(0.9))
tf5 = hdr5.text_frame
p_h5 = tf5.paragraphs[0]
p_h5.text = "Overall Project Verification & Deliverables Summary"
p_h5.font.size = Pt(24)
p_h5.font.bold = True
p_h5.font.color.rgb = COLOR_PRIMARY

cards_s5 = [
    ("Build & Type Verification", [
        "next build: Exit Code 0 (13 pages, 8 APIs)",
        "tsc --noEmit: 0 TypeScript compilation errors",
        "Edge Middleware (32.5 kB) role routing",
        "Optimized client bundles (< 95 kB initial JS)"
    ]),
    ("End-to-End Operational Flow", [
        "1. Equipment Discovery & QR Lookup",
        "2. Requisition Submission (Zod validated)",
        "3. Manager Approval -> Trigger Email",
        "4. Tech Checkout -> Custody Handover",
        "5. Return Inspection -> Calibration / Maintenance",
        "6. Immutable Chain-of-Custody Audit Log"
    ]),
    ("Complete Submission Package", [
        "Full Git Repository with clean history",
        "Prisma Relational Database & Seed script",
        "7 Transactional Email Templates & Webhook",
        "Prisma Studio GUI Management",
        "20+ Technical Reports & Reference Docs"
    ])
]

for idx, (title, points) in enumerate(cards_s5):
    c_left = left_base + idx * (col_w + col_gap)
    card_shape = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(1.65), col_w, Inches(5.2))
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = COLOR_CARD
    card_shape.line.color.rgb = COLOR_ACCENT

    tf_c = card_shape.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.22)
    tf_c.margin_right = Inches(0.22)
    tf_c.margin_top = Inches(0.22)
    
    p_ct = tf_c.paragraphs[0]
    p_ct.text = title
    p_ct.font.size = Pt(17)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_PRIMARY
    p_ct.space_after = Pt(12)
    
    for pt in points:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"• {pt}"
        p_pt.font.size = Pt(12.5)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(7)

pptx_path = os.path.join(OUTPUT_DIR, "LabVault_Complete_Project_Presentation.pptx")
prs.save(pptx_path)
print(f"[OK] Generated Overall PPT: {pptx_path}")

# -------------------------------------------------------------
# 2. OVERALL DOCX REPORT GENERATION (COMPREHENSIVE)
# -------------------------------------------------------------
doc = docx.Document()

for section in doc.sections:
    section.top_margin = DocxInches(1)
    section.bottom_margin = DocxInches(1)
    section.left_margin = DocxInches(1)
    section.right_margin = DocxInches(1)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def add_styled_heading(text, level, space_before=14, space_after=6):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.space_before = DocxPt(space_before)
    h.paragraph_format.space_after = DocxPt(space_after)
    return h

# Title & Cover Block
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_title = p_title.add_run("LabVault: Laboratory Equipment Lifecycle & Maintenance Platform")
run_title.font.size = DocxPt(22)
run_title.font.bold = True
run_title.font.color.rgb = DocxRGBColor(15, 23, 42)

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_sub = p_sub.add_run("Comprehensive Technical Project Report\nFull Implementation: Assignment 1 (Frontend & Architecture) + Assignment 2 (Relational DB, Seeding, Emails & RBAC)")
run_sub.font.size = DocxPt(13)
run_sub.font.italic = True
run_sub.font.color.rgb = DocxRGBColor(71, 85, 105)

p_meta = doc.add_paragraph()
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_meta = p_meta.add_run("Academic Engineering Project | Full-Stack Web Application\nTechnologies: Next.js 14 App Router, TypeScript, PostgreSQL, Prisma ORM, Faker.js, Resend & React Email, Zustand, Radix UI")
run_meta.font.size = DocxPt(10)
run_meta.font.color.rgb = DocxRGBColor(100, 116, 139)
p_meta.paragraph_format.space_after = DocxPt(18)

doc.add_paragraph("―" * 55).alignment = WD_ALIGN_PARAGRAPH.CENTER

# 1. Executive Summary
add_styled_heading("1. Executive Summary", 1)
doc.add_paragraph(
    "LabVault is an enterprise-grade web application engineered to manage the complete lifecycle of laboratory equipment, "
    "instrumentation, metrology calibrations, and maintenance workflows across academic and research institutions. "
    "Combining high-performance frontend architecture with robust relational database persistence and automated transactional "
    "communication, LabVault eliminates equipment hoarding, untracked calibration drifts, unrecorded hardware faults, "
    "and paper-based checkout bottlenecks."
)
doc.add_paragraph(
    "This document provides the exhaustive technical summary of the entire project, covering the architectural foundations "
    "established in Assignment 1 and the enterprise database, mock generation, email, and security capabilities delivered in Assignment 2."
)

# 2. System Architecture & Tech Stack Matrix
add_styled_heading("2. System Architecture & Technology Stack", 1)
doc.add_paragraph(
    "The application leverages modern full-stack web standards designed for reliability, type safety, and accessibility:"
)

t_stack = doc.add_table(rows=1, cols=3)
t_stack.alignment = WD_TABLE_ALIGNMENT.CENTER
for c in t_stack.rows[0].cells:
    set_cell_background(c, "E2E8F0")
t_stack.rows[0].cells[0].text = "Architecture Layer"
t_stack.rows[0].cells[1].text = "Core Technologies"
t_stack.rows[0].cells[2].text = "Key Responsibilities & Features"
for c in t_stack.rows[0].cells:
    c.paragraphs[0].runs[0].font.bold = True

stack_data = [
    ("Frontend Framework", "Next.js 14 (App Router)", "React Server Components (RSC), dynamic metadata, OpenGraph image generation (@vercel/og)"),
    ("UI & Component System", "Tailwind CSS, shadcn/ui, Radix UI", "18+ accessible UI primitives, dark/light theme switching, responsive laboratory dashboards"),
    ("State & Mutations", "Zustand, React Hook Form, Zod", "Client-side state management, role switching, Zod runtime validation, Next.js Server Actions"),
    ("Database & ORM", "PostgreSQL + Prisma ORM", "9 relational models, 8 enums, 30+ B-tree indexes, referential integrity (Cascade/SetNull/Restrict)"),
    ("Automated Mock Data", "Faker.js v9 (@faker-js/faker)", "Deterministic faker.seed(123456), 32 users, 66 equipment assets, 90 requisitions, 130 audit logs"),
    ("Transactional Email", "Resend SDK + @react-email", "7 responsive JSX templates, simulated local dispatch, email event logging in PostgreSQL"),
    ("Delivery Webhooks", "Svix + Route Handlers", "Cryptographic signature validation at /api/webhooks/resend for Sent/Delivered/Bounced states"),
    ("Security & RBAC", "Jose (JWT) + Edge Middleware", "4-tier institutional RBAC (Student, Technician, Lab Manager, Admin), Server Action authorization guards")
]

for layer, tech, resp in stack_data:
    row = t_stack.add_row().cells
    row[0].text = layer
    row[1].text = tech
    row[2].text = resp

for row in t_stack.rows:
    for cell in row.cells:
        cell.paragraphs[0].runs[0].font.size = DocxPt(9.5)

# 3. Assignment 1 Features (Frontend, Components, Actions)
add_styled_heading("3. Assignment 1: User Experience, Components & Server Actions", 1)
doc.add_paragraph(
    "Assignment 1 established the interactive foundation of the platform:"
)
doc.add_paragraph(
    "1. Equipment Catalog & Filtering: Fast faceted search across categories (Optical, Analytical, Electrical, Mechanical, Biological, Measuring, Computing), laboratory location, condition, and operational availability status.\n"
    "2. Dynamic Equipment Details & OG Cards: Server-rendered detail pages with technical specifications, maintenance history, and auto-generated OpenGraph preview cards.\n"
    "3. Borrowing & Requisition Pipeline: Interactive borrowing workflow with calendar date pickers, project purpose forms, and real-time status badges.\n"
    "4. Maintenance & Calibration Tracking: Diagnostic work orders, technician assignment, priority classification, and NIST-traceable calibration schedules.\n"
    "5. Institutional Role Switcher: Instant client-side role simulator enabling testing across Student, Lab Technician, Lab Manager, and Administrator perspectives."
)

# 4. Assignment 2 Features (Database, Seeding, Emails, RBAC)
add_styled_heading("4. Assignment 2: Database Persistence, Seeding, Email & RBAC", 1)

doc.add_paragraph("4.1 Relational Schema Design (Topic 4)")
doc.add_paragraph(
    "A strongly typed PostgreSQL schema was constructed using Prisma ORM with 9 core domain models:\n"
    "• User: System users with email uniqueness, department, avatar, and UserRole enum.\n"
    "• Lab: Academic research facilities, capacity limits, and assigned manager relations.\n"
    "• Equipment: Physical instrumentation, serial numbers, QR code references, warranty dates, and custodian linkage.\n"
    "• BorrowRequest: Formal loan requisitions with request/approval/checkout/return/inspection lifecycle.\n"
    "• MaintenanceTicket & MaintenanceWorkLog: Work orders with priority, status, repair logs, and costs.\n"
    "• CalibrationRecord: ISO/IEC 17025:2017 compliant calibration certificates with accuracy readings.\n"
    "• AuditLog: Immutable chain-of-custody audit stream capturing actor, action, timestamp, and IP.\n"
    "• EmailEvent: Transactional delivery telemetry tracking message statuses from Resend."
)

doc.add_paragraph("4.2 Automated Seeding with Faker.js (Topic 4)")
doc.add_paragraph(
    "The automated seeding script (`prisma/seed.ts`) populates the database with realistic academic data using `faker.seed(123456)`:\n"
    "• 32 Institutional Users (Students, Technicians, Lab Managers, Administrators).\n"
    "• 6 Specialized Academic Facilities (Robotics Lab, Cleanroom Microscopy, VLSI Lab, Materials Lab, Chemistry Core, Genomics Lab).\n"
    "• 66 Real-world Scientific Equipment Assets (FE-SEM microscopes, 1 GHz oscilloscopes, HPLC systems, FTIR spectrometers, qPCR systems, 50 kN Instron testers).\n"
    "• 90 Realistic Borrow Requisitions with historical and active lifecycle states.\n"
    "• 35 Maintenance Work Orders with multi-step diagnostic work logs.\n"
    "• 35 ISO-17025 NIST Calibration Certificates.\n"
    "• 130 Immutable Chain-of-Custody Audit Log Events."
)

doc.add_paragraph("4.3 Transactional Email Subsystem (Topic 5)")
doc.add_paragraph(
    "LabVault integrates the Resend SDK with 7 modular React Email templates:\n"
    "1. BorrowApprovedEmail: Informs borrowers of loan approval and collection location.\n"
    "2. BorrowRejectedEmail: Explains requisition denial reason and scheduling alternatives.\n"
    "3. EquipmentDueReminderEmail: Automated 24-hour return deadline reminder.\n"
    "4. MaintenanceAssignedEmail: Alerts technicians of assigned work orders.\n"
    "5. MaintenanceResolvedEmail: Confirms equipment repair and status restoration.\n"
    "6. CalibrationDueEmail: Flags overdue ISO-17025 calibration dates for lab managers.\n"
    "7. CriticalIssueEmail: Immediate alert to administrators regarding critical equipment failure."
)

doc.add_paragraph("4.4 Webhook Delivery Tracking & RBAC Security")
doc.add_paragraph(
    "Incoming Resend webhook events are validated using Svix cryptographic headers at `/api/webhooks/resend`. "
    "Furthermore, security is enforced via JWT session tokens in Next.js Edge Middleware and `requireAuthRole()` checks on Server Actions."
)

# 5. Verification & Testing Matrix
add_styled_heading("5. Verification & Quality Assurance", 1)
doc.add_paragraph(
    "All components were rigorously validated:"
)

t_ver = doc.add_table(rows=1, cols=3)
t_ver.alignment = WD_TABLE_ALIGNMENT.CENTER
for c in t_ver.rows[0].cells:
    set_cell_background(c, "E2E8F0")
t_ver.rows[0].cells[0].text = "Verification Step"
t_ver.rows[0].cells[1].text = "Command / Method"
t_ver.rows[0].cells[2].text = "Observed Result"
for c in t_ver.rows[0].cells:
    c.paragraphs[0].runs[0].font.bold = True

ver_data = [
    ("Production Build", "npm run build (next build)", "Exit Code 0 — 13 static pages, 8 dynamic REST/Webhook APIs compiled successfully"),
    ("TypeScript Type Check", "npx tsc --noEmit", "Exit Code 0 — Zero type errors across all source files and seed.ts"),
    ("Database Migration", "npx prisma migrate dev", "PostgreSQL database 'labvault' schema synchronized (migration: init)"),
    ("Faker.js Seeding", "npm run db:seed", "Successfully generated 32 users, 66 assets, 90 borrows, 130 audit logs in < 3s"),
    ("Database GUI", "npx prisma studio", "All 9 tables visually verified at http://localhost:5555"),
    ("Development Server", "npm run dev", "Operational at http://localhost:3000 with sub-second hot reload")
]

for step, cmd, res in ver_data:
    row = t_ver.add_row().cells
    row[0].text = step
    row[1].text = cmd
    row[2].text = res

for row in t_ver.rows:
    for cell in row.cells:
        cell.paragraphs[0].runs[0].font.size = DocxPt(9.5)

# 6. Conclusion
add_styled_heading("6. Conclusion", 1)
doc.add_paragraph(
    "LabVault successfully fulfills all requirements across Assignment 1 and Assignment 2. "
    "The application demonstrates mastery of modern web architecture: from accessible, responsive React interfaces "
    "and optimistic Server Actions to relational database modeling, reproducible automated seeding, transactional communications, "
    "and enterprise RBAC authorization."
)

docx_path = os.path.join(OUTPUT_DIR, "LabVault_Complete_Project_Technical_Report.docx")
doc.save(docx_path)
print(f"[OK] Generated Overall DOCX Report: {docx_path}")
