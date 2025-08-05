# Story 4.1 – Accessibility and Responsive Design

## Description

**As** a user with a disability

**I want** the banner to be accessible, keyboard operable and usable on all devices,

**so that** no one is excluded from accessing the settings.

## Acceptance Criteria

- WCAG 2.1 AA compliance (including ARIA labels) [secureprivacy.ai].
- Layout adapts to different screen sizes (responsive).
- Colors have sufficient contrast.

## Detailed Description

### Accessibility according to WCAG 2.1 AA
The cookie banner must meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA:

1. **Perceivable**:
   - **Text alternatives**: All non-text content (icons, images) require text alternatives
   - **Contrast**: Text must have a contrast ratio of at least 4.5:1 (normal text) and 3:1 (large text)
   - **Text size**: Text must be resizable up to 200% without loss of quality
   - **No information conveyed solely by color**: Information must not rely on color alone

2. **Operable**:
   - **Keyboard operability**: All functions must be usable via keyboard
   - **Focus visibility**: Keyboard focus must be clearly visible
   - **Enough time**: Users must have enough time to read content and perform actions
   - **No flashes**: No content that could trigger seizures

3. **Understandable**:
   - **Readability**: Text must be clear and understandable
   - **Predictability**: Functions must work in a predictable way
   - **Input assistance**: Support for error prevention and correction

4. **Robust**:
   - **Compatibility**: Content must be compatible with current and future user agents (including assistive technologies)
   - **Correct markup**: Valid HTML with proper semantics

### ARIA implementation
For optimal accessibility with screen readers and other assistive technologies:

1. **ARIA roles and attributes**:
   - `role="dialog"` for the banner
   - `aria-labelledby` to link to the heading
   - `aria-describedby` for the banner description
   - `aria-expanded`, `aria-controls` for expandable elements
   - Example:
   ```html
   <div role="dialog" aria-modal="true" aria-labelledby="cookie-title" aria-describedby="cookie-description">
     <h2 id="cookie-title">Cookie-Einstellungen</h2>
     <p id="cookie-description">Bitte wählen Sie, welche Cookies Sie akzeptieren möchten.</p>
     <!-- Weitere Inhalte -->
   </div>
   ```

2. **Focus management**:
   - Automatic focus on the banner when opened
   - Focus trap within the banner (no tabbing outside)
   - Return focus after closing the banner
   - Logical tab order

3. **Screen reader announcements**:
   - Live regions for dynamic changes
   - Status updates when settings change

### Responsive Design
The cookie banner must work optimally on all devices and screen sizes:

1. **Flexible layouts**:
   - Use relative units (%, em, rem) instead of fixed pixels
   - Flexbox or Grid for flexible arrangement of elements
   - Adjust element sizes to available space

2. **Breakpoints for different devices**:
   - Mobile-first approach
   - At least three breakpoints: mobile, tablet, desktop
   - Example CSS media queries:
   ```css
   /* Mobile (base) */
   .cookie-banner {
     width: 100%;
     bottom: 0;
     left: 0;
     padding: 1rem;
   }

   /* Tablet */
   @media (min-width: 768px) {
     .cookie-banner {
       width: 80%;
       max-width: 600px;
       bottom: 2rem;
       left: 50%;
       transform: translateX(-50%);
       border-radius: 8px;
     }
   }

   /* Desktop */
   @media (min-width: 1200px) {
     .cookie-banner {
       max-width: 800px;
     }
   }
   ```

3. **Touch-friendly operation**:
   - Sufficiently large click areas (min. 44x44px)
   - Appropriate spacing between interactive elements
   - Consideration of touch gestures

### Color Contrast and Visual Design
For optimal readability and usability:

1. **Contrast requirements**:
   - Text/background contrast: at least 4.5:1 (normal) or 3:1 (large)
   - Contrast for UI components and graphic objects: at least 3:1
   - Use contrast-check tools during development

2. **Visual hierarchy**:
   - Clear distinction between information levels
   - Consistent use of colors for specific functions
   - Support information hierarchy through typography

3. **Error tolerance**:
   - Clear visual feedback for actions
   - Clear error messages with suggested solutions
   - Confirmation dialogs for important actions

### Technical Implementation
1. **HTML structure**:
   - Semantically correct HTML5
   - Logical document structure with proper heading levels
   - Correct use of form elements with labels

2. **JavaScript accessibility**:
   - Progressive enhancement: basic functionality even without JavaScript
   - Keyboard event listeners for navigation
   - Focus management for modal dialogs

3. **Testing**:
   - Automated accessibility tests (e.g., with axe, WAVE)
   - Manual tests with screen readers (NVDA, JAWS, VoiceOver)
   - Tests with different input methods (keyboard, touch, voice)
   - Responsive tests on different devices and screen sizes

### Legal Requirements
Website accessibility is legally required in many countries, e.g., EU Directive 2016/2102 or the Americans with Disabilities Act (ADA). An accessible cookie banner is therefore not only about usability but also legal compliance.

### Test Scenarios
1. Screen reader test – banner must be operable with common screen readers (NVDA, JAWS, VoiceOver)
2. Keyboard test – all functions must work without a mouse
3. Contrast test – all text and UI elements must have sufficient contrast
4. Responsive test – banner must display correctly on different devices (smartphone, tablet, desktop)
5. Zoom test – banner must remain usable at 200% zoom
6. Automated WCAG test – check with tools such as axe or WAVE
7. Usability test with users with various impairments
