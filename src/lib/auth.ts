import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { UserRole, User } from "@/types";

const AUTH_COOKIE_NAME = "labvault_session";
const AUTH_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "labvault-super-secure-production-auth-secret-change-in-prod"
);

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
}

export interface Session {
  user: User;
  role: UserRole;
  isAuthenticated: boolean;
}

// Deterministic mock seed users mapped to active roles
export const DEFAULT_USERS: Record<UserRole, User> = {
  STUDENT: {
    id: "usr_student_01",
    name: "Alex Rivera",
    email: "alex.rivera@student.labvault.edu",
    role: "STUDENT",
    department: "Mechanical & Mechatronics Engineering",
    studentOrEmployeeId: "STU-2024-8841",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 234-5678",
  },
  LAB_TECHNICIAN: {
    id: "usr_tech_01",
    name: "Dave Chen",
    email: "dave.chen@labvault.edu",
    role: "LAB_TECHNICIAN",
    department: "Central Instrument Facility",
    studentOrEmployeeId: "EMP-TECH-104",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 345-6789",
  },
  LAB_MANAGER: {
    id: "usr_mgr_01",
    name: "Dr. Marcus Sterling",
    email: "marcus.sterling@labvault.edu",
    role: "LAB_MANAGER",
    department: "Materials Science & Metallurgy",
    studentOrEmployeeId: "FAC-MGR-012",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 456-7890",
  },
  ADMIN: {
    id: "usr_admin_01",
    name: "Dr. Eleanor Vance",
    email: "eleanor.vance@labvault.edu",
    role: "ADMIN",
    department: "Office of the Dean of Research & Engineering",
    studentOrEmployeeId: "ADM-DEAN-001",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 567-8901",
  },
};

/**
 * Encrypt and sign a JWT session token
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(AUTH_SECRET);
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET);
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Server-side helper to extract current authenticated session from cookies.
 */
export async function getServerSession(): Promise<Session> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (sessionCookie) {
    const decoded = await verifySessionToken(sessionCookie);
    if (decoded && decoded.role) {
      const defaultMatch = DEFAULT_USERS[decoded.role] || DEFAULT_USERS.STUDENT;
      return {
        user: {
          id: decoded.userId || defaultMatch.id,
          name: decoded.name || defaultMatch.name,
          email: decoded.email || defaultMatch.email,
          role: decoded.role,
          department: decoded.department || defaultMatch.department,
          studentOrEmployeeId: defaultMatch.studentOrEmployeeId,
          avatarUrl: decoded.avatarUrl || defaultMatch.avatarUrl,
        },
        role: decoded.role,
        isAuthenticated: true,
      };
    }
  }

  // Default fallback to Student role session if no cookie present
  const defaultUser = DEFAULT_USERS.STUDENT;
  return {
    user: defaultUser,
    role: "STUDENT",
    isAuthenticated: true,
  };
}

/**
 * Server-side Role Check & Authorization Guard
 */
export function authorizeRole(
  currentRole: UserRole,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(currentRole);
}

/**
 * Assert that the current session has permission for an operation.
 * Throws Error if unauthorized.
 */
export async function requireAuthRole(
  allowedRoles: UserRole[],
  errorMessage: string = "Unauthorized: You do not have permission to perform this action."
): Promise<Session> {
  const session = await getServerSession();
  if (!authorizeRole(session.role, allowedRoles)) {
    throw new Error(errorMessage);
  }
  return session;
}
