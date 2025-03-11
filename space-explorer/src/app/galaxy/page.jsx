"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SolarSystem = () => {
  const mountRef = useRef(null);
  const [modalInfo, setModalInfo] = useState(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Audio setup for galaxy background sound
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const galaxySound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load("./sounds/galaxy-ambient.mp3", function (buffer) {
      galaxySound.setBuffer(buffer);
      galaxySound.setLoop(true);
      galaxySound.setVolume(1);
      galaxySound.play();
    });

    const canvas = document.querySelector("canvas");

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 100;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 300);
    scene.add(pointLight);

    // Planet data: [radius, distance from sun, rotation speed]
    const planetsData = [
      [3.2, 84, 0.004], // Mercury (3x distance)
      [5.8, 132, 0.003], // Venus (3x distance)
      [6, 186, 0.002], // Earth (3x distance)
      [4, 234, 0.0018], // Mars (3x distance)
      [12, 300, 0.001], // Jupiter (3x distance)
      [10, 414, 0.0008], // Saturn (3x distance)
      [7, 528, 0.0004], // Uranus (3x distance)
      [7, 600, 0.0001], // Neptune (3x distance)
    ];

    // Texture loading setup
    const textureLoader = new THREE.TextureLoader();
    textureLoader.onError = function (err) {
      console.error("An error occurred loading the texture:", err);
    };

    // Load all textures
    const allTexturePromises = [
      "galaxy",
      "sun",
      "mercury",
      "venus",
      "earth",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
    ].map((name) => {
      return new Promise((resolve) => {
        textureLoader.load(
          `./planetTexture/${name}.jpg`,
          (texture) => resolve({ name, texture }),
          undefined,
          (error) => {
            console.error(`Error loading ${name} texture:`, error);
            resolve({ name, texture: null });
          }
        );
      });
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Optional: Add orbit controls if you want to interact with the scene
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create orbit lines for planets
    planetsData.forEach(([_, distance]) => {
      const orbitGeometry = new THREE.RingGeometry(
        distance,
        distance + 0.2,
        128
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2; // Rotate to lay flat on the XZ plane
      scene.add(orbit);
    });

    // Create text labels for celestial bodies
    const createLabel = (text, size = 10) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 800;
      canvas.height = 300; // Increased height to accommodate larger text

      // Set text style with larger font
      context.font = "bold 140px Arial"; // Reduced font size slightly
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle"; // Center text vertically
      context.fillText(text, 256, 128); // Adjusted y-position to center of canvas

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(size, size / 2, 1); // Adjusted height ratio to match new canvas dimensions
      return sprite;
    };

    // Create labels for each planet
    const planetLabels = [
      { name: "Sun", distance: 0, yOffset: 105 }, // 3x yOffset
      { name: "Mercury", distance: 84, yOffset: 6 },
      { name: "Venus", distance: 132, yOffset: 8 },
      { name: "Earth", distance: 186, yOffset: 8 },
      { name: "Mars", distance: 234, yOffset: 6 },
      { name: "Jupiter", distance: 300, yOffset: 15 },
      { name: "Saturn", distance: 414, yOffset: 13 },
      { name: "Uranus", distance: 528, yOffset: 10 },
      { name: "Neptune", distance: 600, yOffset: 10 },
    ].map(({ name, distance, yOffset }) => {
      const label = createLabel(name);
      label.position.set(distance, yOffset, 0);
      scene.add(label);
      return label;
    });

    // Add planet information data with more details
    const planetInfo = {
      mercury: {
        name: "Mercury",
        description:
          "The smallest and innermost planet in the Solar System. It has no atmosphere to retain heat, causing extreme temperature variations. Mercury has a heavily cratered surface similar to our Moon due to impacts from comets and asteroids.",
        diameter: "4,879 km",
        dayLength: "58.6 Earth days",
        yearLength: "88 Earth days",
        gravity: "3.7 m/s²",
        temperature: "-173°C to 427°C",
        distanceFromSun: "57.9 million km",
        orbitalSpeed: "47.4 km/s",
        moons: "0",
        composition: "Rocky planet with a large iron core (60% of its mass)",
        atmosphere:
          "Extremely thin, composed mainly of oxygen, sodium, hydrogen, helium and potassium",
        notableFacts: [
          "Mercury has the most eccentric orbit of all planets in the Solar System",
          "Despite being closest to the Sun, Venus is hotter due to Mercury's lack of atmosphere",
          "Mercury's surface resembles our Moon with numerous impact craters",
          "A day on Mercury (sunrise to sunrise) lasts 176 Earth days",
        ],
      },
      venus: {
        name: "Venus",
        description:
          "The second planet from the Sun and Earth's closest planetary neighbor. It has a thick atmosphere that traps heat, making it the hottest planet in our solar system despite being farther from the Sun than Mercury.",
        diameter: "12,104 km",
        dayLength: "243 Earth days (retrograde rotation)",
        yearLength: "225 Earth days",
        gravity: "8.87 m/s²",
        temperature: "462°C (average)",
        distanceFromSun: "108.2 million km",
        orbitalSpeed: "35 km/s",
        moons: "0",
        composition:
          "Rocky planet with a similar size and composition to Earth",
        atmosphere:
          "Extremely dense, composed of 96% carbon dioxide, creating a runaway greenhouse effect",
        notableFacts: [
          "Venus rotates backwards compared to other planets",
          "The atmospheric pressure on Venus is 92 times that of Earth",
          "Venus has more volcanoes than any other planet in our solar system",
          "A day on Venus is longer than its year",
        ],
      },
      earth: {
        name: "Earth",
        description:
          "Our home planet and the only known celestial body to harbor life. It has liquid water, an oxygen-rich atmosphere, and a protective magnetic field. Earth's surface is 71% covered by water, with the remaining 29% consisting of continents and islands.",
        diameter: "12,742 km",
        dayLength: "24 hours",
        yearLength: "365.25 days",
        gravity: "9.8 m/s²",
        temperature: "-88°C to 58°C",
        distanceFromSun: "149.6 million km (1 AU)",
        orbitalSpeed: "29.8 km/s",
        moons: "1 (Luna)",
        composition:
          "Rocky planet with an iron-nickel core, silicate mantle, and thin crust",
        atmosphere:
          "78% nitrogen, 21% oxygen, 1% argon, carbon dioxide, and other gases",
        notableFacts: [
          "Earth is the only planet not named after a god or goddess",
          "Our planet's magnetic field protects us from harmful solar radiation",
          "Earth's axial tilt of 23.5° causes our seasons",
          "The highest point on Earth is Mount Everest (8,848.86 meters above sea level)",
          "The deepest point is the Challenger Deep in the Mariana Trench (10,994 meters below sea level)",
        ],
      },
      mars: {
        name: "Mars",
        description:
          "The fourth planet from the Sun, often called the 'Red Planet' due to its reddish appearance caused by iron oxide (rust) on its surface. It has polar ice caps and evidence of ancient rivers and lakes, suggesting it once had liquid water on its surface.",
        diameter: "6,779 km",
        dayLength: "24.6 hours",
        yearLength: "687 Earth days",
        gravity: "3.72 m/s²",
        temperature: "-153°C to 20°C",
        distanceFromSun: "227.9 million km",
        orbitalSpeed: "24.1 km/s",
        moons: "2 (Phobos and Deimos)",
        composition: "Rocky planet with a core of iron, nickel, and sulfur",
        atmosphere:
          "Thin, composed of 95% carbon dioxide, 2.7% nitrogen, 1.6% argon",
        notableFacts: [
          "Mars has the largest volcano in the solar system, Olympus Mons (25 km high)",
          "It has the longest canyon, Valles Marineris (4,000 km long)",
          "Dust storms on Mars can cover the entire planet and last for months",
          "Evidence suggests Mars once had flowing water and may have been habitable",
          "More than 40 missions have been sent to Mars, with several rovers exploring its surface",
        ],
      },
      jupiter: {
        name: "Jupiter",
        description:
          "The largest planet in our Solar System, with a mass two and a half times that of all other planets combined. It's a gas giant primarily composed of hydrogen and helium with a strong magnetic field and many moons. Its most distinctive feature is the Great Red Spot, a giant storm that has been raging for at least 400 years.",
        diameter: "139,820 km (11 times Earth's diameter)",
        dayLength: "9.93 hours",
        yearLength: "11.86 Earth years",
        gravity: "24.79 m/s²",
        temperature: "-145°C (cloud tops)",
        distanceFromSun: "778.5 million km",
        orbitalSpeed: "13.1 km/s",
        moons:
          "79 confirmed moons, including the four large Galilean moons: Io, Europa, Ganymede, and Callisto",
        composition:
          "Gas giant composed mainly of hydrogen and helium, with a possible rocky core",
        atmosphere:
          "Thick atmosphere of hydrogen, helium, methane, ammonia, and water vapor",
        notableFacts: [
          "Jupiter's Great Red Spot is a storm larger than Earth that has existed for centuries",
          "Jupiter's magnetic field is 14 times stronger than Earth's",
          "It emits more heat than it receives from the Sun",
          "Jupiter acts as a 'cosmic vacuum cleaner,' protecting inner planets by attracting asteroids and comets",
          "The Galilean moon Europa may have a subsurface ocean that could potentially harbor life",
        ],
      },
      saturn: {
        name: "Saturn",
        description:
          "Known for its spectacular ring system, Saturn is a gas giant and the second-largest planet in our Solar System. Its rings are made mostly of ice particles with some rocky debris and dust. Despite its large size, Saturn is the least dense planet in our solar system—it would float in water if there were an ocean large enough.",
        diameter: "116,460 km",
        dayLength: "10.7 hours",
        yearLength: "29.46 Earth years",
        gravity: "10.44 m/s²",
        temperature: "-178°C (cloud tops)",
        distanceFromSun: "1.4 billion km",
        orbitalSpeed: "9.7 km/s",
        moons:
          "82 confirmed moons, including Titan, the second-largest moon in the solar system",
        composition:
          "Gas giant composed mainly of hydrogen and helium, with a small rocky core",
        atmosphere:
          "Primarily hydrogen and helium with traces of ammonia, methane, and water vapor",
        notableFacts: [
          "Saturn's rings extend up to 282,000 km from the planet but are only about 10 meters thick",
          "Its moon Titan has a thick atmosphere and liquid methane lakes on its surface",
          "Saturn has a hexagonal cloud pattern at its north pole",
          "The Cassini spacecraft discovered geysers of water erupting from the moon Enceladus",
          "Saturn's density is so low that it would float in a giant bathtub of water",
        ],
      },
      uranus: {
        name: "Uranus",
        description:
          "The seventh planet from the Sun and the first discovered with a telescope. It's an ice giant composed primarily of hydrogen, helium, and methane. Uranus rotates on its side, giving it extreme seasons that last for decades. Its blue-green color comes from methane in its atmosphere, which absorbs red light and reflects blue light.",
        diameter: "50,724 km",
        dayLength: "17.24 hours",
        yearLength: "84 Earth years",
        gravity: "8.87 m/s²",
        temperature: "-224°C (average)",
        distanceFromSun: "2.9 billion km",
        orbitalSpeed: "6.8 km/s",
        moons:
          "27 known moons, all named after characters from Shakespeare and Pope",
        composition:
          "Ice giant with a mantle of water, ammonia, and methane ices surrounding a rocky core",
        atmosphere:
          "Hydrogen, helium, and methane, with methane giving it its blue-green color",
        notableFacts: [
          "Uranus rotates on its side with an axial tilt of 98 degrees",
          "It was the first planet discovered in modern times (1781) using a telescope",
          "Uranus has 13 faint rings",
          "It has only been visited by one spacecraft, Voyager 2, in 1986",
          "The planet experiences extreme seasonal changes due to its unusual tilt",
        ],
      },
      neptune: {
        name: "Neptune",
        description:
          "The eighth and farthest known planet from the Sun. It's an ice giant with the strongest winds in the Solar System, reaching speeds of 2,100 km/h. Neptune's deep blue color comes from methane in its atmosphere. It was the first planet located through mathematical predictions rather than direct observation.",
        diameter: "49,244 km",
        dayLength: "16.11 hours",
        yearLength: "165 Earth years",
        gravity: "11.15 m/s²",
        temperature: "-214°C (average)",
        distanceFromSun: "4.5 billion km",
        orbitalSpeed: "5.4 km/s",
        moons: "14 known moons, with Triton being the largest",
        composition:
          "Ice giant with a mantle of water, ammonia, and methane ices surrounding a rocky core",
        atmosphere:
          "Hydrogen, helium, and methane, with methane giving it its blue color",
        notableFacts: [
          "Neptune has the strongest winds in the solar system, reaching 2,100 km/h",
          "It was discovered through mathematical predictions based on Uranus's orbit",
          "Its moon Triton orbits in the opposite direction of Neptune's rotation",
          "Neptune has a Great Dark Spot, a storm system similar to Jupiter's Great Red Spot",
          "It has only been visited once by spacecraft (Voyager 2 in 1989)",
        ],
      },
      sun: {
        name: "Sun",
        description:
          "The star at the center of our Solar System. It's a nearly perfect sphere of hot plasma that provides the energy that sustains life on Earth. The Sun contains 99.86% of the mass in the Solar System and is powered by nuclear fusion, converting hydrogen into helium in its core.",
        diameter: "1,392,700 km (109 times Earth's diameter)",
        age: "4.6 billion years (middle-aged for a star)",
        type: "G-type main-sequence star (yellow dwarf)",
        temperature: "5,500°C (surface), 15,000,000°C (core)",
        mass: "333,000 times Earth's mass",
        composition: "73% hydrogen, 25% helium, 2% heavier elements",
        distanceFromEarth: "149.6 million km (1 AU)",
        rotationPeriod: "25-35 days (varies by latitude due to being gaseous)",
        magneticField:
          "Complex and powerful, reversing polarity approximately every 11 years",
        notableFacts: [
          "The Sun produces energy through nuclear fusion, converting 600 million tons of hydrogen into helium every second",
          "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth",
          "The Sun's core temperature is hot enough to convert matter into plasma",
          "Solar flares and coronal mass ejections can disrupt Earth's communications and power systems",
          "The Sun will eventually expand into a red giant in about 5 billion years, engulfing Mercury and Venus",
        ],
      },
    };

    // Declare sun variable at the top level of useEffect
    let sun;
    let planets = [];

    // Initialize scene after textures are loaded
    Promise.all(allTexturePromises).then((loadedTextures) => {
      // Set up video background with more debugging
      const video = document.createElement("video");
      console.log("Creating video element");

      // Add crossOrigin attribute
      video.crossOrigin = "anonymous";
      video.src = "/galaxy/galaxy.mp4";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      // Add more detailed event listeners for debugging
      video.addEventListener("loadstart", () =>
        console.log("Video load started")
      );
      video.addEventListener("loadedmetadata", () =>
        console.log("Video metadata loaded")
      );
      video.addEventListener("loadeddata", () => {
        console.log("Video data loaded");
        // Force video to play and log success/failure
        video
          .play()
          .then(() => console.log("Video playing successfully"))
          .catch((error) => console.error("Error playing video:", error));
      });

      video.addEventListener("error", (e) => {
        console.error("Video error:", {
          error: e,
          networkState: video.networkState,
          readyState: video.readyState,
        });
      });

      // Create video texture after ensuring video is loaded
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      // Set encoding and color space
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      videoTexture.colorSpace = THREE.SRGBColorSpace;

      // Ensure texture is updated
      videoTexture.needsUpdate = true;

      scene.background = videoTexture;

      // Create sun with glow
      const sunTexture = loadedTextures.find((t) => t.name === "sun")?.texture;
      const sunGeometry = new THREE.SphereGeometry(45, 32, 32);

      // Create the main sun
      const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture || null,
        color: sunTexture ? undefined : 0xffff00,
      });
      sun = new THREE.Mesh(sunGeometry, sunMaterial);

      // Create multiple layers of glow with different sizes and intensities
      const createGlowLayer = (radius, intensity, color) => {
        const glowGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
          uniforms: {
            viewVector: { value: camera.position },
            glowColor: { value: new THREE.Color(color) },
            glowIntensity: { value: intensity },
          },
          vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
              vec3 vNormal = normalize(normalMatrix * normal);
              vec3 vNormalized = normalize(viewVector);
              intensity = pow(1.0 - abs(dot(vNormal, vNormalized)), 3.0);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 glowColor;
            uniform float glowIntensity;
            varying float intensity;
            void main() {
              gl_FragColor = vec4(glowColor, intensity * glowIntensity);
            }
          `,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        return new THREE.Mesh(glowGeometry, glowMaterial);
      };

      // Add multiple glow layers
      const glowLayers = [
        { radius: 47, intensity: 0.5, color: 0xffdd99 }, // Inner glow
        { radius: 50, intensity: 0.3, color: 0xff9933 }, // Middle glow
        { radius: 55, intensity: 0.1, color: 0xff5500 }, // Outer glow
      ].map((layer) => {
        const glow = createGlowLayer(
          layer.radius,
          layer.intensity,
          layer.color
        );
        sun.add(glow);
        return glow;
      });

      // Add lights
      const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
      sun.add(sunLight);

      const sunAmbientLight = new THREE.PointLight(0xffffcc, 0.5, 2000);
      sun.add(sunAmbientLight);

      scene.add(sun);

      // Create planets
      planets = planetsData.map(([radius, distance, speed], index) => {
        const planetName = [
          "mercury",
          "venus",
          "earth",
          "mars",
          "jupiter",
          "saturn",
          "uranus",
          "neptune",
        ][index];
        const planetTexture = loadedTextures.find(
          (t) => t.name === planetName
        )?.texture;

        const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const planetMaterial = new THREE.MeshPhongMaterial({
          map: planetTexture || null,
          color: planetTexture
            ? undefined
            : new THREE.Color(Math.random(), Math.random(), Math.random()), // Fallback color
          shininess: 25,
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);

        // Create orbit
        const orbit = new THREE.Object3D();
        orbit.add(planet);
        planet.position.x = distance;
        scene.add(orbit);
        const calculateLightIntensity = (distance) => {
          const maxDistance = 600; // Updated to Neptune's new distance
          return Math.max(0.1, 1 - (distance / maxDistance) * 0.8);
        };

        // Add directional light from the sun to each planet
        const planetLight = new THREE.DirectionalLight(
          0xffffff,
          calculateLightIntensity(distance)
        );
        planetLight.position.set(-distance, 0, 0); // Position light opposite to planet's position relative to sun
        planetLight.target = planet; // Point light at the planet
        orbit.add(planetLight); // Add light to orbit so it moves with planet

        // Create and add label for this planet
        const label = createLabel(
          planetName.charAt(0).toUpperCase() + planetName.slice(1)
        );
        label.position.y = radius + 2; // Position label above the planet
        planet.add(label); // Attach label to planet so it moves with it

        // Make planets interactive
        planet.userData = { isSelectable: true, index };

        return { planet, orbit, rotationSpeed: speed };
      });

      // Animation function
      function animate() {
        requestAnimationFrame(animate);

        // Rotate planets and their orbits
        planets.forEach(({ planet, orbit, rotationSpeed }) => {
          planet.rotation.y += 0.02;
          orbit.rotation.y += rotationSpeed;

          // Update label rotation to always face camera
          const label = planet.children.find(
            (child) => child instanceof THREE.Sprite
          );
          if (label) {
            label.quaternion.copy(camera.quaternion);
          }
        });

        // Sun's rotation
        sun.rotation.y += 0.004;
        controls.update();

        // Update all glow layers
        glowLayers.forEach((glow) => {
          glow.material.uniforms.viewVector.value =
            new THREE.Vector3().subVectors(
              camera.position,
              glow.getWorldPosition(new THREE.Vector3())
            );
        });

        renderer.render(scene, camera);
      }

      // Start animation
      animate();
    });

    // Add raycaster for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Add click event listener
    const handleClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Find all objects intersecting with the ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Check if we hit a planet
      if (intersects.length > 0) {
        // Find the first intersected object that is a planet
        for (let i = 0; i < intersects.length; i++) {
          const object = intersects[i].object;

          // Check if this is the sun and sun is defined
          if (sun && object === sun) {
            setModalInfo(planetInfo.sun);
            break;
          }

          // Check if this is a planet and planets array is populated
          if (planets.length > 0) {
            for (let j = 0; j < planets.length; j++) {
              if (object === planets[j].planet) {
                const planetName = [
                  "mercury",
                  "venus",
                  "earth",
                  "mars",
                  "jupiter",
                  "saturn",
                  "uranus",
                  "neptune",
                ][j];
                setModalInfo(planetInfo[planetName]);
                break;
              }
            }
          }
        }
      }
    };

    window.addEventListener("click", handleClick);

    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", null);
      window.removeEventListener("click", handleClick);
      if (galaxySound.isPlaying) {
        galaxySound.stop();
      }
    };
  }, [setModalInfo]);

  // Function to close the modal
  const closeModal = () => {
    setModalInfo(null);
  };

  return (
    <>
      <canvas ref={mountRef}></canvas>

      {/* Wrap the modal with AnimatePresence */}
      <AnimatePresence>
        {modalInfo && (
          <div className="planet-modal">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="planet-modal-content"
            >
              <span className="close-button" onClick={closeModal}>
                &times;
              </span>
              <h2>{modalInfo.name}</h2>
              <p className="description">{modalInfo.description}</p>

              <div className="planet-stats">
                {modalInfo.diameter && (
                  <div className="stat-item">
                    <span className="stat-label">Diameter:</span>
                    <span className="stat-value">{modalInfo.diameter}</span>
                  </div>
                )}
                {modalInfo.dayLength && (
                  <div className="stat-item">
                    <span className="stat-label">Day Length:</span>
                    <span className="stat-value">{modalInfo.dayLength}</span>
                  </div>
                )}
                {modalInfo.yearLength && (
                  <div className="stat-item">
                    <span className="stat-label">Year Length:</span>
                    <span className="stat-value">{modalInfo.yearLength}</span>
                  </div>
                )}
                {modalInfo.gravity && (
                  <div className="stat-item">
                    <span className="stat-label">Gravity:</span>
                    <span className="stat-value">{modalInfo.gravity}</span>
                  </div>
                )}
                {modalInfo.temperature && (
                  <div className="stat-item">
                    <span className="stat-label">Temperature:</span>
                    <span className="stat-value">{modalInfo.temperature}</span>
                  </div>
                )}
                {modalInfo.distanceFromSun && (
                  <div className="stat-item">
                    <span className="stat-label">Distance from Sun:</span>
                    <span className="stat-value">
                      {modalInfo.distanceFromSun}
                    </span>
                  </div>
                )}
                {modalInfo.orbitalSpeed && (
                  <div className="stat-item">
                    <span className="stat-label">Orbital Speed:</span>
                    <span className="stat-value">{modalInfo.orbitalSpeed}</span>
                  </div>
                )}
                {modalInfo.moons && (
                  <div className="stat-item">
                    <span className="stat-label">Moons:</span>
                    <span className="stat-value">{modalInfo.moons}</span>
                  </div>
                )}
                {modalInfo.composition && (
                  <div className="stat-item">
                    <span className="stat-label">Composition:</span>
                    <span className="stat-value">{modalInfo.composition}</span>
                  </div>
                )}
                {modalInfo.atmosphere && (
                  <div className="stat-item">
                    <span className="stat-label">Atmosphere:</span>
                    <span className="stat-value">{modalInfo.atmosphere}</span>
                  </div>
                )}
                {modalInfo.age && (
                  <div className="stat-item">
                    <span className="stat-label">Age:</span>
                    <span className="stat-value">{modalInfo.age}</span>
                  </div>
                )}
                {modalInfo.type && (
                  <div className="stat-item">
                    <span className="stat-label">Type:</span>
                    <span className="stat-value">{modalInfo.type}</span>
                  </div>
                )}
                {modalInfo.mass && (
                  <div className="stat-item">
                    <span className="stat-label">Mass:</span>
                    <span className="stat-value">{modalInfo.mass}</span>
                  </div>
                )}
                {modalInfo.distanceFromEarth && (
                  <div className="stat-item">
                    <span className="stat-label">Distance from Earth:</span>
                    <span className="stat-value">
                      {modalInfo.distanceFromEarth}
                    </span>
                  </div>
                )}
                {modalInfo.rotationPeriod && (
                  <div className="stat-item">
                    <span className="stat-label">Rotation Period:</span>
                    <span className="stat-value">
                      {modalInfo.rotationPeriod}
                    </span>
                  </div>
                )}
                {modalInfo.magneticField && (
                  <div className="stat-item">
                    <span className="stat-label">Magnetic Field:</span>
                    <span className="stat-value">
                      {modalInfo.magneticField}
                    </span>
                  </div>
                )}
              </div>

              {modalInfo.notableFacts && (
                <div className="notable-facts">
                  <h3>Notable Facts</h3>
                  <ul>
                    {modalInfo.notableFacts.map((fact, index) => (
                      <li key={index}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SolarSystem;
