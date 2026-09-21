let map = null;
let landUseLayer = null;
let climateLayer = null;

// LOGIN SYSTEM
function handleLogin(e) {
    e.preventDefault();
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    setTimeout(() => {
        initMap();
        initChart();
    }, 200);
}

function handleLogout() {
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

// SIDEBAR TAB SWITCHING
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = "nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-earth-200 hover:bg-earth-800/60 hover:text-white font-medium text-sm transition";
    });

    document.getElementById(`tab-${tabName}`).classList.remove('hidden');

    const activeBtn = document.getElementById(`nav-${tabName}`);
    activeBtn.className = "nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-earth-800 text-sand-200 font-semibold text-sm transition";

    if(tabName === 'gisDashboard') {
        setTimeout(() => {
            if(map) map.invalidateSize();
        }, 200);
    }
}

// INITIALIZE MAP
function initMap() {
    if (map !== null) return;

    map = L.map('map', { zoomControl: false }).setView([10.7905, 78.7047], 7);
    
    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap | Bhumi Nexus'
    }).addTo(map);

    setupMapLayers();

    setTimeout(() => { map.invalidateSize(); }, 300);
}

// MAP LAYERS & POLYGONS
function setupMapLayers() {
    const landUseData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": { "name": "Cauvery Delta Agricultural Zone" },
                "geometry": { "type": "Polygon", "coordinates": [[[78.8, 10.5], [79.8, 10.6], [79.7, 11.2], [78.9, 10.9], [78.8, 10.5]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Western Ghats Forest Reserve" },
                "geometry": { "type": "Polygon", "coordinates": [[[76.8, 10.0], [77.3, 10.2], [77.1, 11.5], [76.5, 11.0], [76.8, 10.0]]] }
            }
        ]
    };

    landUseLayer = L.geoJSON(landUseData, {
        style: { color: '#1b4332', fillColor: '#2d6a4f', fillOpacity: 0.5, weight: 2 },
        onEachFeature: (f, l) => l.bindPopup(`<b>${f.properties.name}</b>`)
    }).addTo(map);

    const climateData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": { "name": "High Climate Risk Area" },
                "geometry": { "type": "Polygon", "coordinates": [[[77.8, 9.2], [78.5, 9.3], [78.3, 9.9], [77.6, 9.7], [77.8, 9.2]]] }
            }
        ]
    };

    climateLayer = L.geoJSON(climateData, {
        style: { color: '#c96e4b', fillColor: '#d4a373', fillOpacity: 0.6, weight: 2 },
        onEachFeature: (f, l) => l.bindPopup(`<b style="color: #c96e4b;">${f.properties.name}</b>`)
    });
}

// TOGGLE LAYER
function toggleLayer(type) {
    if(!map) return;

    document.getElementById('layerLandUse').className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-sand-100 text-earth-800 border border-transparent";
    document.getElementById('layerClimate').className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-sand-100 text-earth-800 border border-transparent";

    if (map.hasLayer(landUseLayer)) map.removeLayer(landUseLayer);
    if (map.hasLayer(climateLayer)) map.removeLayer(climateLayer);

    if (type === 'landuse') {
        map.addLayer(landUseLayer);
        document.getElementById('layerLandUse').className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-earth-50 text-earth-700 border border-earth-500/30";
    } else if (type === 'climate') {
        map.addLayer(climateLayer);
        document.getElementById('layerClimate').className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-sand-200 text-earth-900 border border-sand-500/30";
    }
}

// CHART.JS
function initChart() {
    const ctx = document.getElementById('landChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Agriculture', 'Forest', 'Urban'],
            datasets: [{ data: [55, 30, 15], backgroundColor: ['#2d6a4f', '#d4a373', '#1b4332'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// MODAL CONTROLS
function openModal() { document.getElementById('uploadModal').classList.remove('hidden'); }
function closeModal() { document.getElementById('uploadModal').classList.add('hidden'); }