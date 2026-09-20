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
# 1. PPT GENERATION (3-4 SLIDES)
# -------------------------------------------------------------
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette: Deep Slate, Indigo/Cyan Accents, Off-white
COLOR_BG = RGBColor(15, 23, 42)        # #0F172A Slate 900
COLOR_CARD = RGBColor(30, 41, 59)      # #1E293B Slate 800
COLOR_PRIMARY = RGBColor(56, 189, 248)  # #38BDF8 Sky 400
COLOR_ACCENT = RGBColor(129, 140, 248) # #818CF8 Indigo 400
COLOR_TEXT = RGBColor(241, 245, 249)   # #F1F5F9 Slate 100
COLOR_MUTED = RGBColor(148, 163, 184)  # #94A3B8 Slate 400
COLOR_WHITE = RGBColor(255, 255, 255)

def create_slide_background(slide):
    # Background rectangle
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_BG
    bg.line.color.rgb = COLOR_BG
    return bg

# --- SLIDE 1: Title Slide ---
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide1)

# Title Card
title_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(3.8))
tf1 = title_box.text_frame
tf1.word_wrap = True

p1 = tf1.paragraphs[0]
p1.text = "LabVault"
p1.font.size = Pt(48)
p1.font.bold = True
p1.font.color.rgb = COLOR_PRIMARY

p2 = tf1.add_paragraph()
p2.text = "Laboratory Equipment Lifecycle & Maintenance Platform"
p2.font.size = Pt(24)
p2.font.color.rgb = COLOR_TEXT
p2.space_before = Pt(10)

p3 = tf1.add_paragraph()
p3.text = "Assignment 2: Relational Database, Faker.js Seeding & Resend Transactional Email"
p3.font.size = Pt(18)
p3.font.color.rgb = COLOR_ACCENT
p3.space_before = Pt(16)

p4 = tf1.add_paragraph()
p4.text = "Tech Stack: Next.js 14 App Router | PostgreSQL + Prisma ORM | Faker.js | Resend & React Email | RBAC"
p4.font.size = Pt(14)
p4.font.color.rgb = COLOR_MUTED
p4.space_before = Pt(28)

# --- SLIDE 2: Architecture & Relational Database (Topic 4) ---
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide2)

# Slide Header
hdr2 = slide2.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(1.0))
tf2 = hdr2.text_frame
p_h2 = tf2.paragraphs[0]
p_h2.text = "Relational Data Modeling & Automated Seeding (Topic 4)"
p_h2.font.size = Pt(26)
p_h2.font.bold = True
p_h2.font.color.rgb = COLOR_PRIMARY

# 3 Column Cards
col_w = Inches(3.64)
col_gap = Inches(0.38)
left_base = Inches(0.8)

cards_s2 = [
    ("Prisma & PostgreSQL Schema", [
        "9 Normalized Models: User, Lab, Equipment, BorrowRequest, MaintenanceTicket, MaintenanceWorkLog, CalibrationRecord, AuditLog, EmailEvent",
        "8 Domain Enums for strict type safety",
        "30+ B-tree indexes for fast queries & joins",
        "Referential actions (Cascade, SetNull, Restrict)"
    ]),
    ("Deterministic Faker.js Seeding", [
        "faker.seed(123456) for reproducible test states",
        "32 Users across 4 roles (Student, Tech, Mgr, Admin)",
        "6 Facilities & 66 Real-world Equipment Assets",
        "90 Borrow Requisitions & 35 Maintenance Tickets",
        "130 Chain-of-Custody Immutable Audit Logs"
    ]),
    ("Data Access Layer & Migration", [
        "Repository Pattern decouples UI from DB",
        "Seamless fallback to in-memory mock-db",
        "Zero-downtime Prisma migrations (migrate dev)",
        "Integrated Prisma Studio visual management"
    ])
]

for idx, (title, points) in enumerate(cards_s2):
    c_left = left_base + idx * (col_w + col_gap)
    card_shape = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(1.8), col_w, Inches(5.0))
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = COLOR_CARD
    card_shape.line.color.rgb = COLOR_ACCENT

    tf_c = card_shape.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.25)
    tf_c.margin_right = Inches(0.25)
    tf_c.margin_top = Inches(0.25)
    
    p_ct = tf_c.paragraphs[0]
    p_ct.text = title
    p_ct.font.size = Pt(18)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_PRIMARY
    p_ct.space_after = Pt(14)
    
    for pt in points:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"• {pt}"
        p_pt.font.size = Pt(13)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(8)

# --- SLIDE 3: Transactional Email & React Email (Topic 5) ---
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide3)

hdr3 = slide3.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(1.0))
tf3 = hdr3.text_frame
p_h3 = tf3.paragraphs[0]
p_h3.text = "Transactional Email & Delivery Webhooks (Topic 5)"
p_h3.font.size = Pt(26)
p_h3.font.bold = True
p_h3.font.color.rgb = COLOR_PRIMARY

cards_s3 = [
    ("7 React Email Templates", [
        "Borrow Approved & Rejected notifications",
        "Equipment Due & Overdue Return Reminders",
        "Maintenance Work Order Assigned alerts",
        "Maintenance Resolved confirmation",
        "ISO-17025 Calibration Due warning",
        "Critical Equipment Failure escalation"
    ]),
    ("Resend SDK Integration", [
        "Type-safe JSX component rendering",
        "Automated fallback simulation mode for dev",
        "Zero crash risk when API keys unconfigured",
        "Full dispatch telemetry stored in database",
        "Instant notification on Server Action lifecycle"
    ]),
    ("Svix Webhook Delivery Tracking", [
        "Secure endpoint at /api/webhooks/resend",
        "Cryptographic Svix signature validation",
        "Event tracking: Sent, Delivered, Opened, Bounced",
        "Audit trail linking EmailEvents to Requisitions"
    ])
]

for idx, (title, points) in enumerate(cards_s3):
    c_left = left_base + idx * (col_w + col_gap)
    card_shape = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(1.8), col_w, Inches(5.0))
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = COLOR_CARD
    card_shape.line.color.rgb = COLOR_ACCENT

    tf_c = card_shape.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.25)
    tf_c.margin_right = Inches(0.25)
    tf_c.margin_top = Inches(0.25)
    
    p_ct = tf_c.paragraphs[0]
    p_ct.text = title
    p_ct.font.size = Pt(18)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_PRIMARY
    p_ct.space_after = Pt(14)
    
    for pt in points:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"• {pt}"
        p_pt.font.size = Pt(13)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(8)

# --- SLIDE 4: Security, RBAC & Assignment Verification ---
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide4)

hdr4 = slide4.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(1.0))
tf4 = hdr4.text_frame
p_h4 = tf4.paragraphs[0]
p_h4.text = "RBAC Security & Verification Summary"
p_h4.font.size = Pt(26)
p_h4.font.bold = True
p_h4.font.color.rgb = COLOR_PRIMARY

cards_s4 = [
    ("4-Tier RBAC Architecture", [
        "Student: View catalog, request loans, track status",
        "Lab Technician: Checkouts, returns, logs, calibrations",
        "Lab Manager: Approve requests, assign tickets",
        "Admin: Full audit access, lab configs, role switching",
        "Secured via Next.js Middleware & Server Actions"
    ]),
    ("Seamless Assignment 1 Integration", [
        "100% backward compatible with Assignment 1",
        "Preserved Radix UI / shadcn design system",
        "Zustand client state + Next.js Server Actions",
        "Zod runtime validation for all mutations",
        "Dynamic OpenGraph preview image generator"
    ]),
    ("Build & Testing Verification", [
        "Production Build: next build (Exit code 0)",
        "Type Safety: tsc --noEmit (0 TypeScript errors)",
        "Full seeding verification with 66+ assets",
        "Interactive Prisma Studio dashboard",
        "13 Static pages + 8 REST / Webhook API routes"
    ])
]

for idx, (title, points) in enumerate(cards_s4):
    c_left = left_base + idx * (col_w + col_gap)
    card_shape = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(1.8), col_w, Inches(5.0))
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = COLOR_CARD
    card_shape.line.color.rgb = COLOR_ACCENT

    tf_c = card_shape.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.25)
    tf_c.margin_right = Inches(0.25)
    tf_c.margin_top = Inches(0.25)
    
    p_ct = tf_c.paragraphs[0]
    p_ct.text = title
    p_ct.font.size = Pt(18)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_PRIMARY
    p_ct.space_after = Pt(14)
    
    for pt in points:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"• {pt}"
        p_pt.font.size = Pt(13)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(8)

pptx_path = os.path.join(OUTPUT_DIR, "LabVault_Assignment2_Presentation.pptx")
prs.save(pptx_path)
print(f"[OK] Generated PPT: {pptx_path}")

# -------------------------------------------------------------
# 2. DOCX REPORT GENERATION
# -------------------------------------------------------------
doc = docx.Document()

# Page Margins: 1 inch
for section in doc.sections:
    section.top_margin = DocxInches(1)
    section.bottom_margin = DocxInches(1)
    section.left_margin = DocxInches(1)
    section.right_margin = DocxInches(1)

# Helpers for styling
def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def add_styled_heading(text, level, space_before=12, space_after=6):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.space_before = DocxPt(space_before)
    h.paragraph_format.space_after = DocxPt(space_after)
    return h

# Title & Metadata
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_title = p_title.add_run("LabVault: Laboratory Equipment Lifecycle & Maintenance Platform")
run_title.font.size = DocxPt(22)
run_title.font.bold = True
run_title.font.color.rgb = DocxRGBColor(15, 23, 42)

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_sub = p_sub.add_run("Assignment 2 Technical Submission Report\nTopic 4: Database Seeding (Faker.js) & Topic 5: Transactional Email (Resend)")
run_sub.font.size = DocxPt(13)
run_sub.font.italic = True
run_sub.font.color.rgb = DocxRGBColor(71, 85, 105)

p_meta = doc.add_paragraph()
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_meta = p_meta.add_run("Course: Advanced Web Application Engineering | Academic Year 2026\nTech Stack: Next.js 14 App Router, PostgreSQL, Prisma ORM, Faker.js, Resend & React Email, RBAC")
run_meta.font.size = DocxPt(10)
run_meta.font.color.rgb = DocxRGBColor(100, 116, 139)
p_meta.paragraph_format.space_after = DocxPt(20)

doc.add_paragraph("―" * 55).alignment = WD_ALIGN_PARAGRAPH.CENTER

# 1. Executive Summary
add_styled_heading("1. Executive Summary", 1)
doc.add_paragraph(
    "LabVault is an enterprise-grade laboratory equipment lifecycle, maintenance, and asset tracking system "
    "developed for higher educational and research institutions. Building upon the Assignment 1 foundational architecture "
    "(Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Zustand, and Server Actions), "
    "Assignment 2 delivers complete database persistence, automated mock data generation, transactional email workflows, "
    "and end-to-end Role-Based Access Control (RBAC)."
)

# 2. Key Architecture & Objectives
add_styled_heading("2. Core Academic Deliverables", 1)

doc.add_paragraph(
    "Assignment 2 fulfills all mandatory academic requirements without disrupting or breaking Assignment 1 features:"
)

# Table of Deliverables
t1 = doc.add_table(rows=1, cols=3)
t1.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = t1.rows[0].cells
hdr_cells[0].text = "Component / Module"
hdr_cells[1].text = "Technology Implemented"
hdr_cells[2].text = "Key Functionality & Artifacts"
for c in hdr_cells:
    set_cell_background(c, "E2E8F0")
    c.paragraphs[0].runs[0].font.bold = True

deliverables_data = [
    ("Relational Database", "PostgreSQL + Prisma ORM", "9 normalized models, 8 enums, 30+ indexes, cascade constraints"),
    ("Automated Seeding", "Faker.js v9 (@faker-js/faker)", "Deterministic faker.seed(123456), 32 users, 66 assets, 90 requests"),
    ("Transactional Emails", "Resend SDK + @react-email", "7 responsive templates, simulation mode, event persistence"),
    ("Delivery Webhooks", "Svix + Next.js Route Handlers", "Cryptographic signature verification at /api/webhooks/resend"),
    ("Security & RBAC", "Jose (JWT) + Next.js Middleware", "4 roles (Student, Tech, Lab Manager, Admin), server guards"),
    ("Backward Compatibility", "Repository Pattern", "Seamless abstraction layer connecting Prisma DB & mock store")
]

for item, tech, desc in deliverables_data:
    row_cells = t1.add_row().cells
    row_cells[0].text = item
    row_cells[1].text = tech
    row_cells[2].text = desc

for row in t1.rows:
    for cell in row.cells:
        cell.paragraphs[0].runs[0].font.size = DocxPt(9.5)

# 3. Topic 4: Relational Schema & Database Seeding
add_styled_heading("3. Topic 4: Relational Database Schema & Faker.js Seeding", 1)
doc.add_paragraph(
    "A production-grade relational schema was engineered using Prisma ORM with PostgreSQL. "
    "The schema captures the full asset management lifecycle across 9 strongly-typed entities:"
)

doc.add_paragraph(
    "• User: Multi-role authentication (STUDENT, TECHNICIAN, LAB_MANAGER, ADMIN).\n"
    "• Lab: Academic research facilities and room capacity allocations.\n"
    "• Equipment: Physical instrumentation with serial numbers, warranty, and custodian references.\n"
    "• BorrowRequest: Full requisition pipeline with checkout/checkin and inspection notes.\n"
    "• MaintenanceTicket & MaintenanceWorkLog: Work orders and technician diagnostics.\n"
    "• CalibrationRecord: Metrology and ISO-17025 NIST-traceable calibration certificates.\n"
    "• AuditLog: Immutable chain-of-custody audit stream.\n"
    "• EmailEvent: Webhook-driven delivery log capturing Sent, Delivered, and Bounced states."
)

doc.add_paragraph(
    "The automated seeding script (`prisma/seed.ts`) employs `@faker-js/faker` with a deterministic seed (`123456`) "
    "to guarantee identical, realistic academic data across all environments upon executing `npm run db:seed`."
)

# 4. Topic 5: Transactional Email Integration
add_styled_heading("4. Topic 5: Transactional Email with Resend & React Email", 1)
doc.add_paragraph(
    "LabVault incorporates a robust transactional email subsystem powered by Resend and React Email. "
    "All email templates are crafted using JSX components for cross-client styling and brand consistency."
)

email_templates = [
    ("BorrowApprovedEmail", "Notifies student of requisition approval with pickup instructions and return schedule."),
    ("BorrowRejectedEmail", "Informs student of request rejection with reason and alternative recommendation."),
    ("EquipmentDueReminderEmail", "Dispatches automated 24-hour return reminders before loan expiration."),
    ("MaintenanceAssignedEmail", "Alerts assigned technician with failure description and priority level."),
    ("MaintenanceResolvedEmail", "Confirms repair completion and returns equipment to AVAILABLE status."),
    ("CalibrationDueEmail", "Warns lab managers of upcoming ISO-17025 calibration deadlines."),
    ("CriticalIssueEmail", "Escalates safety or catastrophic hardware failures directly to administrators.")
]

t2 = doc.add_table(rows=1, cols=2)
t2.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr2 = t2.rows[0].cells
hdr2[0].text = "React Email Template"
hdr2[1].text = "Trigger Event & Lifecycle Context"
for c in hdr2:
    set_cell_background(c, "E2E8F0")
    c.paragraphs[0].runs[0].font.bold = True

for tmpl, context in email_templates:
    r = t2.add_row().cells
    r[0].text = tmpl
    r[1].text = context

for row in t2.rows:
    for cell in row.cells:
        cell.paragraphs[0].runs[0].font.size = DocxPt(9.5)

# 5. Security & RBAC Enforcement
add_styled_heading("5. Role-Based Access Control (RBAC) & Security", 1)
doc.add_paragraph(
    "Authorization is enforced through defense-in-depth across two layers:\n"
    "1. Edge Middleware (`src/middleware.ts`): Inspects encrypted JWT session cookies and guards routes such as /calibration and /activity from unauthorized roles.\n"
    "2. Server Action Guards (`src/lib/auth.ts`): Server actions execute `requireAuthRole()` to verify caller permissions before executing database mutations."
)

# 6. Verification and Build Status
add_styled_heading("6. Verification & Build Summary", 1)
doc.add_paragraph(
    "The application was thoroughly verified across multiple automated checks:\n"
    "• Production Build: `next build` compiled with Exit Code 0 (13 static pages, 8 dynamic API routes).\n"
    "• Type Safety: `tsc --noEmit` verified 0 TypeScript compilation errors.\n"
    "• Database Seeding: Successfully seeded 32 users, 66 equipment items, 90 borrow records, and 130 audit logs.\n"
    "• GUI Inspection: Verified all records visually using Prisma Studio at http://localhost:5555."
)

# 7. Conclusion
add_styled_heading("7. Conclusion", 1)
doc.add_paragraph(
    "Assignment 2 represents a complete full-stack expansion of LabVault. By integrating PostgreSQL, Prisma ORM, "
    "Faker.js deterministic seeding, Resend transactional notifications, and strict RBAC, LabVault meets all "
    "enterprise software engineering criteria for academic equipment lifecycle management."
)

docx_path = os.path.join(OUTPUT_DIR, "LabVault_Assignment2_Technical_Report.docx")
doc.save(docx_path)
print(f"[OK] Generated DOCX Report: {docx_path}")
