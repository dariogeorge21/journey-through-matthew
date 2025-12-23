## Complete Build Prompt: *Journey Through Matthew - Jaago*

Build a **journey-based quiz game** titled **“Journey Through Matthew”**, designed for a church or faith-based event. The game narrates the **life of Jesus as presented in the Gospel of Matthew**, structured into **15 sequential levels**, each representing one key event from the Gospel in correct biblical order. Each level contains **one MCQ**, and players must answer correctly to progress forward. The final score is calculated using **accuracy + time taken**, making the game competitive and suitable for a **live leaderboard**.

### Platform & Restrictions

* Supported devices: **Laptops, Desktops, Tablets only**
* Input methods: **Mouse or Touch only**
* No physical keyboard usage during gameplay (except fallback via on-screen keyboard link)
* Theme: **Dark mode**
* Focus on **smooth animations, transitions, and delightful UX**

---

## Game Workflow

### 1. Landing Page

* Display a short, engaging introduction explaining the game’s purpose and journey.
* Show the **Jaago logo** prominently using `/public/jaago.png`.
* Include a **Start Game** button with subtle animations and hover effects.
* Background should feel spiritual and calm, with dark tones and soft motion effects.

---

### 2. Player Input Screen

Collect minimal player information with fun, constrained inputs:

* **Name**:

  * Primary input via **voice**
  * Provide a visible **anchor link** to enable an **on-screen keyboard fallback** if the microphone fails
* **Where are you from?**

  * Fixed set of selectable buttons (no text input)
* Inputs must work only with **mouse or touch**

After submission:

* Show a **4–5 second delay** with a **funny / friendly loading spinner**
* Generate and clearly display a **random 6-digit security code** for 4–5 seconds
* Explicitly instruct the player to **remember this code**
* Store this code securely in frontend context/state
* Immediately start a **countdown animation from 5 → 0**

---

### 3. Gameplay

* Begin the quiz after the countdown ends
* Each of the **15 levels**:

  * Displays one MCQ (dummy question objects for now)
  * Correct answer allows progression with visual green flicker for 500ms
  * Incorrect answer still progresses but affects score with visual red flicker for 500ms
* UI elements:

  * **Timer** influencing final score
* Transitions between levels should feel like a **journey forward**
* Maintain high visual polish using animations and micro-interactions

* Score calculation:

  * **Accuracy** (100% correct = 1000 points)
  * **Time taken** (less time = more points, scaled appropriately)
  * **Tie-breaker**: In case of identical total scores, use the timestamp of completion (earlier completion wins)
  * **Total score** = accuracy points + time bonus points
  * **Note**: The scoring formula should be designed to make ties statistically unlikely by using fine-grained time measurements (e.g., milliseconds) and a continuous scoring function for time rather than discrete intervals

---

### 4. Security Check at End

After the final level:

* Ask the player to re-enter the **same 6-digit security code**
* Validate against the stored context value
* If incorrect 2 times, then follow the “Forgot Code” flow

If the player clicks **“Forgot Code”**:

* Display a playful but thematic punishment:

  * “Please recite **5 Hail Marys**”
  * Show **5 visually attractive checkboxes**
  * Player must manually check each box after reciting
* Only after completing this can they proceed

---

### 5. Score Reveal & Completion

* If the security code is correct:

  * Show loading spinner
  * Reveal final score with animation
  * Display:

    * Thank-you message
    * Short godly / inspirational messages
* Provide a **Restart Game** button

  * Redirects to the landing page
  * Fully resets game state

---

## Database & Backend (Supabase)

* Use **Supabase** as backend
* **One single table** is sufficient
* Store:

  * Player name
  * Location
  * Level-wise progress
  * Final score
  * Time taken
  * Timestamp
* Questions are loaded from **dummy objects for now**
* Developer manually manages credentials via `.env`
* No admin panel required

---

## Tech Stack & UI

* **Next.js**
* **React**
* **Tailwind CSS**
* Any good modern UI library (animations encouraged)
* Dark theme only
* Clean component separation
* Smooth UX > heavy features

---

## End Goal

Deliver a **fully working, polished quiz game** with:

* Strong visual identity
* Playful but respectful faith-based interactions
* Smooth journey-style gameplay
* Leaderboard-ready scoring
* Clean Supabase integration

This prompt should be treated as the **single source of truth** for building *Journey Through Matthew*.
