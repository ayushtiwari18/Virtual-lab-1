// Main JavaScript file for Ocean Simulations

// Object to store all simulation functions
const simulations = {
  oceanAcidification: null,
  waves: null,
  currents: null,
  plasticPollution: null,
  tsunami: null,
  ecosystem: null,
  oilspill: null,
  salinity: null,
};

// Function to load a simulation
function loadSimulation(simName) {
  const container = document.getElementById("simulation-container");
  container.innerHTML = ""; // Clear previous simulation

  if (simulations[simName]) {
    simulations[simName](container);
  } else {
    container.innerHTML = `<p>Simulation "${simName}" not implemented yet.</p>`;
  }
}

// Event listeners for navigation
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("#nav-list a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const simName = e.target.getAttribute("data-sim");
      loadSimulation(simName);
    });
  });

  // Load default simulation
  loadSimulation("oceanAcidification");
});

// Ocean Acidification Simulation
simulations.oceanAcidification = (container) => {
  container.innerHTML = `
    <div class="simulation" id="ocean-acidification-sim">
      <div class="controls">
        <label for="co2-level">CO2 Level: <span id="co2-level-value">400</span> ppm</label>
        <input type="range" id="co2-level" min="300" max="1000" value="400">
        <label for="time-scale">Time Scale: <span id="time-scale-value">1</span>x</label>
        <input type="range" id="time-scale" min="1" max="10" step="1" value="1">
        <button id="add-shellfish">Add Shellfish</button>
        <button id="add-coral">Add Coral</button>
      </div>
      <canvas id="ocean-acidification-canvas"></canvas>
    </div>
  `;

  const co2LevelSlider = document.getElementById("co2-level");
  const co2LevelValue = document.getElementById("co2-level-value");
  const timeScaleSlider = document.getElementById("time-scale");
  const timeScaleValue = document.getElementById("time-scale-value");
  const addShellfishBtn = document.getElementById("add-shellfish");
  const addCoralBtn = document.getElementById("add-coral");
  const canvas = document.getElementById("ocean-acidification-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  let co2Level = 400;
  let timeScale = 1;
  let organisms = [];
  let bubbles = [];

  class Organism {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = 20;
      this.health = 100;
    }

    update(pH) {
      if (pH < 7.8) {
        this.health -= (7.8 - pH) * 0.1 * timeScale;
      }
      this.health = Math.max(0, this.health);
    }

    draw() {
      const alpha = this.health / 100;
      ctx.globalAlpha = alpha;
      if (this.type === "shellfish") {
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "coral") {
        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y + this.size);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  class Bubble {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speed = Math.random() * 2 + 1;
    }

    update() {
      this.y -= this.speed * timeScale;
      if (this.y + this.size < 0) {
        this.y = canvas.height + this.size;
      }
    }

    draw() {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function addOrganism(type) {
    organisms.push(
      new Organism(
        Math.random() * canvas.width,
        Math.random() * (canvas.height / 2) + canvas.height / 2,
        type
      )
    );
  }

  function calculatePH(co2) {
    // Simplified pH calculation based on CO2 levels
    return 8.1 - (co2 - 400) * 0.0007;
  }

  function updateSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water
    const pH = calculatePH(co2Level);
    const blueValue = Math.max(0, Math.min(255, 190 - (co2Level - 400) * 0.2));
    ctx.fillStyle = `rgb(0, 119, ${blueValue})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw organisms
    organisms = organisms.filter((org) => org.health > 0);
    organisms.forEach((org) => {
      org.update(pH);
      org.draw();
    });

    // Update and draw bubbles
    bubbles.forEach((bubble) => {
      bubble.update();
      bubble.draw();
    });

    // Add new bubbles
    if (Math.random() < 0.1 * timeScale) {
      bubbles.push(new Bubble(Math.random() * canvas.width, canvas.height));
    }

    // Display stats
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`pH: ${pH.toFixed(2)}`, 10, 20);
    ctx.fillText(`Organisms: ${organisms.length}`, 10, 40);

    requestAnimationFrame(updateSimulation);
  }

  co2LevelSlider.addEventListener("input", () => {
    co2Level = parseInt(co2LevelSlider.value);
    co2LevelValue.textContent = co2Level;
  });

  timeScaleSlider.addEventListener("input", () => {
    timeScale = parseInt(timeScaleSlider.value);
    timeScaleValue.textContent = timeScale;
  });

  addShellfishBtn.addEventListener("click", () => addOrganism("shellfish"));
  addCoralBtn.addEventListener("click", () => addOrganism("coral"));

  // Initialize simulation
  for (let i = 0; i < 20; i++) {
    bubbles.push(
      new Bubble(Math.random() * canvas.width, Math.random() * canvas.height)
    );
  }

  updateSimulation();
};

// Placeholder functions for other simulations
simulations.waves = (container) => {
  container.innerHTML = "<p>Wave Formation simulation not implemented yet.</p>";
};

simulations.currents = (container) => {
  container.innerHTML = "<p>Ocean Currents simulation not implemented yet.</p>";
};

simulations.pollution = (container) => {
  container.innerHTML =
    "<p>Plastic Pollution simulation not implemented yet.</p>";
};

simulations.tsunami = (container) => {
  container.innerHTML = "<p>Tsunami simulation not implemented yet.</p>";
};

simulations.ecosystem = (container) => {
  container.innerHTML =
    "<p>Marine Ecosystem simulation not implemented yet.</p>";
};

simulations.oilspill = (container) => {
  container.innerHTML =
    "<p>Oil Spill Cleanup simulation not implemented yet.</p>";
};

simulations.salinity = (container) => {
  container.innerHTML =
    "<p>Salinity and Buoyancy simulation not implemented yet.</p>";
};

// Wave Formation Simulation
simulations.waves = (container) => {
  container.innerHTML = `
        <div class="simulation" id="waves-sim">
            <div class="controls">
                <label for="wind-speed">Wind Speed: <span id="wind-speed-value">10</span> m/s</label>
                <input type="range" id="wind-speed" min="0" max="30" value="10">
                <label for="wind-direction">Wind Direction: <span id="wind-direction-value">0</span>°</label>
                <input type="range" id="wind-direction" min="0" max="359" value="0">
            </div>
            <div id="wave-canvas"></div>
        </div>
    `;

  const windSpeedSlider = document.getElementById("wind-speed");
  const windSpeedValue = document.getElementById("wind-speed-value");
  const windDirectionSlider = document.getElementById("wind-direction");
  const windDirectionValue = document.getElementById("wind-direction-value");

  // Three.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  document.getElementById("wave-canvas").appendChild(renderer.domElement);

  // Create ocean plane
  const geometry = new THREE.PlaneGeometry(100, 100, 128, 128);
  const material = new THREE.MeshPhongMaterial({
    color: 0x0077be,
    shininess: 100,
  });
  const ocean = new THREE.Mesh(geometry, material);
  ocean.rotation.x = -Math.PI / 2;
  scene.add(ocean);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  camera.position.set(0, 30, 50);
  camera.lookAt(0, 0, 0);

  // Wave parameters
  let windSpeed = 10;
  let windDirection = 0;
  const waveHeight = 2;
  const waveFrequency = 0.1;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Update wave geometry
    const time = Date.now() * 0.001;
    const positions = ocean.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      // Calculate wave height based on wind speed and direction
      const waveX =
        Math.sin(x * waveFrequency + time + (windDirection * Math.PI) / 180) *
        waveHeight *
        (windSpeed / 30);
      const waveY =
        Math.sin(y * waveFrequency + time) * waveHeight * (windSpeed / 30);

      positions[i + 2] = waveX + waveY;
    }

    ocean.geometry.attributes.position.needsUpdate = true;
    ocean.geometry.computeVertexNormals();

    renderer.render(scene, camera);
  }

  // Start animation
  animate();

  // Event listeners for sliders
  windSpeedSlider.addEventListener("input", () => {
    windSpeed = parseInt(windSpeedSlider.value);
    windSpeedValue.textContent = windSpeed;
  });

  windDirectionSlider.addEventListener("input", () => {
    windDirection = parseInt(windDirectionSlider.value);
    windDirectionValue.textContent = windDirection;
  });
};

// Main JavaScript file for Ocean Simulations

// ... (previous code remains the same)

// Ocean Currents Simulation
simulations.currents = (container) => {
  container.innerHTML = `
        <div class="simulation" id="currents-sim">
            <div class="controls">
                <label for="temperature">Global Temperature: <span id="temperature-value">15</span>°C</label>
                <input type="range" id="temperature" min="0" max="30" value="15">
                <label for="salinity">Global Salinity: <span id="salinity-value">35</span> ppt</label>
                <input type="range" id="salinity" min="30" max="40" value="35">
            </div>
            <div id="currents-canvas"></div>
        </div>
    `;

  const temperatureSlider = document.getElementById("temperature");
  const temperatureValue = document.getElementById("temperature-value");
  const salinitySlider = document.getElementById("salinity");
  const salinityValue = document.getElementById("salinity-value");

  // D3.js setup
  const width = 800;
  const height = 600;
  const projection = d3
    .geoNaturalEarth1()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

  const svg = d3
    .select("#currents-canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const path = d3.geoPath().projection(projection);

  // Load world map data
  d3.json(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  ).then(function (world) {
    // Draw world map
    svg
      .append("g")
      .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#d0d0d0")
      .attr("stroke", "#ffffff");

    // Ocean currents data (simplified)
    const currents = [
      {
        type: "LineString",
        coordinates: [
          [-80, 25],
          [-75, 35],
          [-60, 40],
          [-30, 50],
          [0, 50],
        ],
      }, // Gulf Stream
      {
        type: "LineString",
        coordinates: [
          [140, 35],
          [180, 35],
          [-140, 35],
          [-120, 45],
        ],
      }, // Kuroshio Current
      {
        type: "LineString",
        coordinates: [
          [20, -30],
          [60, -30],
          [100, -30],
          [140, -40],
        ],
      }, // Agulhas Current
      {
        type: "LineString",
        coordinates: [
          [-70, -50],
          [-40, -50],
          [0, -50],
          [40, -40],
        ],
      }, // Antarctic Circumpolar Current
    ];

    // Draw ocean currents
    const currentPaths = svg
      .append("g")
      .selectAll("path")
      .data(currents)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#0077be")
      .attr("stroke-width", 2);

    // Animation function
    function animateCurrents() {
      currentPaths
        .attr("stroke-dasharray", function () {
          const length = this.getTotalLength();
          return length + " " + length;
        })
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(10000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", animateCurrents);
    }

    animateCurrents();

    // Update function
    function updateCurrents(temperature, salinity) {
      const speed = (temperature - 15) / 15 + (salinity - 35) / 5;
      currentPaths
        .transition()
        .duration(1000)
        .attr("stroke-width", 2 + speed * 2)
        .attr("stroke", d3.interpolateRdYlBu(1 - temperature / 30));
    }

    // Event listeners for sliders
    temperatureSlider.addEventListener("input", () => {
      const temp = parseInt(temperatureSlider.value);
      temperatureValue.textContent = temp;
      updateCurrents(temp, parseInt(salinitySlider.value));
    });

    salinitySlider.addEventListener("input", () => {
      const sal = parseInt(salinitySlider.value);
      salinityValue.textContent = sal;
      updateCurrents(parseInt(temperatureSlider.value), sal);
    });
  });
};

// ... (rest of the code remains the same)
// Main JavaScript file for Ocean Simulations

// ... (previous code remains the same)

// Plastic Pollution Impact Simulation
simulations.plasticPollution = (container) => {
  container.innerHTML = `
    <div class="simulation" id="plastic-pollution-sim">
      <div class="controls">
        <label for="pollution-rate">Pollution Rate: <span id="pollution-rate-value">1</span>x</label>
        <input type="range" id="pollution-rate" min="0" max="5" step="0.1" value="1">
        <label for="cleanup-effort">Cleanup Effort: <span id="cleanup-effort-value">0</span>%</label>
        <input type="range" id="cleanup-effort" min="0" max="100" value="0">
        <button id="add-fish">Add Fish</button>
        <button id="add-turtle">Add Turtle</button>
      </div>
      <canvas id="plastic-pollution-canvas"></canvas>
    </div>
  `;

  const pollutionRateSlider = document.getElementById("pollution-rate");
  const pollutionRateValue = document.getElementById("pollution-rate-value");
  const cleanupEffortSlider = document.getElementById("cleanup-effort");
  const cleanupEffortValue = document.getElementById("cleanup-effort-value");
  const addFishBtn = document.getElementById("add-fish");
  const addTurtleBtn = document.getElementById("add-turtle");
  const canvas = document.getElementById("plastic-pollution-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  let pollutionRate = 1;
  let cleanupEffort = 0;
  let plasticParticles = [];
  let animals = [];

  class PlasticParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speed = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.y += this.speed;
      if (this.y > canvas.height) {
        this.y = 0;
      }
    }

    draw() {
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Animal {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = type === "fish" ? 15 : 30;
      this.speed = type === "fish" ? 2 : 1;
      this.direction = Math.random() * Math.PI * 2;
      this.health = 100;
    }

    update() {
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;

      if (this.x < 0 || this.x > canvas.width)
        this.direction = Math.PI - this.direction;
      if (this.y < 0 || this.y > canvas.height)
        this.direction = -this.direction;

      // Check for plastic ingestion
      plasticParticles.forEach((particle, index) => {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + particle.size) {
          this.health -= 5;
          plasticParticles.splice(index, 1);
        }
      });

      this.health = Math.max(0, this.health);
    }

    draw() {
      ctx.fillStyle = this.type === "fish" ? "orange" : "green";
      ctx.beginPath();
      if (this.type === "fish") {
        ctx.moveTo(this.x + this.size, this.y);
        ctx.lineTo(this.x - this.size, this.y - this.size / 2);
        ctx.lineTo(this.x - this.size, this.y + this.size / 2);
      } else {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      }
      ctx.closePath();
      ctx.fill();

      // Health bar
      ctx.fillStyle = `rgb(${255 - this.health * 2.55}, ${
        this.health * 2.55
      }, 0)`;
      ctx.fillRect(
        this.x - this.size,
        this.y - this.size - 10,
        this.size * 2 * (this.health / 100),
        5
      );
    }
  }

  function addAnimal(type) {
    animals.push(
      new Animal(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        type
      )
    );
  }

  function updateSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water
    ctx.fillStyle = "rgba(0, 119, 190, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw plastic particles
    plasticParticles.forEach((particle, index) => {
      particle.update();
      particle.draw();

      // Remove particles based on cleanup effort
      if (Math.random() < cleanupEffort / 10000) {
        plasticParticles.splice(index, 1);
      }
    });

    // Add new plastic particles based on pollution rate
    if (Math.random() < 0.1 * pollutionRate) {
      plasticParticles.push(
        new PlasticParticle(Math.random() * canvas.width, 0)
      );
    }

    // Update and draw animals
    animals = animals.filter((animal) => animal.health > 0);
    animals.forEach((animal) => {
      animal.update();
      animal.draw();
    });

    // Display stats
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Plastic Particles: ${plasticParticles.length}`, 10, 20);
    ctx.fillText(`Animals: ${animals.length}`, 10, 40);

    requestAnimationFrame(updateSimulation);
  }

  pollutionRateSlider.addEventListener("input", () => {
    pollutionRate = parseFloat(pollutionRateSlider.value);
    pollutionRateValue.textContent = pollutionRate.toFixed(1);
  });

  cleanupEffortSlider.addEventListener("input", () => {
    cleanupEffort = parseInt(cleanupEffortSlider.value);
    cleanupEffortValue.textContent = cleanupEffort;
  });

  addFishBtn.addEventListener("click", () => addAnimal("fish"));
  addTurtleBtn.addEventListener("click", () => addAnimal("turtle"));

  // Initialize simulation
  for (let i = 0; i < 50; i++) {
    plasticParticles.push(
      new PlasticParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      )
    );
  }
  for (let i = 0; i < 10; i++) {
    addAnimal(Math.random() < 0.5 ? "fish" : "turtle");
  }

  updateSimulation();
};

// ... (rest of the code remains the same)
// Main JavaScript file for Ocean Simulations

// ... (previous code remains the same)

// Tsunami Simulation
simulations.tsunami = (container) => {
  container.innerHTML = `
        <div class="simulation" id="tsunami-sim">
            <div class="controls">
                <button id="trigger-tsunami">Trigger Tsunami</button>
                <label for="earthquake-magnitude">Earthquake Magnitude: <span id="magnitude-value">7.0</span></label>
                <input type="range" id="earthquake-magnitude" min="5.0" max="9.0" step="0.1" value="7.0">
                <label for="water-depth">Ocean Depth: <span id="depth-value">4000</span> m</label>
                <input type="range" id="water-depth" min="1000" max="8000" step="100" value="4000">
            </div>
            <div id="tsunami-canvas"></div>
        </div>
    `;

  const triggerButton = document.getElementById("trigger-tsunami");
  const magnitudeSlider = document.getElementById("earthquake-magnitude");
  const magnitudeValue = document.getElementById("magnitude-value");
  const depthSlider = document.getElementById("water-depth");
  const depthValue = document.getElementById("depth-value");

  // Three.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  document.getElementById("tsunami-canvas").appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Ocean setup
  const oceanGeometry = new THREE.PlaneGeometry(100, 100, 128, 128);
  const oceanMaterial = new THREE.MeshPhongMaterial({
    color: 0x0077be,
    shininess: 10,
  });
  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
  ocean.rotation.x = -Math.PI / 2;
  scene.add(ocean);

  // Coastline setup
  const coastGeometry = new THREE.PlaneGeometry(100, 20, 128, 32);
  const coastMaterial = new THREE.MeshPhongMaterial({ color: 0xc2b280 });
  const coast = new THREE.Mesh(coastGeometry, coastMaterial);
  coast.position.set(0, 0, -60);
  coast.rotation.x = -Math.PI / 2;
  scene.add(coast);

  // Camera position
  camera.position.set(0, 40, 80);
  camera.lookAt(0, 0, 0);

  // Tsunami parameters
  let tsunamiActive = false;
  let tsunamiTime = 0;
  let tsunamiMagnitude = 7.0;
  let waterDepth = 4000;

  function triggerTsunami() {
    tsunamiActive = true;
    tsunamiTime = 0;
  }

  function updateTsunami() {
    if (!tsunamiActive) return;

    tsunamiTime += 0.016; // Assuming 60 fps

    const positions = ocean.geometry.attributes.position.array;
    const coastPositions = coast.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      // Calculate wave height based on tsunami parameters
      const distance = Math.sqrt(x * x + y * y);
      const speed = Math.sqrt(9.8 * waterDepth); // Wave speed formula
      const wavePhase = distance - speed * tsunamiTime;

      // Tsunami wave formula (simplified)
      const waveHeight =
        Math.exp(-0.0001 * Math.abs(wavePhase)) *
        Math.sin(0.1 * wavePhase) *
        (tsunamiMagnitude - 5) *
        2;

      positions[i + 2] = Math.max(0, waveHeight);

      // Update coastline
      if (i < coastPositions.length) {
        const coastDistance = Math.abs(coastPositions[i] - 50);
        const coastWaveHeight = Math.max(
          0,
          waveHeight * Math.exp(-0.1 * coastDistance)
        );
        coastPositions[i + 2] = coastWaveHeight;
      }
    }

    ocean.geometry.attributes.position.needsUpdate = true;
    ocean.geometry.computeVertexNormals();
    coast.geometry.attributes.position.needsUpdate = true;
    coast.geometry.computeVertexNormals();

    if (tsunamiTime > 100) tsunamiActive = false;
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    updateTsunami();
    renderer.render(scene, camera);
  }

  animate();

  // Event listeners
  triggerButton.addEventListener("click", triggerTsunami);

  magnitudeSlider.addEventListener("input", () => {
    tsunamiMagnitude = parseFloat(magnitudeSlider.value);
    magnitudeValue.textContent = tsunamiMagnitude.toFixed(1);
  });

  depthSlider.addEventListener("input", () => {
    waterDepth = parseInt(depthSlider.value);
    depthValue.textContent = waterDepth;
  });
};

// ... (rest of the code remains the same)
// Enhanced Marine Ecosystem Simulation
simulations.ecosystem = (container) => {
  container.innerHTML = `
    <div class="simulation" id="ecosystem-sim">
      <div class="controls">
        <label for="fishing-rate">Fishing Rate: <span id="fishing-rate-value">1</span>x</label>
        <input type="range" id="fishing-rate" min="0" max="5" step="0.1" value="1">
        <label for="pollution-level">Pollution Level: <span id="pollution-level-value">0</span>%</label>
        <input type="range" id="pollution-level" min="0" max="100" value="0">
        <label for="temperature">Water Temperature: <span id="temperature-value">15</span>°C</label>
        <input type="range" id="temperature" min="0" max="30" value="15">
      </div>
      <canvas id="ecosystem-canvas"></canvas>
    </div>
  `;

  const fishingRateSlider = document.getElementById("fishing-rate");
  const fishingRateValue = document.getElementById("fishing-rate-value");
  const pollutionLevelSlider = document.getElementById("pollution-level");
  const pollutionLevelValue = document.getElementById("pollution-level-value");
  const temperatureSlider = document.getElementById("temperature");
  const temperatureValue = document.getElementById("temperature-value");
  const canvas = document.getElementById("ecosystem-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  class Fish {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 10 + 5;
      this.speed = Math.random() * 2 + 1;
      this.angle = Math.random() * Math.PI * 2;
    }

    move() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      if (this.x < 0 || this.x > canvas.width)
        this.angle = Math.PI - this.angle;
      if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;

      this.angle += (Math.random() - 0.5) * 0.2;
    }

    draw() {
      ctx.fillStyle = "rgba(255, 165, 0, 0.8)";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.size, this.y - this.size / 2);
      ctx.lineTo(this.x - this.size, this.y + this.size / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  class Plankton {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
    }

    move() {
      this.y += Math.random() - 0.5;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let fishes = Array(50)
    .fill()
    .map(() => new Fish());
  let planktons = Array(500)
    .fill()
    .map(() => new Plankton());

  function updateEcosystem() {
    const fishingRate = parseFloat(fishingRateSlider.value);
    const pollutionLevel = parseInt(pollutionLevelSlider.value);
    const temperature = parseInt(temperatureSlider.value);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water
    const waterColor = `rgba(0, ${119 - pollutionLevel}, ${
      190 - pollutionLevel
    }, 1)`;
    ctx.fillStyle = waterColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw plankton
    planktons.forEach((plankton) => {
      plankton.move();
      plankton.draw();
    });

    // Update and draw fish
    fishes.forEach((fish, index) => {
      fish.move();
      fish.draw();

      // Fish eating plankton
      planktons = planktons.filter((plankton) => {
        const dx = fish.x - plankton.x;
        const dy = fish.y - plankton.y;
        return Math.sqrt(dx * dx + dy * dy) > fish.size;
      });

      // Fish reproduction (based on food availability and temperature)
      if (
        Math.random() <
        ((0.001 * planktons.length) / 500) *
          (1 - Math.abs(temperature - 15) / 15)
      ) {
        fishes.push(new Fish());
      }

      // Fish death (based on pollution, temperature, and fishing)
      if (
        Math.random() <
        (0.001 * pollutionLevel) / 100 +
          (0.001 * Math.abs(temperature - 15)) / 15 +
          0.001 * fishingRate
      ) {
        fishes.splice(index, 1);
      }
    });

    // Plankton growth (based on temperature and pollution)
    if (
      Math.random() <
      0.1 * (1 - pollutionLevel / 100) * (1 - Math.abs(temperature - 15) / 15)
    ) {
      planktons.push(new Plankton());
    }

    // Display stats
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Fish: ${fishes.length}`, 10, 20);
    ctx.fillText(`Plankton: ${planktons.length}`, 10, 40);

    requestAnimationFrame(updateEcosystem);
  }

  fishingRateSlider.addEventListener("input", () => {
    fishingRateValue.textContent = parseFloat(fishingRateSlider.value).toFixed(
      1
    );
  });

  pollutionLevelSlider.addEventListener("input", () => {
    pollutionLevelValue.textContent = pollutionLevelSlider.value;
  });

  temperatureSlider.addEventListener("input", () => {
    temperatureValue.textContent = temperatureSlider.value;
  });

  updateEcosystem();
};

// Enhanced Oil Spill Cleanup Simulation
simulations.oilspill = (container) => {
  container.innerHTML = `
    <div class="simulation" id="oilspill-sim">
      <div class="controls">
        <button id="start-spill">Start Oil Spill</button>
        <button id="deploy-skimmer">Deploy Skimmer</button>
        <button id="deploy-boom">Deploy Boom</button>
        <label for="wind-direction">Wind Direction: <span id="wind-direction-value">0</span>°</label>
        <input type="range" id="wind-direction" min="0" max="359" value="0">
        <label for="wind-speed">Wind Speed: <span id="wind-speed-value">0</span> km/h</label>
        <input type="range" id="wind-speed" min="0" max="100" value="0">
      </div>
      <canvas id="oilspill-canvas"></canvas>
    </div>
  `;

  const startSpillBtn = document.getElementById("start-spill");
  const deploySkimmerBtn = document.getElementById("deploy-skimmer");
  const deployBoomBtn = document.getElementById("deploy-boom");
  const windDirectionSlider = document.getElementById("wind-direction");
  const windDirectionValue = document.getElementById("wind-direction-value");
  const windSpeedSlider = document.getElementById("wind-speed");
  const windSpeedValue = document.getElementById("wind-speed-value");
  const canvas = document.getElementById("oilspill-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  let oilParticles = [];
  let skimmers = [];
  let booms = [];
  let isSpillActive = false;
  let windDirection = 0;
  let windSpeed = 0;

  class OilParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 3 + 1;
    }

    move() {
      const windForceX =
        (Math.cos((windDirection * Math.PI) / 180) * windSpeed) / 10;
      const windForceY =
        (Math.sin((windDirection * Math.PI) / 180) * windSpeed) / 10;

      this.vx += windForceX * 0.01;
      this.vy += windForceY * 0.01;

      this.x += this.vx;
      this.y += this.vy;

      // Apply drag force
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function startSpill() {
    isSpillActive = true;
    oilParticles = [];
    for (let i = 0; i < 1000; i++) {
      oilParticles.push(new OilParticle(canvas.width / 2, canvas.height / 2));
    }
  }

  function deploySkimmer() {
    skimmers.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 30,
    });
  }

  function deployBoom() {
    booms.push({
      x1: Math.random() * canvas.width,
      y1: Math.random() * canvas.height,
      x2: Math.random() * canvas.width,
      y2: Math.random() * canvas.height,
    });
  }

  function updateSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water
    ctx.fillStyle = "rgba(0, 119, 190, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw oil particles
    oilParticles.forEach((particle, index) => {
      particle.move();
      particle.draw();

      // Check collision with skimmers
      skimmers.forEach((skimmer) => {
        const dx = particle.x - skimmer.x;
        const dy = particle.y - skimmer.y;
        if (dx * dx + dy * dy < skimmer.radius * skimmer.radius) {
          oilParticles.splice(index, 1);
        }
      });

      // Check collision with booms
      booms.forEach((boom) => {
        const A = { x: boom.x1, y: boom.y1 };
        const B = { x: boom.x2, y: boom.y2 };
        const C = { x: particle.x, y: particle.y };
        const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
        const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);
        const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
        const angle = Math.acos((BC ** 2 + AC ** 2 - AB ** 2) / (2 * BC * AC));
        if (angle > Math.PI / 2) {
          particle.vx *= -1;
          particle.vy *= -1;
        }
      });
    });

    // Draw skimmers
    ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
    skimmers.forEach((skimmer) => {
      ctx.beginPath();
      ctx.arc(skimmer.x, skimmer.y, skimmer.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw booms
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    booms.forEach((boom) => {
      ctx.beginPath();
      ctx.moveTo(boom.x1, boom.y1);
      ctx.lineTo(boom.x2, boom.y2);
      ctx.stroke();
    });

    // Draw wind direction arrow
    ctx.save();
    ctx.translate(canvas.width - 50, 50);
    ctx.rotate((windDirection * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.lineTo(20, 0);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();

    // Display stats
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Oil particles: ${oilParticles.length}`, 10, 20);
    ctx.fillText(`Skimmers: ${skimmers.length}`, 10, 40);
    ctx.fillText(`Booms: ${booms.length}`, 10, 60);

    requestAnimationFrame(updateSimulation);
  }

  startSpillBtn.addEventListener("click", startSpill);
  deploySkimmerBtn.addEventListener("click", deploySkimmer);
  deployBoomBtn.addEventListener("click", deployBoom);

  windDirectionSlider.addEventListener("input", () => {
    windDirection = parseInt(windDirectionSlider.value);
    windDirectionValue.textContent = windDirection;
  });

  windSpeedSlider.addEventListener("input", () => {
    windSpeed = parseInt(windSpeedSlider.value);
    windSpeedValue.textContent = windSpeed;
  });

  updateSimulation();
};

// Enhanced Salinity and Buoyancy Simulation
simulations.salinity = (container) => {
  container.innerHTML = `
    <div class="simulation" id="salinity-sim">
      <div class="controls">
        <label for="salinity">Salinity: <span id="salinity-value">35</span> ppt</label>
        <input type="range" id="salinity" min="0" max="100" value="35">
        <label for="object-density">Object Density: <span id="object-density-value">1000</span> kg/m³</label>
        <input type="range" id="object-density" min="800" max="1200" value="1000">
        <button id="add-object">Add Object</button>
      </div>
      <canvas id="salinity-canvas"></canvas>
    </div>
  `;

  const salinitySlider = document.getElementById("salinity");
  const salinityValue = document.getElementById("salinity-value");
  const objectDensitySlider = document.getElementById("object-density");
  const objectDensityValue = document.getElementById("object-density-value");
  const addObjectBtn = document.getElementById("add-object");
  const canvas = document.getElementById("salinity-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  let objects = [];
  let salinity = 35;
  let objectDensity = 1000;

  class FloatingObject {
    constructor(x, y, density) {
      this.x = x;
      this.y = y;
      this.density = density;
      this.radius = 20;
      this.vy = 0;
    }

    update(waterDensity) {
      const buoyancyForce =
        (waterDensity - this.density) *
        9.81 *
        ((4 / 3) * Math.PI * this.radius ** 3);
      const dragForce = -0.5 * this.vy * Math.abs(this.vy);
      const netForce = buoyancyForce + dragForce;

      this.vy +=
        netForce / ((4 / 3) * Math.PI * this.radius ** 3 * this.density);
      this.y += this.vy;

      if (this.y < this.radius) {
        this.y = this.radius;
        this.vy = 0;
      } else if (this.y > canvas.height - this.radius) {
        this.y = canvas.height - this.radius;
        this.vy = 0;
      }
    }

    draw() {
      ctx.fillStyle =
        this.density < 1000 ? "rgba(255, 0, 0, 0.7)" : "rgba(0, 0, 255, 0.7)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function addObject() {
    objects.push(
      new FloatingObject(
        Math.random() * canvas.width,
        canvas.height / 2,
        objectDensity
      )
    );
  }

  function updateSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water
    const waterColor = `rgba(0, ${119 + salinity}, ${190 + salinity}, 1)`;
    ctx.fillStyle = waterColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate water density based on salinity
    const waterDensity = 1000 + salinity * 0.75;

    // Update and draw objects
    objects.forEach((object) => {
      object.update(waterDensity);
      object.draw();
    });

    // Draw water surface line
    ctx.strokeStyle = "white";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Display stats
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Water Density: ${waterDensity.toFixed(2)} kg/m³`, 10, 20);
    ctx.fillText(`Objects: ${objects.length}`, 10, 40);

    requestAnimationFrame(updateSimulation);
  }

  salinitySlider.addEventListener("input", () => {
    salinity = parseInt(salinitySlider.value);
    salinityValue.textContent = salinity;
  });

  objectDensitySlider.addEventListener("input", () => {
    objectDensity = parseInt(objectDensitySlider.value);
    objectDensityValue.textContent = objectDensity;
  });

  addObjectBtn.addEventListener("click", addObject);

  updateSimulation();
};
