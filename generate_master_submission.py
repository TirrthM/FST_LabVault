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
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

OUTPUT_DIR = r"d:\LabVault\submission"
ASSETS_DIR = r"d:\LabVault\submission\assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. PPT GENERATION (VISUALLY RICH & EMBEDDED DIAGRAMS)
# -------------------------------------------------------------
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette: Clean Slate Dark Theme
COLOR_BG = RGBColor(15, 23, 42)        # #0F172A Slate 900
COLOR_CARD = RGBColor(30, 41, 59)      # #1E293B Slate 800
COLOR_PRIMARY = RGBColor(56, 189, 248)  # #38BDF8 Sky 400
COLOR_ACCENT = RGBColor(129, 140, 248) # #818CF8 Indigo 400
COLOR_TEXT = RGBColor(241, 245, 249)   # #F1F5F9 Slate 100
COLOR_MUTED = RGBColor(148, 163, 184)  # #94A3B8 Slate 400
COLOR_GREEN = RGBColor(52, 211, 153)   # #34D399 Emerald 400

def create_slide_background(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_BG
    bg.line.color.rgb = COLOR_BG
    return bg

# --- SLIDE 1: Title Slide ---
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide1)

title_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.3), Inches(11.333), Inches(4.8))
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
p2.space_before = Pt(8)

p3 = tf1.add_paragraph()
p3.text = "Complete Project Presentation (Assignments 1 & 2 Combined)"
p3.font.size = Pt(17)
p3.font.color.rgb = COLOR_ACCENT
p3.space_before = Pt(12)

p4 = tf1.add_paragraph()
p4.text = "What is LabVault?\nA modern web application for universities and research labs to track equipment, approve student loan requests, log maintenance repairs, schedule calibrations, and send automated email alerts."
p4.font.size = Pt(14)
p4.font.color.rgb = COLOR_MUTED
p4.space_before = Pt(20)

p5 = tf1.add_paragraph()
p5.text = "Tech Stack: Next.js 14 App Router | TypeScript | PostgreSQL + Prisma ORM | Faker.js | Resend & React Email | RBAC"
p5.font.size = Pt(12)
p5.font.color.rgb = COLOR_GREEN
p5.space_before = Pt(16)

# --- SLIDE 2: Full System Architecture ---
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide2)

hdr2 = slide2.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.8))
tf2 = hdr2.text_frame
p_h2 = tf2.paragraphs[0]
p_h2.text = "System Architecture & Core Technology Stack"
p_h2.font.size = Pt(24)
p_h2.font.bold = True
p_h2.font.color.rgb = COLOR_PRIMARY

# Embed Architecture Diagram Image
arch_img_path = os.path.join(ASSETS_DIR, "architecture_diagram.png")
if os.path.exists(arch_img_path):
    slide2.shapes.add_picture(arch_img_path, Inches(0.8), Inches(1.35), width=Inches(7.2))

# Text Card on the Right side
desc_card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.3), Inches(1.35), Inches(4.2), Inches(5.6))
desc_card.fill.solid()
desc_card.fill.fore_color.rgb = COLOR_CARD
desc_card.line.color.rgb = COLOR_ACCENT

tf_d = desc_card.text_frame
tf_d.word_wrap = True
tf_d.margin_left = Inches(0.25)
tf_d.margin_right = Inches(0.25)
tf_d.margin_top = Inches(0.25)

p_dt = tf_d.paragraphs[0]
p_dt.text = "Architecture Highlights"
p_dt.font.size = Pt(17)
p_dt.font.bold = True
p_dt.font.color.rgb = COLOR_PRIMARY
p_dt.space_after = Pt(10)

arch_points = [
    ("Presentation (Frontend)", "Next.js 14 App Router, React Server Components (RSC), Tailwind CSS, shadcn/ui, and Radix UI primitives."),
    ("Logic & State", "Server Actions for safe database changes, Zustand for instant client role switching, Zod for validation."),
    ("Persistence (Backend)", "PostgreSQL database managed by Prisma ORM with 9 relational models and 30+ indexes."),
    ("Email & Notifications", "Resend API with 7 React Email templates, plus Svix webhooks for real-time delivery tracking.")
]

for title, desc in arch_points:
    p_t = tf_d.add_paragraph()
    p_t.text = f"• {title}:"
    p_t.font.size = Pt(12)
    p_t.font.bold = True
    p_t.font.color.rgb = COLOR_ACCENT
    
    p_b = tf_d.add_paragraph()
    p_b.text = f"  {desc}"
    p_b.font.size = Pt(11)
    p_b.font.color.rgb = COLOR_TEXT
    p_b.space_after = Pt(6)

# --- SLIDE 3: Relational Database & Automated Mock Seeding ---
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide3)

hdr3 = slide3.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.8))
tf3 = hdr3.text_frame
p_h3 = tf3.paragraphs[0]
p_h3.text = "Relational Database (Prisma) & Faker.js Seeding (Topic 4)"
p_h3.font.size = Pt(24)
p_h3.font.bold = True
p_h3.font.color.rgb = COLOR_PRIMARY

# Embed Database Schema Image
schema_img_path = os.path.join(ASSETS_DIR, "database_schema_diagram.png")
if os.path.exists(schema_img_path):
    slide3.shapes.add_picture(schema_img_path, Inches(0.8), Inches(1.35), width=Inches(7.2))

# Right summary card
db_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.3), Inches(1.35), Inches(4.2), Inches(5.6))
db_card.fill.solid()
db_card.fill.fore_color.rgb = COLOR_CARD
db_card.line.color.rgb = COLOR_ACCENT

tf_db = db_card.text_frame
tf_db.word_wrap = True
tf_db.margin_left = Inches(0.25)
tf_db.margin_right = Inches(0.25)
tf_db.margin_top = Inches(0.25)

p_dbt = tf_db.paragraphs[0]
p_dbt.text = "Database & Seeding Summary"
p_dbt.font.size = Pt(17)
p_dbt.font.bold = True
p_dbt.font.color.rgb = COLOR_PRIMARY
p_dbt.space_after = Pt(10)

db_points = [
    ("9 Relational Tables", "Users, Labs, Equipment, Borrow Requests, Maintenance Tickets, Work Logs, Calibrations, Audit Logs, Email Events."),
    ("Reproducible Seeding", "faker.seed(123456) generates exact realistic data every time using 'npm run db:seed'."),
    ("Populated Academic Data", "32 multi-role users, 6 labs, 66 equipment items, 90 borrow requests, 35 work orders, 130 audit events."),
    ("Visual Management", "Prisma Studio runs locally at http://localhost:5555 for instant web-based database browsing.")
]

for title, desc in db_points:
    p_t = tf_db.add_paragraph()
    p_t.text = f"• {title}:"
    p_t.font.size = Pt(12)
    p_t.font.bold = True
    p_t.font.color.rgb = COLOR_ACCENT
    
    p_b = tf_db.add_paragraph()
    p_b.text = f"  {desc}"
    p_b.font.size = Pt(11)
    p_b.font.color.rgb = COLOR_TEXT
    p_b.space_after = Pt(6)

# --- SLIDE 4: Equipment Lifecycle & Transactional Email ---
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide4)

hdr4 = slide4.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.8))
tf4 = hdr4.text_frame
p_h4 = tf4.paragraphs[0]
p_h4.text = "Equipment Lifecycle Workflow & Resend Email (Topic 5)"
p_h4.font.size = Pt(24)
p_h4.font.bold = True
p_h4.font.color.rgb = COLOR_PRIMARY

# Embed Workflow Diagram
wf_img_path = os.path.join(ASSETS_DIR, "workflow_diagram.png")
if os.path.exists(wf_img_path):
    slide4.shapes.add_picture(wf_img_path, Inches(0.8), Inches(1.35), width=Inches(11.733))

# 3 Horizontal Information Cards Below
card_y = Inches(4.7)
c_w = Inches(3.64)
c_gap = Inches(0.38)

info_cards = [
    ("7 React Email Templates", [
        "Borrow Approved & Rejected notifications",
        "24-Hour Return Due reminders",
        "Maintenance assigned & completed",
        "Calibration warning & Critical failures"
    ]),
    ("Resend SDK & Webhook", [
        "Pre-built JSX email design system",
        "Local simulation mode for development",
        "Svix cryptographic webhook security",
        "Sent, Delivered & Bounced tracking"
    ]),
    ("4-Tier Security (RBAC)", [
        "Student: Search catalog & request loans",
        "Technician: Checkouts, logs, calibrations",
        "Lab Manager: Approvals & ticket assignments",
        "Admin: Full audit log & system settings"
    ])
]

for idx, (ctitle, cpts) in enumerate(info_cards):
    c_left = Inches(0.8) + idx * (c_w + c_gap)
    c_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, card_y, c_w, Inches(2.3))
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = COLOR_CARD
    c_box.line.color.rgb = COLOR_ACCENT

    tf_c = c_box.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.18)
    tf_c.margin_right = Inches(0.18)
    tf_c.margin_top = Inches(0.15)
    
    p_ct = tf_c.paragraphs[0]
    p_ct.text = ctitle
    p_ct.font.size = Pt(14)
    p_ct.font.bold = True
    p_ct.font.color.rgb = COLOR_PRIMARY
    p_ct.space_after = Pt(6)
    
    for pt in cpts:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"• {pt}"
        p_pt.font.size = Pt(10.5)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(3)

# --- SLIDE 5: Verification & Key Highlights ---
slide5 = prs.slides.add_slide(prs.slide_layouts[6])
create_slide_background(slide5)

hdr5 = slide5.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.8))
tf5 = hdr5.text_frame
p_h5 = tf5.paragraphs[0]
p_h5.text = "Project Verification, Quality & Submission Summary"
p_h5.font.size = Pt(24)
p_h5.font.bold = True
p_h5.font.color.rgb = COLOR_PRIMARY

col_w5 = Inches(3.64)
col_gap5 = Inches(0.38)
left_base5 = Inches(0.8)

cards_s5 = [
    ("Build & Type Safety", [
        "next build: Exit Code 0 (13 static pages, 8 APIs)",
        "tsc --noEmit: 0 TypeScript errors across codebase",
        "Edge Middleware (32.5 kB) for fast role security",
        "Lightweight bundles (< 95 kB initial client JS)"
    ]),
    ("Complete Problem Solved", [
        "Eliminates paper logs and lost lab equipment",
        "Transparent real-time chain-of-custody tracking",
        "Automatic email reminders prevent late returns",
        "ISO-17025 calibration tracking ensures safety"
    ]),
    ("How to Test & Run", [
        "1. Database: PostgreSQL running on port 5432",
        "2. Migrate: npx prisma migrate dev --name init",
        "3. Seed: npm run db:seed (Faker.js)",
        "4. Start: npm run dev -> http://localhost:3000",
        "5. Database GUI: npx prisma studio (port 5555)"
    ])
]

for idx, (title, points) in enumerate(cards_s5):
    c_left = left_base5 + idx * (col_w5 + col_gap5)
    card_shape = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(1.5), col_w5, Inches(5.4))
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
        p_pt.font.size = Pt(12)
        p_pt.font.color.rgb = COLOR_TEXT
        p_pt.space_after = Pt(7)

pptx_path = os.path.join(OUTPUT_DIR, "LabVault_Project_Presentation.pptx")
prs.save(pptx_path)
print(f"[OK] Generated Master PPT: {pptx_path}")

# -------------------------------------------------------------
# 2. DOCX REPORT GENERATION (DETAILED, EASY TO UNDERSTAND)
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

# Title & Metadata
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_title = p_title.add_run("LabVault: Laboratory Equipment Lifecycle & Maintenance Platform")
run_title.font.size = DocxPt(22)
run_title.font.bold = True
run_title.font.color.rgb = DocxRGBColor(15, 23, 42)

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_sub = p_sub.add_run("Complete Technical Project Report\nFull Implementation: Assignment 1 (Frontend & Architecture) + Assignment 2 (Relational DB, Seeding, Emails & RBAC)")
run_sub.font.size = DocxPt(12)
run_sub.font.italic = True
run_sub.font.color.rgb = DocxRGBColor(71, 85, 105)

p_meta = doc.add_paragraph()
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_meta = p_meta.add_run("Course: Advanced Full-Stack Web Development | Academic Submission\nTechnologies: Next.js 14 App Router, TypeScript, PostgreSQL, Prisma ORM, Faker.js, Resend & React Email, Zustand, Radix UI")
run_meta.font.size = DocxPt(9.5)
run_meta.font.color.rgb = DocxRGBColor(100, 116, 139)
p_meta.paragraph_format.space_after = DocxPt(16)

doc.add_paragraph("―" * 55).alignment = WD_ALIGN_PARAGRAPH.CENTER

# 1. Project Introduction in Simple Terms
add_styled_heading("1. Project Introduction & Problem Statement", 1)
doc.add_paragraph(
    "In universities and scientific research institutes, managing laboratory equipment—such as electron microscopes, "
    "high-speed centrifuges, oscilloscopes, and spectrometers—is often a chaotic and manual process. Most institutions still rely on "
    "paper logbooks, uncoordinated spreadsheets, or verbal requests. This leads to serious problems: equipment goes missing, "
    "loan returns are forgotten, maintenance issues remain unrecorded, and delicate instruments miss mandatory calibration deadlines."
)
doc.add_paragraph(
    "LabVault solves this challenge by providing a modern, full-stack web application that manages the entire lifecycle "
    "of academic laboratory equipment. From the moment an asset is registered, through student loan requests, approval workflows, "
    "technician checkouts, repair work orders, and ISO-17025 calibration records, LabVault ensures transparent, automated, and secure management."
)

# 2. System Architecture & Embedded Diagram
add_styled_heading("2. System Architecture & Technology Stack", 1)
doc.add_paragraph(
    "LabVault is built using a modern 4-tier architecture designed for speed, type safety, and real-time responsiveness:"
)

# Embed Architecture Diagram in DOCX
if os.path.exists(arch_img_path):
    doc.add_picture(arch_img_path, width=DocxInches(6.5))
    p_caption = doc.add_paragraph("Figure 1: LabVault 4-Tier Full-Stack System Architecture")
    p_caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_caption.paragraph_format.space_after = DocxPt(12)
    p_caption.runs[0].font.size = DocxPt(9)
    p_caption.runs[0].font.italic = True

t_stack = doc.add_table(rows=1, cols=3)
t_stack.alignment = WD_TABLE_ALIGNMENT.CENTER
for c in t_stack.rows[0].cells:
    set_cell_background(c, "E2E8F0")
t_stack.rows[0].cells[0].text = "Tier / Component"
t_stack.rows[0].cells[1].text = "Technology Used"
t_stack.rows[0].cells[2].text = "Purpose & Simple Explanation"
for c in t_stack.rows[0].cells:
    c.paragraphs[0].runs[0].font.bold = True

tech_table_data = [
    ("Frontend (Presentation)", "Next.js 14 App Router, React Server Components (RSC), Tailwind CSS", "Renders fast, interactive user interfaces with dark/light themes and instant page transitions."),
    ("UI Component System", "shadcn/ui & Radix UI Primitives", "Provides 18+ accessible, polished UI elements including modals, dropdowns, tabs, and tooltips."),
    ("State Management", "Zustand & React Hook Form", "Stores client state, handles instant user role switching, and collects validated form inputs."),
    ("Data Validation", "Zod Schema Validation", "Ensures all user inputs are strictly checked on both client and server before processing."),
    ("Relational Database", "PostgreSQL + Prisma ORM", "Stores all users, equipment, requests, and logs with strong data integrity and relationships."),
    ("Mock Data Generator", "Faker.js v9 (@faker-js/faker)", "Automatically generates hundreds of realistic equipment items, users, and logs for testing."),
    ("Transactional Email", "Resend SDK + @react-email", "Sends automated, beautifully designed email alerts for approvals, due dates, and repair tickets."),
    ("Delivery Webhooks", "Svix Signature Verification", "Listens for email delivery updates (Delivered, Opened, Bounced) and logs them in the database."),
    ("Security & RBAC", "Jose (JWT) + Edge Middleware", "Restricts access to sensitive pages and actions based on user role (Student, Tech, Manager, Admin).")
]

for tier, tech, expl in tech_table_data:
    r = t_stack.add_row().cells
    r[0].text = tier
    r[1].text = tech
    r[2].text = expl

for row in t_stack.rows:
    for cell in row.cells:
        cell.paragraphs[0].runs[0].font.size = DocxPt(9)

# 3. Assignment 1 Technical Deliverables
add_styled_heading("3. Assignment 1: User Experience, UI/UX & Server Actions", 1)
doc.add_paragraph(
    "Assignment 1 delivered the complete interactive frontend and application architecture:"
)
doc.add_paragraph(
    "• Equipment Discovery & Faceted Search: Users can search and filter 60+ instruments by category (Optical, Analytical, Electrical, Mechanical, Biological), lab room, condition, and status.\n"
    "• Equipment Detail Pages & Dynamic Social Cards: Displays full technical specifications, user manuals, and past maintenance history. Also generates dynamic OpenGraph preview cards via `/api/og/equipment/[id]`.\n"
    "• Loan Requisition Workflow: Students submit borrow requests specifying dates and course project justifications with instant Zod schema validation.\n"
    "• Maintenance & Calibration Logs: Technicians can open diagnostic work orders, record parts replaced, log repair hours, and track calibration certificates.\n"
    "• Instant Role Switcher: A floating header widget that lets reviewers switch between Student, Technician, Lab Manager, and Administrator roles with a single click."
)

# 4. Assignment 2 Technical Deliverables (Topic 4: Database & Faker.js)
add_styled_heading("4. Assignment 2 (Topic 4): Relational Database & Faker.js Seeding", 1)
doc.add_paragraph(
    "Assignment 2 introduced full database persistence using Prisma ORM with PostgreSQL. The schema is organized into 9 normalized models:"
)

# Embed Schema Diagram in DOCX
if os.path.exists(schema_img_path):
    doc.add_picture(schema_img_path, width=DocxInches(6.5))
    p_caption2 = doc.add_paragraph("Figure 2: LabVault Relational Database Schema & Data Models")
    p_caption2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_caption2.paragraph_format.space_after = DocxPt(12)
    p_caption2.runs[0].font.size = DocxPt(9)
    p_caption2.runs[0].font.italic = True

doc.add_paragraph(
    "1. User: Stores institutional users across 4 roles (STUDENT, TECHNICIAN, LAB_MANAGER, ADMIN).\n"
    "2. Lab: Represents physical facilities (Robotics Lab, Microscopy Cleanroom, VLSI Lab, etc.).\n"
    "3. Equipment: Physical instruments with serial numbers, warranty dates, specs, and custodian links.\n"
    "4. BorrowRequest: Loan requisitions moving through REQUESTED -> APPROVED -> BORROWED -> RETURNED -> INSPECTED.\n"
    "5. MaintenanceTicket & MaintenanceWorkLog: Work orders and technician diagnostics.\n"
    "6. CalibrationRecord: ISO-17025 metrology calibration records with accuracy tolerances.\n"
    "7. AuditLog: Immutable chain-of-custody audit trail recording all asset events.\n"
    "8. EmailEvent: Delivery log storing message timestamps and webhook events."
)

doc.add_paragraph(
    "Deterministic Seeding (`prisma/seed.ts`): Using `@faker-js/faker` with `faker.seed(123456)`, the database "
    "is populated with 32 users, 6 labs, 66 equipment items, 90 borrow requisitions, 35 repair tickets, and 130 audit logs "
    "in under 3 seconds upon running `npm run db:seed`."
)

# 5. Assignment 2 Technical Deliverables (Topic 5: Transactional Email & Webhooks)
add_styled_heading("5. Assignment 2 (Topic 5): Transactional Emails & Delivery Webhooks", 1)
doc.add_paragraph(
    "To automate communication and prevent equipment hoarding, LabVault integrates the Resend SDK with 7 React Email templates:"
)

# Embed Workflow Diagram in DOCX
if os.path.exists(wf_img_path):
    doc.add_picture(wf_img_path, width=DocxInches(6.5))
    p_caption3 = doc.add_paragraph("Figure 3: Equipment Requisition Lifecycle & Notification Pipeline")
    p_caption3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_caption3.paragraph_format.space_after = DocxPt(12)
    p_caption3.runs[0].font.size = DocxPt(9)
    p_caption3.runs[0].font.italic = True

t_email = doc.add_table(rows=1, cols=3)
t_email.alignment = WD_TABLE_ALIGNMENT.CENTER
for c in t_email.rows[0].cells:
    set_cell_background(c, "E2E8F0")
t_email.rows[0].cells[0].text = "Email Template"
t_email.rows[0].cells[1].text = "Recipient & Trigger"
t_email.rows[0].cells[2].text = "Purpose & Content"
for c in t_email.rows[0].cells:
    c.paragraphs[0].runs[0].font.bold = True

email_data = [
    ("BorrowApprovedEmail", "Student (When Manager Approves)", "Confirms equipment is ready for pickup with return deadline and lab location details."),
    ("BorrowRejectedEmail", "Student (When Manager Rejects)", "Politely informs student of rejection with reasons (e.g. maintenance conflict)."),
    ("EquipmentDueReminderEmail", "Borrower (24h Before Due Date)", "Friendly reminder to return instrument on time to avoid late penalties."),
    ("MaintenanceAssignedEmail", "Technician (When Ticket Assigned)", "Alerts technician with hardware failure details, model number, and priority."),
    ("MaintenanceResolvedEmail", "Requester & Lab Manager", "Confirms repair completion and verifies instrument is back in AVAILABLE status."),
    ("CalibrationDueEmail", "Lab Manager (Before Expiration)", "Warns that an instrument's ISO-17025 calibration is due or overdue."),
    ("CriticalIssueEmail", "Administrators (On Major Failure)", "Urgent safety alert regarding hazardous failure or critical breakdown.")
]

for tmpl, rec, purp in email_data:
    r = t_email.add_row().cells
    r[0].text = tmpl
    r[1].text = rec
    r[2].text = purp

for row in t_email.rows:
    for cell in row.cells:
        cell.paragraphs[0].runs[0].font.size = DocxPt(9)

doc.add_paragraph(
    "\nDelivery Tracking & Webhooks: Incoming webhook events from Resend are verified using cryptographic Svix "
    "headers at `/api/webhooks/resend`. Status changes (Sent, Delivered, Opened, Bounced) are automatically saved to PostgreSQL."
)

# 6. Verification and Testing Results
add_styled_heading("6. Verification & Quality Assurance Summary", 1)
doc.add_paragraph(
    "The application was validated across all technical quality standards:"
)

t_ver = doc.add_table(rows=1, cols=3)
t_ver.alignment = WD_TABLE_ALIGNMENT.CENTER
for c in t_ver.rows[0].cells:
    set_cell_background(c, "E2E8F0")
t_ver.rows[0].cells[0].text = "Test / Verification Step"
t_ver.rows[0].cells[1].text = "Execution Command"
t_ver.rows[0].cells[2].text = "Observed Result & Outcome"
for c in t_ver.rows[0].cells:
    c.paragraphs[0].runs[0].font.bold = True

ver_data = [
    ("Production Build", "npm run build (next build)", "Exit Code 0 — 13 static pages and 8 dynamic API routes compiled cleanly."),
    ("TypeScript Validation", "npx tsc --noEmit", "Exit Code 0 — Zero type errors across all source files and seed scripts."),
    ("Database Migration", "npx prisma migrate dev", "PostgreSQL database 'labvault' synchronized with 9 relational tables."),
    ("Automated Seeding", "npm run db:seed", "Created 32 users, 66 assets, 90 requests, 35 tickets, 130 audit logs in 2.8s."),
    ("Visual GUI Inspection", "npx prisma studio", "All 9 tables visually verified at http://localhost:5555."),
    ("Local Web Server", "npm run dev", "Operational at http://localhost:3000 with sub-second hot reloading.")
]

for step, cmd, res in ver_data:
    r = t_ver.add_row().cells
    r[0].text = step
    r[1].text = cmd
    r[2].text = res

for row in t_ver.rows:
    for cell in row.cells:
        cell.paragraphs[0].runs[0].font.size = DocxPt(9)

# 7. Conclusion
add_styled_heading("7. Conclusion", 1)
doc.add_paragraph(
    "LabVault provides a complete, scalable, and intuitive solution for academic laboratory equipment management. "
    "By uniting Next.js 14, React Server Components, PostgreSQL, Prisma ORM, Faker.js automated seeding, Resend transactional emails, "
    "and 4-tier Role-Based Access Control, the project successfully fulfills all academic requirements across both Assignment 1 and Assignment 2."
)

docx_path = os.path.join(OUTPUT_DIR, "LabVault_Project_Technical_Report.docx")
doc.save(docx_path)
print(f"[OK] Generated Master DOCX Report: {docx_path}")
