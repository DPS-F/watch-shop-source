import './style.css';

const loading = document.querySelector("#loading");
const errorBlock = document.querySelector("#error");
const emptyBlock = document.querySelector("#empty");
const productsContainer = document.querySelector("#products");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const retryBtn = document.querySelector("#retry-btn");
const categorySelect = document.querySelector("#category-select");
const themeToggle = document.querySelector("#theme-toggle");

const API_URL = "https://dummyjson.com/products";

async function fetchProducts(query = "", category = "all-watches") {
    loading.style.display = "block";
    errorBlock.style.display = "none";
    emptyBlock.style.display = "none";
    productsContainer.innerHTML = "";

    try {
        let url = "";

        if (query) {
            url = `${API_URL}/search?q=${query}`;
        } else if (category === "all-watches") {
            url = `${API_URL}/search?q=watch`;
        } else {
            url = `${API_URL}/category/${category}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        loading.style.display = "none";

        if (data.products.length === 0) {
            emptyBlock.style.display = "block";
            return;
        }

        productsContainer.innerHTML = data.products.map(product => `
            <div class="product-card">
                <img src="${product.thumbnail}" alt="${product.title}" 
                     onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop'">
                <h3>${product.title}</h3>
                <p class="description">${product.description.substring(0, 60)}...</p>
                <div class="card-footer">
                    <p class="price">$${product.price}</p>
                    <p class="rating">⭐ ${product.rating}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Ошибка:", error);
        loading.style.display = "none";
        errorBlock.style.display = "block";
    }
}

fetchProducts("", categorySelect.value);

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchProducts(query);
});

categorySelect.addEventListener("change", (e) => {
    searchInput.value = ""; 
    fetchProducts("", e.target.value);
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        fetchProducts(query);
    }
});

retryBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchProducts(query);
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        themeToggle.textContent = "☀️ Светлая тема";
    } else {
        themeToggle.textContent = "🌙 Темная тема";
    }
});