---
layout: post
title: Create a serverless eCommerce site with React, Stripe and Netlify
description: TODO
image: /images/posts/redux-and-ramda.jpg
---

In this tutorial I'm going to show you how to create your own eCommerce solution so that you can start accepting payments on your website without the need for a traditional server or third-party subscription service. We'll be using React (with hooks!) to build the functionality, communicate with Stripe for payment processing, and Netlify to deploy and host the site. You can view the final result of what we'll be creating [here](https://google.com).

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

## Checkout form with Stripe Elements
We are going to make use of [Stripe Elements](https://stripe.com/payments/elements) to create the checkout form. Stripe Elements are a set of pre-built UI components, created by Stripe, to help you securely collect your customer's card details. They have also created [react-stripe-elements](https://github.com/stripe/react-stripe-elements), which includes these elements are React components. This is what we'll be using, go ahead and install it with this command:

{% highlight bash linenos %}
npm install react-stripe-elements
{% endhighlight %}

Next we need to add the Stripe.js library inside the `head` tag of`public/index.html`. This library is responsible for communicating with Stripe and performing the tokenization. We need to add it to the page this way for [PCI compliance](https://www.pcicomplianceguide.org/faq/), it cannot be included in our script bundle, as it needs to be loaded from Stripe's servers at runtime. The `react-stripe-elements` library depends upon this script.

Now that we've got that setup we can go ahead and create the checkout form component. Create a new directory `src/components/CheckoutForm` and add a file named `CheckoutForm.js`, then add the following to it:

{% highlight jsx linenos %}
import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import './CheckoutForm.css';

class CheckoutForm extends Component {
  submit = e => {
    e.preventDefault();
    console.log('submitted');
  };

  render() {
    return (
      <form className="CheckoutForm" onSubmit={this.submit}>
        <h4>Would you like to complete the purchase?</h4>
        <CardElement />
        <button className="CheckoutForm-button" type="submit">
          Submit Order
        </button>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);

{% endhighlight %}

Submitting the form currently only logs that the form was submitted. Instead of adding an `onClick` handler, we're adding the `onSubmit` handler to the `form` that encapsulates it. This is preferable as the user can submit the form by pressing the enter key as well as clicking the submit button.

We're importing the `CardElement` component from `react-stripe-elements`, this includes inputs for all of the major card fields: the card number, the expiration date, and the CVC. There other Stripe Element components if you want to display those inputs separately. The `CardElement` also handles client side validation of the input fields for us. To enable this, we're wrapping the `CheckoutForm` in the injectStripe function. This returns a new component with an injected stripe prop, which contains a Stripe object.

We now need to add some styles for the checkout form. Create a new CSS file in `src/components/CheckoutForm/CheckoutForm` named `CheckoutForm.css`. And add the following CSS:

{% highlight css linenos %}
.CheckoutForm {
  border-top: 1px solid #eee;
  margin: 0 auto;
  max-width: 800px;
  padding-top: 2rem;
  text-align: center;
}

.CheckoutForm-button {
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
  background-color: #7fdc45;
  color: #fff;
  cursor: pointer;
  transition-property: background-color, color;
  transition-duration: 0.25s;
  transition-timing-function: ease-out;
  -webkit-appearance: none;
}

.CheckoutForm-button:hover,
.CheckoutForm-button:focus {
  background-color: #68b637;
}

.CheckoutForm-error {
  color: #dc4545;
}

.StripeElement {
  display: block;
  margin: 0.5rem auto 1.5rem;
  max-width: 500px;
  padding: 12px 16px;
  font-size: 1rem;
  border: 1px solid #eee;
  border-radius: 3px;
  outline: 0;
  background: white;
}
{% endhighlight %}

Now we need to add the checkout form to our app. So back in our `App.js` we need to add the following where the rest of our imports are, add the following:

{% highlight js %}
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './components/CheckoutForm/CheckoutForm';
{% endhighlight %}

Then we'll use these components in the `render` function. Directly after the `<Cart />` element, add the following:

{% highlight jsx %}
{itemsInCart.length > 0 && (
  <StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
)}
{% endhighlight %}

Our `CheckoutForm` component is enclosed within the Stripe Elements components. The `StripeProvider` component initializes Stripe and passes in your publishable key. This is a test key, you'll need to get your key from your Stripe account dashboard.

The Elements component creates an Elements group. When you use multiple Stripe Elements components instead of the combined `CardElement` that we're using, the Elements group indicates they're related. For example, if you used separate components for the card number, expiration date, and CVC, you would put them all in the same Elements group. Note that Elements must contain the component that you wrapped with `injectStripe`.

## Create a token for securely sending card information
Back in the `CheckoutForm` component, we need to update the `submit` function so that it tokenizes the card information and sends it to the server. Replace what we currently have in `src/components/CheckoutForm/CheckoutForm.js` with the following:

{% highlight jsx linenos%}
import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import './CheckoutForm.css';

class CheckoutForm extends Component {
  state = {
    complete: false,
    errorMessage: null,
  };

  submit = async e => {
    e.preventDefault();

    try {
      let { token } = await this.props.stripe.createToken({ name: 'Name' });

      let response = await fetch('/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: token.id,
      });

      if (response.ok) {
        this.setState({ complete: true });
      }
    } catch (err) {
      this.setState({
        errorMessage: err.message || 'Sorry, something went wrong.',
      });
    }
  };

  render() {
    const { complete, errorMessage } = this.state;

    if (complete) {
      return <div>Payment successful!</div>;
    }

    return (
      <form className="CheckoutForm" onSubmit={this.submit}>
        <h4>Would you like to complete the purchase?</h4>
        <CardElement />
        <button className="CheckoutForm-button" type="submit">
          Submit Order
        </button>
        {errorMessage && (
          <div className="CheckoutForm-error">{errorMessage}</div>
        )}
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
{% endhighlight %}

TODO explain the changes made here.

## Write Lambda function code to tokenize payment
Intro to lambda code

{% highlight js linenos %}
const stripe = require('stripe')('sk_test_yaKbjP7rkSGdMeQtQvTMx4cG');

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

  if (!data.token || parseInt(data.amount) < 1) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Some required fields were not supplied.',
      }),
    });
  }

  stripe.charges
    .create({
      amount: parseInt(data.amount),
      currency: 'aud',
      description: 'Dreamcast game shop',
      source: data.token,
    })
    .then(({ status }) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({ status }),
      });
    })
    .catch(err => {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: `Error: ${err.message}`,
        }),
      });
    });
};
{% endhighlight %}

Explain what is going on in the code above.

## Setup Netlify Lambda
Now we have to write our server side code to handle the api call we are making upon the form submission. As mentioned earlier, we'll be using lambda functions on Netlify. Netlify lets you deploy Lambda functions without an AWS account, and handles setting up API gateways and deployment configurations for you. With function management handled directly within Netlify. After a little bit of set up, all we have to worry about is write the code within the lambda function. So let's get that set up now. Start by installing the `netlify-lambda` package:

{% highlight bash %}
npm install netlify-lambda --save-dev
{% endhighlight %}

Next we need to define where the functions will be built to and served from. Create a new file in the root directory of the project named `netlify.toml`, and add the following to it:

{% highlight text %}
[build]
  Command = "npm run build"
  Functions = "lambda"
  Publish = "build"
{% endhighlight %}

Here we're telling Netlify that our lambda functions will be in a directory named `lambda` and our publish folder is `build` - as that is the default for `create-react-app`. Now we need to set up a way to run the lambda function. To do so, we can add a `start:lambda` script to the scripts section of our `package.json`, so our scripts section should now look like this:

{%highlight json %}
"scripts": {
  "start": "react-scripts start",
  "start:lambda": "netlify-lambda serve src/lambda",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
},
{% endhighlight %}

Now when we run `npm run start:lambda` our lambda function will be running on `localhost:9000`. But if we try to access our new endpoint from our react app we'll get a CORS error. In order for us to be able to use our lambda functions in our react app during development we need to set up a proxy. First, `install http-proxy-middleware` using npm:

{% highlight text %}
npm install http-proxy-middleware --save
{% endhighlight %}

Then create a new file `src/setupProxy.js` and add the following:

{%highlight js linenos %}
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/.netlify/functions/', {
      target: 'http://localhost:9000/',
      pathRewrite: {
        '^/\\.netlify/functions': '',
      },
    })
  );
};
{% endhighlight %}

This creates a proxy by directly accessing the Express app instance created by create react app ([proxy documentation](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development)). Note that our lambda function will be served from the same origin once deployed, this change is only required for local development.
If we run both the app and the lambda by running `npm start` and `npm run start:lambda`, our api call will now work as expected when accessed through `http://localhost:3000`.

## Deploy to netlify
