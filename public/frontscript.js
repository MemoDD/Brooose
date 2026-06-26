let cursor = 0;
let nextCursor = null;
const limit = 10;
let category = "";
let startDate = "";

async function loadProducts(reset = false) {
    try {
        if (reset) {
            document.getElementById('grid-container').innerHTML = "";
            cursor = 0;
            nextCursor = null;
        }

        // ✅ Correct URL definition
        let url = `https://brooose.onrender.com/products?limit=${limit}`;
        if (nextCursor) url += `&cursor=${nextCursor}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (startDate) url += `&startDate=${startDate}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const container = document.getElementById('grid-container');

        data.products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerHTML = `
                <h3>${product.name}</h3>
                <p><strong>ID:</strong> ${product.pid}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Created:</strong> ${new Date(product.created_at).toLocaleDateString()}</p>
            `;
            container.appendChild(item);
        });

        nextCursor = data.nextCursor;

        if (!nextCursor) {
            document.getElementById('load-more').style.display = 'none';
        } else {
            document.getElementById('load-more').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}
