// Ajouter au début du fichier
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker enregistré!');
            })
            .catch(error => {
                console.log('Erreur d\'enregistrement du Service Worker:', error);
            });
    });
}

// Ajouter la détection de la plateforme
function detectPlatform() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    document.body.classList.add(isMobile ? 'mobile' : 'desktop');
    
    // Afficher la bannière d'installation sur mobile
    if (isMobile) {
        showInstallBanner();
    }
}

// Bannière d'installation
function showInstallBanner() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        const banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="install-content">
                <p>Installez l'application pour un meilleur accès</p>
                <button id="installBtn">Installer</button>
                <button id="closeBannerBtn">Plus tard</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        document.getElementById('installBtn').addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Application installée');
                }
                deferredPrompt = null;
                banner.remove();
            });
        });
        
        document.getElementById('closeBannerBtn').addEventListener('click', () => {
            banner.remove();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Gestion de la navigation
    const navLinks = document.querySelectorAll('.bottom-nav a');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Mise à jour des classes active
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Masquer toutes les pages
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            // Afficher la page cible
            document.getElementById(targetId).classList.add('active');
            
            // Scroll vers le haut
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
});

function initializeHome() {
    const shops = [
        {
            name: "Café de la Plage",
            image: "cafe-plage.jpg",
            rating: 4.5,
            category: "Restaurant",
            description: "Vue magnifique sur l'océan"
        },
        {
            name: "Boutique Surf",
            image: "surf-shop.jpg",
            rating: 4.8,
            category: "Shopping",
            description: "Tout pour le surf"
        },
        // Ajoutez d'autres commerces...
    ];

    const events = [
        {
            title: "Marché nocturne",
            date: "15 juillet 2024",
            image: "marche-nocturne.jpg",
            description: "Artisanat local et produits régionaux"
        },
        {
            title: "Festival de la Mer",
            date: "20 juillet 2024",
            image: "festival-mer.jpg",
            description: "Animations et concerts"
        },
        // Ajoutez d'autres événements...
    ];

    // Affichage des commerces
    const shopsGrid = document.querySelector('.shops-grid');
    shopsGrid.innerHTML = shops.map((shop, index) => `
        <div class="shop-card" style="animation-delay: ${index * 0.1}s">
            <img src="img/${shop.image}" alt="${shop.name}">
            <div class="content">
                <span class="category-tag">${shop.category}</span>
                <h3>${shop.name}</h3>
                <div class="rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(shop.rating))}${shop.rating % 1 ? '½' : ''}
                    </div>
                    <span class="reviews">(${Math.floor(Math.random() * 50 + 10)} avis)</span>
                </div>
                <p>${shop.description}</p>
            </div>
        </div>
    `).join('');

    // Affichage des événements
    const eventsSlider = document.querySelector('.events-slider');
    eventsSlider.innerHTML = events.map((event, index) => `
        <div class="event-card" style="animation-delay: ${index * 0.1}s">
            <img src="img/${event.image}" alt="${event.title}">
            <div class="event-content">
                <span class="event-date">${event.date}</span>
                <h3>${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-info">
                    <span class="material-icons">location_on</span>
                    <span>Biscarrosse Plage</span>
                    <span class="material-icons">schedule</span>
                    <span>20:00</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Appelez la fonction après le chargement du DOM
document.addEventListener('DOMContentLoaded', initializeHome); 

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const gpsButton = document.getElementById('gpsButton');
    let userLocation = null;

    // Fonction pour calculer la distance entre deux points
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return (R * c).toFixed(1);
    }

    // Fonction pour obtenir la localisation
    function getLocation() {
        gpsButton.classList.add('loading');
        
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Mettre à jour les résultats de recherche avec les distances
                    updateSearchResults(searchInput.value);
                    gpsButton.classList.remove('loading');
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                    alert("Impossible d'obtenir votre position");
                    gpsButton.classList.remove('loading');
                }
            );
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur");
            gpsButton.classList.remove('loading');
        }
    }

    // Exemple de données de commerces
    const shops = [
        { name: "Café de la Plage", lat: 44.4439, lng: -1.2467, type: "Restaurant" },
        { name: "Boutique Surf", lat: 44.4435, lng: -1.2470, type: "Shopping" },
        // Ajoutez d'autres commerces...
    ];

    function updateSearchResults(query) {
        const resultsContainer = document.querySelector('.search-results') || 
            document.createElement('div');
        resultsContainer.className = 'search-results';
        
        if (!query) {
            resultsContainer.classList.remove('active');
            return;
        }

        const filteredShops = shops.filter(shop => 
            shop.name.toLowerCase().includes(query.toLowerCase()) ||
            shop.type.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredShops.length > 0) {
            const resultsHTML = filteredShops.map(shop => {
                let distanceText = '';
                if (userLocation) {
                    const distance = calculateDistance(
                        userLocation.lat, userLocation.lng,
                        shop.lat, shop.lng
                    );
                    distanceText = `<span class="distance">${distance} km</span>`;
                }

                return `
                    <div class="result-item" data-lat="${shop.lat}" data-lng="${shop.lng}">
                        <span class="material-icons">${shop.type === 'Restaurant' ? 'restaurant' : 'shopping_bag'}</span>
                        <div class="result-info">
                            <div>${shop.name}</div>
                            <div class="result-type">${shop.type}</div>
                        </div>
                        ${distanceText}
                    </div>
                `;
            }).join('');

            resultsContainer.innerHTML = resultsHTML;
            resultsContainer.classList.add('active');
        } else {
            resultsContainer.innerHTML = '<div class="result-item">Aucun résultat trouvé</div>';
            resultsContainer.classList.add('active');
        }

        if (!document.querySelector('.search-results')) {
            document.querySelector('.search-bar').appendChild(resultsContainer);
        }
    }

    // Événements
    searchInput.addEventListener('input', (e) => {
        updateSearchResults(e.target.value);
    });

    gpsButton.addEventListener('click', getLocation);

    // Fermer les résultats quand on clique ailleurs
    document.addEventListener('click', (e) => {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer && !e.target.closest('.search-bar')) {
            resultsContainer.classList.remove('active');
        }
    });

    // Gérer le clic sur un résultat
    document.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.result-item');
        if (resultItem) {
            const lat = parseFloat(resultItem.dataset.lat);
            const lng = parseFloat(resultItem.dataset.lng);
            
            // Naviguer vers la page de la carte et centrer sur le commerce
            document.querySelector('a[href="#map"]').click();
            if (window.map) {
                window.map.setView([lat, lng], 18);
                // Trouver et ouvrir le marqueur correspondant
                window.markers?.forEach(marker => {
                    if (marker.getLatLng().lat === lat && marker.getLatLng().lng === lng) {
                        marker.openPopup();
                    }
                });
            }
        }
    });
}

// Appeler la fonction d'initialisation
document.addEventListener('DOMContentLoaded', initializeSearch); 

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            const grid = button.closest('.category-page').querySelector('.shops-grid');
            const items = grid.children;
            
            // Mise à jour des boutons actifs
            button.closest('.category-filters')
                .querySelectorAll('.filter-btn')
                .forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrage des éléments
            Array.from(items).forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Appeler la fonction après le chargement du DOM
document.addEventListener('DOMContentLoaded', initializeFilters);

// Ajouter après les données existantes
const categoryData = {
    restaurants: [
        {
            name: "Le Bistrot de la Plage",
            image: "bistrot-plage.jpg",
            rating: 4.7,
            category: "restaurant",
            description: "Cuisine traditionnelle face à l'océan",
            horaires: "12h-14h30, 19h-22h30",
            specialite: "Fruits de mer",
            clickAndCollect: {
                enabled: true,
                creneaux: [
                    "11:30-12:00",
                    "12:00-12:30",
                    "12:30-13:00",
                    "19:00-19:30",
                    "19:30-20:00"
                ],
                preparation: "20min"
            },
            social: {
                website: "https://bistrotdelaplage.fr",
                instagram: "bistrot_plage",
                facebook: "bistrotdelaplage",
                trustpilot: "bistrot-de-la-plage"
            },
            products: [
                {
                    id: 1,
                    name: "Menu du Jour",
                    price: 19.90,
                    description: "Entrée + Plat + Dessert",
                    image: "menu-jour.jpg",
                    category: "Menus"
                },
                {
                    id: 2,
                    name: "Plateau de Fruits de Mer",
                    price: 35.00,
                    description: "Huîtres, crevettes, bulots, tourteau",
                    image: "plateau-mer.jpg",
                    category: "Spécialités"
                }
                // ... autres produits
            ]
        },
        {
            name: "Café des Surfeurs",
            image: "cafe-surfeurs.jpg",
            rating: 4.5,
            category: "cafe",
            description: "Petit-déjeuner et brunch toute la journée",
            horaires: "8h-19h",
            specialite: "Brunch",
            clickAndCollect: {
                enabled: true,
                creneaux: [
                    "10:00-10:30",
                    "10:30-11:00",
                    "11:00-11:30",
                    "15:00-15:30",
                    "15:30-16:00"
                ],
                preparation: "15min"
            },
            social: {
                website: "https://cafe-surfeurs-bisca.fr",
                instagram: "cafe_surfeurs",
                facebook: "cafesurfeursbisca",
                trustpilot: "cafe-surfeurs-bisca"
            }
        },
        {
            name: "La Paillote",
            image: "paillote.jpg",
            rating: 4.3,
            category: "snack",
            description: "Snacking de qualité les pieds dans le sable",
            horaires: "11h-22h",
            specialite: "Planches apéro",
            social: {
                website: "https://paillote-bisca.fr",
                instagram: "paillote_bisca",
                facebook: "paillotebisca",
                trustpilot: "paillote-bisca"
            },
            products: [
                {
                    id: 1,
                    name: "Planche Apéro",
                    price: 18.90,
                    description: "Charcuterie, fromages, tapas",
                    image: "planche-apero.jpg",
                    category: "Planches"
                },
                {
                    id: 2,
                    name: "Salade Ocean",
                    price: 16.50,
                    description: "Salade, crevettes, saumon fumé",
                    image: "salade-ocean.jpg",
                    category: "Salades"
                },
                {
                    id: 3,
                    name: "Cocktail Maison",
                    price: 9.90,
                    description: "Cocktail signature de La Paillote",
                    image: "cocktail-maison.jpg",
                    category: "Boissons"
                }
            ]
        }
    ],

    boutiques: [
        {
            name: "Surf Shop Bisca",
            image: "surf-shop.jpg",
            rating: 4.8,
            category: "surf",
            description: "Tout l'équipement pour le surf",
            services: "Location, Réparation",
            clickAndCollect: {
                enabled: true,
                creneaux: [
                    "10:00-10:30",
                    "10:30-11:00",
                    "11:00-11:30",
                    "15:00-15:30",
                    "15:30-16:00"
                ],
                preparation: "15min"
            },
            social: {
                website: "https://surfshop-bisca.fr",
                instagram: "surfshop_bisca",
                facebook: "surfshopbisca",
                trustpilot: "surf-shop-bisca"
            },
            products: [
                {
                    id: 1,
                    name: "Planche de surf",
                    price: 499.00,
                    description: "Planche 7'0 tout niveau",
                    image: "planche-surf.jpg",
                    category: "Planches"
                }
                // ... autres produits
            ]
        },
        {
            name: "Beach Mode",
            image: "beach-mode.jpg",
            rating: 4.4,
            category: "mode",
            description: "Prêt-à-porter été et accessoires",
            services: "Retouches",
            social: {
                website: "https://beachmode-bisca.fr",
                instagram: "beachmode_bisca",
                facebook: "beachmodebisca"
            },
            products: [
                {
                    id: 1,
                    name: "Robe de plage",
                    price: 49.90,
                    description: "Robe légère 100% coton",
                    image: "robe-plage.jpg",
                    category: "Vêtements"
                }
            ]
        },
        {
            name: "Souvenirs d'Océan",
            image: "souvenirs.jpg",
            rating: 4.2,
            category: "souvenirs",
            description: "Cadeaux et souvenirs locaux",
            services: "Emballage cadeau",
            social: {
                website: "https://souvenirs-ocean-bisca.fr",
                instagram: "souvenirs_ocean",
                facebook: "souvenirsoceanbisca",
                trustpilot: "souvenirs-ocean-bisca"
            },
            products: [
                {
                    id: 1,
                    name: "Mug Biscarrosse",
                    price: 12.90,
                    description: "Mug en céramique décoré",
                    image: "mug-bisca.jpg",
                    category: "Mugs"
                },
                {
                    id: 2,
                    name: "T-shirt Souvenir",
                    price: 24.90,
                    description: "T-shirt 100% coton bio",
                    image: "tshirt-souvenir.jpg",
                    category: "Vêtements"
                },
                {
                    id: 3,
                    name: "Magnet Plage",
                    price: 5.90,
                    description: "Magnet décoratif",
                    image: "magnet-plage.jpg",
                    category: "Magnets"
                },
                {
                    id: 4,
                    name: "Carte Postale",
                    price: 2.50,
                    description: "Lot de 3 cartes postales",
                    image: "cartes-postales.jpg",
                    category: "Cartes"
                }
            ]
        }
    ],

    plage: [
        {
            name: "Location Surf",
            image: "location-surf.jpg",
            rating: 4.9,
            category: "location",
            description: "Location de planches et combinaisons",
            equipements: "Planches, Combinaisons, Bodyboards",
            social: {
                website: "https://location-surf-bisca.fr",
                instagram: "locationsurf_bisca",
                facebook: "locationsurfbisca",
                trustpilot: "location-surf-bisca"
            },
            products: [
                {
                    id: 1,
                    name: "Location planche 1h",
                    price: 15.00,
                    description: "Planche de surf + combinaison",
                    image: "location-surf.jpg",
                    category: "Locations"
                },
                {
                    id: 2,
                    name: "Pack journée",
                    price: 35.00,
                    description: "Location complète à la journée",
                    image: "pack-journee.jpg",
                    category: "Packs"
                }
            ]
        },
        {
            name: "École de Surf",
            image: "ecole-surf.jpg",
            rating: 4.8,
            category: "cours",
            description: "Cours tous niveaux",
            services: "Cours particuliers, Stages",
            social: {
                website: "https://ecole-surf-bisca.fr",
                instagram: "ecolesurf_bisca",
                facebook: "ecolesurfbisca",
                trustpilot: "ecole-surf-bisca"
            },
            products: [
                {
                    id: 1,
                    name: "Cours débutant 1h30",
                    price: 45.00,
                    description: "Cours particulier tout inclus",
                    image: "cours-debutant.jpg",
                    category: "Cours"
                },
                {
                    id: 2,
                    name: "Stage 5 jours",
                    price: 199.00,
                    description: "Stage intensif tous niveaux",
                    image: "stage-surf.jpg",
                    category: "Stages"
                }
            ]
        },
        {
            name: "Beach Services",
            image: "beach-services.jpg",
            rating: 4.6,
            category: "services",
            description: "Location de transats et parasols",
            equipements: "Transats, Parasols, Cabines",
            social: {
                website: "https://beach-services-bisca.fr",
                instagram: "beachservices_bisca",
                facebook: "beachservicesbisca",
                trustpilot: "beach-services-bisca"
            },
            products: [
                {
                    id: 1,
                    name: "Location transat journée",
                    price: 15.00,
                    description: "Transat confortable avec parasol",
                    image: "transat.jpg",
                    category: "Locations"
                },
                {
                    id: 2,
                    name: "Pack famille",
                    price: 40.00,
                    description: "2 transats + 2 parasols + cabine",
                    image: "pack-plage.jpg",
                    category: "Packs"
                }
            ]
        }
    ],

    activites: [
        {
            name: "Club Nautique",
            image: "club-nautique.jpg",
            rating: 4.7,
            category: "sport",
            description: "Activités nautiques variées",
            activites: "Voile, Paddle, Kayak",
            social: {
                website: "https://club-nautique-bisca.fr",
                instagram: "clubnautique_bisca",
                facebook: "clubnautiquebisca"
            },
            products: [
                {
                    id: 1,
                    name: "Sortie voile 2h",
                    price: 60.00,
                    description: "Initiation à la voile",
                    image: "sortie-voile.jpg",
                    category: "Voile"
                },
                {
                    id: 2,
                    name: "Location Paddle",
                    price: 20.00,
                    description: "Location paddle 2h",
                    image: "paddle.jpg",
                    category: "Paddle"
                }
            ]
        },
        {
            name: "Cinéma de la Plage",
            image: "cinema-plage.jpg",
            rating: 4.5,
            category: "culture",
            description: "Projections en plein air",
            programme: "Films récents et classiques",
            social: {
                website: "https://cinema-plage-bisca.fr",
                instagram: "cinema_plage",
                facebook: "cinemaplageBisca",
                trustpilot: "cinema-plage-bisca"
            },
            products: [
                {
                    id: 1,
                    name: "Place adulte",
                    price: 8.50,
                    description: "Séance en plein air",
                    image: "cinema-place.jpg",
                    category: "Places"
                },
                {
                    id: 2,
                    name: "Place enfant (-12 ans)",
                    price: 6.50,
                    description: "Séance en plein air",
                    image: "cinema-enfant.jpg",
                    category: "Places"
                },
                {
                    id: 3,
                    name: "Pack famille",
                    price: 25.00,
                    description: "2 adultes + 2 enfants",
                    image: "cinema-famille.jpg",
                    category: "Packs"
                },
                {
                    id: 4,
                    name: "Menu snack",
                    price: 12.00,
                    description: "Pop-corn + Boisson + Friandise",
                    image: "cinema-snack.jpg",
                    category: "Snacks"
                }
            ]
        },
        {
            name: "Mini-Golf Océan",
            image: "mini-golf.jpg",
            rating: 4.4,
            category: "loisirs",
            description: "Parcours 18 trous thématique",
            horaires: "10h-23h en été",
            social: {
                website: "https://minigolf-bisca.fr",
                instagram: "minigolf_bisca",
                facebook: "minigolfbisca"
            },
            products: [
                {
                    id: 1,
                    name: "Parcours adulte",
                    price: 12.00,
                    description: "Parcours 18 trous",
                    image: "parcours-adulte.jpg",
                    category: "Parcours"
                },
                {
                    id: 2,
                    name: "Pack famille",
                    price: 35.00,
                    description: "2 adultes + 2 enfants",
                    image: "pack-famille.jpg",
                    category: "Packs"
                }
            ]
        }
    ]
};

// Fonction pour initialiser chaque catégorie
function initializeCategory(categoryName) {
    const grid = document.querySelector(`.${categoryName}-grid`);
    if (!grid || !categoryData[categoryName]) return;

    grid.innerHTML = categoryData[categoryName].map((item, index) => `
        <div class="shop-card" data-category="${item.category}" style="animation-delay: ${index * 0.1}s">
            <img src="img/${item.image}" alt="${item.name}">
            <div class="content">
                <span class="category-tag">${item.category}</span>
                <h3>${item.name}</h3>
                <div class="rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(item.rating))}${item.rating % 1 ? '½' : ''}
                    </div>
                    <span class="reviews">(${Math.floor(Math.random() * 50 + 10)} avis)</span>
                </div>
                <p>${item.description}</p>
                ${item.horaires ? `<p class="horaires"><span class="material-icons">schedule</span> ${item.horaires}</p>` : ''}
                ${item.services ? `<p class="services"><span class="material-icons">room_service</span> ${item.services}</p>` : ''}
                ${item.specialite ? `<p class="specialite"><span class="material-icons">restaurant_menu</span> ${item.specialite}</p>` : ''}
                ${item.equipements ? `<p class="equipements"><span class="material-icons">surfing</span> ${item.equipements}</p>` : ''}
                ${item.activites ? `<p class="activites"><span class="material-icons">sports</span> ${item.activites}</p>` : ''}
                ${item.programme ? `<p class="programme"><span class="material-icons">movie</span> ${item.programme}</p>` : ''}
                ${item.products ? `
                    <div class="shop-actions">
                        <button class="action-btn view-products" onclick="event.stopPropagation();">
                            <span class="material-icons">menu_book</span>
                            Voir les produits
                        </button>
                    </div>
                ` : ''}
                ${item.social ? `
                    <div class="social-links">
                        ${item.social.website ? `
                            <a href="${item.social.website}" target="_blank" class="social-link website" title="Site web">
                                <span class="material-icons">language</span>
                            </a>
                        ` : ''}
                        ${item.social.instagram ? `
                            <a href="https://instagram.com/${item.social.instagram}" target="_blank" class="social-link instagram" title="Instagram">
                                <span class="material-icons">photo_camera</span>
                            </a>
                        ` : ''}
                        ${item.social.facebook ? `
                            <a href="https://facebook.com/${item.social.facebook}" target="_blank" class="social-link facebook" title="Facebook">
                                <span class="material-icons">facebook</span>
                            </a>
                        ` : ''}
                        ${item.social.trustpilot ? `
                            <a href="https://trustpilot.com/review/${item.social.trustpilot}" target="_blank" class="social-link trustpilot" title="Trustpilot">
                                <span class="material-icons">star_rate</span>
                            </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    // Gérer les clics sur le bouton voir les produits
    grid.querySelectorAll('.view-products').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const shopData = categoryData[categoryName].find(
                shop => shop.name === e.target.closest('.shop-card').querySelector('h3').textContent
            );
            showProductsModal(shopData);
        });
    });
}

// Initialiser toutes les catégories au chargement
document.addEventListener('DOMContentLoaded', () => {
    ['restaurants', 'boutiques', 'plage', 'activites'].forEach(category => {
        initializeCategory(category);
    });
});

// Modifier la gestion de la navigation
function initializeNavigation() {
    // Navigation principale et catégories
    const allLinks = document.querySelectorAll('.bottom-nav a, .categories a');
    const pages = document.querySelectorAll('.page');

    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Masquer toutes les pages
            pages.forEach(p => p.classList.remove('active'));
            
            // Afficher la page cible
            const targetPage = document.getElementById(targetId);
            targetPage.classList.add('active');
            
            // Mettre à jour la navigation du bas
            document.querySelectorAll('.bottom-nav a').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('href') === '#home') {
                    navLink.classList.add('active');
                }
            });

            // Scroll vers le haut en douceur
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Ajouter une animation d'entrée
            targetPage.style.animation = 'fadeInPage 0.5s ease forwards';
        });
    });

    // Ajouter un bouton retour pour les pages de catégories
    const categoryPages = document.querySelectorAll('.category-page');
    categoryPages.forEach(page => {
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.innerHTML = `
            <span class="material-icons">arrow_back</span>
            <span>Retour</span>
        `;
        page.insertBefore(backButton, page.firstChild);

        backButton.addEventListener('click', () => {
            // Retour à la page d'accueil
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById('home').classList.add('active');
            document.querySelectorAll('.bottom-nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        });
    });
}

// Ajouter les styles CSS pour le bouton retour et l'animation
const styles = `
    .back-button {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: white;
        border: none;
        border-radius: 25px;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    .back-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    .back-button .material-icons {
        font-size: 20px;
    }

    @keyframes fadeInPage {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Ajouter les styles au document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialiser la navigation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
});

// Ajouter la fonction de réservation
function initializeClickAndCollect() {
    // Ajouter un bouton de réservation sur chaque carte
    document.querySelectorAll('.shop-card').forEach(card => {
        const shopData = categoryData[card.closest('.category-page')?.id]?.find(
            shop => shop.name === card.querySelector('h3').textContent
        );

        if (shopData?.clickAndCollect?.enabled) {
            const reserveButton = document.createElement('button');
            reserveButton.className = 'reserve-button';
            reserveButton.innerHTML = `
                <span class="material-icons">schedule</span>
                Réserver un créneau
            `;
            card.querySelector('.content').appendChild(reserveButton);

            reserveButton.addEventListener('click', () => {
                showReservationModal(shopData);
            });
        }
    });
}

// Créer la modal de réservation
function showReservationModal(shopData) {
    const modal = document.createElement('div');
    modal.className = 'reservation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">×</button>
            <h3>Réserver un créneau - ${shopData.name}</h3>
            <p class="prep-time">
                <span class="material-icons">timer</span>
                Temps de préparation estimé: ${shopData.clickAndCollect.preparation}
            </p>
            
            <div class="date-selector">
                <label>Date de retrait :</label>
                <input type="date" min="${new Date().toISOString().split('T')[0]}">
            </div>

            <div class="slots-container">
                <label>Créneaux disponibles :</label>
                <div class="time-slots">
                    ${shopData.clickAndCollect.creneaux.map(creneau => {
                        const [start] = creneau.split('-');
                        const [hours, minutes] = start.split(':');
                        const slotTime = new Date();
                        slotTime.setHours(hours, minutes);
                        
                        const isAvailable = slotTime > now;
                        return `
                            <button class="time-slot ${!isAvailable ? 'disabled' : ''}" 
                                    ${!isAvailable ? 'disabled' : ''}>
                                ${creneau}
                                ${!isAvailable ? '<span class="slot-status">Indisponible</span>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="reservation-form">
                <input type="text" placeholder="Votre nom" required>
                <input type="tel" placeholder="Téléphone" required>
                <input type="email" placeholder="Email" required>
                <textarea placeholder="Commentaire (optionnel)"></textarea>
            </div>

            <button class="confirm-reservation" disabled>
                Confirmer la réservation
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Gérer la fermeture de la modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    // Gérer la sélection des créneaux
    const timeSlots = modal.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            updateConfirmButton();
        });
    });

    // Vérifier si le formulaire est complet
    const inputs = modal.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('input', updateConfirmButton);
    });

    function validatePhoneNumber(phone) {
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        return phoneRegex.test(phone);
    }

    function updateConfirmButton() {
        const selectedSlot = modal.querySelector('.time-slot.selected');
        const phoneInput = modal.querySelector('input[type="tel"]');
        const isPhoneValid = validatePhoneNumber(phoneInput.value);
        
        if (!isPhoneValid && phoneInput.value) {
            phoneInput.setCustomValidity('Numéro de téléphone invalide');
            phoneInput.reportValidity();
        } else {
            phoneInput.setCustomValidity('');
        }

        const allInputsFilled = Array.from(inputs).every(input => {
            return input.value.trim() && (input.type !== 'tel' || isPhoneValid);
        });
        
        const confirmButton = modal.querySelector('.confirm-reservation');
        confirmButton.disabled = !(selectedSlot && allInputsFilled);
    }

    // Gérer la confirmation
    modal.querySelector('.confirm-reservation').addEventListener('click', async () => {
        const button = modal.querySelector('.confirm-reservation');
        button.disabled = true;
        button.innerHTML = `
            <span class="loading-spinner"></span>
            Confirmation en cours...
        `;

        try {
            // Simuler un appel API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const formData = {
                shop: shopData.name,
                date: modal.querySelector('input[type="date"]').value,
                time: modal.querySelector('.time-slot.selected').textContent,
                name: modal.querySelector('input[type="text"]').value,
                phone: modal.querySelector('input[type="tel"]').value,
                email: modal.querySelector('input[type="email"]').value,
                comment: modal.querySelector('textarea').value
            };

            showConfirmation(formData);
            modal.remove();
        } catch (error) {
            button.disabled = false;
            button.innerHTML = 'Confirmer la réservation';
            alert('Erreur lors de la réservation. Veuillez réessayer.');
        }
    });
}

// Afficher la confirmation
function showConfirmation(data) {
    const confirmation = document.createElement('div');
    confirmation.className = 'confirmation-modal';
    confirmation.innerHTML = `
        <div class="modal-content">
            <h3>Réservation confirmée !</h3>
            <div class="confirmation-details">
                <p><strong>Commerce :</strong> ${data.shop}</p>
                <p><strong>Date :</strong> ${data.date}</p>
                <p><strong>Créneau :</strong> ${data.time}</p>
                <p><strong>Au nom de :</strong> ${data.name}</p>
            </div>
            <p class="confirmation-message">
                Un email de confirmation a été envoyé à ${data.email}
            </p>
            <button class="close-confirmation">Fermer</button>
        </div>
    `;

    document.body.appendChild(confirmation);

    confirmation.querySelector('.close-confirmation').addEventListener('click', () => {
        confirmation.remove();
    });
}

// Ajouter les styles CSS
const clickAndCollectStyles = `
    .reservation-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }

    .close-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        border: none;
        background: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }

    .time-slots {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
        margin: 15px 0;
    }

    .time-slot {
        padding: 10px;
        border: 2px solid #eee;
        border-radius: 10px;
        background: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .time-slot.selected {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .reservation-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin: 20px 0;
    }

    .reservation-form input,
    .reservation-form textarea {
        padding: 12px;
        border: 2px solid #eee;
        border-radius: 10px;
        font-size: 1em;
    }

    .confirm-reservation {
        width: 100%;
        padding: 15px;
        border: none;
        border-radius: 10px;
        background: var(--primary-color);
        color: white;
        font-size: 1.1em;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .confirm-reservation:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .reserve-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        margin-top: 15px;
        transition: all 0.3s ease;
    }

    .reserve-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
    }

    .prep-time {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        margin: 10px 0;
    }

    .confirmation-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .confirmation-details {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
    }

    .confirmation-message {
        color: var(--primary-color);
        text-align: center;
        margin: 20px 0;
    }
`;

// Ajouter les styles
const clickAndCollectStyleSheet = document.createElement('style');
clickAndCollectStyleSheet.textContent = clickAndCollectStyles;
document.head.appendChild(clickAndCollectStyleSheet);

// Ajouter la fonction pour afficher les produits
function showProductsModal(shopData) {
    const modal = document.createElement('div');
    modal.className = 'products-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">×</button>
            <div class="shop-header">
                <h2>${shopData.name}</h2>
                ${shopData.rating ? `
                    <div class="rating">
                        <div class="stars">
                            ${'★'.repeat(Math.floor(shopData.rating))}${shopData.rating % 1 ? '½' : ''}
                        </div>
                    </div>
                ` : ''}
            </div>

            ${shopData.products ? `
                <div class="products-categories">
                    <button class="category-filter active" data-category="all">Tout</button>
                    ${[...new Set(shopData.products.map(p => p.category))].map(category => `
                        <button class="category-filter" data-category="${category}">${category}</button>
                    `).join('')}
                </div>

                <div class="products-grid">
                    ${shopData.products.map(product => `
                        <div class="product-card" data-category="${product.category}">
                            <div class="product-image">
                                <img src="img/products/${product.image}" alt="${product.name}">
                            </div>
                            <div class="product-content">
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                <div class="product-footer">
                                    <span class="price">${product.price.toFixed(2)} €</span>
                                    <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product)}, '${shopData.name}')">
                                        <span class="material-icons">add_shopping_cart</span>
                                        <span class="add-text">Ajouter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="no-products">Aucun produit disponible</p>'}
        </div>
    `;

    document.body.appendChild(modal);

    // Gérer la fermeture
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    // Gérer les filtres de catégories
    const categoryButtons = modal.querySelectorAll('.category-filter');
    const productCards = modal.querySelectorAll('.product-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Ajouter la gestion du panier
let cart = {
    items: [],
    total: 0
};

// Fonction pour ajouter au panier
function addToCart(product, shopName) {
    cart.items.push({
        ...product,
        shopName
    });
    cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);
    updateCartBadge();
    showCartPage();
}

// Fonction pour supprimer du panier
function removeFromCart(productId) {
    const index = cart.items.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.items.splice(index, 1);
        cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);
        updateCartBadge();
        showCartPage(); // Rafraîchir l'affichage du panier
    }
}

// Mettre à jour le badge du panier
function updateCartBadge() {
    let cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) {
        cartBadge = document.createElement('span');
        cartBadge.className = 'cart-badge';
        document.querySelector('a[href="#shop"]').appendChild(cartBadge);
    }
    cartBadge.textContent = cart.items.length;
    cartBadge.style.display = cart.items.length ? 'block' : 'none';
}

// Afficher la page panier
function showCartPage() {
    const cartPage = document.getElementById('shop');
    const pages = document.querySelectorAll('.page');
    
    // Masquer toutes les pages et afficher la page panier
    pages.forEach(p => p.classList.remove('active'));
    cartPage.classList.add('active');

    // Mettre à jour la navigation
    document.querySelectorAll('.bottom-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#shop') {
            link.classList.add('active');
        }
    });

    // Afficher le contenu du panier
    cartPage.innerHTML = `
        <div class="cart-page">
            <h2>Mon Panier</h2>
            ${cart.items.length > 0 ? `
                <div class="cart-content">
                    <div class="cart-items">
                        ${cart.items.map(item => `
                            <div class="cart-item">
                                <img src="img/products/${item.image}" alt="${item.name}">
                                <div class="cart-item-details">
                                    <h3>${item.name}</h3>
                                    <p class="shop-name">Vendu par : ${item.shopName}</p>
                                    <p class="description">${item.description}</p>
                                    <div class="price-row">
                                        <span class="price">${item.price.toFixed(2)} €</span>
                                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                                            <span class="material-icons">delete</span>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-summary">
                        <h3>Récapitulatif</h3>
                        <div class="summary-details">
                            <div class="summary-row">
                                <span>Total</span>
                                <span>${cart.total.toFixed(2)} €</span>
                            </div>
                        </div>
                        <button class="checkout-button" onclick="proceedToCheckout()">
                            <span class="material-icons">shopping_cart_checkout</span>
                            Passer la commande
                        </button>
                        <button class="continue-shopping" onclick="goToHome()">
                            <span class="material-icons">arrow_back</span>
                            Continuer mes achats
                        </button>
                    </div>
                </div>
            ` : `
                <div class="empty-cart">
                    <span class="material-icons">shopping_cart</span>
                    <p>Votre panier est vide</p>
                    <button class="continue-shopping" onclick="goToHome()">
                        Continuer mes achats
                    </button>
                </div>
            `}
        </div>
    `;
}

// Navigation
function goToHome() {
    document.querySelector('a[href="#home"]').click();
}

function proceedToCheckout() {
    alert('Redirection vers la page de paiement...');
}

// Initialiser le panier au chargement
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});