const menu = [
  { id: 1, name: "Jollof Rice & Chicken", description: "Smoky party jollof with grilled chicken", price: 3500 },
  { id: 2, name: "Fried Rice & Turkey", description: "Fried rice with peppered turkey", price: 4000 },
  { id: 3, name: "Pounded Yam & Egusi", description: "Soft pounded yam with egusi soup", price: 3000 },
  { id: 4, name: "Suya Platter", description: "Spicy beef suya with onions and pepper", price: 2500 },
  { id: 5, name: "Chilled Zobo", description: "Refreshing hibiscus drink", price: 800 },
];

let cart = {}; // { itemId: quantity }

const menuEl = document.getElementById("menu");
const cartItemsEl = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const form = document.getElementById("order-form");
const messageEl = document.getElementById("message");

function formatPrice(amount) {
  return "₦" + amount.toLocaleString();
}

function renderMenu() {
  menuEl.innerHTML = "";
  menu.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <strong>${formatPrice(item.price)}</strong>
      <button data-id="${item.id}">Add to cart</button>
    `;
    menuEl.appendChild(card);
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function changeQuantity(id, change) {
  cart[id] = (cart[id] || 0) + change;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function getCartItems() {
  return Object.keys(cart).map((id) => {
    const item = menu.find((m) => m.id === Number(id));
    return { id: item.id, name: item.name, price: item.price, quantity: cart[id] };
  });
}

function getTotal() {
  return getCartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const items = getCartItems();
  cartItemsEl.innerHTML = "";

  if (items.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>
        <button data-action="minus" data-id="${item.id}">-</button>
        <button data-action="plus" data-id="${item.id}">+</button>
      </span>
    `;
    cartItemsEl.appendChild(row);
  });

  totalEl.textContent = formatPrice(getTotal());
}

menuEl.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (id) addToCart(Number(id));
});

cartItemsEl.addEventListener("click", (e) => {
  const { action, id } = e.target.dataset;
  if (action === "plus") changeQuantity(Number(id), 1);
  if (action === "minus") changeQuantity(Number(id), -1);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const items = getCartItems();
  if (items.length === 0) {
    messageEl.textContent = "Please add at least one item.";
    return;
  }

  const order = {
    customer: {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
    },
    items,
    total: getTotal(),
  };

  // Phase 2: we will send this to our server instead
  console.log("New order:", order);

  messageEl.textContent = "Order placed! (not saved yet, backend comes next)";
  cart = {};
  renderCart();
  form.reset();
});

renderMenu();
renderCart();