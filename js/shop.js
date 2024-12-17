document.addEventListener('DOMContentLoaded', () => {
    const shopContainer = document.querySelector('.shop-container');
    
    // Exemple de produits
    const products = [
        { id: 1, name: "Pain tradition", price: 1.20, shop: "Boulangerie du Port" },
        { id: 2, name: "Croissant", price: 1.10, shop: "Boulangerie du Port" },
        { id: 3, name: "Café", price: 2.00, shop: "Café de la Plage" }
    ];

    let cart = [];

    // Affichage des produits
    function displayProducts() {
        const productsHTML = products.map(product => `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>${product.shop}</p>
                <p>${product.price.toFixed(2)} €</p>
                <button onclick="addToCart(${product.id})">Ajouter au panier</button>
            </div>
        `).join('');

        shopContainer.innerHTML = productsHTML;
    }

    // Fonction pour ajouter au panier
    window.addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push(product);
            updateCart();
        }
    };

    // Mise à jour du panier
    function updateCart() {
        const cartTotal = cart.reduce((total, product) => total + product.price, 0);
        console.log(`Panier mis à jour: ${cart.length} articles, Total: ${cartTotal.toFixed(2)} €`);
    }

    displayProducts();
}); 