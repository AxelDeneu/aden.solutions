# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multilingual portfolio website built with SvelteKit, TypeScript, and Tailwind CSS. The site showcases professional experience, projects, education, and contact information with internationalization support (English/French).

## Development Commands

```bash
# Start development server (localhost:5173)
npm run dev

# Type checking
npm run check         # Single run
npm run check:watch   # Watch mode

# Code quality
npm run lint          # Check with Prettier & ESLint
npm run format        # Auto-format with Prettier

# Production build
npm run build         # Build for production
npm run preview       # Preview production build
```

## Architecture & Key Patterns

### Component Organization

The codebase follows a modular section-based architecture:

- **Sections** (`src/lib/components/sections/`): Page sections like Hero, About, WorkExperience
- **Portfolio Components** (`src/lib/components/portfolio/`): Reusable portfolio elements
- **UI Components** (`src/lib/components/ui/`): Shadcn/ui-based components
- **Magic Components** (`src/lib/components/magic/`): Visual effects (particles, meteors)

### Data Flow & State Management

1. **Static Data**: All content is defined in `src/lib/static/` as translatable objects
2. **Resume Store**: Central store (`src/lib/stores/resume.ts`) that:
   - Aggregates all static data
   - Automatically translates content based on locale
   - Uses Svelte derived stores for reactive translations
3. **Type Safety**: Each data type has its own TypeScript interface in `src/lib/types/`

### Internationalization (i18n)

- Translation keys are defined in `src/lib/locales/{en,fr}.json`
- The `resumeStore` automatically translates all content when locale changes
- Use `TranslatableValue` type for any translatable content
- Translation happens recursively through the `translateObject` function

### Static Site Generation

- Configured with `@sveltejs/adapter-static` for static hosting
- All routes are pre-rendered at build time
- MDsveX enabled for Markdown content with Shiki syntax highlighting

## Important Development Notes

### When Adding New Content

1. Define the data structure in `src/lib/types/`
2. Create static data in `src/lib/static/`
3. Add translation keys to both locale files
4. Import and integrate into the resume store
5. Create/update the corresponding section component

### Type System

- TypeScript strict mode is enabled
- Use `TranslatableValue` for any content that needs translation
- The type system enforces that all translatable content goes through the translation pipeline

### Component Conventions

- All section components receive data through props from the resume store
- Components should be pure and not directly access stores
- Use Tailwind CSS classes with the `cn()` utility for conditional styling
- Dark mode is handled via CSS variables and the mode-watcher package

### Testing Approach

Currently, there are no test commands configured. When implementing tests:

- Consider adding Vitest for unit testing
- Use Playwright for E2E testing with SvelteKit
- Add test scripts to package.json

### Build Optimization

- Vite handles bundling and optimization
- Images use `@sveltejs/enhanced-img` for optimization
- Static adapter pre-compresses assets when building

## Development Principles

### Code Quality Guidelines

- You MUST follow the SOLID principles

### Testing Guidelines

- Always use PlayWright MCP to check for the website. Just ask me for the running website url before