# 🎮 GameHub - Modern Game Discovery Platform

> One of my very first projects (built in 2023). I just gave the codebase a small refactor.

[![Live Website](https://img.shields.io/badge/🌐_Live_Site-game%E2%80%91fan.netlify.app-blue?style=for-the-badge)](https://game-fan.netlify.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.8-319795?style=for-the-badge&logo=chakraui)](https://chakra-ui.com/)

## 🚀 Tech Stack

### **Frontend Framework**
- **React 18** + **Vite 4** – ultra-fast development experience.
- **TypeScript 5** – strict type-safety.

### **State & Data**
- **Zustand** – lightweight global store.
- **@tanstack/react-query 3** – server-state management, caching & infinite queries ([docs](https://tanstack.com/query/v3)).
- **Axios** – REST requests to **RAWG Video Games Database API** ([API docs](https://rawg.io/apidocs)).

### **Styling & UI**
- **Chakra UI 2** – component system.
- **Framer Motion** – animations.

### **Tooling**
- **ESLint** + **Prettier** – code quality & formatting.
- **Vite** – bundler & preview.

## 🎯 Key Features

- 🔍 Search & filter games by genre, platform and release date.  
- ↕️ Sort results by popularity, rating or release date.  
- ♾️ Infinite Scroll – seamless page loading.  
- 🖼️ Game cards with screenshot gallery & image zoom.  
- 🔞 +18 blur gate for adult content.  
- 🌗 Responsive design with light & dark mode.  

## 🖼️ Features Showcase

### Landing Page
![Landing](./public/readme/landing.png)

### Platform & Sort Select
![Platform Select](./public/readme/platformselect.png) ![Sort By](./public/readme/sortby.png)

### Interactive Game Card
![Game Card](./public/readme/gamecardcomponentwithimagechange.png)

### Fullscreen Preview
![Fullscreen](./public/readme/fullscreenimage.png)

## ✨ Technical Notes

- Additional screenshots are fetched lazily on card hover.  
- Infinite scrolling powered by `useInfiniteQuery` + `IntersectionObserver`.  
- Clean Zustand store without boilerplate.  

## 🏗️ Project Structure

```text
game-hub/
├── src/
│   ├── components/        # UI & layout
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API layer (RAWG)
│   ├── entities/          # Type definitions
│   ├── assets/            # Static images
│   └── store.ts           # Zustand store
├── public/                # Static assets + readme screenshots
├── index.html
├── package.json
└── vite.config.ts
```

## 🌐 Deployment

- **Production**: [game-fan.netlify.app](https://game-fan.netlify.app)

---

**Indie side-project for gamers – built for learning & fun 🎉**
