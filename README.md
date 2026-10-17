# 🧠 AI Neuroevolution Simulator — GCERT & NCERT Science Exhibition 2026–27

[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Canvas API](https://img.shields.io/badge/HTML5-Canvas_60FPS-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Linear Algebra](https://img.shields.io/badge/Math-Linear_Algebra-00E599?style=for-the-badge)](https://en.wikipedia.org/wiki/Feedforward_neural_network)
[![NEP 2020](https://img.shields.io/badge/Pedagogy-NEP_2020_Class_8--12-FDC800?style=for-the-badge)](https://www.education.gov.in/nep)

> **Event**: GCERT & NCERT Children's Science Exhibition 2026–27 (બાળ વૈજ્ઞાનિક પ્રદર્શન)  
> **Main Theme**: *Science, Technology, and Innovation for a Sustainable and Viksit Bharat*  
> **Subtheme 1(A)**: *Artificial Intelligence (AI) for Better Life & Autonomous UAV Robotics*  
> **Subtheme 1(B)**: *Mathematical Modelling and Computational Thinking*

---

## 💡 1. Executive Summary & Core Exhibition Thesis

This project is an **Interactive AI Literacy & Autonomous Flight Simulation Laboratory** built completely from scratch using **Zero External AI Libraries**. It demystifies modern artificial intelligence for teachers, students, and science fair judges by rendering the internal mathematical mechanics of a neural network in real time.

### The Educational Problem: The "Magic Illusion" Crisis

Today, high-school students interact with large language models (ChatGPT, Gemini) and voice assistants, yet treat AI as "magical sentient code". Under India's **National Education Policy (NEP 2020)** and CBSE guidelines, schools are mandated to teach foundational AI from Class 8 onwards. However, educators lack visual, hands-on sandboxes where learners can directly peer inside the mathematical engine.

### The Solution: Real-Time Darwinian Neuroevolution

Rather than using pre-trained weights or black-box libraries, this simulator starts with **150 completely blind agents with random Gaussian weights**. Visiting students observe how the population naturally evolves:

1. **Generation 1**: All 150 birds flop and crash within 1.5 seconds. Students immediately realize: *AI starts completely blind; there is no innate intelligence*.
2. **Generation 5**: Through natural selection and rank-weighted breeding, champions learn to navigate past the first vertical barrier.
3. **Generation 20**: Birds glide effortlessly through high-speed moving obstacles, shrinking gaps, and wind shear.

---

## 🏛️ 2. Dual-Pronged Exhibition Alignment

### Pillar 1: STEM / AI Education & Classroom Demystification (Subtheme 1B)

- **Biology Connection**: Darwinian natural selection, chromosome crossover (mixing DNA layers from pairs of top parent brains), and genetic mutation perturbations.
- **Mathematics Connection**: Feedforward vector multiplication ($z = W \cdot x + b$), activation functions ($\text{ReLU}$, $\text{Sigmoid}$), Euclidean coordinate distances, and multi-objective loss/fitness functions.
- **Computer Science Connection**: Heuristic reinforcement learning, forward propagation, and headless turbo training.

### Pillar 2: Autonomous UAV Obstacle Avoidance for Robotics (Subtheme 1A)

- Simulates edge microcontrollers guiding Unmanned Aerial Vehicles (UAVs / drones) through vertical obstacle corridors in GPS-denied environments (e.g. disaster search-and-rescue).
- Utilizes **9 normalized sensory radar/sonar inputs** (altitude, vertical velocity, forward obstacle distance, gap apertures, dynamic velocity, crosswind force).
- Because the network has fewer than 300 parameters, it executes in microseconds on low-power microcontrollers with zero cloud dependencies.

---

## 📐 3. Mathematical Foundations

### A. Sensory Input Vector ($X \in \mathbb{R}^9$)

Each agent receives 9 continuous telemetry values normalized between $[0, 1]$ or $[-1, 1]$:

```text
x[0] = y / 600                             (Altitude)
x[1] = v / 10                              (Vertical Velocity)
x[2] = d / 400                             (Obstacle Proximity Distance)
x[3] = y_top / 600                         (Upper Pipe Ceiling)
x[4] = y_bottom / 600                      (Lower Pipe Floor)
x[5] = v_pipe / 2                          (Dynamic Oscillation Rate)
x[6] = F_wind / 1                          (Crosswind Force Vector)
x[7] = y_second_top / 600                  (Secondary Barrier Ceiling)
x[8] = y_second_bottom / 600               (Secondary Barrier Floor)
```

### B. Forward Propagation ($z = W \cdot x + b$)

For each layer $l$ from $1$ to $L$:

$$Z^{[l]} = W^{[l]} A^{[l-1]} + b^{[l]}$$

$$A^{[l]} = g^{[l]}(Z^{[l]})$$

- **Hidden Layers**: $\text{ReLU}(z) = \max(0, z)$ provides non-linear expressiveness with zero vanishing gradients.
- **Output Layer**: $\sigma(z) = \frac{1}{1 + e^{-z}}$ squashes output into a jump probability $p \in (0, 1)$. If $p > 0.5$, the bird flaps upward.

### C. Objective Multi-Factor Fitness Function

$$\text{Fitness} = (\text{Score} \times 1000) + \text{FramesSurvived} - (|\Delta Y_{\text{gap}}| \times 0.5)$$

---

## 📁 4. Project Architecture & Clean Folder Structure

```text
D:\Trinno\Ai TE1\
├── public/
│   └── best-brain.json               # Pre-trained champion neural weights (Score 100+)
├── src/
│   ├── core/                         # Framework-agnostic mathematical engines
│   │   ├── NeuralNetwork.js          # Matrix multiplications, activations, mutations
│   │   ├── GeneticAlgorithm.js       # Tournament selection, crossover, elitism
│   │   ├── GameEngine.js             # 60 FPS Canvas physics, dynamic obstacles, LiDAR rays
│   │   └── AudioSynthesizer.js       # Procedural Web Audio API sound generator
│   ├── components/                   # Neobrutalist Bento UI modules
│   │   ├── Header/                   # Navigation, theme pills, NEP 2020 badges
│   │   ├── Game/                     # Canvas viewport, obstacle badges, turbo overlay
│   │   ├── Controls/                 # What-if sliders (mutation, elitism, topology)
│   │   ├── Telemetry/                # Live metric cards (generation, alive, fitness, records)
│   │   ├── Visualizer/               # Brain diagram, fitness curve, math inspector, weight matrix
│   │   ├── Pedagogy/                 # 4-step interactive guided classroom tour modal
│   │   └── ExportImport/             # JSON model & CSV research dossier export
│   ├── hooks/
│   │   └── useSimulation.js          # 60 FPS requestAnimationFrame state bridge
│   ├── styles/
│   │   └── index.css                 # Neobrutalist Bento design system & tokens
│   ├── App.jsx                       # Main application layout
│   └── main.jsx                      # Vite entry point
├── package.json                      # React 18, Vite, Lucide-React, Canvas-Confetti
├── vite.config.js                    # Vite bundler configuration
└── README.md                         # This master document
```

---

## 🚀 5. Quickstart Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### Installation & Launch

1. **Clone or Navigate to the Workspace**:

   ```bash
   cd "D:\Trinno\Ai TE1"
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Launch the Local Development Server**:

   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:5173/](http://localhost:5173/).

---

## 🎓 6. Science Fair Presentation Guide for Judges

When judges or school teachers approach your stall, follow this 3-minute winning presentation flow:

1. **The Hook (30s)**:
   - *"Everyone uses ChatGPT, but how does AI actually make decisions? Under NEP 2020, our project provides an open-source visual laboratory where students look directly inside a machine's brain."*
2. **Generation 1 Chaos (45s)**:
   - Click **Reset** and **Start Evolution**.
   - Show how all 150 birds crash within 1 second because weights are pure random numbers.
3. **The Mathematical Proof (60s)**:
   - Click the **Math Inspector (1B)** tab or press **Freeze-Frame (Inspect)**.
   - Point to the live matrix equation $z = W \cdot x + b$:
   - *"Every decision to flap or glide is computed through basic linear algebra and vector dot products taught in high school mathematics."*
4. **Interactive What-If Experimentation (45s)**:
   - Invite the judge to drag the **Mutation Slider to 50%** to observe chaotic genetic degradation.
   - Drop **Elitism to 0%** to see champions get accidentally forgotten.
   - Click **Load Pre-Trained Champion** to watch an evolved champion navigate double barriers and wind zones with superhuman precision!

---

## 📜 7. License & Credits

Distributed under the MIT License. Developed for the **GCERT & NCERT Children's Science Exhibition 2026–27** (બાળ વૈજ્ઞાનિક પ્રદર્શન).
