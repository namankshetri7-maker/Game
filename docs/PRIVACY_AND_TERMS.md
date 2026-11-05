# Wonder World Kids: Super Quest — Privacy Policy & Terms of Service (Legal Review Template)

**Effective Date:** November 5, 2026  
**Commercial Model:** One-Time Purchase ($9.00 USD) • No Subscription • No In-App Ads • No In-App Purchases • 100% Offline-First

---

## 1. Overview and Core Philosophy

Wonder World Kids ("the Application") is an offline-first educational game suite engineered for children aged 3 to 10. The application was built from the ground up under the principle of **Zero Online Data Collection**. We believe that children's educational playtime should be private, joyful, and completely free from digital surveillance, behavioral profiling, and targeted advertising.

---

## 2. Information Collection and Processing

### A. Personal Information
- **Zero Remote Transmission:** The Application does **not** transmit, collect, upload, share, or sell any personal information to external servers, cloud providers, or third parties.
- **Zero Mandatory Accounts:** No email address, telephone number, real name, physical address, or social login is required to play the game.
- **Child Player Names & Ages:** Parents may create up to four (4) local child player nicknames and ages. This data is written strictly to local device storage (`window.localStorage`) and never leaves the hardware.

### B. Analytical and Behavioral Data
- **No Third-Party Analytics SDKs:** The Application contains no Google Analytics, Firebase Telemetry, Facebook Pixel, Mixpanel, AppsFlyer, Adjust, or equivalent tracking code.
- **No Behavioral Tracking:** No telemetry regarding child session durations, input sequences, or mistake logs is transmitted over any network.

### C. Device Permissions and Hardware Access
- **Camera & Microphone:** Not requested and never accessed.
- **Geolocation:** Not requested and never accessed.
- **Device Contacts & Calendars:** Not requested and never accessed.
- **Local Audio Output:** Uses standard procedural Web Audio synthesis generated dynamically on the client processor (zero remote audio downloads).

---

## 3. Compliance Assessment for Intended Markets

### A. United States — Children's Online Privacy Protection Act (COPPA, 15 U.S.C. §§ 6501–6506)
- **Applicability:** COPPA applies to operators of commercial websites and online services directed to children under 13 that collect, use, or disclose personal information from children.
- **Architecture Evaluation:** Because Wonder World Kids does not collect, maintain, or disclose personal information online, operator obligations regarding online parental notice and verifiable consent are satisfied through an architecture of non-collection.
- **Parental Controls:** A parental gate with cryptographic verification protects child management, screen time limits, and data deletion features.

### B. European Union & United Kingdom — General Data Protection Regulation (GDPR / UK GDPR / GDPR-K)
- **Data Minimization (Article 5(1)(c)):** All processing is limited to what is strictly necessary to run gameplay locally.
- **Storage Limitation (Article 5(1)(e)):** All data is stored on the user's personal hardware and can be wiped immediately at any time by clearing browser/app storage.
- **Integrity and Confidentiality (Article 5(1)(f)):** Sensitive parent configurations (such as parental PIN codes) are stored locally using salted cryptographic hash derivation (`SHA-256`), preventing plain-text exposure in local storage.

### C. California Consumer Privacy Act (CCPA) / CPRA & CalOPPA
- We do not sell or share consumer personal information, nor do we process sensitive personal information for advertising purposes.

---

## 4. Local Data Storage, Backup, and Deletion Rights

1. **Where Data Resides:** All game stars, progress milestones, unlocked stickers, and player names are stored within the client's browser local storage sandbox (`localStorage`).
2. **Right to Wipe / Erase:** Parents can delete individual child profiles or execute a complete "Reset Child Progress" inside the Parent Dashboard at any time. Clearing the web browser's site data completely removes all records permanently.
3. **Data Portability:** Parents can generate a full family backup file (`.JSON`) from the Parent Dashboard to safely back up or migrate progress across household devices without relying on third-party cloud storage.

---

## 5. Client-Side Security Notice & Limitations

Wonder World Kids includes a Parent Gate to prevent young children from accidentally resetting progress, altering screen time limit notifications, or deleting profiles. 

**Parent Notice:** Because this application operates client-side without a remote server, technical individuals with physical device access, operating system administrator rights, or browser developer tools can inspect local client files. For complete hardware-level restrictions, parents are advised to utilize their operating system's native parental locks:
- **Apple Devices:** iOS / iPadOS / macOS Screen Time
- **Android Devices:** Google Family Link
- **Windows PC:** Microsoft Family Safety

---

## 6. Commercial Model & Refund Policy

- **Single Purchase Price:** $9.00 USD (or regional equivalent).
- **No Hidden Charges:** The game contains no locked levels requiring additional payments, micro-transactions, or subscription fees.
- **Refund Policy:** Distribution partners (e.g., itch.io, Gumroad, or personal web store) standard refund policies apply.

---

*Note: This document provides the architectural and operational privacy disclosure for Wonder World Kids. Publishers should conduct standard legal review before deploying to regional marketplaces.*
