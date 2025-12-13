# 🧘🏻‍♀️Focus Mode

Focus Mode is a React + Vite application that helps you protect deep work blocks:

- Launch guided focus sessions with a configurable timer and distraction warnings.
- Blocklist distracting URLs locally for easy reference.
- Layer ambient soundscapes (bird song, morning glow, calm melody) to mask background noise.
- Styled with Tailwind CSS for a clean, responsive UI.

## Getting Started

1. **Install dependencies**

	```bash
	npm install
	```

2. **Run the dev server**

	```bash
	npm run dev
	```

	The app opens at `http://localhost:5173`

3. **Build for production**

	```bash
	npm run build
	```

## Key Features

- **Focus Session** – Adjustable 10–60 minute timer, animated progress, and tab-switch limit tracking.
- **Ambient Focus Sound** – Procedural audio loops: bird song, morning glow, calm melody, each with volume control.
- **Blocked Sites** – Quick list of URLs to avoid during a session.
- **Notifications** – Inline status updates when sessions start, pause, or complete.

## Tech Stack

- React 19 with Vite tooling.
- Tailwind CSS, PostCSS, and Autoprefixer for styling.
- Custom Web Audio hooks for sound generation.
- ESLint 9 for linting.

## Folder Structure

- `src/components` – UI components (focus session card, ambient panel, etc.).
- `src/hooks` – Custom hooks such as `useFocusTimer` and `useAmbientSound`.
- `public` – Static assets served as-is.
- `tailwind.config.cjs` – Tailwind theme extensions.

## Notes

- Web Audio requires user interaction before audio playback; click Play once the page loads.
- For a Chrome extension target, add a `manifest.json` and treat `dist` output as the popup bundle.
