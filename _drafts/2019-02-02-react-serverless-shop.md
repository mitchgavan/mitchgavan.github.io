---
layout: post
title: Create a serverless eCommerce app with React, Stripe and Netlify
description: TODO
image: /images/posts/redux-and-ramda.jpg
---

In this tutorial I'm going to show you how to create your own eCommerce solution so that you can start accepting payments on your website without the need for a traditional server or third-party subscription service. We'll be using React to build the functionality, Netlify to host the site and communicate with Stripe for payment processing.

Before we get started I'd just like to point out that the solution we'll be creating won't cost you anything to run and maintain until you reach the generous limits of Netlify's [free tier](https://www.netlify.com/pricing/). The only thing you'll need to note is that Stripe charges a [small fee](https://stripe.com/au/pricing) for each payment processed, in return for their secure and scalable payment platform. 

We're going to be using [create-react-app](https://facebook.github.io/create-react-app/docs/getting-started) to create our application. It allows to get started quickly with a modern build setup with no configuration. Run the following command to generate your project, feel free to name it whatever you like, I've named mine `my-shop`:

```bash
npx create-react-app my-shop
```

This will generate a base project that we can work off. After that's finished installing, you can view what we currently have, by running the following commands:

```bash
cd my-shop
npm start
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.

## Products UI

Time to start writing some code. First we need some items in our shop. To keep things simple, we'll just add a few items. To do so, create a new directory `src/api` and inside that create a file named `api.js`. This is usually where you would make an api call to fetch your data, but we'll just be hard coding it for simplicity. Add this code to your newly created file:

{% highlight javascript linenos %}
export default [
  {
    id: 1,
    title: 'Shenmue',
    price: 50,
    category: 'Dreamcast',
  },
  {
    id: 2,
    title: 'Sonic Adventure',
    price: 25,
    category: 'Dreamcast',
  },
  {
    id: 3,
    title: 'Soul Calibur',
    price: 30,
    category: 'Dreamcast',
  },
];
{% endhighlight %}

Now let's display these items. Create a new directory `src/components/Product`. We will add a new directory in the `components` directory for each component we create. Inside the `Product` directory. Create a new JavaScript file named `Product.js` and a CSS file named `Product.css`. Add the following code to `Product.js`:

{% highlight jsx linenos %}
import React from 'react';
import './Product.css';

export default ({ onAddToCartClick, price, title }) => (
  <div className="Product">
    <h2 className="Product-title">{title}</h2>
    <div className="Product-price">${price}</div>
    <button className="Product-buy-button" onClick={onAddToCartClick}>
      Add to cart
    </button>
  </div>
);
{% endhighlight %}

`Product` is a simple function component, and doesn't have any state of it's own. It receives some props and will return a React component. React will then efficiently render the elements to the DOM to display a product name, price and add-to-cart button. We now need to style this component, add the following CSS to `Product.css`:

{% highlight css linenos %}
.Product {
  border: 1px solid #eee;
  margin: 1rem 0;
  padding: 1rem;
}

@media (min-width: 800px) {
  .Product {
    margin: 0 1rem;
    width: 33.3333%;
  }
}

.Product-title {
  font-size: 16px;
}

.Product-price {
  margin-bottom: 1rem;
}

.Product-buy-button {
  display: inline-block;
  margin: 0 0 1rem 0;
  padding: 0.85em 1em;
  border: 0;
  outline: 0;
  border-radius: 100em;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  background-color: #61dafb;
  color: #fff;
  cursor: pointer;
  transition-property: background-color, color;
  transition-duration: 0.25s;
  transition-timing-function: ease-out;
  -webkit-appearance: none;
}

.Product-buy-button:hover,
.Product-buy-button:focus {
  background-color: #47b8d7;
}
{% endhighlight %}

Now to utilise our newly created Product component. Open up `src/App.js` and delete all of the code that was generated for you. And add the following:

{% highlight jsx linenos %}
import React, { Component } from 'react';
import items from './api/items';
import Product from './components/Product/Product';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-header-text">Dreamcast Shop</h1>
        </header>
        <main className="App-shop">
          <div className="App-products">
            {items.map(item => (
              <Product key={item.title} title={item.title} price={item.price} />
            ))}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
{% endhighlight %}

At the top of this file we're importing our items api data and our Products component. Then adding some basic layout. The part that renders our products is on line 16. Here we're mapping over our items array and transforming each item in the array into a Product component. We're passing the required props (item and price) to the Product, along with a key prop which React requires in order to efficiently update the DOM.

To finish this section off, replace the CSS in `App.css` with the following:

{% highlight css linenos %}
.App-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 32px;
}

.App-header {
  background-color: #282c34;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-header-text {
  font-size: 16px;
}

.App-shop {
  padding: 1rem 1rem 3rem;
}

.App-products {
  margin: 3rem auto 3.5rem;
  max-width: 800px;
  text-align: center;
}

@media (min-width: 800px) {
  .App-products {
    display: flex;
    justify-content: center;
  }
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
{% endhighlight %}

## Shopping Cart UI

Now let's create the UI for adding products to the shopping cart. Create a new directory `src/components/Cart`. Inside that create a new file named `Cart.js` and add the following code to it:

{% highlight jsx linenos %}
import React from 'react';
import CartItem from './CartItem/CartItem';
import './Cart.css';

export default ({ itemsInCart }) => (
  <div className="Cart">
    <h2 className="Cart-title">Your shopping cart</h2>
    {itemsInCart.length ? (
      <div>
        {itemsInCart.map(item => (
          <CartItem
            key={item.id}
            title={item.title}
            cost={item.price * item.quantity}
            quantity={item.quantity}
          />
        ))}
        <div className="Cart-total-cost">
          Total cost: $
          {itemsInCart
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
            .toFixed(2)}
        </div>
      </div>
    ) : (
      <div>Your cart is empty</div>
    )}
  </div>
);
{% endhighlight %}

This component will render our shopping cart. This component will receive an array of items that have been added to the cart. We don't need to worry about how they got there yet, as the Cart component simply takes a list of items and determines how to render them.

On line 8 we are checking to see if there are any items in the cart, if so we render the items, otherwise we display an empty cart message. On line 10 we are mapping over the items in the array and converting them to CartItem components. We'll need to create this component next. Below the items list we're displaying the total cost of all items. This is the sum of all the items in the cart. And is calculated here using the reduce Array method, which transforms the array of items into a single value. We then call `toFixed(2)` to format the value to decimal points.

Now we just need to style it. Create a new CSS file in `src/components/Cart/` named `Cart.css`. And add the following CSS:

{% highlight css linenos %}
.Cart {
  border-top: 1px solid #eee;
  margin: 0 auto;
  max-width: 800px;
  padding-top: 2rem;
  text-align: center;
}

.Cart-total-cost {
  font-weight: 700;
  padding: 2rem;
}
{% endhighlight %}

Next we need to create the `CartItem` component we're utilising above. Create a new directory `src/components/Cart/CartItem`. Inside that create a new file named `CartItem.js` and add the following code to it: 

{% highlight jsx linenos %}
import  React  from  'react';
import  './CartItem.css';

export  default ({ title, cost, quantity }) => (
import React from 'react';
import './CartItem.css';

export default ({ title, cost, quantity }) => (
  <div className="CartItem">
    <div>{title}</div>
    <div className="CartItem-details">
      <div className="CartItem-quantity">Qty: {quantity}</div>
      <div>${cost.toFixed(2)}</div>
    </div>
  </div>
);
{% endhighlight %}

Once again, this a simple function component that receives some props (title, cost and quantity) and renders them appropriately. Now we just need to style it. Create a new CSS file in `src/components/Cart/CartItem` named `CartItem.css`. And add the following CSS:

{% highlight css linenos %}
.CartItem {
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  text-align: left;
}

.CartItem-details {
  display: flex;
  width: 180px;
}

.CartItem-details div {
  flex: 1 1 50%;
}

.CartItem-quantity {
  padding: 0 1rem;
}
{% endhighlight %}

Now that we have all of the required UI, we need to add the functionality for adding items to the cart. Replace the `src/App.js` with the following code:

{% highlight jsx linenos %}
import React, { Component } from 'react';
import items from './api/items';
import Product from './components/Product/Product';
import Cart from './components/Cart/Cart';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    itemsInCart: [],
  };

  handleAddToCartClick = id => {
    this.setState(state => {
      const itemInCart = state.itemsInCart.find(item => item.id === id);

      // if item is already in cart, update the quantity
      if (itemInCart) {
        return {
          itemsInCart: state.itemsInCart.map(item => {
            if (item.id !== id) return item;
            return { ...itemInCart, quantity: item.quantity + 1 };
          }),
        };
      }

      // otherwise, add new item to cart
      const item = items.find(item => item.id === id);
      return { itemsInCart: [...state.itemsInCart, { ...item, quantity: 1 }] };
    });
  };

  render() {
    const { itemsInCart } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-header-text">Dreamcast Shop</h1>
        </header>
        <main className="App-shop">
          <div className="App-products">
            {items.map(item => (
              <Product
                key={item.title}
                title={item.title}
                price={item.price}
                onAddToCartClick={() => this.handleAddToCartClick(item.id)}
              />
            ))}
          </div>
          <Cart itemsInCart={itemsInCart} />
        </main>
      </div>
    );
  }
}

export default App;
{% endhighlight %}

We've added a few things here. Firstly we've added some state to the App component, which is initialised on line 9 as an empty array. As the name suggests, this will be where the items that have been added to the cart will be stored. On line 49 we have added another prop to the `Product` component named `onAddToCartClick`. This is the function that will get called when the add to cart button is clicked. We are creating a new arrow function here so that we can pass a parameter to the function. This is necessary as the `onClick` event invokes the callback by passing an event object as first and only parameter. So the inline function is returning the `handleAddToCartClick` function with the product ID as an argument. Which is what will get invoked when the add to cart button is clicked. The `handleAddToCartClick` updates the state appropriately.

There's a bit going on in the `handleAddToCartClick` function so let's dissect it. Firstly we are calling React's `setState()` with a function as the argument, this is referred to as the `updater` function. We're passing a function here because we need access to the previous state, and doing it this way guarantees the state is up to date. On the next line we're trying to find the item in the cart based on it's ID by using the `find()` array method, which will iterate of the `itemsInCart` state and return an item if the ID of the item matches the ID parameter passed in. Then if the item is found in the cart we increment the quantity property of that item in an immutable fashion. If there is no item in the cart with that ID, we need to add it to the cart. We accomplish this by first finding the item in our `items` array, and then returning an updated state object with that item appended to `itemsInCart`.

Finally, we've imported the Cart component and added it to the render function on line 53.  We're passing the list of `itemsIncart` from the App component's state to Cart component via a prop. And with that we have a basic functioning shopping cart user interface.

## Checkout form with stripe elements
We are going to make use of [Stripe Elements](https://stripe.com/payments/elements) to create the checkout form. Stripe Elements are a set of pre-built UI components, created by Stripe, to help you securely collect your customer's card details. They have also created [react-stripe-elements](https://github.com/stripe/react-stripe-elements), which includes these elements are React components. This is what we'll be using, go ahead and install it with this command:
```
npm install react-stripe-elements
```


## Setup Netlify Lambda

## Write Lambda function code to tokenize payment

## Deploy to netlify
