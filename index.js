const products = [
  {
    id: 1,
    name: "Essential Oversized Tee",
    category: "shirts",
    price: 18500,
    badge: "NEW",
    image: "images/product1.jpg"
  },

  {
    id: 2,
    name: "NESTA Everyday Shirt",
    category: "shirts",
    price: 24000,
    badge: "",
    image: "images/product2.jpg"
  },

  {
    id: 3,
    name: "Urban Runner",
    category: "shoes",
    price: 45000,
    badge: "POPULAR",
    image: "images/product3.jpg"
  },

  {
    id: 4,
    name: "Classic Street Sneaker",
    category: "shoes",
    price: 52000,
    badge: "",
    image: "images/product4.jpg"
  },

  {
    id: 5,
    name: "NESTA Cap",
    category: "accessories",
    price: 12000,
    badge: "NEW",
    image: "images/product5.jpg"
  },

  {
    id: 6,
    name: "Minimal Watch",
    category: "accessories",
    price: 38000,
    badge: "",
    image: "images/product6.jpg"
  },

  {
    id: 7,
    name: "Premium Basic Tee",
    category: "shirts",
    price: 16000,
    badge: "",
    image: "images/product7.jpg"
  },

  {
    id: 8,
    name: "Daily Crossbody",
    category: "accessories",
    price: 27000,
    badge: "NEW",
    image: "images/product8.jpg"
  }
];


/* STORAGE */

let cart = JSON.parse(
  localStorage.getItem("nestaCart")
) || [];

let wishlist = JSON.parse(
  localStorage.getItem("nestaWishlist")
) || [];


/* ELEMENTS */

const productGrid = document.getElementById("productGrid");

const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

const wishlistCount = document.getElementById("wishlistCount");

const searchBtn = document.getElementById("searchBtn");
const searchPanel = document.getElementById("searchPanel");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

const toast = document.getElementById("toast");


/* PRICE */

function formatPrice(price) {

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(price);

}


/* SAVE */

function saveCart() {

  localStorage.setItem(
    "nestaCart",
    JSON.stringify(cart)
  );

}

function saveWishlist() {

  localStorage.setItem(
    "nestaWishlist",
    JSON.stringify(wishlist)
  );

}


/* PRODUCTS */

function renderProducts(list = products) {

  if (list.length === 0) {

    productGrid.innerHTML = `
      <p style="
        grid-column:1/-1;
        color:#777;
        padding:50px 0;
      ">
        No products found.
      </p>
    `;

    return;
  }


  productGrid.innerHTML = list.map(product => {

    const liked = wishlist.includes(product.id);

    return `
      <article class="product-card">

        <div class="product-image">

          ${
            product.badge
              ? `<span class="product-badge">${product.badge}</span>`
              : ""
          }

          <button
            class="wishlist-product ${liked ? "active" : ""}"
            onclick="toggleWishlist(${product.id})"
            aria-label="Add to wishlist"
          >
            ${liked ? "♥" : "♡"}
          </button>

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.style.display='none';"
          >

        </div>


        <div class="product-info">

          <div>

            <div class="product-name">
              ${product.name}
            </div>

            <div class="product-category">
              ${product.category}
            </div>

          </div>

          <div class="product-price">
            ${formatPrice(product.price)}
          </div>

        </div>


        <button
          class="add-btn"
          onclick="addToCart(${product.id})"
        >
          Add to cart
        </button>

      </article>
    `;

  }).join("");

}


/* FILTER */

document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".filter")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    const category = button.dataset.category;

    if (category === "all") {

      renderProducts(products);

    } else {

      const filtered = products.filter(
        product => product.category === category
      );

      renderProducts(filtered);

    }

  });

});


/* SEARCH */

searchBtn.addEventListener("click", () => {

  searchPanel.classList.toggle("active");

  searchInput.focus();

});


closeSearch.addEventListener("click", () => {

  searchPanel.classList.remove("active");

  searchInput.value = "";

  renderProducts(products);

});


searchInput.addEventListener("input", () => {

  const query = searchInput.value
    .toLowerCase()
    .trim();

  const results = products.filter(product =>

    product.name
      .toLowerCase()
      .includes(query)

    ||

    product.category
      .toLowerCase()
      .includes(query)

  );

  renderProducts(results);

});


/* CART */

function addToCart(id) {

  const existing = cart.find(
    item => item.id === id
  );

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      id: id,
      quantity: 1
    });

  }

  saveCart();
  renderCart();

  showToast("Added to cart");

}


function changeQuantity(id, amount) {

  const item = cart.find(
    item => item.id === id
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {

    cart = cart.filter(
      item => item.id !== id
    );

  }

  saveCart();
  renderCart();

}


function removeFromCart(id) {

  cart = cart.filter(
    item => item.id !== id
  );

  saveCart();
  renderCart();

  showToast("Item removed");

}


function renderCart() {

  let total = 0;
  let count = 0;


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div style="
        text-align:center;
        color:#777;
        padding:60px 10px;
      ">
        Your cart is empty.
      </div>
    `;

  } else {

    cartItems.innerHTML = cart.map(item => {

      const product = products.find(
        product => product.id === item.id
      );

      if (!product) return "";

      const itemTotal =
        product.price * item.quantity;

      total += itemTotal;

      count += item.quantity;


      return `
        <div class="cart-item">

          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <div>

            <div class="cart-item-name">
              ${product.name}
            </div>

            <div class="cart-item-price">
              ${formatPrice(product.price)}
            </div>

            <div class="quantity">

              <button
                onclick="changeQuantity(${product.id}, -1)"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                onclick="changeQuantity(${product.id}, 1)"
              >
                +
              </button>

            </div>

          </div>

          <button
            class="remove-item"
            onclick="removeFromCart(${product.id})"
          >
            Remove
          </button>

        </div>
      `;

    }).join("");

  }


  cartTotal.textContent =
    formatPrice(total);

  cartCount.textContent = count;

}


/* CART DRAWER */

function openCart() {

  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");

  document.body.classList.add("no-scroll");

}


function closeCartDrawer() {

  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");

  document.body.classList.remove("no-scroll");

}


cartBtn.addEventListener(
  "click",
  openCart
);

closeCart.addEventListener(
  "click",
  closeCartDrawer
);

cartOverlay.addEventListener(
  "click",
  closeCartDrawer
);


/* WISHLIST */

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist = wishlist.filter(
      item => item !== id
    );

    showToast("Removed from wishlist");

  } else {

    wishlist.push(id);

    showToast("Added to wishlist");

  }

  saveWishlist();

  updateWishlistCount();

  renderProducts();

}


function updateWishlistCount() {

  wishlistCount.textContent =
    wishlist.length;

}


document
  .getElementById("wishlistBtn")
  .addEventListener("click", () => {

    const likedProducts = products.filter(
      product => wishlist.includes(product.id)
    );

    if (likedProducts.length === 0) {

      showToast("Your wishlist is empty");

    } else {

      renderProducts(likedProducts);

      document
        .getElementById("shop")
        .scrollIntoView({
          behavior: "smooth"
        });

    }

  });


/* MOBILE MENU */

menuBtn.addEventListener("click", () => {

  mobileMenu.classList.add("active");

});


closeMenu.addEventListener("click", () => {

  mobileMenu.classList.remove("active");

});


document
  .querySelectorAll(".mobile-menu a")
  .forEach(link => {

    link.addEventListener("click", () => {

      mobileMenu.classList.remove("active");

    });

  });


/* TOAST */

let toastTimer;

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2000);

}


/* NEWSLETTER */

document
  .getElementById("newsletterForm")
  .addEventListener("submit", event => {

    event.preventDefault();

    const email =
      document.getElementById("emailInput").value;

    if (email) {

      showToast("You're subscribed!");

      event.target.reset();

    }

  });


/* CHECKOUT */

document
  .getElementById("checkoutBtn")
  .addEventListener("click", () => {

    if (cart.length === 0) {

      showToast("Your cart is empty");

      return;

    }

    showToast(
      "Checkout demo — payment coming soon"
    );

  });


/* INITIAL LOAD */

renderProducts();

renderCart();

updateWishlistCount();