import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
//import "../data/car.js"
//import "../data/backend-practice.js"

async function loadPage() {
  //async makes a function return a promise
  try {
    await loadProductsFetch(); //await lets us wait for a promise to finish. We can only use it when its inside an async fn.
    await new Promise((resolve) => {
      loadCart(() => {
        resolve("value2");
      });
    });
  } catch (error) {
    console.log('Unexpected error , please try again later')
  }
  renderOrderSummary();
  renderPaymentSummary();
  return "value2";
}

loadPage().then((value) => {
  console.log("next step");
  console.log(value);
});
/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve("value2");
    });
  }),
]).then((values) => {
  console.log(values);
  renderOrderSummary();
  renderPaymentSummary();
});
*/
// new Promise((resolve)=>{

//   loadProducts(()=>{

//     resolve();
//   });
// }).then(()=>{
//    return new Promise((resolve)=>{
//    loadCart(()=>{
//     resolve();
//    });
//    })
// }).then(()=>{
//   renderOrderSummary();
//   renderPaymentSummary();
// });

//  loadProducts(()=>{
//   loadCart(()=>{
//     renderOrderSummary();
//     renderPaymentSummary();
//   });

// });
