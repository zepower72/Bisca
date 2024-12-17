document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map-container').setView([44.4439, -1.2467], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Exemple de marqueurs pour les commerces
    const shops = [
        { name: "Boulangerie du Port", lat: 44.4439, lng: -1.2467 },
        { name: "Café de la Plage", lat: 44.4435, lng: -1.2470 }
    ];

    shops.forEach(shop => {
        L.marker([shop.lat, shop.lng])
            .bindPopup(shop.name)
            .addTo(map);
    });

    // Géolocalisation
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = [position.coords.latitude, position.coords.longitude];
            L.marker(userLocation)
                .bindPopup("Vous êtes ici")
                .addTo(map);
        });
    }
}); 