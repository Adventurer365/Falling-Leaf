// Cart array to store items
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById("cart-items");
    const cartEmptyMsg = document.getElementById("cart-empty");
    const totalAmountSpan = document.getElementById("total-amount");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (cartItemsDiv && cartEmptyMsg && totalAmountSpan && checkoutBtn) {
        if (cart.length === 0) {
            cartEmptyMsg.style.display = "block";
            cartItemsDiv.innerHTML = "";
            totalAmountSpan.textContent = "0.00";
            checkoutBtn.disabled = true;
        } else {
            cartEmptyMsg.style.display = "none";
            cartItemsDiv.innerHTML = "";
            let total = 0;

            cart.forEach((item, index) => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "cart-item";
                itemDiv.innerHTML = `
                    <p>${item.name} - $${item.price} x ${item.quantity}</p>
                    <div>
                        <button class="decrease" data-index="${index}">-</button>
                        <button class="increase" data-index="${index}">+</button>
                    </div>
                `;
                cartItemsDiv.appendChild(itemDiv);
                total += item.price * item.quantity;
            });

            totalAmountSpan.textContent = total.toFixed(2);
            checkoutBtn.disabled = false;

            document.querySelectorAll(".decrease").forEach(btn => {
                btn.addEventListener("click", function() {
                    const index = this.getAttribute("data-index");
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    } else {
                        cart.splice(index, 1);
                    }
                    saveCart();
                    updateCartDisplay();
                    updateCartCounter();
                });
            });

            document.querySelectorAll(".increase").forEach(btn => {
                btn.addEventListener("click", function() {
                    const index = this.getAttribute("data-index");
                    if (cart[index].quantity < cart[index].stock) {
                        cart[index].quantity++;
                    } else {
                        alert(`Sorry, only ${cart[index].stock} ${cart[index].name}(s) in stock!`);
                    }
                    saveCart();
                    updateCartDisplay();
                    updateCartCounter();
                });
            });
        }
    }
}

// Carousel functionality
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentIndex = 0;

function showItem(index) {
    carouselItems.forEach((item, i) => {
        item.classList.remove('active');
        item.style.transform = i < index ? 'translateX(-100%)' : 'translateX(100%)';
        if (i === index) {
            item.classList.add('active');
            item.style.transform = 'translateX(0)';
        }
    });
}

function nextItem() {
    currentIndex = (currentIndex + 1) % carouselItems.length;
    showItem(currentIndex);
}

function prevItem() {
    currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
    showItem(currentIndex);
}

if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', nextItem);
    prevBtn.addEventListener('click', prevItem);
    setInterval(nextItem, 5000);
}

// Modal functionality
const modal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalAddToCart = document.getElementById('modal-add-to-cart');
const closeModal = document.querySelector('.close-modal');
const thumbs = document.querySelectorAll('.modal-thumb');

function openModal(element) {
    const itemName = element.getAttribute('data-item');
    const isCarousel = element.classList.contains('carousel-item');
    const images = isCarousel ? [element.querySelector('img')] : element.querySelectorAll('.product-images img');
    const mainImg = images[0].src;
    const thumb1 = images[0].src;
    const thumb2 = images[1] ? images[1].src : images[0].src;
    const thumb3 = images[2] ? images[2].src : images[0].src;
    const descriptionElement = isCarousel ? element.querySelector('.carousel-content p') : element.querySelector('p');
    const description = descriptionElement.textContent.split(' - ')[0];
    const addButton = element.querySelector('.add-to-cart');

    modalImage.src = mainImg;
    document.getElementById('thumb-1').src = thumb1;
    document.getElementById('thumb-2').src = thumb2;
    document.getElementById('thumb-3').src = thumb3;
    modalTitle.textContent = itemName;
    modalDescription.textContent = description;
    modalAddToCart.setAttribute('data-item', itemName);
    modalAddToCart.setAttribute('data-price', addButton.getAttribute('data-price'));
    modalAddToCart.setAttribute('data-stock', addButton.getAttribute('data-stock'));
    modal.classList.add('active');

    thumbs.forEach(thumb => thumb.classList.remove('active'));
    document.getElementById('thumb-1').classList.add('active');
}

document.querySelectorAll('.carousel-item').forEach(item => {
    item.addEventListener('click', function() {
        openModal(this);
    });
});

document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) return;
        openModal(this);
    });
});

thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
        modalImage.src = this.src;
        thumbs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

if (closeModal) {
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
    });
}

if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Contact form submission
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        alert(`Thank you, ${name}! Your message has been received.\nEmail: ${email}\nMessage: ${message}`);
        contactForm.reset();
    });
}

// Trigger animation on product add to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.closest('.product');
        product.style.animation = 'none';
        setTimeout(() => {
            product.style.animation = 'pulse 0.5s ease';
        }, 10);
    });
});

// Update cart counter
function updateCartCounter() {
    const cartCounters = document.querySelectorAll('.nav-cart-counter');
    cartCounters.forEach(counter => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = totalItems;
        counter.classList.toggle('active', totalItems > 0);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const item = this.getAttribute("data-item");
            const price = parseFloat(this.getAttribute("data-price"));
            const stock = parseInt(this.getAttribute("data-stock"));

            const cartItem = cart.find(i => i.name === item);
            if (cartItem) {
                if (cartItem.quantity < stock) {
                    cartItem.quantity++;
                    alert(`${item} quantity updated to ${cartItem.quantity}`);
                } else {
                    alert(`Sorry, only ${stock} ${item}(s) in stock!`);
                }
            } else {
                if (stock > 0) {
                    cart.push({ name: item, price: price, quantity: 1, stock: stock });
                    alert(`Added ${item} to cart`);
                } else {
                    alert(`Sorry, ${item} is out of stock!`);
                }
            }
            saveCart();
            updateCartDisplay();
            updateCartCounter();
        });
    });

    showItem(currentIndex);
    updateCartDisplay();
    updateCartCounter();
});

// Hamburger menu toggle
document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const item = this.getAttribute("data-item");
            const price = parseFloat(this.getAttribute("data-price"));
            const stock = parseInt(this.getAttribute("data-stock"));

            const cartItem = cart.find(i => i.name === item);
            if (cartItem) {
                if (cartItem.quantity < stock) {
                    cartItem.quantity++;
                    alert(`${item} quantity updated to ${cartItem.quantity}`);
                } else {
                    alert(`Sorry, only ${stock} ${item}(s) in stock!`);
                }
            } else {
                if (stock > 0) {
                    cart.push({ name: item, price: price, quantity: 1, stock: stock });
                    alert(`Added ${item} to cart`);
                } else {
                    alert(`Sorry, ${item} is out of stock!`);
                }
            }
            saveCart();
            updateCartDisplay();
            updateCartCounter();
        });
    });

    showItem(currentIndex);
    updateCartDisplay();
    updateCartCounter();

    // Add hamburger menu toggle here
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    if (menuToggle && navContainer) {
        menuToggle.addEventListener('click', function() {
            navContainer.classList.toggle('active');
        });
    }
});

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`, styleSheet.cssRules.length);