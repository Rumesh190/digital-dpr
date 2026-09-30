# DIGITAL DPR — PHASE 1 FINAL UX/UI PRODUCT AUDIT

**Date:** 30 September 2026  
**Audited by:** Principal Product Design Review  
**Version:** Source code (local project) + deployed URL (digital-dpr.vercel.app)  
**Primary persona:** Site Engineer (Rumesh)  
**Primary platform:** Android mobile (360–430px)  
**Secondary platform:** Desktop web (1024–1728px)

---

**AUDIT METHOD:** This audit was conducted from a thorough review of the complete source code (45+ files, every component, every route, every interaction pattern) combined with live inspection of the deployed application at digital-dpr.vercel.app across mobile (375px) and desktop viewports. The login flow, Today dashboard, Calendar, Projects, and the submitted seed DPR (2026-09-28) were verified live. All findings are traceable to specific files and line numbers in the source.

---

## SECTION A — EXECUTIVE ASSESSMENT

Digital DPR is in strong shape for a Phase 1 freeze. The product demonstrates a level of design maturity that is uncommon for a pre-backend application: the full DPR workflow is architecturally coherent, the section-by-section progression is well-considered, and the visual system — while carrying some inconsistencies — establishes a genuinely premium tone without over-decorating. This is not an enterprise CRUD shell dressed up with gradients; it is a purpose-built field tool with real attention to the construction site context.

**Mobile quality** is high. Touch targets consistently meet or exceed 44px. The bottom sheet form pattern is well-executed. The step indicator creates genuine workflow continuity. The camera-first photo workflow and voice recording in Site Visit show understanding of real field needs. Save state feedback is present and non-intrusive. Safe area handling is thorough.

**Desktop quality** is good but secondary. The sidebar + content + sticky aside layout works. However, several areas reveal mobile-first thinking that was widened rather than rethought for desktop — the Today dashboard hero card being the most visible example.

**Workflow coherence** is the product's greatest strength. The hash-based section navigation within a single DPR editor creates a seamless progression from Work Done through to Review. The "Save & Continue" pattern gives the user a clear sense of forward movement. The carry-forward from yesterday's Tomorrow Plan is a thoughtful touch that respects the daily cadence.

**Visual consistency** is approximately 80% there. The design tokens (CSS custom properties) are defined but underutilized — many components use hardcoded hex values instead of the token system. This does not break anything visually today, but it creates maintenance risk and makes some values drift subtly across components.

**Interaction quality** is solid. Reduced-motion support is implemented throughout. Autosave with debounce is working. Entry/exit animations are tasteful and purposeful. The one area needing attention is delete confirmations, where two different patterns coexist (window.confirm vs BottomSheet).

**Readiness to freeze Phase 1:** Ready after addressing the items identified as MUST FIX BEFORE FREEZE in Section N. The blockers are narrow and surgical — primarily around project context hardcoding and a couple of data-confidence issues. The product does not need a redesign; it needs a tightening pass.

---

## SECTION B — WHAT IS ALREADY WORKING WELL

These patterns and screens should NOT be redesigned. They are strong, purposeful, and should be left alone.

**The section-by-section DPR progression.** The hash-based navigation (#work → #manpower → #materials → #photos → #visit → #tomorrow) within dpr-editor.tsx is elegant. Each section screen receives the full DPR state, renders its own header/step-indicator/content/bottom-bar, and hands off cleanly via the `onNext` callback chain (continueToManpower, continueToMaterials, etc.). This creates genuine workflow continuity without complex routing.

**The BottomSheet form pattern.** The shared BottomSheet component (bottom-sheet.tsx) is well-implemented: 94dvh mobile with drag handle, centered dialog on desktop, backdrop blur, body scroll lock, AnimatePresence transitions, footer slot with safe-area padding. It provides a consistent interaction container across all six form types.

**Work Done activity cards.** The WorkActivityCard in work-done-screen.tsx is one of the best-designed components in the application. The planned/achieved/progress layout, the animated progress bar, the status badge, the three-dot context menu with Edit/Duplicate/Delete — this is a mature, information-rich card that a Site Engineer can scan at a glance.

**The autosave architecture.** The 450ms debounce save with "Saving…"/"Saved ✓" indicator, plus the unmount flush in useEffect cleanup, provides exactly the right level of persistence confidence without being intrusive. The save-failed toast ("Couldn't save changes. Keep this page open and try another edit.") is clear and actionable.

**Photo capture workflow.** Separate camera (capture="environment") and gallery (multiple) inputs, client-side JPEG resize to 1600px at 78% quality, IndexedDB blob storage, photo preview with caption editing — this is thoughtfully built for the construction site use case.

**Voice recording in Site Visit.** MediaRecorder with 2-minute limit, recording timer with ping animation, playback via VoiceNotePlayer, replace/delete controls. This meaningfully reduces typing for site feedback and shows real understanding of field conditions.

**Empty states.** Every section has a purposeful empty state with icon, heading, description, and primary CTA. These are not afterthoughts — they guide the user toward the correct action.

**The step indicator.** The 5-step nav (Work → Manpower → Materials → Photos → Tomorrow) with completed checkmarks creates genuine positional awareness. The user always knows where they are in the DPR.

**Mobile safe-area handling.** Consistent use of `env(safe-area-inset-bottom)` on fixed bottom bars, proper `pb-[calc(...)]` spacing, and the BottomSheet footer padding. This will work correctly on notched/rounded devices.

**Reduced-motion support.** Every animated component checks `useReducedMotion()` and sets `duration: 0` or `initial: false`. The CSS also has a global `@media (prefers-reduced-motion: reduce)` rule. This is thorough.

**The Review DPR screen.** The ReviewCard component with complete/incomplete/optional status badges, the preview-with-overflow pattern (show 3, "+N more"), the desktop sticky aside with completion checklist, and the attempted-submission focus-scroll to the first missing section — this is a well-designed pre-submission checkpoint.

---

## SECTION C — FINDINGS

| ID | Screen / Area | Issue | Evidence | Why It Matters | Severity | Recommended Correction |
|----|--------------|-------|----------|----------------|----------|----------------------|
| C-01 | All screens | Project ID hardcoded to "commercial-tower" | `today-dashboard.tsx` line 14: `const projectId="commercial-tower"`. Same in `calendar-workspace.tsx` line 3. `dpr-editor.tsx` header shows "Commercial Tower" as static text (line 67). | Selecting a different project from the Projects page navigates to `/today?project=<id>` but TodayDashboard ignores the query parameter. The user could create DPR data against the wrong project with no feedback. | BLOCKER | Read `projectId` from the URL search parameter (`?project=`), falling back to the first assigned project. Propagate this through CalendarWorkspace and DPREditor. |
| C-02 | DPR Editor | Delete uses `window.confirm()` in legacy path | `dpr-editor.tsx` line 43: `if(window.confirm("Remove this entry?"))` for inline remove actions. Section screens (work-done, manpower, materials, site-visit, tomorrow-plan) all use the BottomSheet confirmation pattern. | Two different delete UX patterns coexist. `window.confirm()` is jarring, blocks the thread, cannot be styled, and is inconsistent with the premium feel elsewhere. | HIGH | Replace all `window.confirm()` calls with the BottomSheet delete confirmation pattern already used in section screens. |
| C-03 | DPR Editor | PlanForm (legacy) diverges from TomorrowPlanScreen form | `dpr-editor.tsx` lines 143–146: PlanForm uses simplified Select/Field/NumberField helpers. `tomorrow-plan-screen.tsx` uses the full MobileOptionPicker pattern with richer validation, auto-unit mapping, and character limits. | When a user opens the plan form from the card overview vs the Tomorrow section screen, they get different form quality. The legacy form lacks validation, has no error states, and does not prevent 0/negative quantities. | HIGH | Remove the legacy PlanForm from dpr-editor.tsx. Always route plan editing through the TomorrowPlanScreen form pattern, or extract the TomorrowPlanScreen's PlanForm as a shared component. |
| C-04 | Section screens | "Back to DPR" links to `/today` instead of returning to editor | `work-done-screen.tsx` line 31: `<Link href="/today">Back to DPR</Link>`. Same pattern in all section screens (manpower, materials, photos, site-visit, tomorrow-plan). | If a user entered the DPR for a non-today date from Calendar, pressing "Back to DPR" abandons their context. They should return to the editor for the date they were working on. | HIGH | The "Back to DPR" link should navigate back to `/dpr/today?project=<projectId>&date=<date>` or use `router.back()` / a callback prop. |
| C-05 | Projects page | Greeting is hardcoded "Good afternoon" | `projects/page.tsx` renders "Good afternoon, Rumesh" regardless of time. TodayDashboard correctly computes greeting from the current hour. | Minor inconsistency, but noticeable if the user sees the Projects page in the morning. | LOW | Use the same `greeting(hour)` function from TodayDashboard, or extract it as a shared utility. |
| C-06 | Today Dashboard | Week strip status dots rely solely on color | `today-dashboard.tsx` WeekStrip: submitted = green dot, draft = red dot, no DPR = bordered dot. No text labels or distinct shapes. | Users with color vision deficiency cannot distinguish status. The desktop calendar uses a checkmark for submitted (which is good) but the mobile week strip does not. | MEDIUM | Add a checkmark (✓) inside the submitted dot on the mobile week strip, matching the desktop calendar pattern. |
| C-07 | DPR Editor | No date validation for future DPR creation | `dpr.ts` `createDPR` accepts any date string. Calendar allows navigating to future dates and creating DPRs. | A Site Engineer should not submit a DPR for a date that hasn't happened yet. This is a data integrity risk. | MEDIUM | Prevent DPR creation for dates after today. Show a clear message: "DPRs can only be created for today or past dates." |
| C-08 | All section screens | ProgressRing component duplicated 6+ times | Identical `ProgressRing` function exists in: work-done-screen.tsx, manpower-screen.tsx, materials-screen.tsx, site-photos-screen.tsx, site-visit-screen.tsx, tomorrow-plan-screen.tsx, dpr-review.tsx. | Not a UX issue per se, but if the ring rendering drifts between copies, users could see inconsistent progress visualizations. Creates maintenance burden. | LOW | Extract ProgressRing into a shared component (e.g., `components/ui/progress-ring.tsx`). |
| C-09 | Site Visit | Optional nature insufficiently communicated on Today Dashboard | `today-dashboard.tsx` SectionTile: The Site Visit tile shows `helper: "Optional"` as supporting text, but uses the same visual weight and grid placement as required sections. | A user scanning the 6-tile grid might believe all 6 sections are required. The "Optional" text is 12px secondary color — easily missed. | MEDIUM | Visually differentiate the optional tile. Options: muted border, "Optional" badge overlaying the tile corner (similar to the "Optional" badge used on section-screen headers), or a subtle dashed border. |
| C-10 | DPR Editor | Submitted DPR is fully read-only with no edit path | `dpr-editor.tsx` line 57: If `status==="submitted"`, renders `<DPRReview readOnly>` with no edit capability. | While finality is correct for Phase 1, there is no "Request edit" or "Recall" mechanism. If the SE submits with an error, they have no recourse. This is acceptable for Phase 1 but must be flagged for product review. | LOW | Flag for product decision: should SE be able to request an edit of a submitted DPR? For Phase 1, the current behavior is acceptable if communicated clearly. Add a note on the read-only view: "This DPR has been submitted. Contact your supervisor to make changes." |
| C-11 | Review DPR | Attempted submission with missing sections scrolls to first missing card | `dpr-review.tsx` line 16: `setAttempted(true)` then scroll to `[data-review-missing="true"]`. Missing cards get an amber border shadow. | This is good behavior. However, the mobile fixed bottom bar "Submit DPR" button does not change state or show an error message — it just scrolls. The user might not understand why nothing happened. | MEDIUM | After scrolling to the missing section, briefly show a toast or animate the bottom bar to indicate "Complete required sections first." |
| C-12 | Photo handling | Photos stored as data URLs converted through FileReader | `dpr-editor.tsx` line 44 and `site-photos-screen.tsx` line 21: Photos go through `FileReader.readAsDataURL` → `savePhotoDataUrl` → IndexedDB. | Large photos create large base64 strings temporarily in memory before being resized. On low-memory Android devices with 5-10 photos, this could cause performance issues or crashes. | MEDIUM | Process photos via URL.createObjectURL + canvas directly, avoiding the full base64 intermediate. The `resizeImage` function in site-photos-screen.tsx already uses canvas but receives a data URL. |
| C-13 | Bottom navigation | "Projects" tab absent from mobile bottom nav | `bottom-nav.tsx`: Today, Calendar, Profile. `sidebar.tsx`: Today, Calendar, Projects. | Mobile users must access Projects through the header's project name dropdown (ChevronDown navigating to /projects). This is discoverable but not immediately obvious. | LOW | Acceptable for Phase 1 given 3 is the right number of bottom nav items. Ensure the header project context (C-01 fix) makes project switching always accessible. |
| C-14 | DPR Editor card overview | Photo section in card view has its own camera/gallery inputs separate from SitePhotosScreen | `dpr-editor.tsx` lines 72: Photo section card has inline camera/gallery file inputs and direct photo handling. `site-photos-screen.tsx` has its own camera/gallery inputs with richer UX (processing state, error handling, file type validation). | The card-view photo upload path lacks the file type validation, processing indicator, and error handling of SitePhotosScreen. A user could upload an unsupported file from the card view with no feedback. | MEDIUM | Route photo additions through the SitePhotosScreen consistently, or extract the validation/processing logic into a shared hook. |
| C-15 | Manpower form | Worker count stepper allows 0 total workers | `dpr-editor.tsx` ManpowerForm: validation at line 117 checks `total<1`, but during entry the counter can reach 0 without immediate feedback. | A user switching between in-house and subcontractor might momentarily have 0 workers, which is confusing. | LOW | Disable the decrement button when the count is at 1 (not 0) for the active workforce type, unless the other type has workers. |
| C-16 | All forms | No "unsaved changes" warning when closing BottomSheet forms | BottomSheet `onClose` immediately dismisses without checking for unsaved edits. | A user who partially fills a Work activity form and accidentally taps the backdrop will lose all input. On a construction site with one-handed use, accidental dismissals are likely. | HIGH | Add an "unsaved changes" confirmation when closing a BottomSheet that has been modified. |
| C-17 | Calendar | Mobile calendar shows only 14-day horizontal strip | `calendar-workspace.tsx` MobileCalendar: 14 days with prev/next shifting by 14. | A user trying to answer "Did I submit last Thursday's DPR?" must tap through date ranges. There is no month view on mobile. | MEDIUM | Consider adding a month toggle to the mobile calendar, or at minimum allow the user to jump to specific dates more efficiently. |
| C-18 | DPR Editor | Success screen hardcodes "Commercial Tower" | `dpr-editor.tsx` line 148: `<p className="mt-3 text-[15px] font-medium">Commercial Tower</p>` | Related to C-01. The success confirmation should show the actual project name. | BLOCKER | Use the project name from DPR data or a project lookup, not a hardcoded string. |
| C-19 | Login screen | Login form has no real authentication | `login-screen.tsx`: Pre-filled credentials, 380ms delay, navigates to /projects. | Expected for Phase 1 demo. Not a UX defect but should be clearly communicated. The "Demo" badge at the bottom handles this adequately. | — | No action needed for Phase 1. |
| C-20 | All section screens | Section screen headers hardcode "Commercial Tower" and "MEP Works" | work-done-screen.tsx line 23, site-photos-screen.tsx line 26, site-visit-screen.tsx line 24, etc. | Same class of issue as C-01 and C-18. All project context is hardcoded. | BLOCKER | Pass project metadata as props or read from a project context/store. |
| C-21 | DPR Editor | General Remarks textarea has no character limit indicator | `dpr-editor.tsx` line 75: textarea has no `maxLength` and no character counter. Other forms (Work: 500, Manpower: 200, Materials: 200, Visit: 500, Plan: 300) all have limits and counters. | Inconsistency. A user could enter unbounded text. | LOW | Add maxLength (e.g., 1000) and a character counter consistent with other textareas. |
| C-23 | Review DPR (read-only) | "Ready to submit" text shown on already-submitted DPR | `dpr-review.tsx` ProgressRing section (line 21): The mobile progress summary always shows "Ready to submit" when missing.length===0, even in read-only mode. The description text correctly says "This DPR has been submitted and is read-only" but the status line above it says "Ready to submit." | Contradictory. A submitted DPR should say "Submitted" not "Ready to submit." Verified live on the 2026-09-28 seed DPR. | LOW | Conditionally change the status text: if readOnly, show "Submitted" instead of "Ready to submit." |
| C-22 | Photo section | No maximum photo count enforced | `site-photos-screen.tsx` and `dpr-editor.tsx`: Photos can be added without limit. | With 20+ photos, the grid becomes unwieldy, memory usage grows, and localStorage/IndexedDB could hit device limits. | MEDIUM | Set a practical maximum (e.g., 20 photos) with a clear message when reached. |

---

## SECTION D — MOBILE-SPECIFIC FINDINGS

| ID | Issue | Evidence | Severity |
|----|-------|----------|----------|
| D-01 | MobileOptionPicker dropdown may be obscured by keyboard on small viewports | `mobile-option-picker.tsx`: dropdown renders below the trigger with max-height 300px/38dvh. If the picker is near the bottom of a scrollable form inside a BottomSheet, the dropdown could overlap with or be pushed off-screen by the virtual keyboard. | MEDIUM |
| D-02 | Number input spinner buttons visible on some Android browsers | WorkForm, ManpowerForm, MaterialForm use `type="number"` inputs. While CSS hides webkit spinners, some Samsung Internet and older Android Chrome versions still show native spinners alongside the custom stepper. | LOW |
| D-03 | Photo delete button on grid cards is small and overlaps photo content | `site-photos-screen.tsx` PhotoCard: Delete button is `size-11` (44px) positioned `right-2 top-2` over the photo. On 360px screens with 2-column grid, photos are approximately 160px wide — the 44px button covers a significant portion. | LOW |
| D-04 | Bottom bar "Save & Continue" button text truncation on 360px | `work-done-screen.tsx` line 31: "Save & Continue" with ArrowRight icon in a flex-[1.45] button. At 360px with "Back to DPR" adjacent, the text may truncate. | LOW |
| D-05 | Site Visit header title truncates on narrow viewports | `site-visit-screen.tsx` line 22: `max-w-[190px] truncate` on "Site Visit / Feedback". At 360px, this title is likely to truncate. | LOW |

---

## SECTION E — DESKTOP-SPECIFIC FINDINGS

| ID | Issue | Evidence | Severity |
|----|-------|----------|----------|
| E-01 | Today Dashboard hero card loses impact on desktop | `today-dashboard.tsx` DprProgressHero: The dark mobile hero (bg-[#18191f]) becomes a light bordered card on desktop (lg:bg-white). The percentage becomes small. The emotional weight of the "today's progress" moment is diminished. | MEDIUM |
| E-02 | DPR Editor sticky aside shows "Add" text instead of actionable links for missing sections | `dpr-editor.tsx` line 77: Missing sections show `<span className="text-[#c98932]">Add</span>` but this is not clickable — it's just text inside a div. | MEDIUM |
| E-03 | Desktop section-link nav bar in DPR editor uses small pill buttons | `dpr-editor.tsx` line 68: `h-10 px-3 text-[12px]` pill buttons for section navigation. These are functional but visually lightweight for a desktop workspace. | LOW |
| E-04 | Desktop Calendar recent DPRs grid uses very small text (9–11px) | `calendar-workspace.tsx` RecentDPRs: Button labels at 9–11px are at the lower limit of readability. | LOW |
| E-05 | Desktop Profile page is bare | `profile/page.tsx`: Static display of name, role, email. No settings, no preferences, no project assignments. | LOW |

---

## SECTION F — CONSISTENCY FINDINGS

| ID | Area | Inconsistency | Screens Affected |
|----|------|---------------|------------------|
| F-01 | Design tokens | CSS custom properties defined but hardcoded hex values used throughout | All components. Example: `text-[#71717a]` instead of `text-[var(--secondary)]`. `border-[#e4e4e7]` instead of `border-[var(--border)]`. | 
| F-02 | Card border radius | Multiple radii coexist: 10px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 26px | Section cards (20px), photo cards (17px), BottomSheet (14px desktop), form inputs (14px), summary stats (18px), hero card (26px mobile, 16px desktop) |
| F-03 | Button heights | CTA buttons vary: h-11 (44px), h-12 (48px), h-[50px], h-[52px], h-[54px] | BottomSheet footer CTAs (54px), section bottom bars (54px), carry-forward buttons (50px), calendar buttons (48px) |
| F-04 | Font size for labels | Form labels: 12px, 13px, 14px used interchangeably | WorkForm uses 14px bold for primary labels and 12px semibold for sub-labels. ManpowerForm matches. MaterialForm matches. PlanForm (legacy) uses 14px medium. |
| F-05 | Delete button color | Two reds used for destructive actions | `text-[#d9423d]` in SheetFormFooter, `bg-[#dc3f3a]` in BottomSheet confirmations, `text-[#e14d48]` on photo remove. |
| F-06 | Status badge styling | Draft badge uses two different color pairs | DPR Editor header: `bg-[#fdeceb] text-[#c43f3b]`. Section screen headers: `bg-[#ffebe9] text-[#df4b46]`. |
| F-07 | Shadows | Multiple shadow values with varying blur/opacity | Section tiles: `0_7px_22px_rgba(20,25,35,.035)`. Desktop cards: `0_4px_14px_rgba(20,25,35,.025)`. Hero: `0_14px_32px_rgba(20,21,29,.14)`. Submit button: `0_8px_18px_rgba(237,79,73,.18)`. No shadow tokens defined. |
| F-08 | MenuAction component | Duplicated in work-done-screen.tsx, manpower-screen.tsx, materials-screen.tsx, tomorrow-plan-screen.tsx | Identical code in 4 files. |

---

## SECTION G — FIELD-USABILITY RISKS

These issues would realistically affect a Site Engineer on an actual construction site.

| Priority | Risk | Impact | Mitigation |
|----------|------|--------|------------|
| 1 | **Wrong project** (C-01, C-18, C-20) | Entering an entire DPR against the wrong project. On a multi-project site, this is a realistic daily risk. | Fix the hardcoded projectId. Show persistent project context in the DPR editor header. |
| 2 | **Accidental form dismissal** (C-16) | One-handed use on site means accidental taps on the backdrop are common. Losing a partially-completed Work activity form forces re-entry. | Unsaved-changes confirmation on BottomSheet close. |
| 3 | **Fat-finger photo deletion** (D-03) | The delete overlay on photo grid cards is easy to hit accidentally. On a bumpy site, unintentional taps are frequent. | Add a confirmation step for single-photo deletion from the grid (already exists for deletion from within the preview). |
| 4 | **Sunlight readability** | The light grey status text (#71717a on white background) may be hard to read in direct sunlight. Contrast ratio is approximately 4.7:1 for the secondary text color, which meets WCAG AA for large text but is borderline for 12-13px body text. | Consider darkening secondary text to #636363 (~5.7:1 ratio) for small sizes. |
| 5 | **Keyboard obstruction in BottomSheet** | On Android with large keyboards (SwiftKey, Gboard with suggestions), the form content area in mobileTall BottomSheets may be squeezed. The form scrolls, but the sticky footer CTA competes for space. | Test on actual Android devices. Consider collapsing the BottomSheet footer into the scroll area when the keyboard is active. |
| 6 | **Interruption recovery** | If the SE receives a phone call mid-entry, the DPR state is preserved (autosave) but BottomSheet forms are not. Any in-progress form entry is lost. | This is acceptable given the autosave of the parent DPR state. The risk is limited to the current unsaved form fields. |

---

## SECTION H — TOP 10 BEFORE BACKEND

These are the ten highest-value UX/UI changes before freezing Phase 1.

### 1. Fix hardcoded project ID
**Problem:** `projectId="commercial-tower"` is baked into TodayDashboard, CalendarWorkspace, and all section screens. Project switching is broken.  
**Change:** Read projectId from URL search params with fallback. Propagate through all editor and section components.  
**Why now:** This is a data integrity blocker. A user literally cannot use the product for multiple projects.

### 2. Fix hardcoded project names in headers and success screen
**Problem:** "Commercial Tower" and "MEP Works" appear as static strings in section screen headers, the DPR editor header, and the submission success screen.  
**Change:** Derive project name and work type from the project data based on projectId.  
**Why now:** Same class as #1. Without this, multi-project usage is misleading.

### 3. Add unsaved-changes guard on BottomSheet forms
**Problem:** Accidentally closing a partially-filled form loses all input with no warning.  
**Change:** Track form dirty state. Show a "Discard changes?" confirmation when closing a modified BottomSheet.  
**Why now:** This is the most impactful field-usability improvement. Construction site one-handed use makes accidental dismissals frequent.

### 4. Replace window.confirm() with BottomSheet confirmations
**Problem:** Two different delete patterns coexist. window.confirm() breaks the premium feel.  
**Change:** Use the same BottomSheet confirmation pattern that section screens already implement.  
**Why now:** Quick consistency win. The pattern already exists — just apply it everywhere.

### 5. Fix "Back to DPR" navigation for non-today dates
**Problem:** "Back to DPR" always links to /today, discarding context for historical DPR editing.  
**Change:** Navigate back to the correct editor URL with project and date parameters.  
**Why now:** Without this, editing a historical DPR from Calendar is frustrating — the user loses their place.

### 6. Remove legacy PlanForm from dpr-editor.tsx
**Problem:** Two different plan-entry form implementations with different quality levels.  
**Change:** Always use the richer TomorrowPlanScreen form pattern.  
**Why now:** The legacy form lacks validation and could allow invalid data entry.

### 7. Prevent future-date DPR creation
**Problem:** No date validation. A user can create a DPR for tomorrow or next week.  
**Change:** Block DPR creation for dates after today with a clear message.  
**Why now:** Data integrity. A future DPR is nonsensical for a daily progress report.

### 8. Add photo validation to card-view upload path
**Problem:** The DPR editor card view's photo upload lacks the file-type validation and error handling that SitePhotosScreen has.  
**Change:** Extract photo processing logic into a shared hook. Apply consistently.  
**Why now:** A silent upload failure is a data confidence problem.

### 9. Improve Review screen feedback on incomplete submission attempt
**Problem:** Tapping "Submit DPR" with missing sections just scrolls — no explicit message.  
**Change:** Show a brief, clear message ("Complete all required sections to submit") and animate the incomplete section badge.  
**Why now:** The user needs to understand why their action didn't work, especially under time pressure.

### 10. Add "Optional" visual differentiation on Today Dashboard section tiles
**Problem:** Site Visit tile looks identical to required tiles in the 6-tile grid.  
**Change:** Add a subtle visual differentiator — a muted treatment or "Optional" micro-badge on the tile.  
**Why now:** Prevents unnecessary anxiety about completing 6 sections when only 5 are required.

---

## SECTION I — CAN WAIT UNTIL AFTER BACKEND

These improvements are worthwhile but should NOT delay backend work.

- **Design token consolidation** (F-01): Replace hardcoded hex values with CSS custom properties. Important for maintainability, but no user-facing impact today.
- **Component deduplication** (C-08, F-08): Extract ProgressRing, MenuAction, and step indicator into shared components. Engineering hygiene, not UX.
- **Card radius normalization** (F-02): Pick 2-3 standard radii (e.g., 12px for small, 16px for medium, 20px for large) and apply consistently.
- **Shadow token system** (F-07): Define 3-4 shadow tokens and replace the 6+ unique shadow values.
- **Button height normalization** (F-03): Standardize CTA heights to 48px (secondary) and 54px (primary).
- **Desktop Today dashboard hero redesign** (E-01): Make the desktop progress card feel more like a workspace element.
- **Desktop DPR editor aside improvements** (E-02): Make the "Add" indicators clickable, linking to the appropriate section.
- **Desktop Profile enrichment** (E-05): Add project assignments, preferences, and settings.
- **Mobile calendar month view** (C-17): Add a full month grid option on mobile.
- **Photo count limit** (C-22): Set a maximum of 20 photos.
- **General Remarks character limit** (C-21): Add maxLength and counter.

---

## SECTION J — PHASE 2 / FUTURE OPPORTUNITIES

These are NOT Phase 1 defects. They are future capabilities that become relevant once backend and multi-user features exist.

- **Manager review workflow:** Separate review/approval interface where managers can approve, reject, or request changes to submitted DPRs. Requires status expansion: draft → submitted → approved / rejected / changes-requested.
- **AI voice transcription:** The voice recording infrastructure is already in place. Adding server-side transcription of site visit feedback would further reduce typing burden.
- **Activity library per project:** Currently, activities are hardcoded (Cable Tray Installation, Conduit Laying, etc.). Per-project activity libraries would make the picker more relevant and reduce "Other" usage.
- **Material inventory integration:** Show available stock when entering materials used. Flag shortages. Connect to Tomorrow's Plan.
- **Cross-day analytics:** "This week's progress" summary, trend charts for manpower deployment, material consumption patterns.
- **Offline-first with sync:** Replace localStorage/IndexedDB with a proper offline-first data layer that syncs when connectivity returns. Essential for construction sites with poor connectivity.
- **Photo annotation:** Allow drawing on photos to mark specific areas — useful for pointing out defects or progress.
- **DPR templates:** Pre-fill recurring DPR patterns for projects with stable activity sets.
- **Push notifications:** "You haven't submitted today's DPR" reminders in the evening.
- **Multi-language support:** Construction sites in India often have multilingual teams. Tamil/Hindi UI options.

---

## SECTION K — BACKEND-READINESS UX

These are UX states that must be considered when local persistence becomes server persistence. They should NOT block Phase 1 freeze but should be designed before backend integration begins.

**BACKEND-READINESS: Loading states for network data**  
Currently, DPR data loads synchronously from localStorage (line 35, dpr-editor.tsx). With a backend, the initial load will be asynchronous. The current "Opening today's DPR…" loading state exists but needs expansion: skeleton screens for section content, loading states for the Today dashboard progress data, loading states for Calendar status dots.

**BACKEND-READINESS: Save failure and retry**  
The current save-failed toast ("Couldn't save changes") is a dead end — it tells the user to "try another edit." With a backend, save failures will be network-related and potentially recoverable. Design: retry button, queued changes indicator, offline banner.

**BACKEND-READINESS: Submission-in-progress state**  
Currently, submission is synchronous (saveDPR to localStorage). With a backend, submission becomes a network request that can be slow or fail. Design: "Submitting…" state with spinner, disable the submit button during the request, handle timeout, handle server validation errors that differ from client validation.

**BACKEND-READINESS: Conflict resolution**  
If two tabs or devices edit the same DPR (possible once authentication exists), the last-write-wins model of localStorage will become a conflict problem. Design: "This DPR was modified elsewhere. Reload?" or merge UI.

**BACKEND-READINESS: Photo upload progress**  
Photos are currently stored locally. With a backend, each photo is a file upload that takes time and can fail independently. Design: per-photo upload progress, retry for failed uploads, "uploading 3 of 7 photos" indicator.

**BACKEND-READINESS: Sync indicator**  
Replace the local "Saving…"/"Saved ✓" with a richer state: "Saving locally" → "Syncing" → "Synced ✓" → "Offline — saved locally." The user must always know whether their data has reached the server.

**BACKEND-READINESS: Server-confirmed submission**  
Currently, submission writes to localStorage and shows success immediately. With a backend, submission must be confirmed by the server. Design: optimistic UI with rollback on failure, or pessimistic UI that waits for server confirmation before showing the success screen.

**BACKEND-READINESS: Authentication expiry**  
Mid-DPR-entry session expiry would be catastrophic. Design: silent token refresh, and if that fails, preserve local state and require re-login with automatic restoration of the DPR in progress.

---

## SECTION L — MICRO-INTERACTION AUDIT

| Interaction | Current Behavior | Problem | Recommended Behavior | Timing |
|-------------|-----------------|---------|---------------------|--------|
| Save state transition | "Saving…" → "Saved ✓" with opacity fade | Good. No change needed. | — | — |
| Section tile tap | `whileTap={{scale:.98}}` | Good. Responsive press feedback. | — | — |
| BottomSheet open | Slide-up with backdrop fade | Good. Clear surface relationship. | — | — |
| BottomSheet close via backdrop tap | Immediate dismiss | **No warning for dirty forms** | Add dirty-state check before dismiss | — |
| Delete from context menu | Menu closes → BottomSheet confirmation opens | Slightly disorienting: two surfaces animate in sequence | Add a 100ms delay between menu close and confirmation open to let the first animation settle | ~100ms gap |
| Photo capture → grid addition | Photo appears in grid with `opacity:0, scale:.97` → `opacity:1, scale:1` | Good. Clear feedback that the photo was added. | — | — |
| Photo delete from grid overlay | Immediate deletion, no confirmation | **Destructive action too easy to trigger accidentally** | Show BottomSheet confirmation (matching the preview delete flow) | — |
| Voice recording start | Ping animation on mic icon | Good. Clear recording indicator. | — | — |
| Voice recording stop | Recording stops, blob processes, audio player appears | The transition from recording to playback has no explicit "processing" state. If the blob is large, there may be a moment of no feedback. | Add a brief "Processing…" state between recording stop and player render | 200–500ms |
| Submit DPR success | Checkmark scales in with spring, page fades in | Good. Celebratory without being excessive. | — | — |
| Step indicator completion | Number becomes green checkmark | Good. Clear progression signal. | — | — |
| Progress ring animation | `duration: .7` with custom ease | Good. Smooth and satisfying. | — | — |
| WorkActivityCard enter | `opacity:0, y:7` → `opacity:1, y:0` with stagger | Good. Sequential reveal creates visual hierarchy. | — | — |

---

## SECTION M — MACRO-INTERACTION AUDIT

### The Complete DPR Journey

**Today → Continue DPR** ✅ Clear. The hero card's "Continue DPR" button is prominent. The progress percentage creates urgency.

**Continue DPR → Work Done** ✅ The hash-based transition is smooth. The step indicator immediately orients the user.

**Work Done → Manpower** ✅ "Save & Continue" is well-labeled. The transition (`continueToManpower`) clears the work focus and activates manpower focus. `scrollTo({top:0})` resets the viewport.

**Manpower → Materials** ✅ Same pattern. Consistent.

**Materials → Photos** ✅ Same pattern. The shift from form-based entry to camera-based capture is a natural workflow change that the user can feel.

**Photos → Site Visit** ⚠️ This transition works but may confuse users because Site Visit is optional and does not appear in the 5-step indicator. The user goes from step 4 (Photos) to an unnumbered section, then to step 5 (Tomorrow). The continuity could be improved.
**Recommendation:** Add a visual indicator that "Site Visit is optional — skip if no visits occurred today" at the transition point.

**Site Visit → Tomorrow's Plan** ✅ The "Continue" button (not "Save & Continue") is correctly labeled for an optional section.

**Tomorrow's Plan → Review** ✅ The "Review DPR" button correctly signals the shift from data entry to verification. The step indicator's position at step 5 makes the user feel they're at the end.

**The 4/5 → 5/5 moment:** This is well-handled. The ProgressRing animates from 80% to 100%. The Review & Submit card on the Today dashboard changes from neutral to red CTA when all 5 sections are complete. However, within the section-by-section flow, the 5/5 completion happens implicitly when the last required section gets at least one valid entry. There is no explicit "All sections complete!" celebration within the DPR editor flow itself — the user discovers it on the Review screen.
**Recommendation:** When the user completes the 5th required section and taps "Save & Continue" (or "Review DPR" from Tomorrow's Plan), consider a brief micro-celebration — the ProgressRing hitting 100% with a subtle pulse, or a "Ready for review" badge appearing. This costs almost nothing to implement but creates a moment of accomplishment.

**Review → Submit** ✅ The Review screen presents all data clearly. The submit flow uses a confirmation BottomSheet with a summary grid (activities, manpower, materials, photos, planned activities). This is correct.

**Submit → Success** ✅ The success screen is clean: checkmark animation, project name, date, "View DPR" and "Done" buttons.

**Success → History** ⚠️ "Done" navigates to /today, not to Calendar/history. A user who wants to verify their submission in the calendar must navigate there separately. This is acceptable but could be improved.
**Recommendation:** Add "View in Calendar" as a tertiary link on the success screen.

---

## SECTION N — PHASE 1 FREEZE RECOMMENDATION

### MUST FIX BEFORE FREEZE

| ID | Finding | Rationale |
|----|---------|-----------|
| C-01 | Fix hardcoded projectId | Data integrity blocker — wrong project risk |
| C-18 | Fix hardcoded project name in success screen | Same class as C-01 |
| C-20 | Fix hardcoded project names in section headers | Same class as C-01 |
| C-16 | Add unsaved-changes guard on BottomSheet forms | Field usability — accidental data loss |
| C-02 | Replace window.confirm() with BottomSheet | Premium feel / consistency |

### SHOULD FIX BEFORE FREEZE

| ID | Finding | Rationale |
|----|---------|-----------|
| C-03 | Remove legacy PlanForm | Data quality — unvalidated form |
| C-04 | Fix "Back to DPR" navigation | Workflow continuity for historical DPRs |
| C-07 | Prevent future-date DPR creation | Data integrity |
| C-14 | Add photo validation to card-view upload | Data confidence |
| C-11 | Improve incomplete-submission feedback on Review | Clarity under pressure |
| C-09 | Differentiate optional section tile | Cognitive load reduction |
| C-06 | Add checkmark to mobile week strip submitted dots | Accessibility |

### SAFE TO DEFER

| ID | Finding | Rationale |
|----|---------|-----------|
| C-05, C-08, C-10, C-13, C-15, C-21, C-22 | Low-severity usability and consistency issues | No workflow impact |
| D-01 through D-05 | Mobile-specific refinements | Edge cases, not blocking |
| E-01 through E-05 | Desktop refinements | Secondary platform |
| F-01 through F-08 | Consistency normalization | Maintenance, not user-facing |

### Recommended Implementation Sequence

**Pass 1 — Data Integrity & Confidence (1–2 days)**
- Fix hardcoded projectId (C-01, C-18, C-20)
- Prevent future-date DPR creation (C-07)
- Add photo validation to card-view upload (C-14)
- Remove legacy PlanForm (C-03)

**Pass 2 — Field Usability (1–2 days)**
- Add unsaved-changes guard on BottomSheet forms (C-16)
- Replace window.confirm() with BottomSheet (C-02)
- Fix "Back to DPR" navigation for non-today dates (C-04)
- Improve incomplete-submission feedback on Review (C-11)

**Pass 3 — Visual & Interaction Polish (1 day)**
- Differentiate optional section tile (C-09)
- Add checkmark to mobile week strip submitted dots (C-06)
- Photo delete confirmation from grid overlay

**Pass 4 — Optional consistency pass (0.5 day)**
- Button height normalization
- Delete color consistency
- Badge color consistency

**→ FREEZE PHASE 1**

**→ BEGIN BACKEND DEVELOPMENT**

---

*End of Phase 1 UX/UI Audit*
