import { cart } from "../data/cart-class.js";
import { orders } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import { formatCurrency } from "./utils/money.js";

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getOrderItems(order) {
  return order.products || order.cartItems || order.cart?.cartItems || [];
}

function getDeliveryDate(order, orderItem) {
  if (orderItem.estimatedDeliveryTime) {
    return formatDate(orderItem.estimatedDeliveryTime);
  }

  const deliveryOption = getDeliveryOption(orderItem.deliveryOptionId);
  const orderDate = new Date(order.orderTime || Date.now());
  orderDate.setDate(orderDate.getDate() + deliveryOption.deliveryDays);
  return formatDate(orderDate);
}

function renderOrder(order) {
  const orderItems = getOrderItems(order);
  const productsHtml = orderItems.map((orderItem) => {
    const product = getProduct(orderItem.productId);
    const productName = product?.name || "Product details unavailable";
    const image = product?.image || "";
    const productId = encodeURIComponent(orderItem.productId || "");
    const orderId = encodeURIComponent(order.id || "");

    return `
      <div class="product-image-container">
        ${image ? `<img src="${image}" alt="${productName}">` : ""}
      </div>
      <div class="product-details">
        <div class="product-name">${productName}</div>
        <div class="product-delivery-date">
          Arriving on: ${getDeliveryDate(order, orderItem)}
        </div>
        <div class="product-quantity">Quantity: ${orderItem.quantity}</div>
        <button
          class="buy-again-button button-primary js-buy-again"
          data-product-id="${productId}"
          data-quantity="${orderItem.quantity}"
        >
          <img class="buy-again-icon" src="images/icons/buy-again.png" alt="">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>
      <div class="product-actions">
        <a href="tracking.html?orderId=${orderId}&productId=${productId}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  }).join("");

  return `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${formatDate(order.orderTime)}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents || 0)}</div>
          </div>
        </div>
        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id || "Unavailable"}</div>
        </div>
      </div>
      <div class="order-details-grid">${productsHtml}</div>
    </div>
  `;
}

async function renderOrders() {
  await loadProductsFetch();

  const ordersGrid = document.querySelector(".orders-grid");
  ordersGrid.innerHTML = orders.length
    ? orders.map(renderOrder).join("")
    : '<p class="empty-orders-message">You have no orders yet.</p>';

  const cartQuantity = document.querySelector(".cart-quantity");
  cartQuantity.textContent = cart.calculateCartQuantity();

  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantity = Number(button.dataset.quantity);
      if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return;
      }

      cart.addToCart(productId, quantity);
      cartQuantity.textContent = cart.calculateCartQuantity();
      button.querySelector(".buy-again-message").textContent = "Added to cart";
    });
  });
}

renderOrders();
