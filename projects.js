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
  "parallel-qoi": {
    title: "Parallel QOI",
    type: "Parallel & distributed computing · Team project",
    tools: ["C++", "OpenMP", "CUDA", "MPI", "Electron", "React"],
    summary:
      "A lossless image encoder that explores parallel and distributed computing through the Quite OK Image format, with a desktop dashboard for conversion and performance comparisons.",
    role: "Team member",
    focus: "The following describes the shared project and its features.",
    heading: "Project features",
    details: [
      "Serial, OpenMP, CUDA, and MPI backends encode RGB and RGBA images into standards-compliant QOI files.",
      "A two-pass approach summarises segment state, propagates entry states, and assembles parallel output in order.",
      "A React and Electron dashboard provides image conversion, decoded previews, and pixel validation.",
      "Backend comparisons show runtime, throughput, and phase breakdowns to explore computation, transfer, and communication costs.",
    ],
    repo: "https://github.com/KJiShou/parallel-qoi",
    repoLabel: "View team repository",
    credit: "https://kjishou.github.io/Portfolio/",
    creditLabel: "Team screenshots · Kong Ji Shou",
    images: [
      {
        src: "assets/parallel-qoi-convert.png",
        label: "Convert",
        alt: "Parallel QOI desktop conversion interface with source and decoded image previews",
        caption:
          "Convert images and validate that decoded pixels match the source.",
      },
      {
        src: "assets/parallel-qoi-compare.png",
        label: "Compare",
        alt: "Parallel QOI backend comparison dashboard",
        caption:
          "Compare serial, shared-memory, GPU, and distributed encoding backends.",
      },
    ],
  },
  "fly-me-to-the-earth": {
    title: "Fly Me 2 The Earth",
    type: "Game programming · Team project",
    tools: ["C++", "DirectX 9", "DirectInput", "FMOD"],
    summary:
      "A C++ spaceflight game where players navigate asteroids and linked portals, built with custom rendering, input, physics, and scene systems.",
    role: "Team member",
    focus: "The following describes the shared project and its features.",
    heading: "Project features",
    details: [
      "Spaceflight gameplay combines asteroid navigation, linked portals, and a countdown.",
      "Direct3D 9 sprite rendering supports textures, transforms, and sprite-sheet animation.",
      "Reusable game objects, physics components, and scene management bring the gameplay systems together.",
      "Keyboard and mouse input, FMOD audio, and pause, resume, and restart controls support the game loop.",
    ],
    repo: "https://github.com/KJiShou/CGP_Assignment",
    repoLabel: "View team repository",
    credit: "https://kjishou.github.io/Portfolio/",
    creditLabel: "Team screenshots · Kong Ji Shou",
    images: [
      {
        src: "assets/fly-me-gameplay.png",
        label: "Spaceflight",
        alt: "Fly Me 2 The Earth spaceflight gameplay with asteroids and portals",
        caption:
          "Navigate a space environment with asteroids and linked portals.",
      },
      {
        src: "assets/fly-me-menu.png",
        label: "Main menu",
        alt: "Fly Me 2 The Earth main menu",
        caption: "The game's main menu introduces its spaceflight setting.",
      },
      {
        src: "assets/fly-me-pause.png",
        label: "Pause",
        alt: "Fly Me 2 The Earth pause menu",
        caption: "Pause controls provide resume and restart options.",
      },
    ],
  },
  "spam-classifier": {
    title: "Spam Message Classifier",
    type: "Artificial intelligence · Team project",
    tools: ["Python", "scikit-learn", "pandas", "Tkinter", "TF-IDF"],
    summary:
      "A desktop machine learning application for exploring spam detection through supervised classifiers and unsupervised clustering.",
    role: "Desktop interface development",
    focus:
      "Built the Tkinter interface for entering messages, choosing algorithms, and presenting model results.",
    heading: "Interface & project features",
    details: [
      "A Tkinter interface accepts a message and lets users choose a model or compare prediction results.",
      "Naive Bayes and SVM classify messages using TF-IDF features, with predictions and model accuracy shown in the interface.",
      "K-Means provides cluster-based predictions; DBSCAN reports dataset-level clusters and noise points.",
      "The shared Python pipeline cleans the message dataset, creates TF-IDF vectors, and trains the classification and clustering models.",
    ],
    repo: "https://github.com/zwzenre/ArtificialIntelligenceAssignment",
    repoLabel: "View team repository",
    images: [],
  },
  "eoe-customer-support": {
    title: "EOE Customer Support",
    type: "Android development · Team project",
    tools: ["Kotlin", "Jetpack Compose", "Firebase", "Room"],
    summary:
      "An Android customer support app that connects customer enquiries with a staff ticket workflow, account management, and FAQ assistance.",
    role: "Team member",
    focus: "The following describes the shared project and its features.",
    heading: "Project features",
    details: [
      "Customer and staff sign-in flows lead to separate support interfaces.",
      "Customers create support tickets with image attachments and view their submitted tickets.",
      "Staff reply to ticket comments, update ticket status, and filter Pending, In Progress, and Resolved tickets.",
      "Jetpack Compose screens connect account, ticket, chat, and FAQ features with Firebase services and local Room persistence.",
    ],
    repo: "https://github.com/hahahahaha598/EOE-Customer-Support",
    repoLabel: "Private GitHub repository",
    repoNote: "Repository access is required to view the source.",
    mediaFormat: "portrait",
    video: {
      src: "assets/eoe-demo.mp4",
      poster: "assets/eoe-home.webp",
      label: "EOE Customer Support customer and staff workflow demonstration",
      caption:
        "A one-minute silent walkthrough of customer tickets, staff replies, status updates, and filters.",
    },
    images: [
      {
        src: "assets/eoe-home.webp",
        label: "Customer home",
        alt: "EOE customer home with shortcuts to create a ticket, view tickets, and get help",
        caption:
          "The customer home brings support actions together in one place.",
      },
      {
        src: "assets/eoe-create-ticket.webp",
        label: "Create ticket",
        alt: "EOE ticket creation form with question type, description, and image attachment fields",
        caption:
          "Customers describe their issue and attach an image when creating a ticket.",
      },
      {
        src: "assets/eoe-my-tickets.webp",
        label: "My tickets",
        alt: "The customer's submitted tickets with Pending, Resolved, and In Progress status labels",
        caption:
          "Customers can check the status of their submitted support requests.",
      },
      {
        src: "assets/eoe-staff-workflow.webp",
        label: "Staff reply",
        alt: "Staff ticket detail with customer and staff comments and an In Progress status control",
        caption:
          "Staff reply to a ticket and update its status within the detail screen.",
      },
      {
        src: "assets/eoe-staff-dashboard.webp",
        label: "Staff dashboard",
        alt: "The staff dashboard with Pending, In Progress, and Resolved ticket shortcuts",
        caption: "The staff dashboard groups support work by ticket status.",
      },
    ],
  },
};
