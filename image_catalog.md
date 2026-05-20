# The Violet House Lesotho - Image Assets Catalog & Usage Map

This document presents a comprehensive, high-fidelity mapping of all **13 image assets** in the `public/images` folder. Every asset is actively integrated within the application's visual sections and metadata tags.

---

### 🗺️ Visual Architecture & Grid Reference

The following table summarizes the file-to-section mapping of the design:

| Filename | Page Section / Target | Content Description | Aspect Ratio & UI Styling | TSX Line |
| :--- | :--- | :--- | :--- | :---: |
| **`image_0.png`** | [Location](#location) | Premium exterior of the estate showing Maseru's luxury residential styling | `aspect-square`, rounded corners, text overlay, zoom on hover | 567 |
| **`image_1.png`** | [Suites](#suites) | Plush grey entertainment lounge with designer chairs | `aspect-square`, custom cards border shadow, zoom on hover | 360 |
| **`image_2.png`** | [Suites](#suites) | Royal Suite featuring signature white checkered headboards | `aspect-square`, custom cards border shadow, zoom on hover | 334 |
| **`image_3.png`** | Details (Atmosphere) | Intimate indoor dining setup with designer lighting | `aspect-square`, fully rounded frame borders, text overlay | 461 |
| **`image_4.png`** | Sign-Off Banner | Close-up of "The Violet House" physical outdoor signage | `h-[60vh]`, full-width landscape banner with charcoal overlay | 580 |
| **`image_5.png`** | Details (Atmosphere) | Curated interior detail view representing minimal luxury and art pieces | `aspect-[16/9]` horizontal layout panel | 488 |
| **`image_6.png`** | [Events](#events) | Exquisite, vibrant gourmet food platter showcasing professional plating | `md:col-span-7`, full cover view, zoom on hover, text reveal overlay | 397 |
| **`image_7.png`** | [Events](#events) | Elegant corporate group setup or dinner configuration | `rounded-[3rem]`, right-hand column top item | 412 |
| **`image_8.png`** | [Events](#events) | Intimate dining table featuring desserts and fine wine bottles | `rounded-[3rem]`, right-hand column bottom item | 421 |
| **`image_9.png`** | [Events](#events) | High-end outdoor event setting or estate exterior | Large promo background block, landscape view under Legacy events | 444 |
| **`image_10.png`** | [Hero](#) / SEO Metadata | Pool deck lifestyle, luxury structure outline, and mountain vibe | `h-screen` background, linear gradient overlay / `og:image` / `twitter:image` | 174 |
| **`image_11.png`** | [Wellness](#wellness) | Close-up portrait of pristine pool waters | `aspect-[3/5]`, portrait-rounded card, overlapping layout | 253 |
| **`image_12.png`** | [Wellness](#wellness) | Model enjoying the serene infinity pool deck | `aspect-[3/5]`, portrait-rounded card, overlapping layout | 262 |

---

### 🔍 Detailed Image Descriptions & UI Roles

#### 1. `image_0.png` — Architectural Showcase
* **Filename:** `/images/image_0.png`
* **Visual Profile:** The stunning modern structure of The Violet House Lesotho, detailing the clean white facades, high-end glazing, and lush landscaping.
* **Section Location:** The Prime Location section (`#location`) at the bottom of the page.
* **HTML Element:**
  ```tsx
  <img src="/images/image_0.png" alt="The Violet House Exterior" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
  ```
* **UX Purpose:** Highlights Maseru's premier residential area. It gives the visitor a direct sense of the high-end security and physical magnificence of the estate they are booking.

#### 2. `image_1.png` — The Living Lounge
* **Filename:** `/images/image_1.png`
* **Visual Profile:** The contemporary living area, furnished with grey textured seating, minimal glass tables, and soft, luxury lighting.
* **Section Location:** Accommodation Section (`#suites`) — right-hand column.
* **HTML Element:**
  ```tsx
  <img src="/images/image_1.png" alt="Entertainment Lounge" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
  ```
* **UX Purpose:** Features "The Living Space". Demonstrates a spacious interior ideal for relaxation, reading, or quiet conversation. Styled with a premium `aspect-square` layout.

#### 3. `image_2.png` — The Royal Bedroom Suite
* **Filename:** `/images/image_2.png`
* **Visual Profile:** An ultra-premium bedroom arrangement showcasing the high-contrast white checkered headboard design and fine textiles.
* **Section Location:** Accommodation Section (`#suites`) — left-hand column.
* **HTML Element:**
  ```tsx
  <img src="/images/image_2.png" alt="Luxury Suite" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
  ```
* **UX Purpose:** Serves as the primary bedroom catalog frame. Highlighting this signature room with a perfect square frame preserves the visual integrity of the tall checkered headboard.

#### 4. `image_3.png` — Culinary Sanctuary (Dining Room)
* **Filename:** `/images/image_3.png`
* **Visual Profile:** An elegantly set dining table in a warm, low-lit environment representing the custom dining area.
* **Section Location:** Details & Atmosphere Section — left column.
* **HTML Element:**
  ```tsx
  <img src="/images/image_3.png" alt="Dining Room" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
  ```
* **UX Purpose:** Underpins "Intimate Dining". Conveys the message that eating at the estate is not just a meal, but a custom-tailored fine dining experience.

#### 5. `image_4.png` — Signature Branding Signpost
* **Filename:** `/images/image_4.png`
* **Visual Profile:** A high-contrast close-up shot of "The Violet House" premium logo and typography signage on the estate.
* **Section Location:** Sign-off Background Banner Section (just above footer).
* **HTML Element:**
  ```tsx
  <img src="/images/image_4.png" alt="The Violet House Signage" className="w-full h-full object-cover opacity-60" />
  ```
* **UX Purpose:** Fades gracefully into the background behind the text *"Awaits Your Arrival"*, delivering a strong, professional branded finish before visitors reach the contact details.

#### 6. `image_5.png` — Quiet Luxury (Design Details)
* **Filename:** `/images/image_5.png`
* **Visual Profile:** Curated close-up showing fine shelf accents, vases, books, and minimalist design cues.
* **Section Location:** Details & Atmosphere Section — right column bottom.
* **HTML Element:**
  ```tsx
  <img src="/images/image_5.png" alt="Interior Details" className="w-full h-full object-cover" />
  ```
* **UX Purpose:** Emphasizes that "beauty is in the details". Reassures guests that the venue focuses heavily on meticulous styling, aesthetic consistency, and order.

#### 7. `image_6.png` — Gourmet Plate Showcase
* **Filename:** `/images/image_6.png`
* **Visual Profile:** A macro shot of an exquisite gourmet catering plate, plated to professional aesthetic standards.
* **Section Location:** Events & Dining Section (`#events`) — Main left item.
* **HTML Element:**
  ```tsx
  <img src="/images/image_6.png" alt="Gourmet Food Platter" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
  ```
* **UX Purpose:** Headlines "Gourmet Catering". Sells the culinary prestige of the estate's private chef services and events.

#### 8. `image_7.png` — Corporate Meeting setup
* **Filename:** `/images/image_7.png`
* **Visual Profile:** A luxury boardroom/dining room arrangement demonstrating a corporate or dining event setup.
* **Section Location:** Events & Dining Section (`#events`) — Upper right grid item.
* **HTML Element:**
  ```tsx
  <img src="/images/image_7.png" alt="Events at Violet House" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
  ```
* **UX Purpose:** Demonstrates that the space is versatile and ready to handle formal events, corporate retreats, and bespoke celebrations.

#### 9. `image_8.png` — Evening Cocktail & Wine Vibe
* **Filename:** `/images/image_8.png`
* **Visual Profile:** A festive table display highlighting wine bottles, glasses, desserts, and warm party vibes.
* **Section Location:** Events & Dining Section (`#events`) — Lower right grid item.
* **HTML Element:**
  ```tsx
  <img src="/images/image_8.png" alt="Dessert & Wine Table" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
  ```
* **UX Purpose:** Sets the mood for social events, evening wine gatherings, cocktail setups, and premium celebrations.

#### 10. `image_9.png` — The Legacy Events Deck
* **Filename:** `/images/image_9.png`
* **Visual Profile:** The sprawling deck area or outdoor grounds styled elegantly for guest gatherings.
* **Section Location:** Events & Dining Section (`#events`) — Bottom split banner background.
* **HTML Element:**
  ```tsx
  <img src="/images/image_9.png" alt="Event Style" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
  ```
* **UX Purpose:** Serves as the background for the promotional prompt call-to-action ("Host Your Legacy Event"). It triggers a booking modal preset specifically configured for events.

#### 11. `image_10.png` — Hero Poolside Vibe & Social Card Banner
* **Filename:** `/images/image_10.png`
* **Visual Profile:** High-end landscape view of the pool deck, ambient lighting, luxury sun loungers, and mountain twilight skies.
* **Section Location:** Hero Section background / HTML Social Head Tags.
* **HTML Element & Meta Tags:**
  * In `App.tsx` (Hero Background):
    ```tsx
    <img src="/images/image_10.png" alt="Luxury Lifestyle at The Violet House" className="w-full h-full object-cover opacity-50 scale-105 animate-slow-zoom" referrerPolicy="no-referrer" />
    ```
  * In `index.html` (Open Graph & Twitter Share Cards):
    ```html
    <meta property="og:image" content="/images/image_10.png" />
    <meta property="twitter:image" content="/images/image_10.png" />
    ```
* **UX Purpose:** The primary welcome visual representing the pinnacle of Maseru's luxury. Shows the primary infinity pool asset immediately. Also generates a premium preview when shared.

#### 12. `image_11.png` — Pristine Pool Water Texture
* **Filename:** `/images/image_11.png`
* **Visual Profile:** Portrait close-up shot of crystal clear water ripples on the pool.
* **Section Location:** Wellness & Relax Section (`#wellness`) — Left overlapping panel.
* **HTML Element:**
  ```tsx
  <img src="/images/image_11.png" alt="Pristine Pool Close-up" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
  ```
* **UX Purpose:** Highlights pure restoration, temperature-controlled water clarity, and pristine hygiene. Designed in an overlapping portrait `aspect-[3/5]` shape for elegant modern styling.

#### 13. `image_12.png` — Serene Wellness Lifestyle
* **Filename:** `/images/image_12.png`
* **Visual Profile:** Portrait shot of a relaxed model sitting adjacent to the quiet luxury infinity pool deck.
* **Section Location:** Wellness & Relax Section (`#wellness`) — Right overlapping panel.
* **HTML Element:**
  ```tsx
  <img src="/images/image_12.png" alt="Model by the Pool" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
  ```
* **UX Purpose:** Creates a luxury lifestyle connection, encouraging guests to imagine themselves reclining by the water. Complements the water close-up.
