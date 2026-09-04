# DSAlgeria 🇩🇿

> منصة تعليمية تفاعلية لتعلّم وفهم هياكل البيانات والخوارزميات بطريقة بصرية وعملية.

DSAlgeria is an interactive educational web application designed to help students understand algorithms and data structures through visualizations, step-by-step execution, source code, execution history, and interactive representations.

The project aims to transform abstract algorithmic concepts into clear and understandable visual experiences.

---

## ✨ Features

### 🧠 Interactive Algorithm Visualization

Algorithms are executed step by step, allowing the user to observe how the algorithm works instead of only seeing the final result.

The visualization can show:

- Current algorithm step
- Active elements
- Comparisons
- Swaps
- Data changes
- Execution progress
- Final result

---

### 📋 Execution History

The **سجل التنفيذ** section displays the sequence of operations performed during the algorithm's execution.

This allows students to:

- Review previous operations
- Follow the algorithm's execution flow
- Understand why each operation occurs
- Track changes to the data

---

### 💻 Source Code

The **الكود المصدري** section displays the source code corresponding to the selected algorithm.

This connects the visual execution with its actual implementation, allowing students to understand the relationship between:

**Algorithm → Code → Execution → Visualization**

---

### 📊 2D Data Visualization

The project includes custom 2D charts built directly with HTML `<div>` elements and CSS.

No external charting library is required for the visualization itself.

The `BarChart3` icon from **Lucide React** is used as an interface icon for the chart section.

The charts can be used to visually represent algorithm-related information and execution statistics.

---

### 🧊 3D Visualization

DSAlgeria also introduces interactive 3D visualization to provide another way of representing algorithms and data structures.

The 3D visualization is designed to make relationships and changes between elements easier to observe in a more immersive environment.

This extends the traditional 2D visualization approach by allowing algorithmic concepts to be represented spatially.

---

## 🎯 Project Goal

The main goal of DSAlgeria is to make algorithms easier to learn by combining theoretical concepts with visual and interactive explanations.

Instead of simply presenting an algorithm as:

```text
Algorithm
    ↓
Source Code
    ↓
Result
```

DSAlgeria focuses on:

```text
Concept
    ↓
Visualization
    ↓
Step-by-Step Execution
    ↓
Execution History
    ↓
Source Code
    ↓
Statistics
    ↓
2D / 3D Visualization
```

This approach allows students to follow the algorithm's logic and observe how its state changes during execution.

---

## 🧩 Algorithms

The platform is designed to support different categories of algorithms.

### Searching

- Linear Search
- Binary Search
- Ternary Search

### Sorting

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort

### Mathematical Algorithms

- Fibonacci Sequence

### Graph Algorithms

- Dijkstra's Algorithm

### Algorithmic Paradigms

- Divide and Conquer
- Greedy Algorithms
- Dynamic Programming

---

## 🛠️ Technologies

- **React** — Building the user interface and application components
- **Vite** — Development environment and build tool
- **Tailwind CSS** — Styling and responsive design
- **JavaScript** — Algorithm implementation and application logic
- **Lucide React** — Interface icons
- **HTML & CSS** — Custom 2D visualizations and UI elements
- **3D Visualization** — Interactive three-dimensional algorithm representations

---

## 🎨 Design

DSAlgeria uses a modern dark interface with an indigo-based visual identity.

The interface focuses on:

- Clean and minimal design
- Clear visual hierarchy
- Interactive components
- Responsive layouts
- Visual feedback during execution
- Arabic educational terminology

The goal is to keep the interface focused on the algorithm while providing enough visual information to understand what is happening at each step.

---

## 🌐 Arabic Interface

DSAlgeria is primarily designed for Arabic-speaking students.

The interface uses Arabic terminology for important educational sections, including:

| Arabic | English |
|---|---|
| سجل التنفيذ | Execution History |
| الكود المصدري | Source Code |
| التعقيد الزمني | Time Complexity |
| التعقيد المكاني | Space Complexity |

This helps make algorithmic concepts more accessible to students learning in Arabic.

---

## ⚙️ How It Works

A typical algorithm execution follows this process:

```text
User Input
    ↓
Initialize Algorithm
    ↓
Execute Operation
    ↓
Update Visualization
    ↓
Record Execution Step
    ↓
Update Statistics
    ↓
Display Result
```

Each execution step can update the visual state of the application, allowing the user to follow the algorithm in real time.

---

## 📚 Educational Approach

DSAlgeria focuses on **learning through visualization**.

Instead of only showing the implementation of an algorithm, the application allows the student to observe its behavior.

For example, during a sorting algorithm:

```text
Compare Elements
       ↓
Highlight Elements
       ↓
Check Condition
       ↓
Swap / Keep
       ↓
Update Visualization
       ↓
Record Operation
```

This makes the algorithm's decision-making process easier to understand.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** and **npm** installed.

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd DSAlgeria
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

## 📁 Project Structure

A simplified project structure:

```text
DSAlgeria/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── algorithms/
│   ├── data/
│   ├── utils/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

The structure may evolve as new algorithms and visualization features are added.

---

## 🔮 Future Improvements

Potential future improvements include:

- Additional algorithms
- More data structures
- More graph algorithms
- Additional 3D visualizations
- Algorithm comparison
- Interactive exercises
- Quizzes
- Learning progress tracking
- More Arabic educational content
- Improved mobile experience
- More advanced visualization controls

---

## 👨‍💻 Author

**Mohamed Benzidane**

Junior Web Developer interested in:

- Web Development
- Artificial Intelligence
- Interactive Applications

DSAlgeria was created as an educational project to make learning algorithms more visual, interactive, and accessible.

---

## 📄 License

This project is intended for educational purposes. You are free to use, modify, and distribute the code as long as you give credit to the original author and maintain the educational nature of the project.