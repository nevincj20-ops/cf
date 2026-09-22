# EBIT INSIGHT
### EBIT–EPS & Break-even EBIT Financial Analysis Platform
*Interactive Corporate Finance Project for B.Com Semester V*

---

## 📌 Project Overview
**EBIT INSIGHT** is an interactive financial analysis web platform designed for B.Com Semester V Corporate Finance coursework, assignments, and exam preparation.

The application allows students, teachers, and finance professionals to:
1. **Compare Financing Alternatives**: Evaluate all-equity, debt-leveraged, and preference capital structures.
2. **Dynamic Break-Even EBIT Solver**: Equates EPS under Plan A and Plan B dynamically without hard-coding:
   $$\frac{(EBIT - I_A)(1 - T) - PD_A}{N_A} = \frac{(EBIT - I_B)(1 - T) - PD_B}{N_B}$$
3. **Step-by-Step Income Statement Workings**: Formats full accounting steps:
   $$\text{EBIT} \rightarrow \text{Interest} \rightarrow \text{EBT} \rightarrow \text{Tax} \rightarrow \text{PAT} \rightarrow \text{Preference Dividend} \rightarrow \text{EPS}$$
4. **Interactive Sensitivity Curve**: Visualizes the indifference intersection point with Recharts.
5. **Academic Interpretation Engine**: Automatically contextualizes operating outcomes (*Below Break-Even*, *At Break-Even*, *Above Break-Even*).
6. **Academic Dossier Generator**: One-click printable reports, PDF export, and CSV download.

---

## 🚀 Technology Stack
- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Liquid Glass Design
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Vitest (14 automated unit tests)

---

## 🛠️ Local Development & Running

### Prerequisites
- Node.js (v18 or higher)

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Run automated financial engine tests
npm test

# 4. Build for production deployment
npm run build
```

---

## 📄 License & Academic Attribution
Created for B.Com Semester V Corporate Finance examination and study purposes. Zero external tracking, 100% client-side computation.
