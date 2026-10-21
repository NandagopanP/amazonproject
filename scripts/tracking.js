import { cart } from "../data/cart-class.js";
import { orders } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getOrderItems(order) {
  return order.products || order.cartItems || order.cart?.cartItems || [];
}

async function renderTrackingDetails() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");
  const order = orders.find(
    (savedOrder) => String(savedOrder.id) === orderId,
  );
  const orderItem = order && getOrderItems(order).find(
    (item) => item.productId === productId,
  );
  const product = orderItem && getProduct(orderItem.productId);
  const productNameElement = document.querySelector(".js-product-name");

  document.querySelector(".cart-quantity").textContent =
    cart.calculateCartQuantity();

  if (!order || !orderItem || !product) {
    productNameElement.textContent = "Order or product not found.";
    document.querySelector(".js-delivery-date").textContent = "";
    document.querySelector(".js-product-quantity").textContent = "";
    document.querySelector(".js-product-image").hidden = true;
    return;
  }

  const deliveryDate = orderItem.estimatedDeliveryTime
    ? orderItem.estimatedDeliveryTime
    : (() => {
        const date = new Date(order.orderTime || Date.now());
        date.setDate(
          date.getDate() +
            getDeliveryOption(orderItem.deliveryOptionId).deliveryDays,
        );
        return date;
      })();

  document.querySelector(".js-delivery-date").textContent =
    `Arriving on ${formatDate(deliveryDate)}`;
  productNameElement.textContent = product.name;
  document.querySelector(".js-product-quantity").textContent =
    `Quantity: ${orderItem.quantity}`;

  const productImage = document.querySelector(".js-product-image");
  productImage.src = product.image;
  productImage.alt = product.name;
  productImage.hidden = false;
}

renderTrackingDetails();
