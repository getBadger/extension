<p align="center">
  <a href="./">
    <img src="images/badger_icon.png" alt="Badger Logo" width="150"/>
  </a>
</p>

<h1 align="center">Badger 🦡</h1>

<p align="center">
  <strong>Browser extension for the Chrome & Firefox browsers.</strong>
  <br />
  <em>Currently live in the webstore.</em>
</p>

<p align="center">
  <a href="#about-Badger">About Badger</a> •
  <a href="#whats-inside-this-monorepo">What's Inside?</a> •
  <a href="#current-stage">Current Stage</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#stay-connected-with-Badger">Stay Connected with Badger</a> •
  <a href="#license-overview">License Overview</a>
</p>

[![Status](https://img.shields.io/badge/status-live%20-green)](https://github.com/getBadger/extension)

---


<h2 id="about-Badger">🎯 About Badger</h2>


Badger was born out of a desire to bring transparency to the online shopping and marketing experience. 
As tech-savvy users ourselves, we recognized the need for tools that empower shoppers and affiliate marketers with clear,
honest information about the digital marketplace.

We're building an all-in-one marketing suite focused on:

* **Unified Workflow:** Websites, apps, community, and AI tools in one place.
* **Effortless Collaboration:** Real-time co-authoring with features like line-level locking.
* **Powerful Knowledge Creation:** Flexible note-taking (Markdown, rich text, infinite canvases, pen support), `LaTeX` 
    support, and more.
* **Smart Organization:** Integrated planning, powerful global search, and knowledge graphs.
* **Revolutionary Version History:** Every change saved.
* **Secure & Private by Design:** Built with cybersecurity precision.


<h2 id="whats-inside-this-monorepo">📦 What's Inside This Monorepo?</h2>

This `BadgerExtension` repository is a monorepo that houses the foundational code for Badger:

* **`/app`**:
  * The Badger extension application.
  * Built with **[React](https://react.dev/)** (using **[Tailwind](https://tailwindcss.com/)** for the frontend).
  * Provides the cross-platform user interface (Windows, macOS, Linux) and client-side logic.
  * Handles offline-first capabilities and synchronization with the backend.

* **`/server`**:
  * The backend logic and data modules running privately.
  * Written in **Python**.
  * Manages real-time feedback, data persistence, and the detailed data history system.

> **Note:** Directory names are placeholders and may evolve.

<h2 id="current-stage">⏳ Current Stage</h2>

Badger and this `BadgerExtension` repository are currently in the **launched live phase**. The code here
represents foundational work and is subject to significant changes as we iterate and refine our vision based on
community feedback.

<h2 id="tech-stack">⭐ Star History</h2>

[![Star History Chart](https://api.star-history.com/svg?repos=Badger/BadgerExtension&type=Date)](https://www.star-history.com/#Badger/BadgerExtension&Date)

<h2 id="stay-connected-with-Badger">🛠️ Tech Stack</h2>

* **Client-side (Browser Extension App):**
  * Framework: [React](https://react.dev/)
  * Style: [Tailwindcss](https://tailwindcss.com/)
  * Language: TypeScript, HTML, CSS
* **Backend & Real-time Database:**
  * Language: Python, SQL, noSQL
* **Key Features Powered by this Stack:**
  * Cross-platform native-like experience
  * Real-time collaboration

<h2 id="getting-started">🚀 Getting Started</h2>

As we are in the early stages, detailed setup and contribution guidelines for developers are still being formulated.

However, to work with this repository, you will generally need:

* **Node.js:** For the React frontend .

More specific instructions for building, running, and developing will be added to the respective subdirectories (`/app`,
`/server`) as they mature.

<h2 id="contributing">🤝 Contributing</h2>

Your insights, experiences, and ideas are critical at this early stage! While direct code contributions to
`BadgerExtension` will become more streamlined as the project matures, here's how you can help shape Badger right now:

* 📧 **Share Your Thoughts via Email:** Send your ideas, your biggest frustrations with current tools, and your dream features to:
  `naquan@getBadger.net `
* ⭐ **Watch this Repository:** Stay updated on our progress.
* 💡 **Open Issues:** Feel free to open issues in this repository for specific bugs you anticipate or features directly
  related to the Extension application's structure or functionality.
* 🗣️ **Spread the Word:** Sharing Badger with friends, classmates, and colleagues helps immensely!

We plan to be open to direct Pull Request suggestions for features and improvements that may be accepted into the Extension
product. Formal contribution guidelines (`CONTRIBUTING.md`) will be added as the codebase stabilizes.

<h2 id="stay-connected-with-Badger">🌐 Stay Connected with Badger</h2>

Follow the overall Badger project for updates, announcements, and community discussion:

*   **Website:** [getBadger.net](https://getBadger.net)
*   **Discord Server:** [https://discord.gg/VEYugTdPAP](https://discord.gg/VEYugTdPAP)
*   **Instagram:** [@getBadger](https://www.instagram.com/getbadger/)
*   **X (Twitter):** [@_getBadger](https://twitter.com/_getBadger)
*   **YouTube:** [@getBadger](https://youtube.com/@getBadger)
*   **Reddit:** [r/getBadger](https://www.reddit.com/r/getBadger/)

<h2 id="license-overview">📜 License Overview</h2>

BadgerExtension (Version 1.0.1) is licensed under the **Apache License Version 2.0**.

* **Until May 2, 2030 (the "Change Date"):**
  * You **CAN** copy, modify, create derivative works, and redistribute the software.
  * You **CAN** use it for non-production purposes.
  * For **production use**, you can self-host it for internal purposes for **up to 50 individual users**.
  * You **CANNOT** offer it as a commercial hosted service or exceed the 50-user limit in production without a separate commercial license from Badger.
* **On or After May 2, 2030:**
  * The license will automatically convert to the **GNU Affero General Public License v3.0 or later (AGPLv3+)**.
* **Important:**
  * You must include the Apache license text with any distribution.

This is a brief summary. For full terms and conditions, please see the [LICENSE](LICENSE) file.

---

Thank you for your interest in BadgerExtension! We're excited to build the future of academic software with you.

Best regards,
Naquan & the (future) Badger Team
(An international initiative)
