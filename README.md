# Multi-Project Repository

Welcome to our combined project workspace! This repository contains a collection of independent projects organized within a single monorepo structure.

## 📁 Repository Structure

```text
gdg-web/
├── 001-prompt-engineering/    # Cravely: Chef-crafted gourmet food delivery web app & landing page (HTML5, CSS3, JS)
└── [future_projects]/         # Subsequent GDG web projects & experiments
```

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Make sure you have the following installed based on the projects inside this repo:

* [Git](https://git-scm.com)
* A modern web browser (Google Chrome, Firefox, Edge, Safari)
* [Node.js](https://nodejs.org) (optional, for serving static web apps or JavaScript/TypeScript projects)
* [Python](https://python.org) (optional, for running local HTTP server or Python scripts)

### Installation & Setup

#### Method 1: Clone the Full Monorepo

1. **Clone the repository:**
   ```bash
   git clone https://github.com/stephengade/gdg-web.git
   cd gdg-web
   ```

2. **Navigate to the specific project you want to run:**
   Each project is independent and manages its own dependencies.
   
   * **For 001-prompt-engineering (Cravely):**
     ```bash
     cd 001-prompt-engineering
     # Open index.html directly in your browser, or launch a local server:
     npx serve .
     # or using Python
     python -m http.server 8000
     ```

   * **For future JavaScript / Node.js projects:**
     ```bash
     cd project_name
     npm install
     npm start
     ```

   * **For future Python projects:**
     ```bash
     cd project_name
     pip install -r requirements.txt
     python main.py
     ```

#### Method 2: Clone / Extract a Single Project Only

If you only want a specific sub-project without downloading the rest of the monorepo:

* **Quickest: Instant standalone copy via `degit` (fresh folder, no monorepo history):**
  ```bash
  npx degit stephengade/gdg-web/001-prompt-engineering my-cravely-app
  cd my-cravely-app
  ```

* **Via Git Sparse Checkout (maintains Git tracking only for the chosen folder):**
  ```bash
  git clone --filter=blob:none --sparse https://github.com/stephengade/gdg-web.git
  cd gdg-web
  git sparse-checkout set 001-prompt-engineering
  ```

---

## 🛠️ Tech Stack

This workspace utilizes the following technologies across its sub-projects:

* **Frontend:** HTML5, CSS3 (Modern responsive layouts, custom design system), Vanilla JavaScript (ES6+)
* **Tooling & Runtimes:** Node.js, Python, Git
* **Documentation & Assets:** Markdown (PRD, Design tokens, Handoff documentation), SVG Vector graphics

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
