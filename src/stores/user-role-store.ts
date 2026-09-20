"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserRole, User } from "@/types";
import { SEED_USERS } from "@/data/seed-data";

export interface UserRoleState {
  currentRole: UserRole;
  currentUser: User;
  setRole: (role: UserRole) => void;
}

const roleToUserMap: Record<UserRole, User> = {
  STUDENT: SEED_USERS.find((u) => u.role === "STUDENT") || SEED_USERS[0],
  LAB_TECHNICIAN: SEED_USERS.find((u) => u.role === "LAB_TECHNICIAN") || SEED_USERS[2],
  LAB_MANAGER: SEED_USERS.find((u) => u.role === "LAB_MANAGER") || SEED_USERS[4],
  ADMIN: SEED_USERS.find((u) => u.role === "ADMIN") || SEED_USERS[5],
};

export const useUserRoleStore = create<UserRoleState>()(
  persist(
    (set) => ({
      currentRole: "LAB_MANAGER",
      currentUser: roleToUserMap["LAB_MANAGER"],
      setRole: (role: UserRole) => {
        set({
          currentRole: role,
          currentUser: roleToUserMap[role],
        });
      },
    }),
    {
      name: "labvault_user_role_session_v1",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : ({} as Storage))),
    }
  )
);
