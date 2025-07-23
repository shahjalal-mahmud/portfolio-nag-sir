# 🧑‍🏫 Personal Dynamic Portfolio Website for University Teacher

A **fully dynamic, responsive, and editable personal portfolio website** built for a university course teacher using **React, Firebase, Tailwind CSS, and Firestore**. This platform allows the teacher to showcase their academic and professional background while having full control over the content through an admin dashboard with inline editing capabilities.

---

## 🚀 Features Overview

### 🏠 Hero Section
- Displays: Name, Profession, Location, Email, Phone, Social Links, Profile Image.
- All data dynamically fetched from Firestore.
- Global data updates (location/email/phone) reflect across Contact & Footer sections.

### 👤 About Section
- Includes: Profile Picture, Full & Short Bio, Location, Email, Download CV Button.
- "See More" button opens modal for full bio.
- Skills & Tech Stack shown dynamically.
- CV download via Google Drive shareable link.

### 🎓 Education Section
- Timeline UI design.
- Dynamic CRUD operations for each education entry.
- Add/Edit/Delete functionality with hover actions.

### 💼 Experience Section
- Similar structure and features as the education section.
- Designed in timeline format with admin-only editing tools.

### 📚 Publications Section
- Two parts: **Stats Counter** (editable) and **Publication Tabs**:
  - Tabs: All, Edited Books, Journal Articles, Conference Proceedings, Book Chapters.
  - Nested Tabs for each Year (auto-generated).
  - Publication entries sorted by year.
  - Add/Edit/Delete functionalities per item with modals.

### 📝 Review Section
- Similar to publication section.
- Tabs include: All, Program Committee, Journal Reviews, Conference Reviews, Editorial Board.
- Dynamic year-wise tabs and CRUD operations.

### 🛠️ Additional Sections
- **Skills** – Tech stack listed dynamically with inline editing.
- **Projects** – Showcased projects with editable data.
- **Certificates** – Achievements & certifications listed dynamically.
- **Professional Recognition** – Editable recognitions and awards.
- **References** – Academic or professional references listed.

### 📞 Contact Section & Footer
- Dynamic contact info reflected from Firestore.
- Fully responsive form with admin visibility.

### 🧭 Navigation
- Sticky top navigation bar.
- Smooth scroll and motion animations.

---

## 🔐 Admin Panel & Authentication

- 🔒 **Admin-only Access** using Firebase Authentication.
- Only specific email (teacher's email) authorized for login.
- **Inline Editing** or Modal Editing for every content.
- **Delete Confirmation Modals** to prevent accidental deletions.
- **Toast Notifications** for success and failure messages.
- **Forgot Password** functionality implemented.

---

## ☁️ Image & CV Handling

Due to Firebase's free plan limitations on storage:
- 📷 **Image Upload**: Admin uploads to [imgBB](https://imgbb.com/) and pastes the direct image URL.
- 📄 **CV Upload**: Admin uploads to Google Drive, enables "anyone can view" and pastes the shareable link.
- Preview available before final update.

---

## ⚙️ Tech Stack

| Technology | Usage |
|------------|--------|
| **React + Vite** | Frontend Framework |
| **Tailwind CSS + DaisyUI** | Styling and Component Library |
| **Firebase Auth** | Admin Authentication |
| **Firestore** | Real-time Database |
| **React Icons** | Icon support |
| **Framer Motion** | Smooth animations |
| **React Toastify** | Toast notifications |
| **React Router Dom** | Client-side routing |
| **Custom Hooks & Modals** | Content management |

---

## ✅ Functionality Summary

- 🔁 Dynamic Data Fetching from Firestore
- 🔏 Firebase Security Rules for Admin Login
- ✏️ Inline Editing & Modal Forms
- 🧼 Delete Confirmation Prompts
- 🌐 Responsive for Mobile & Desktop
- ⚠️ Custom 404 Page
- ⏳ Loading Screen during DB fetch
- 🧠 Smart Content Sync across sections

---

## 🧪 Development Notes

- 🔄 Real-time UI sync with Firestore changes.
- 👨‍🏫 Admin needs no coding knowledge for content update.
- 📦 Used lightweight packages to optimize performance.
- 🧪 Clean and maintainable codebase with modular components.

---

## 📸 Screenshots (Optional - Add Your Own)
Add a few screenshots of:
- Admin Editing Modal
- Timeline View
- Publication Tabs
- About Modal
- Hero Section

---

## 👨‍💻 Developed By

**Shahajalal Mahmud**  
Computer Science & Engineering Student  
Northern University of Business and Technology Khulna
[LinkedIn](https://www.linkedin.com/in/md-shahajalal-mahmud-077b29231/) | [GitHub](https://github.com/shahjalal-mahmud)

---