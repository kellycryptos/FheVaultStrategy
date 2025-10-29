# FHEVault Design Guidelines

## Design Approach: Technical Dashboard System

**Selected Approach**: Design System-based approach drawing from Carbon Design System principles and modern DeFi interfaces (Uniswap, Linear, Stripe Dashboard)

**Rationale**: FHEVault is a technical demonstration tool requiring clarity, trust, and precision. The interface must elegantly handle complex cryptographic workflows while maintaining accessibility for users unfamiliar with FHE concepts.

**Core Principles**:
- **Transparency**: Make encryption states and processes visible and understandable
- **Technical Precision**: Display cryptographic data clearly without overwhelming users
- **Trust Through Clarity**: Use visual hierarchy to build confidence in the encryption process
- **Progressive Disclosure**: Show technical details on demand, keep primary flow simple

---

## Typography System

**Font Families**:
- Primary: Inter (Google Fonts) - for UI elements, forms, labels
- Monospace: JetBrains Mono (Google Fonts) - for addresses, encrypted data, hashes

**Hierarchy**:
- **Display Headings** (H1): text-4xl md:text-5xl, font-bold, tracking-tight
- **Section Headers** (H2): text-2xl md:text-3xl, font-semibold
- **Subsection Headers** (H3): text-xl font-semibold
- **Body Text**: text-base, font-normal, leading-relaxed
- **Labels**: text-sm font-medium, uppercase tracking-wide
- **Technical Data**: text-sm font-mono, tracking-tight
- **Helper Text**: text-xs, opacity-70

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-6, space-y-8, space-y-12
- Card gaps: gap-4, gap-6
- Margins: m-2, m-4, m-8

**Grid Structure**:
- **Container**: max-w-7xl mx-auto px-4 md:px-6
- **Main Layout**: Two-column on desktop (2/3 + 1/3 split), single column mobile
- **Form Grids**: grid-cols-1 md:grid-cols-2 gap-6 for input fields
- **Status Cards**: grid-cols-1 md:grid-cols-3 gap-4 for metrics

**Responsive Breakpoints**:
- Mobile-first approach
- Desktop enhancements at md: (768px) and lg: (1024px)

---

## Component Library

### Navigation Header
- Fixed position with backdrop blur effect
- Logo/branding left-aligned
- Wallet connection button right-aligned with status indicator
- Network indicator showing current blockchain
- Height: h-16 with border-b

### Wallet Connection Component
- Large button with icon and truncated address when connected
- Connection status indicator (dot with pulse animation when active)
- Network selector dropdown
- Disconnect option in hover/click menu

### Strategy Input Form
**Container**: Card with subtle border, p-6 md:p-8
**Components**:
- Label + Input pairs with space-y-2
- Input fields: h-12, px-4, rounded-lg with focus ring
- Number inputs with step controls
- Range sliders with value display
- Helper text below each input explaining FHE implications
- Submit button: Large, prominent, w-full md:w-auto

### Encryption Status Panel
**Visual Design**:
- Segmented flow indicator showing: Input → Encrypt → Submit → Compute → Decrypt → Result
- Each step with icon, label, and status indicator
- Active step highlighted, completed steps checked, pending steps muted
- Progress bar connecting steps
- Expandable technical details (hash, timestamp) for each step

### Results Display Area
**Structure**:
- Two-panel layout: Encrypted Output | Decrypted Score
- Encrypted data in monospace font, scrollable container
- Decryption button prominent when encrypted data available
- Score revealed with animation, large text display
- Comparison chart if multiple strategies submitted
- Export/share functionality

### Demo Mode Button
- Prominent placement above or below main form
- "Run Demo Transaction" with icon
- Tooltip explaining the demo flow
- Auto-fills form and runs complete encryption cycle
- Visual feedback during demo execution

### Information Cards
- **Stats Cards**: Grid layout showing total encryptions, computations, success rate
- **How It Works**: Expandable accordion or tabbed interface
- **Documentation Links**: Card-based navigation to technical docs
- Border, rounded corners, hover elevation effect

### Technical Data Display
**Encrypted Data Blocks**:
- Monospace font in bordered container
- Copy button for easy clipboard access
- Truncation with "Show More" for long strings
- Visual distinction between different data types (input, output, hashes)

### Toast Notifications
- Top-right position, slide-in animation
- Success, error, info, warning variants
- Transaction hash links when applicable
- Auto-dismiss after 5s, manual close option

### Footer
- Simple, single row with documentation links
- GitHub/docs/Twitter links
- "Powered by Zama FHE" attribution
- Minimal height: py-6

---

## Interaction Patterns

### State Feedback
- Loading states with skeleton screens for data-heavy components
- Inline validation on form inputs
- Clear error messages with actionable guidance
- Success confirmations with next-step suggestions

### Button States
- Primary: Solid fill, prominent for main actions
- Secondary: Outlined for alternative actions  
- Disabled: Reduced opacity with cursor-not-allowed
- Loading: Spinner replacing button text

### Animations
**Minimal, Purposeful Only**:
- Fade-in for loaded data (duration-200)
- Slide transitions between encryption steps (duration-300)
- Pulse effect on active encryption status
- Number count-up for revealed scores
- NO decorative scroll animations or parallax effects

---

## Images

**Hero Section**: No traditional hero image - lead with functional interface

**Explanatory Diagrams**:
- FHE workflow visualization (encrypt → compute → decrypt flowchart)
- Placement: In "How It Works" section
- Style: Clean, technical diagram with arrows and labeled boxes
- Size: max-w-2xl, centered

**Optional Brand Illustration**:
- Abstract lock/encryption visual in header area
- Small, non-intrusive, possibly SVG icon-based

---

## Accessibility

- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- ARIA labels for wallet connection status, encryption states
- Keyboard navigation throughout entire flow
- High contrast ratios for all text
- Screen reader announcements for state changes

---

## Page Structure

**Single-Page Application Layout**:
1. **Header** (fixed): Logo, wallet connection, network indicator
2. **Main Container**:
   - **Left Panel** (2/3 width): Strategy input form, demo button, encryption status
   - **Right Panel** (1/3 width): Results display, stats cards, quick help
3. **Secondary Section**: Expandable "How FHE Works" educational content
4. **Footer**: Minimal links and attribution

**Mobile Stack**: Single column, collapsible panels for better focus