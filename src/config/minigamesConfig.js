export const MINIGAMES_CONFIG = {
  flappy: {
    title: "Flappy Bird",
    aspectRatio: "16/9",
    buildName: "flappy",
    fields: [
      { path: "config.gravity", label: "Gravedad del Pájaro", type: "number", step: 0.1 },
      { path: "config.speed", label: "Velocidad de Obstáculos", type: "number", step: 0.5 },
      { path: "config.pointsPerObstacle", label: "Puntos por Obstáculo", type: "number", step: 1 }
    ]
  },
  memory: {
    title: "Juego de Memoria",
    aspectRatio: "16/9",
    buildName: "memory",
    fields: [
      { path: "config.time3Stars", label: "Tiempo para 3 Estrellas (Máx Segundos)", type: "number", step: 5 },
      { path: "config.time2Stars", label: "Tiempo para 2 Estrellas (Máx Segundos)", type: "number", step: 5 },
      { path: "config.points3Stars", label: "Puntos por 3 Estrellas", type: "number", step: 5 },
      { path: "config.points2Stars", label: "Puntos por 2 Estrellas", type: "number", step: 5 },
      { path: "config.points1Star", label: "Puntos por 1 Estrella", type: "number", step: 5 }
    ]
  },
  ruleta: {
    title: "Ruleta de la Fortuna",
    aspectRatio: "1/1",
    buildName: "ruleta",
    fields: [
      { path: "config.section0.points", label: "Sec 0: Puntos", type: "number", step: 10 },
      { path: "config.section0.discountPct", label: "Sec 0: % Descuento", type: "number", step: 5 },

      { path: "config.section1.points", label: "Sec 1: Puntos", type: "number", step: 10 },
      { path: "config.section1.discountPct", label: "Sec 1: % Descuento", type: "number", step: 5 },

      { path: "config.section2.points", label: "Sec 2: Puntos", type: "number", step: 10 },
      { path: "config.section2.discountPct", label: "Sec 2: % Descuento", type: "number", step: 5 },

      { path: "config.section3.points", label: "Sec 3: Puntos", type: "number", step: 10 },
      { path: "config.section3.discountPct", label: "Sec 3: % Descuento", type: "number", step: 5 },

      { path: "config.section4.points", label: "Sec 4: Puntos", type: "number", step: 10 },
      { path: "config.section4.discountPct", label: "Sec 4: % Descuento", type: "number", step: 5 },

      { path: "config.section5.points", label: "Sec 5: Puntos", type: "number", step: 10 },
      { path: "config.section5.discountPct", label: "Sec 5: % Descuento", type: "number", step: 5 },

      { path: "config.section6.points", label: "Sec 6: Puntos", type: "number", step: 10 },
      { path: "config.section6.discountPct", label: "Sec 6: % Descuento", type: "number", step: 5 },

      { path: "config.section7.points", label: "Sec 7: Puntos", type: "number", step: 10 },
      { path: "config.section7.discountPct", label: "Sec 7: % Descuento", type: "number", step: 5 }
    ]
  },
  ruleta_menu: {
    title: "Lobby de Ruleta",
    aspectRatio: "16/9",
    buildName: "ruleta_menu",
    fields: []
  },
  scratch: {
    title: "Rasca y Gana",
    aspectRatio: "16/9",
    buildName: "scratch",
    fields: [
      { path: "prizes", label: "Configuración de Premios (Puntos)", type: "weight-list" }
    ]
  },
  simon: {
    title: "Simón Dice",
    aspectRatio: "1/1",
    buildName: "simon",
    fields: [
      { path: "config.pointsPerLevel", label: "Puntos por Nivel", type: "number", step: 1 },
      { path: "config.sequenceSpeed", label: "Velocidad de Secuencia (Segundos)", type: "number", step: 0.1 }
    ]
  },
  simon_menu: {
    title: "Lobby de Simón",
    aspectRatio: "16/9",
    buildName: "simon_menu",
    fields: []
  }
};