# ResumeCraft 🚀

ResumeCraft is a premium, feature-rich, full-stack AI-powered resume builder designed to help job seekers design, optimize, and export professional resumes. Utilizing a modern Next.js 16 + React 19 architecture, it provides users with a real-time side-by-side editing experience, intelligent ATS (Applicant Tracking System) optimization feedback powered by Google GenAI and Mistral AI, and seamless PDF exports.

---

## Live Link

Live Demo :- https://resumecraft-1h1s.onrender.com

## Key Features ✨

- **Real-Time Interactive Editor (Resume Wizard):** Live side-by-side form editing and styled A4 preview.
- **AI-Powered ATS Score Analyzer:** Evaluates resume matches against target job descriptions and provides concrete enhancement suggestions using Google Gemini & Mistral AI models.
- **One-Click PDF Export:** Seamlessly prints and downloads custom-styled, print-friendly A4 resumes directly from the browser viewport without margins, headers, or watermarks.
- **Cloud-Saved Autologs:** Instant background synchronization and auto-saving of drafts so your progress is never lost.
- **Dashboard & Management:** Create, duplicate, update, or delete multiple resumes from a unified dashboard.
- **Secure Authentication:** Integrated JWT-based authentication system featuring bcryptjs password encryption.

---

## Tech Stack 🛠️

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/)
- **Database & ORM:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Caching / Session Storage:** [Redis](https://redis.io/) (via `ioredis`)
- **AI Integrations:** [Google GenAI SDK](https://github.com/google/generative-ai-js) & [Mistral AI SDK](https://github.com/mistralai/client-node)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

---

## Project Structure 📁

```text
├── public/                 # Static assets & public resources
├── src/
│   ├── app/                # Next.js App Router (pages & API endpoints)
│   │   ├── api/            # Backend API Handlers (auth, resume, ATS score)
│   │   ├── resume/         # Workspace page and templates
│   │   ├── globals.css     # Global styles & print media overrides
│   │   └── page.tsx        # Homepage Dashboard / Login landing
│   ├── features/           # Feature-based modular structure
│   │   ├── auth/           # Login, registration, session checks, and state
│   │   └── resume/         # Resume builder logic, wizards, previewer, & ATS optimizer
│   ├── lib/                # Database connections, config utility functions, and AI clients
│   └── store/              # Redux configuration, dispatch/selector hooks, and slices
```

---

## Getting Started ⚙️

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Database (Local or MongoDB Atlas)
- Redis instance (Local or Cloud-hosted)
- Google Gemini API Key and/or Mistral AI API Key

### Configuration

Create a `.env.local` file in the root directory and configure the environment variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/resumecraft

# JWT Authentication Secret
JWT_SECRET=your_jwt_secret_key

# Redis Connection Uri
REDIS_URI=redis://localhost:6379

# AI APIs Keys
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vishalloop/ResumeCraft.git
   cd ResumeCraft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to experience **ResumeCraft**.

---

## Building and Deployment 📦

### Local Build Verification

To create an optimized production build, run:
```bash
npm run build
```

### Deploying to Render / Vercel

When deploying to PaaS platforms like **Render**, ensure:
1. `tailwindcss` and `@tailwindcss/postcss` are configured in the dependencies block of `package.json` to allow the build engine to process CSS without errors.
2. All environment variables listed in `.env.local` are configured inside the Render dashboard.
3. Use the build command:
   ```bash
   npm install && npm run build
   ```
4. Use the start command:
   ```bash
   npm run start
   ```

---

## License 📄

This project is licensed under the MIT License.
