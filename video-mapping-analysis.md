# Video Mapping Analysis for Career Roadmap Tool

## Video Categories from CSV

### 1. COMPANY TIER VIDEOS (Potential Hero Videos)
These videos explain career paths in different company types - perfect for hero section based on user's target company.

| Video ID | Title | Best For | Embed URL |
|----------|-------|----------|-----------|
| wLNYUJ-Nj5Y | Level up your career in High Growth Startups | high-growth tier | https://www.youtube.com/embed/wLNYUJ-Nj5Y |
| W1QTd9gWDrw | Level up your career in Scaled Startups | unicorns tier | https://www.youtube.com/embed/W1QTd9gWDrw |
| _QfvxrbJmeY | Level up your career in Big Tech Companies | big-tech tier | https://www.youtube.com/embed/_QfvxrbJmeY |
| bBFvw_F5ekg | Level up your career in Product MNCs | service tier | https://www.youtube.com/embed/bBFvw_F5ekg |
| kOHPCvM4dgI | Level up your career in Dream Companies | General/All tiers | https://www.youtube.com/embed/kOHPCvM4dgI |
| 8brxbx-1HfE | Level up your career in High Growth Startups (alt) | high-growth tier | https://www.youtube.com/embed/8brxbx-1HfE |

**Recommendation:** Use for HERO videos - different video per persona based on what's most relevant.

---

### 2. DSA/TECHNICAL FOUNDATION VIDEOS (Phase 1 & 2)
Core technical skill videos for learning path phases.

| Video ID | Title | Best For | Embed URL |
|----------|-------|----------|-----------|
| sg5pwazWomM | DSA beginner level at Scaler | Phase 1 (entry-level) | https://www.youtube.com/embed/sg5pwazWomM |
| IkYjxLHyw98 | DSA intermediate level at Scaler | Phase 2 (mid-level) | https://www.youtube.com/embed/IkYjxLHyw98 |
| _dl8KiU1HYY | Importance of DSA for every engineer | Phase 1 (all levels) | https://www.youtube.com/embed/_dl8KiU1HYY |
| o39hGS4ef6E | HLD (High Level Design) at Scaler | Phase 3 (mid/senior) | https://www.youtube.com/embed/o39hGS4ef6E |

**Recommendation:** Use for LEARNING PATH PHASES based on level and phase number.

---

### 3. INTERVIEW PREPARATION VIDEOS (Phase 4)
Videos focused on interview success.

| Video ID | Title | Best For | Embed URL |
|----------|-------|----------|-----------|
| UjaJkO2iHWc | How Scaler helps with HR interviews | Phase 4 (all) | https://www.youtube.com/embed/UjaJkO2iHWc |
| 1bvdwgDiX1Q | How to prep for your first interviews? | Phase 4 (entry) | https://www.youtube.com/embed/1bvdwgDiX1Q |
| 9d4zRIHbPYI | How to set yourself apart during Interviews? | Phase 4 (mid/senior) | https://www.youtube.com/embed/9d4zRIHbPYI |

**Recommendation:** Use for PHASE 4 (Interview Prep) of learning paths.

---

### 4. CAREER SWITCHING VIDEOS
Relevant for understanding career transitions.

| Video ID | Title | Best For | Embed URL |
|----------|-------|----------|-----------|
| WTSMgkoxQyI | Why switch to product based companies early? | Phase 1/2 (entry/mid) | https://www.youtube.com/embed/WTSMgkoxQyI |
| RRFHZSEeMyk | Switching from Product MNCs to startup | mid/senior levels | https://www.youtube.com/embed/RRFHZSEeMyk |
| vdTJIhRTXjo | Switching within same tier of organisation | mid/senior levels | https://www.youtube.com/embed/vdTJIhRTXjo |
| KsWq6yNIwQ4 | Services developer paths 0-3 years | entry level | https://www.youtube.com/embed/KsWq6yNIwQ4 |
| DXWAqGiVgkU | Services developer paths 3-6 years | mid level | https://www.youtube.com/embed/DXWAqGiVgkU |
| ou3hyeLF4dI | What's next for senior developers? | senior level | https://www.youtube.com/embed/ou3hyeLF4dI |

**Recommendation:** Can be used for Phase 2 or Phase 3 based on career level.

---

### 5. NON-TECH/CAREER SWITCHER VIDEOS
Specifically for nontech personas.

| Video ID | Title | Best For | Embed URL |
|----------|-------|----------|-----------|
| D3C9-R2cY6M | Why projects are MUST-HAVE for non-techies! | ALL nontech personas | https://www.youtube.com/embed/D3C9-R2cY6M |
| z9gDWPam3-o | For non-coders switching to tech | nontech personas | https://www.youtube.com/embed/z9gDWPam3-o |
| o5f766FvnoI | Switch into tech without coding experience | nontech personas | https://www.youtube.com/embed/o5f766FvnoI |

**Recommendation:** Use for HERO or PHASE 1 of all nontech personas.

---

### 6. DATA SCIENCE SPECIFIC VIDEOS
For data engineer/scientist personas only.

| Video ID | Title | Best For | Embed URL |
|----------|-------|----------|-----------|
| EGihqTaWgJ0 | What problem statements do Data Scientists work on? | data personas | https://www.youtube.com/embed/EGihqTaWgJ0 |
| MSRSZTP0Fl8 | Software Engineering to Data Science & ML | tech_data personas | https://www.youtube.com/embed/MSRSZTP0Fl8 |
| CZyIuVQnLPQ | Transition into Data Science without experience | nontech_data personas | https://www.youtube.com/embed/CZyIuVQnLPQ |
| VOPEEQeph48 | Transition into DSML without coding | nontech_data personas | https://www.youtube.com/embed/VOPEEQeph48 |

**Recommendation:** Use for ALL data personas (entry/mid/senior, tech/nontech).

---

### 7. GENERAL/MOTIVATIONAL VIDEOS
Broad appeal videos.

| Video ID | Title | Best For | Embed URL |
|----------|-------|----------|-----------|
| 3Pq9blTtKfE | Why We Do What We Do - Scaler Academy | All personas (Hero) | https://www.youtube.com/embed/3Pq9blTtKfE |

**Recommendation:** Fallback hero video or Phase 1 motivational content.

---

## MAPPING STRATEGY

### Hero Video Selection Logic

For each persona, choose hero video based on:

1. **User Type (tech vs nontech):**
   - nontech → Use nontech-specific videos (D3C9-R2cY6M, o5f766FvnoI)
   - tech → Use company tier videos

2. **Specialization (for nontech):**
   - nontech_data → Data switching videos (CZyIuVQnLPQ, VOPEEQeph48)
   - nontech_other → General nontech videos (D3C9-R2cY6M, o5f766FvnoI)

3. **Default for tech personas:**
   - Use general motivational: "Level up your career in Dream Companies" (kOHPCvM4dgI)
   - Or Scaler mission: "Why We Do What We Do" (3Pq9blTtKfE)

### Learning Path Phase Videos Logic

#### Phase 1 (Foundations)
- **entry_nontech_*:** Switch into tech without coding (o5f766FvnoI)
- **entry_tech_*:** DSA beginner level (sg5pwazWomM)
- **mid_*_*:** Importance of DSA (\_dl8KiU1HYY)
- **senior_*_*:** Why switch to product companies (WTSMgkoxQyI)
- **ALL _data personas:** What Data Scientists work on (EGihqTaWgJ0)

#### Phase 2 (Core Skills)
- **entry_*_*:** DSA intermediate level (IkYjxLHyw98)
- **mid_tech_*:** Services developer 3-6 years (DXWAqGiVgkU)
- **mid_nontech_*:** Why projects for non-techies (D3C9-R2cY6M)
- **senior_*_*:** What's next for senior developers (ou3hyeLF4dI)
- **_data personas:** Software Eng to Data Science (MSRSZTP0Fl8)

#### Phase 3 (Advanced Topics)
- **mid/senior_*_*:** HLD at Scaler (o39hGS4ef6E)
- **entry_*_*:** Importance of DSA (\_dl8KiU1HYY)
- **nontech_*_*:** Transition videos specific to specialization
- **_data personas:** Transition into DSML (CZyIuVQnLPQ or VOPEEQeph48)

#### Phase 4 (Interview Prep)
- **entry_*_*:** How to prep for first interviews (1bvdwgDiX1Q)
- **mid_*_*:** Set yourself apart in interviews (9d4zRIHbPYI)
- **senior_*_*:** Set yourself apart in interviews (9d4zRIHbPYI)
- **ALL personas:** HR interview prep as alternative (UjaJkO2iHWc)

---

## COVERAGE ANALYSIS

### Videos We Can Use: 27 total

**By Purpose:**
- Hero videos: 9 videos (company tier + nontech + general)
- Phase 1 videos: 6 videos (foundations)
- Phase 2 videos: 7 videos (core skills)
- Phase 3 videos: 5 videos (advanced)
- Phase 4 videos: 3 videos (interview prep)
- Data-specific: 4 videos (all phases)

**Coverage:**
- ✅ ALL 30 personas can get hero videos
- ✅ ALL 30 personas can get Phase 1 videos
- ✅ ALL 30 personas can get Phase 2 videos
- ✅ ALL 30 personas can get Phase 3 videos
- ✅ ALL 30 personas can get Phase 4 videos

**Result:** We have sufficient videos to populate all 150 video slots with relevant, contextualized content!

---

## IMPLEMENTATION PLAN

### Option A: Role-Based Differentiation (RECOMMENDED)
Assign different videos based on:
- User type (tech vs nontech)
- Level (entry vs mid vs senior)
- Specialization (backend, frontend, data, devops, fullstack)

**Pros:**
- Highly personalized experience
- Videos match user's exact journey
- Better engagement

**Cons:**
- More complex mapping logic
- Need to validate each persona individually

### Option B: Simplified Approach
Use a smaller set of "universal" videos:
- Same hero video for all tech personas
- Same hero video for all nontech personas
- Standard phase videos based only on level

**Pros:**
- Simpler to implement
- Easier to maintain

**Cons:**
- Less personalized
- Misses opportunity for role-specific guidance

### Option C: Hybrid Approach (BALANCED)
- Differentiate hero videos by user type and specialization
- Use level-based videos for phases (entry/mid/senior)
- Special handling for data personas (they have unique videos)

**Pros:**
- Good balance of personalization and simplicity
- Manageable complexity
- Leverages available video diversity

**Cons:**
- Some manual mapping still required

---

## RECOMMENDED NEXT STEPS

1. **Choose approach:** A, B, or C above
2. **Create detailed mapping:** 30 personas × 5 videos = 150 mappings
3. **Script the update:** Bulk update all persona JSON files
4. **Test sample personas:** Verify videos load correctly
5. **Deploy and validate:** Check all 30 personas in production

---

## NOTES

- All YouTube URLs need conversion from watch format to embed format
- Watch format: `https://www.youtube.com/watch?v=VIDEO_ID`
- Embed format: `https://www.youtube.com/embed/VIDEO_ID`
- Already done in tables above ✅

- Some videos appear twice in CSV (video 1 and 12 are both high-growth startup videos)
- We should deduplicate and use the best version
