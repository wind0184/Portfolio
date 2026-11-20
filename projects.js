"use strict";

window.portfolioProjects = {
  "calculus-lab-escape": {
    title: "Calculus Lab Escape",
    type: "Final-year project · 2026–present",
    tools: ["Unity", "C#", "Firebase Authentication", "Cloud Firestore"],
    summary:
      "An educational puzzle game that turns pre-university calculus into three interactive missions covering limits, differentiation, and integration.",
    role: "Game design and development",
    focus:
      "Connected learning interactions, mission progression, persistence, and reporting within a Unity PC game.",
    heading: "What I built",
    details: [
      "Three calculus missions with different puzzle interactions, including a bridge rescue and a multi-module integration device.",
      "Step-by-step answer validation, immediate feedback, progressive hints, and saved mission progress.",
      "Firebase account login and cloud synchronisation, with local save/resume support.",
      "Learning records and report export to HTML and CSV.",
    ],
    repo: "https://github.com/wind0184/CalculusLabEscape",
    repoLabel: "View source on GitHub",
    images: [
      {
        src: "assets/calculus-world.png",
        label: "World",
        alt: "The forest and bridge environment in Calculus Lab Escape",
        caption:
          "The differentiation mission connects calculus questions to a bridge rescue.",
      },
      {
        src: "assets/calculus-differentiation.jpg",
        label: "Gameplay",
        alt: "A differentiation question with validated answer choices",
        caption: "Answer validation and feedback are tied to mission progress.",
      },
      {
        src: "assets/calculus-hints.jpg",
        label: "Hints",
        alt: "A progressive hint explaining a numerical limit calculation",
        caption: "Progressive hints provide support during a limits question.",
      },
      {
        src: "assets/calculus-integration.jpg",
        label: "Integration",
        alt: "The integration device and a step-by-step antiderivative question",
        caption:
          "The integration mission includes multiple interactive device modules.",
      },
    ],
  },
  "vr-fishing": {
    title: "VR Fishing Game",
    type: "Team project · 2026",
    tools: ["Unity", "C#", "XR Interaction Toolkit"],
    summary:
      "A VR fishing experience that combines casting, reeling, and line tension with visual, audio, and controller vibration feedback.",
    role: "Fishing gameplay",
    focus:
      "My contribution focused on the fishing portion of the team project.",
    heading: "My contribution",
    details: [
      "Developed the casting and reeling mechanics that drive the fishing loop.",
      "Implemented line-tension behaviour and connected fishing interactions to visual and audio feedback.",
      "Used controller vibration to give the player feedback during fishing.",
    ],
    repo: "https://github.com/zwzenre/VirtualRealityAssignment",
    repoLabel: "View team repository",
    credit: "https://kqkhoo1209.github.io/?project=vr-fishing",
    images: [
      {
        src: "assets/vr-beach.png",
        label: "Beach",
        alt: "The team project tropical dock and fishing area",
        caption: "A tropical setting from the shared VR fishing project.",
      },
      {
        src: "assets/vr-sea.png",
        label: "Fishing",
        alt: "Fishing gameplay at sea in the shared VR project",
        caption:
          "The fishing loop combines interaction with visual and controller feedback.",
      },
    ],
  },
  "weather-simulation": {
    title: "Dynamic Weather Simulation",
    type: "Group project · 2026",
    tools: ["Unity", "C#", "Unity Particle System"],
    summary:
      "A real-time city simulation with six weather states and controls for exploring how the environment changes.",
    role: "Team member",
    focus: "The following describes the shared project and its features.",
    heading: "Project features",
    details: [
      "Temperature and humidity influence the probability of transitions between weather states.",
      "Particle effects and environmental changes represent rain, snow, fog, and storms.",
      "Simulation controls expose weather selection and transition timing.",
    ],
    repo: "https://github.com/zwzenre/ComputerGameTechAssignment",
    repoLabel: "View team repository",
    credit: "https://kqkhoo1209.github.io/?project=weather-simulation",
    images: [
      {
        src: "assets/weather-snowy.jpg",
        label: "Snow",
        alt: "Snow covering the buildings and streets of a simulated city",
        caption:
          "Snowfall and accumulation change the appearance of the city scene.",
      },
      {
        src: "assets/weather-rainy.jpg",
        label: "Rain",
        alt: "Rain particles across the city environment",
        caption:
          "Particle effects and lighting convey the rainy weather state.",
      },
    ],
  },
  "interactive-robot": {
    title: "Interactive 3D Robot",
    type: "Group project · 2025",
    tools: ["C++", "OpenGL"],
    summary:
      "An articulated 3D robot with interactive movement, camera, lighting, and texture controls, rendered using C++ and OpenGL.",
    role: "Team member",
    focus: "The following describes the shared project and its features.",
    heading: "Project features",
    details: [
      "Parent-child transformations connect the robot body, limbs, and articulated joints.",
      "Walking and jumping animations demonstrate hierarchical movement.",
      "Keyboard and mouse controls adjust the camera, lighting, and robot appearance.",
    ],
    repo: "https://github.com/KQKhoo1209/GraphicProgramming",
    repoLabel: "View team repository",
    credit: "https://kqkhoo1209.github.io/?project=interactive-robot",
    images: [
      {
        src: "assets/opengl-robot.png",
        label: "Robot",
        alt: "The articulated 3D robot rendered in OpenGL",
        caption:
          "The shared graphics project demonstrates articulated movement and rendering controls.",
      },
    ],
  },
};
