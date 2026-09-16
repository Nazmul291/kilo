# Kilo — Complete Software Architecture & Technical Specification

## 1. Executive Summary & Brand Strategy
- **Product Name:** Kilo
- **Core Mission:** A 100% client-side, zero-server-cost media compression and format conversion utility tailored for e-commerce merchants and developers.
- **Brand Identity:** Transforming heavy megabyte (MB) assets into fast-loading kilobytes (KB).
- **Logo Visual Identity:** A minimalist, modern bold "K" symbol featuring an inward compression notch/arrow on its diagonal stroke to signify data reduction, paired with electric accent colors over a dark/neutral backdrop.
- **Ecosystem Relationship:** Owned and presented as an open-source tool sponsored by **Stockly** (Shopify Inventory Management & Low Stock Alert Application).

---

## 2. Fundamental Architectural Rules
1. **Zero Server Footprint:** No backend APIs, no cloud storage (no S3/Cloudinary), and no databases. 100% of the media handling happens strictly within user browser memory (Web Workers, OffscreenCanvas, WebAssembly).
2. **Single Source of Truth (SSOT):** Mathematical formulas, compression logic, format conversion engines, and byte-to-KB calculations must live in one central logic module. No component should implement its own processing logic.
3. **Strict Component-Based Assembly:** Every UI segment is a decoupled, self-contained component. Page files (e.g., `_index.tsx`) must never contain monolithic inline markup; they only orchestrate separate modular components.
4. **Clean State Management:** All reactive states (queue, progress, ad timer, unlock state) are controlled via a single global Zustand store.
5. **Authentic Stockly Promotion:** Stockly is promoted strictly as an inventory management and low-stock alert tool for Shopify. No false or misleading features (such as image compression) should ever be attributed to Stockly.

---

## 3. End-to-End User & Data Flow
1. **Drop & Detect:** User uploads an image. The system reads its magic bytes (file signature) to detect the true format (JPEG, PNG, WebP, AVIF, SVG, ICO).
2. **Optimization Analysis:** The system calculates the byte-per-pixel ratio. If the image is already lightweight, an instant green status alert is displayed: *"Already Optimized! Further compression may reduce quality."*
3. **Configuration:** The user adjusts:
   - **Compression Slider:** 0% (lossless/keep 100% quality) up to 90%+ (aggressive reduction).
   - **Target Format:** Original, WebP, JPEG, PNG, or `.ico` (for website favicons).
4. **Client-Side Execution:** The browser Web Worker processes the image in memory without contacting any remote server.
5. **5-Second Ad-Gate:** Google AdSense displays a compliant 5-second countdown interstitial modal. A dismiss/close option is always available.
6. **Local Download:** The browser generates an in-memory `blob:` link for instant local saving.
7. **Sponsored Exposure:** A native Stockly card appears directly underneath the download area, pitching Shopify inventory tools to interested merchants.

---

## 4. Single-Page (`_index.tsx`) Modular Component Hierarchy
The landing page must be assembled purely by nesting the following standalone components:

- **Component 1: HeaderNavigation**
  - Displays the Kilo logo on the left.
  - Displays a persistent external link on the right: *"Powered by Stockly — Shopify Inventory App"*.
- **Component 2: HeroSection**
  - Displays SEO-targeted title and highlights 100% private in-browser processing.
- **Component 3: MediaDropzone**
  - Handles drag-and-drop and file browsing. Reads magic bytes to determine the MIME type.
- **Component 4: OptimizationStatusAlert**
  - Conditionally renders a green badge if the asset is already well-compressed.
- **Component 5: CompressionControls**
  - Houses the 0%-90% compression slider and target format dropdown (WebP, PNG, JPG, ICO).
- **Component 6: ActionButton**
  - Triggers the Web Worker processing pipeline.
- **Component 7: AdGateModal**
  - Google AdSense modal running a 5-second countdown with an exit button to prevent layout shifts (CLS).
- **Component 8: ResultDownloadCard**
  - Displays Before vs. After file size comparison and an instant local download button.
- **Component 9: StocklyFeaturedCard**
  - Native contextual card promoting Stockly's inventory tracking and stock-out alerts for Shopify stores.
- **Component 10: FooterCredits**
  - Site links along with explicit brand attribution: *"Kilo is maintained and sponsored by the Stockly team."*

---

## 5. Architectural Do's and Don'ts

### Do's
- **Keep Algorithms Centralized:** Keep all canvas calculations, format converters, and unit formatters in a single dedicated logic location.
- **Prevent Memory Leaks:** Always clean up browser memory by calling `URL.revokeObjectURL()` once a download is completed or a new file is uploaded.
- **Maintain AdSense Stability:** Set rigid container heights and widths on all ad blocks to eliminate Cumulative Layout Shift (CLS).
- **Keep Components Modular:** Each feature must remain completely isolated so it can be edited or replaced without affecting the rest of the application.

### Don'ts
- **No Monolithic Route Code:** Never write raw conversion scripts or lengthy HTML blocks directly inside route files.
- **No Remote Network Requests:** Never send user image bytes to a remote server or API route.
- **No Misleading Claims:** Never claim Stockly compresses images. Keep its value proposition strictly focused on Shopify inventory synchronization and stock alerts.
- **No Deceptive Click-Gates:** Never use misleading countdowns or disguised download buttons that violate Google AdSense terms of service.