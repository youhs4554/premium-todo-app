# Frontend Documentation

The frontend is a modern React application built with Next.js.

## 🏗️ Architecture

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS for utility-first styling.
- **Animations**: Framer Motion for premium UI transitions.
- **State Management**: React `useState` and `useEffect` for local state; JWT stored in `localStorage`.
- **API Client**: Axios instance configured in `src/lib/api.ts` with base URL and auth interceptors.

## 🎨 Design System

The application uses a "Premium Dark" theme:
- **Background**: Deep dark overlays with mesh gradients.
- **Glassmorphism**: Components use `backdrop-filter: blur()` and semi-transparent borders.
- **Typography**: Inter (default Next.js font) with bold weights for headings.

## 📂 Project Structure

- `src/app/`: App router pages (`auth/`, `dashboard/`).
- `src/components/`: Reusable UI components.
- `src/lib/`: Utility functions and API client.
- `src/app/globals.css`: Global styles and theme tokens.
