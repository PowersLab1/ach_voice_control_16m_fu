# Auditory Conditioned Hallucinations (ACH) task with voice control cues

## Overview

This repo implements the **Auditory Conditioned Hallucinations (ACH) task with voice control cues**. The task presents participants with a series of blocks, each containing trials with both auditory and visual stimuli, and exploits associative learning to induce auditory hallucinations, with cues to elicit, inhibit, or remain neutral toward these induced percepts. The fixation cross color cues these states, controlled at the mini-block level according to the in-person variant:

- **Blocks 1 & 2:** Use a constant fixation cross color (e.g., `"default"`).
- **Blocks 3, 4, 5:** Use a block-specific order of fixation cross colors (e.g., `"gray"`, `"green"`, `"red"`), with the specific sequence randomized over mini-blocks, of which there are three per block.

The app collects participant responses and confidence ratings, manages state with Redux, and sends data to REDCap via AWS Lambda.

---

## Installation

1. **Clone the repository** and navigate into the project folder.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the app locally to test:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

---

## Block Structure and Fixation Cross Color Logic

- **Block files:**  
  Each block (`Trial_TT_1.js`, `Trial_TT_2.js`, `Trial_TT_3.js`, etc.) passes two key props to the central `` component:
  - `blockIdx`: The block number (e.g., `1`, `2`, `3`, etc.).
  - `constantCrossColor`: (Only for blocks 1 & 2) The constant color to use for the fixation cross.

### Block 1 & 2 Example:
```jsx
<Trial
  decibels={this.state.decibels}
  shouldRecordRatings={true}
  trialCompleteRenderer={this.trialCompleteRenderer}
  dataHandler={this.dataHandler}
  blockIdx={TRIAL_NUM}
  constantCrossColor="default" // or "gray", "black", etc.
/>
```

### Blocks 3, 4, 5 Example:
```jsx
<Trial
  decibels={this.state.decibels}
  shouldRecordRatings={true}
  trialCompleteRenderer={this.trialCompleteRenderer}
  dataHandler={this.dataHandler}
  blockIdx={TRIAL_NUM}
  // No constantCrossColor prop
/>
```

- **Trial Component Logic:**
  - If `constantCrossColor` is provided, all miniblocks in that block use the specified color.
  - Otherwise, the color order for each block is randomly shuffled once and fixed for the duration of the block.

---

## How to Edit the Fixation Cross Color Logic or Trial Structure

1. **Edit the `Trial.js` Constructor:**
   - To change color logic, update how `this.crossColorOrder` is set:
     - Use a constant color when `constantCrossColor` is passed.
     - Otherwise, randomize the order using `blockIdx`.

2. **Pass the Correct Props from Block Files:**
   - For constant-color blocks (1 & 2), pass both `blockIdx` and `constantCrossColor`.
   - For randomized-color blocks (3–5), pass only `blockIdx`.

3. **Update the `render()` Method in `Trial.js`:**
   - Ensure the current color is passed to `VisualStimulus` as `crossColor={this.crossColorOrder[this.state.index % 3]}`.

4. **(Optional) Change Color Options:**
   - Edit the `FIX_CROSS_COLORS` array in `Trial.js` to use different colors if needed.

| Block Type       | What to Pass to ``              | What Happens                |
|------------------|------------------------------------------|-----------------------------|
| Constant color   | `blockIdx`, `constantCrossColor`         | Blocks 1-2 |
| Randomized color | `blockIdx` only                          | Random order, fixed for each of three mini-blocks within Blocks 3-5 |

---

## Key Files

- `Trial.js`: Central logic for trial presentation, including fixation cross color assignment.
- `Trial_TT_1.js` to `Trial_TT_5.js`: Block-specific components, each passing the appropriate props to `Trial`.
- `VisualStimulus.js`: Receives the `crossColor` prop and renders the fixation cross accordingly[1].

---

## Running and Testing

- **Start the app** as described above.
- **Verify fixation cross color logic:**
  - Blocks 1 & 2 should always show the same cross color.
  - Blocks 3–5 should each have their own unique, randomized color order for the fixation cross, consistent within each mini-block.

---

## Data Handling

- Redux is used for state management.
- Data is sent to REDCap via AWS Lambda functions.
- See `store.js` and related Redux files for details.

---

## Deployment

For instructions on deployment, see the lab documentation.

---

## Contributing

- When adding new blocks or changing color logic, ensure you update both the block file and, if necessary, the color array in `Trial.js`.

---

**For more technical details, see the in-code documentation and comments.**  
If you have questions, contact alexandria.bond@yale.edu.
