import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = r"d:\LabVault\submission\assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'

# 1. Architecture Diagram
def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=300)
    fig.patch.set_facecolor('#0F172A')
    ax.set_facecolor('#0F172A')
    ax.axis('off')
    
    # Title
    ax.text(6, 6.0, "LabVault - Full-Stack System Architecture", fontsize=18, fontweight='bold', 
            color='#38BDF8', ha='center', va='center')
    
    # 4 Main Tiers
    tiers = [
        ("1. Presentation Tier (Client/UI)", 
         ["Next.js 14 App Router", "React Server Components (RSC)", "Tailwind CSS + shadcn/ui", "Zustand State Store", "Radix UI Primitives (18+)"],
         '#1E293B', '#38BDF8', 0.5),
        ("2. Logic & Security Tier", 
         ["Next.js Server Actions", "Edge Middleware & JWT Auth", "Zod Runtime Validation", "4-Tier RBAC Guards", "Dynamic OG Image Engine"],
         '#1E293B', '#818CF8', 3.4),
        ("3. Data & Persistence Tier", 
         ["Prisma ORM Client", "PostgreSQL Database (9 Models)", "Faker.js Deterministic Seeder", "Repository Pattern Adapter", "Prisma Studio GUI"],
         '#1E293B', '#34D399', 6.3),
        ("4. Integration & Telemetry", 
         ["Resend Transactional Email", "7 React Email JSX Templates", "Svix Webhook Endpoint", "Immutable Chain Audit Logs", "Email Delivery Tracking"],
         '#1E293B', '#F472B6', 9.2)
    ]
    
    for title, items, bg_color, border_color, x_pos in tiers:
        # Card Box
        rect = patches.FancyBboxPatch((x_pos, 0.8), 2.5, 4.6, boxstyle="round,pad=0.1,rounding_size=0.15",
                                      facecolor=bg_color, edgecolor=border_color, linewidth=2)
        ax.add_patch(rect)
        
        # Header Badge
        header_rect = patches.FancyBboxPatch((x_pos + 0.1, 4.7), 2.3, 0.6, boxstyle="round,pad=0.05,rounding_size=0.1",
                                             facecolor=border_color, edgecolor='none')
        ax.add_patch(header_rect)
        ax.text(x_pos + 1.25, 5.0, title.split(' (')[0], fontsize=10, fontweight='bold', 
                color='#0F172A', ha='center', va='center')
        
        # Subtitle
        sub = title.split('(')[1].replace(')', '') if '(' in title else ''
        ax.text(x_pos + 1.25, 4.4, sub, fontsize=8, color='#94A3B8', ha='center', va='center')
        
        # Item list
        for i, item in enumerate(items):
            y = 3.8 - i * 0.65
            ax.text(x_pos + 0.2, y, f"• {item}", fontsize=8.5, color='#F1F5F9', va='center', wrap=True)
            
    # Connective arrows
    ax.annotate("", xy=(3.3, 3.1), xytext=(3.05, 3.1), arrowprops=dict(arrowstyle="->", color="#38BDF8", lw=2))
    ax.annotate("", xy=(6.2, 3.1), xytext=(5.95, 3.1), arrowprops=dict(arrowstyle="->", color="#818CF8", lw=2))
    ax.annotate("", xy=(9.1, 3.1), xytext=(8.85, 3.1), arrowprops=dict(arrowstyle="->", color="#34D399", lw=2))
    
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.5)
    
    out_path = os.path.join(ASSETS_DIR, "architecture_diagram.png")
    plt.tight_layout()
    plt.savefig(out_path, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print(f"[OK] Created: {out_path}")

# 2. Database Schema Map
def create_schema_diagram():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=300)
    fig.patch.set_facecolor('#0F172A')
    ax.set_facecolor('#0F172A')
    ax.axis('off')
    
    ax.text(6, 6.0, "LabVault - Relational Database Schema (9 PostgreSQL Models)", fontsize=18, fontweight='bold', 
            color='#38BDF8', ha='center', va='center')
    
    models = [
        ("User (32 records)", ["id (PK, CUID)", "name, email (Unique)", "role (Enum: 4 Roles)", "department, avatarUrl"], 0.6, 3.3, '#38BDF8'),
        ("Lab (6 records)", ["id (PK, CUID)", "code (Unique), name", "location, department", "managerId (FK -> User)"], 3.5, 3.3, '#818CF8'),
        ("Equipment (66 records)", ["id (PK), assetId (Unique)", "name, category (Enum)", "serialNumber, status", "labId (FK), custodianId (FK)"], 6.4, 3.3, '#34D399'),
        ("BorrowRequest (90 records)", ["id (PK), requisitionNumber", "equipmentId, userId (FKs)", "status (6 States), dates", "approvedById, inspectedById"], 9.3, 3.3, '#FBBF24'),
        
        ("MaintenanceTicket (35)", ["id (PK), ticketNumber", "equipmentId, reportedById", "priority, status (5 States)", "assignedTechnicianId (FK)"], 0.6, 0.6, '#F87171'),
        ("WorkLog (60+ records)", ["id (PK), ticketId (FK)", "technicianId (FK -> User)", "notes, partsReplaced", "timeSpentHours, loggedAt"], 3.5, 0.6, '#FB923C'),
        ("CalibrationRecord (35)", ["id (PK), certificateNumber", "equipmentId, technicianId", "calibrationDate, nextDueDate", "accuracyReading, status"], 6.4, 0.6, '#A78BFA'),
        ("Audit & Email (155)", ["AuditLog: 130 Immutable Logs", "EmailEvent: 25 Webhook Logs", "action, entityId, timestamp", "eventType, recipient, payload"], 9.3, 0.6, '#EC4899')
    ]
    
    for title, fields, x, y, col in models:
        rect = patches.FancyBboxPatch((x, y), 2.5, 2.3, boxstyle="round,pad=0.08,rounding_size=0.12",
                                      facecolor='#1E293B', edgecolor=col, linewidth=1.8)
        ax.add_patch(rect)
        
        ax.text(x + 0.15, y + 2.0, title, fontsize=10, fontweight='bold', color=col, va='center')
        
        for idx, fld in enumerate(fields):
            ax.text(x + 0.15, y + 1.55 - idx * 0.4, f"• {fld}", fontsize=7.8, color='#E2E8F0', va='center')
            
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.5)
    
    out_path = os.path.join(ASSETS_DIR, "database_schema_diagram.png")
    plt.tight_layout()
    plt.savefig(out_path, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print(f"[OK] Created: {out_path}")

# 3. Lifecycle Workflow
def create_workflow_diagram():
    fig, ax = plt.subplots(figsize=(12, 5.5), dpi=300)
    fig.patch.set_facecolor('#0F172A')
    ax.set_facecolor('#0F172A')
    ax.axis('off')
    
    ax.text(6, 5.0, "LabVault - Equipment Lifecycle & Request Pipeline", fontsize=18, fontweight='bold', 
            color='#38BDF8', ha='center', va='center')
    
    steps = [
        ("1. Discovery", "Search, Filter & QR Scan\nView Availability Specs", '#38BDF8', 0.5),
        ("2. Requisition", "Student Loan Request\nPurpose & Return Schedule", '#818CF8', 2.8),
        ("3. Approval", "Lab Manager Decision\nTrigger Resend Email", '#34D399', 5.1),
        ("4. Handover", "Technician Checkout\nAsset Custody Assignment", '#FBBF24', 7.4),
        ("5. Inspection", "Check-in & Health Audit\nMaintenance / Calibration", '#F87171', 9.7)
    ]
    
    for title, desc, col, x in steps:
        rect = patches.FancyBboxPatch((x, 1.2), 1.9, 2.8, boxstyle="round,pad=0.08,rounding_size=0.15",
                                      facecolor='#1E293B', edgecolor=col, linewidth=2)
        ax.add_patch(rect)
        
        # Circle Step Number
        circle = patches.Circle((x + 0.95, 3.4), 0.35, facecolor=col, edgecolor='none')
        ax.add_patch(circle)
        ax.text(x + 0.95, 3.4, title.split('.')[0], fontsize=11, fontweight='bold', color='#0F172A', ha='center', va='center')
        
        ax.text(x + 0.95, 2.7, title.split('. ')[1], fontsize=11, fontweight='bold', color=col, ha='center', va='center')
        ax.text(x + 0.95, 1.9, desc, fontsize=8.2, color='#E2E8F0', ha='center', va='center')
        
        if x < 9.0:
            ax.annotate("", xy=(x + 2.75, 2.6), xytext=(x + 2.05, 2.6),
                        arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=2))
            
    # Bottom Audit ribbon
    audit_rect = patches.FancyBboxPatch((0.5, 0.3), 11.1, 0.6, boxstyle="round,pad=0.05,rounding_size=0.1",
                                        facecolor='#334155', edgecolor='#38BDF8', linewidth=1)
    ax.add_patch(audit_rect)
    ax.text(6, 0.6, "Automated Immutable Audit Log Event Stream & Resend Email Delivery Tracking at every step", 
            fontsize=9, fontweight='bold', color='#38BDF8', ha='center', va='center')
    
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 5.5)
    
    out_path = os.path.join(ASSETS_DIR, "workflow_diagram.png")
    plt.tight_layout()
    plt.savefig(out_path, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print(f"[OK] Created: {out_path}")

create_architecture_diagram()
create_schema_diagram()
create_workflow_diagram()
