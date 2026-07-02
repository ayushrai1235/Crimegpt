# Component Library & Styling

## Overview
The **Component Library** document outlines the UI design system for the **CrimeGPT** platform. A consistent, well-designed UI is critical; if the application looks like a confusing legacy government portal, adoption rates among officers will plummet. It must look and feel like a modern, enterprise-grade intelligence tool (e.g., Palantir Gotham).

---

## 1. Styling Framework: Tailwind CSS

We utilize **Tailwind CSS** as the foundational styling framework. 
- **Why?** It allows for rapid development, maintains a highly consistent design system through utility classes, and eliminates the need for maintaining sprawling, global `.css` files.

### 1.1. Color Palette (The KSP Theme)
The application utilizes a customized Tailwind config that aligns with professional law enforcement aesthetics.
- **Primary (Police Blue):** `bg-blue-900` for main navigation and primary buttons.
- **Accent (Alert Red/Amber):** `bg-red-600` for anomalies, high-risk suspects, and destructive actions.
- **Backgrounds:** A clean, slightly off-white background (`bg-slate-50`) for light mode, and a deep, low-contrast dark mode (`bg-slate-900`) for night operations.

## 2. Component Library: `shadcn/ui`

Instead of writing every button and modal from scratch, or relying on bloated libraries like Material UI, we adopt **shadcn/ui**.

- **What is it?** A collection of re-usable components built with Radix UI and Tailwind CSS.
- **Why?** You do not install it as an npm package. You copy the raw code into your project (`src/components/ui`). This gives developers absolute control over the styling and behavior of the components without fighting a library's default opinions.

### 2.1. Key Components Used
- **Data Table:** Used for the Case Management lists. Supports sorting, filtering, and pagination out of the box.
- **Sheet (Side Panel):** Used heavily in the Investigation Workspace. When an officer clicks a citation, a `Sheet` slides in from the right containing the FIR PDF, preventing them from losing their place in the chat.
- **Dialog (Modal):** Used for confirmation dialogs (e.g., "Are you sure you want to reassign this case?").
- **Toast:** Used for non-intrusive notifications (e.g., "PDF uploaded successfully").

## 3. Dark Mode Implementation
Given that officers operate 24/7, a native Dark Mode is a non-functional requirement.
- Implemented using `next-themes`.
- All custom components must include `dark:` variants in their Tailwind classes (e.g., `text-slate-900 dark:text-slate-100`).

## 4. Typography
- **Font:** Inter (via `next/font/google`). It is a highly legible, modern sans-serif font designed for dense data interfaces.
