# Topic 3 Quiz — Type-Safe Server Actions with Zod Double Validation

## Instructions

Answer each question by selecting the correct option. Explanations are provided after each answer.

---

### Question 1

**What is the primary purpose of using Server Actions in Next.js App Router?**

A) To run JavaScript on the client before form submission  
B) To execute server-side mutations directly from React components without explicit API routes  
C) To replace React hooks like `useState` and `useReducer`  
D) To generate static HTML pages at build time  

**Answer: B**

> **Explanation**: Server Actions are asynchronous functions that execute on the server. They can be called directly from Client Components (via form `action` prop or event handlers) or Server Components, eliminating the need to create separate API route handlers for mutations. They are marked with `"use server"` at the top of the file or function body.

---

### Question 2

**In LabVault's double-validation architecture, where does Zod validation occur?**

A) Only on the client side (React Hook Form)  
B) Only on the server side (Server Action)  
C) On both client side (React Hook Form resolver) and server side (Server Action)  
D) In the database layer (Prisma schema validation)  

**Answer: C**

> **Explanation**: LabVault implements "double validation" — the same Zod schema is used both as a React Hook Form `zodResolver` (client-side, for instant UX feedback) and inside the Server Action (server-side, for security). Client validation can be bypassed by malicious actors, so server-side validation is **mandatory** for data integrity. Sharing the same schema ensures consistency.

---

### Question 3

**What does `zodResolver` from `@hookform/resolvers/zod` do?**

A) It converts Zod schemas into database migration files  
B) It integrates Zod validation into React Hook Form, providing real-time field-level error messages  
C) It replaces the need for server-side validation  
D) It generates TypeScript types from Zod schemas  

**Answer: B**

> **Explanation**: `zodResolver` is an adapter that bridges Zod schemas with React Hook Form's validation system. When a form field changes or on submission, React Hook Form passes the form data through the Zod schema. If validation fails, the error messages from Zod's `.min()`, `.email()`, `.refine()` etc. are mapped to the corresponding field's error state, enabling inline error display.

---

### Question 4

**Why must server-side Zod validation be performed even when client-side validation exists?**

A) Because Zod schemas only work on the server  
B) Because client-side validation can be bypassed by disabling JavaScript or sending direct HTTP requests  
C) Because React Hook Form does not support Zod  
D) Because Next.js requires server validation for caching  

**Answer: B**

> **Explanation**: Client-side validation is a UX convenience — it provides instant feedback. However, a malicious user can disable JavaScript, use browser devtools, or send direct POST requests to the Server Action endpoint, bypassing all client-side checks. Server-side validation is the **security boundary** that ensures only valid data is processed.

---

### Question 5

**In LabVault, what does the `z.infer<typeof borrowEquipmentSchema>` type utility produce?**

A) A Zod schema object  
B) A TypeScript type matching the shape defined by the Zod schema  
C) A SQL migration statement  
D) A React component props type  

**Answer: B**

> **Explanation**: `z.infer<T>` is a Zod utility type that extracts the TypeScript type from a Zod schema. For example, if `borrowEquipmentSchema` defines `{ equipmentId: z.string(), purpose: z.string().min(10) }`, then `z.infer<typeof borrowEquipmentSchema>` produces `{ equipmentId: string; purpose: string }`. This enables a single source of truth — the schema defines both runtime validation and compile-time types.

---

### Question 6

**What is the correct directive to mark a file as containing Server Actions?**

A) `"use client"`  
B) `"use server"`  
C) `"use action"`  
D) `"use api"`  

**Answer: B**

> **Explanation**: The `"use server"` directive at the top of a file marks all exported functions in that file as Server Actions. These functions will always execute on the server, even when invoked from Client Components. They can return serialisable values and can be used as form `action` props.

---

### Question 7

**What happens in LabVault when a Server Action returns `{ success: false, errors: {...} }`?**

A) The page automatically redirects to an error page  
B) The client component displays field-level validation errors and/or a toast notification  
C) The form data is saved to a draft  
D) The Server Action retries automatically  

**Answer: B**

> **Explanation**: LabVault's Server Actions return a discriminated union: `{ success: true, data: T }` or `{ success: false, errors: Record<string, string[]> }`. The client component checks the response and either shows a success toast (with `sonner`) or maps the error object to form field errors and/or displays a server error message.

---

### Question 8

**What is Optimistic UI, and how does LabVault implement it?**

A) Pre-rendering pages at build time for fast loading  
B) Updating the UI immediately before the server confirms the action, then rolling back on failure  
C) Caching server responses for offline access  
D) Using WebSockets for real-time updates  

**Answer: B**

> **Explanation**: Optimistic UI assumes the server action will succeed and immediately updates the UI (e.g., showing a new borrow request as "REQUESTED"). If the server returns an error, the UI rolls back to the previous state. LabVault implements this by calling `onOptimisticUpdate` callbacks before `await`ing the Server Action, and calling rollback functions in the `catch` block.

---

### Question 9

**Which of the following Zod methods is used in LabVault to validate that a borrow request's end date is after the start date?**

A) `z.string().email()`  
B) `z.object().refine()`  
C) `z.number().min()`  
D) `z.array().nonempty()`  

**Answer: B**

> **Explanation**: `z.object().refine()` (or `.superRefine()`) adds custom validation logic that spans multiple fields. For date comparison, the schema uses `.refine((data) => new Date(data.requestedEndDate) > new Date(data.requestedStartDate), { message: "End date must be after start date", path: ["requestedEndDate"] })` to validate cross-field constraints.

---

### Question 10

**In the Server Action pattern used by LabVault, what is the return type signature?**

A) `Promise<void>`  
B) `Promise<{ success: boolean; data?: T; errors?: Record<string, string[]>; message?: string }>`  
C) `Response`  
D) `NextApiResponse`  

**Answer: B**

> **Explanation**: LabVault Server Actions return a structured response object with `success` flag, optional `data` payload on success, optional `errors` map on validation failure, and an optional `message` for human-readable feedback. This pattern enables type-safe error handling on the client without relying on HTTP status codes or thrown exceptions.

---

## Score Guide

| Score     | Rating         |
|-----------|----------------|
| 10/10     | Excellent      |
| 8–9/10    | Very Good      |
| 6–7/10    | Good           |
| 4–5/10    | Needs Review   |
| Below 4   | Re-study Topic |
