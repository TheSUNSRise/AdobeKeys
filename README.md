# AdobeKeys 🎹

> **Master Your Workflow.**  
> A minimalistic, fast, and beautiful reference guide for Adobe software shortcut keys.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue.js](https://img.shields.io/badge/vue.js-v3.x-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-v5.x-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v3.x-38bdf8.svg)

AdobeKeys is a modern web application designed to help designers and editors quickly find keyboard shortcuts for popular Adobe software like **Photoshop**, **Illustrator**, and **Premiere Pro**.

It features a clean, distraction-free interface with support for dark mode and multi-language switching.

## ✨ Features

*   **🎨 Minimalist Design**: Clean UI with Adobe-style branding icons.
*   **🌗 Dark & Light Mode**: Automatically syncs with your system preference, or toggle manually.
*   **🌐 Multi-language Support**: Seamlessly switch between **English** and **Chinese (简体中文)**.
*   **⚡ Real-time Search**: Instantly filter shortcuts by key, description, or category.
*   **📱 Responsive**: Works perfectly on desktop, tablet, and mobile.
*   **⌨️ Visual Keys**: Shortcuts are rendered to look like physical keyboard keys.

## 📸 Screenshots

*(Add your screenshots here)*

| Light Mode | Dark Mode |
|:---:|:---:|
| ![Light Mode](https://via.placeholder.com/600x400?text=Light+Mode+Screenshot) | ![Dark Mode](https://via.placeholder.com/600x400?text=Dark+Mode+Screenshot) |

## 🛠️ Tech Stack

*   **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [Vue Router](https://router.vuejs.org/)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16.0 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/TheSUNSRise/AdobeKeys.git
    cd AdobeKeys
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```
AdobeKeys/
├── src/
│   ├── components/      # Shared Vue components
│   ├── composables/     # Logic reuse (e.g., useLocale.ts)
│   ├── data/            # JSON files containing shortcut data
│   │   ├── ps.json      # Photoshop data
│   │   ├── ai.json      # Illustrator data
│   │   └── pr.json      # Premiere Pro data
│   ├── router/          # Routing configuration
│   ├── views/           # Page views (HomeView, ShortcutView)
│   ├── App.vue          # Main layout
│   └── main.ts          # Entry point
└── index.html
```

## 🤝 Contributing

Contributions are welcome! If you want to add more shortcuts or fix an error:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/add-shortcuts`).
3.  **Add/Edit Data**: Navigate to `src/data/`. The JSON structure is as follows:
    ```json
    {
      "key": "Ctrl + Shift + S",
      "description": {
        "en": "Save As",
        "zh": "另存为"
      },
      "category": {
        "en": "File",
        "zh": "文件"
      }
    }
    ```
4.  Commit your changes (`git commit -m 'Add more Photoshop shortcuts'`).
5.  Push to the branch (`git push origin feature/add-shortcuts`).
6.  Open a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).