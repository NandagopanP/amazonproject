import { formatCurrency } from "../scripts/utils/money.js";

export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  return matchingProduct;
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return "";
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails); // calls constructor of the parent class
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    //Method overriding. This will override or replace parents method
    return `
    <a href = "${this.sizeChartLink}" target = "_blank">Size chart</a>
    `;
  }
}
/*
const date = new Date();  // built in class
date.toLocaleDateString;
date.toLocaleTimeString;
*/

export let products = [];

export function loadProductsFetch() {
 const promise =  fetch("https://supersimplebackend.dev/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      products = productsData.map((productDetails) => {
        if (productDetails.type === "clothing") {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
      console.log("load products");

    }).catch((error)=>{
      console.log('Unexpected error')
    })
    return promise;
}


// loadProductsFetch().then(()=>{
//   console.log('Next step')
// })

export function loadProducts(fn) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    products = JSON.parse(xhr.response).map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });
    console.log("load products");

    fn(); //Callback -  A function to run in the future
  });

  xhr.addEventListener('error',(error)=>{
    console.log('Unexpected error')
  })

  xhr.open("GET", "https://supersimplebackend.dev/products");
  xhr.send();
}


