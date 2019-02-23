---
layout: post
title: Create a serverless eCommerce site with React, Stripe and Netlify
description: In this tutorial we're going to create a serverless eCommerce react app that includes a Lambda function for payment processing via Stripe.
image: /images/posts/serverless-shop.jpg
---

In this tutorial we're going to create an eCommerce web app that accepts payments without the need for a traditional server. We'll use React (with hooks!) to build a simple UI for demo purposes. We'll integrate Stripe for payment processing. Stripe requires a server to process a payment, so we'll create a Lambda function to handle that. Netlify lets you deploy Lambda functions without an AWS account, with function management handled within Netlify. And Netlify will also handle our deployment and hosting. You can view the final result of what we'll be creating, hosted on Netlify [here](https://serverless-shop-demo.netlify.com/).

So why a static site with a serverless backend (aka the [JAMStack](https://jamstack.org/)) over a traditional server rendered app? Improved security; server-side processes abstracted into microservice APIs means that surface areas for attacks are reduced. Whilst leveraging the domain expertise of specialist third-party services. Cheaper, easier hosting and scaling; the static site is just a stack of files that can be served anywhere, and scaled with CDNs. Whilst with Lambda functions you only pay for what use as it doesn't need to be constantly running and will automatically scale based on traffic.

The solution we'll be creating won't cost you anything to run and maintain until you reach the generous limits of Netlify's [free tier](https://www.netlify.com/pricing/). The only thing you'll need to note is that Stripe charges a [small fee](https://stripe.com/au/pricing) for each payment processed, in return for usage of their secure, scalable payment platform.

We're going to be using [create-react-app](https://facebook.github.io/create-react-app/docs/getting-started) to create our application. It allows you to get started quickly with a modern build setup without requiring any configuration. Run the following command to generate your project, feel free to name it whatever you like, I've named mine `my-shop`:

```text
npx create-react-app my-shop
```

This will generate a base project that we can work off. After that's finished installing, you can view what we currently have, by running the following commands:

```text
cd my-shop
npm start
```

Then open [http://localhost:3000](http://localhost:3000/) in your browser to view your app.

## Products UI

Time to start writing some code. First we need to add some items to our shop. To keep things simple, we'll just add a few items. To do so, create a new directory `src/api` and inside that create a file named `api.js`. This is usually where you would make an api call to fetch your data, but we'll just be hard coding it for the sake of simplicity in this tutorial. Add this code to your newly created file:

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

Now let's display these items. Create a new directory `src/components/Product`. We'll add a new directory in the `components` directory for each component we create. Inside the `Product` directory. Create a new JavaScript file named `Product.js` and a CSS file named `Product.css`. Add the following code to `Product.js`:

{% highlight jsx linenos %}
import React from 'react';
import './Product.css';

export default function Product({ onAddToCartClick, price, title }) {
  return (
    <div className="Product">
      <h2 className="Product-title">{title}</h2>
      <div className="Product-price">${price}</div>
      <button className="Product-buy-button" onClick={onAddToCartClick}>
        Add to cart
      </button>
    </div>
  );
}
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

Now to utilise our newly created Product component. Open up `src/App.js` and delete all of the code that was generated for you. Then add the following:

{% highlight jsx linenos %}
import React from 'react';
import items from './api/items';
import Product from './components/Product/Product';
import logo from './logo.svg';
import './App.css';

export default function App() {
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
{% endhighlight %}

At the top of this file we're importing our items api data and our Products component. Then adding some basic layout. The part that renders our products is on line 16. Here we're mapping over our items array and transforming each item in the array into a Product component. We're passing the required props (item and price) to each Product, along with a key prop which React requires in order to efficiently update the DOM.

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

export default function Cart({ itemsInCart, totalCost }) {
  return (
    <div className="Cart">
      <h2 className="Cart-title">Your shopping cart</h2>
      {itemsInCart.length > 0 ? (
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
            Total cost: ${totalCost.toFixed(2)}
          </div>
        </div>
      ) : (
        <div>Your cart is empty</div>
      )}
    </div>
  );
}
{% endhighlight %}

Our `<Cart />` component will render our shopping cart. This component will receive an array of items that have been added to the cart. We don't need to worry about how they got there yet, as the Cart component simply takes a list of items and determines how to render them.

On line 9 we are checking to see if there are any items in the cart, if so we render the items, otherwise we display an empty cart message. On line 11 we are mapping over the items in the array and converting them to `<CartItem />` component - we'll need to create this component next. We're passing the required props through to the component, including a `cost` prop, which we're calculating by multiplying the price by the quantity.

Below the items list we're displaying the total cost of all items in the cart. We'll calculate this in the `<App />` and pass it down, as we require it in multiple places. We are calling `toFixed(2)` to format the total cost to decimal places.

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

Next we need to create this `<CartItem />` component that we've just utilized above. Create a new directory `src/components/Cart/CartItem`. Inside that create a new file named `CartItem.js` and add the following code to it:

{% highlight jsx linenos %}
import React from 'react';
import './CartItem.css';

export default function CartItem({ title, cost, quantity }) {
  return (
    <div className="CartItem">
      <div>{title}</div>
      <div className="CartItem-details">
        <div className="CartItem-quantity">Qty: {quantity}</div>
        <div>${cost.toFixed(2)}</div>
      </div>
    </div>
  );
}

{% endhighlight %}

Once again, this a simple function component that receives some props (title, cost and quantity) and renders it accordingly. Now we just need to style it. Create a new CSS file in `src/components/Cart/CartItem` named `CartItem.css`. And add the following CSS:

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

Now that we have all of the required UI, we need to add the functionality for adding items to the cart. Update `src/App.js` with the following code:

{% highlight jsx linenos %}
import React, { useState } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import items from './api/items';
import Product from './components/Product/Product';
import Cart from './components/Cart/Cart';
import CheckoutForm from './components/CheckoutForm/CheckoutForm';
import logo from './logo.svg';
import './App.css';

export default function App() {
  const [itemsInCart, setItemsInCart] = useState([]);

  const handleAddToCartClick = id => {
    setItemsInCart(itemsInCart => {
      const itemInCart = itemsInCart.find(item => item.id === id);

      // if item is already in cart, update the quantity
      if (itemInCart) {
        return itemsInCart.map(item => {
          if (item.id !== id) return item;
          return { ...itemInCart, quantity: item.quantity + 1 };
        });
      }

      // otherwise, add new item to cart
      const item = items.find(item => item.id === id);
      return [...itemsInCart, { ...item, quantity: 1 }];
    });
  };

  const totalCost = itemsInCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
              onAddToCartClick={() => handleAddToCartClick(item.id)}
            />
          ))}
        </div>
        <Cart itemsInCart={itemsInCart} totalCost={totalCost} />
      </main>
    </div>
  );
}
{% endhighlight %}

We've added a few things here. Firstly we've added the `itemsInCart` state to the App component, which is initialized on line 9 as an empty array. As the name suggests, this will be where the items that have been added to the cart will be stored. On line 49 we have added another prop to the `<Product />` component named `onAddToCartClick`. This is the function that will get called when the add to cart button is clicked. We are creating a new arrow function here so that we can pass a parameter to the function. This is necessary as the `onClick` event invokes the callback by passing an event object as the first and only parameter. So the inline function is returning the `handleAddToCartClick` function with the product ID as an argument. Which is what will get invoked when the add to cart button is clicked. And the `handleAddToCartClick` function will update the state accordingly.

There's a bit going on in the `handleAddToCartClick` function so let's dissect it. Firstly we're calling `setItemsInCart`, which is the name we assigned to the function returned from calling `useState()`. And we're calling `setItemsInCart` with a function as the argument, this is referred to as the `updater` function. We're passing a function here because we need access to the previous state, and doing it this way, rather than accessing the `itemsInCart` state directly, guarantees the state is up to date.

On the next line we're trying to find the item in the cart based on it's ID by using the `find()` array method. This will iterate over the `itemsInCart` array and return an item if the ID of the item matches the ID parameter passed in. Then if the item is found in the cart we increment the quantity property of that item in an immutable fashion. If there is no item in the cart with that ID, we need to add it to the cart. We accomplish this by first finding the item in our `items` array, and then returning an updated state object with that item appended to `itemsInCart`.

Finally, we've imported the `<Cart />` component and added it to the render function on line 53.  We're passing it the items and the total cost of the items via props. The total cost is calculated on line 31 by using the `reduce()` array method, which transforms the array of items into a single value, in this case by adding each value to the previous. And with that we have a basic functioning shopping cart user interface.

## Checkout form with Stripe Elements

We are going to make use of [Stripe Elements](https://stripe.com/payments/elements) to create the checkout form. Stripe Elements are a set of pre-built UI components created by Stripe, to help you securely collect your customer's card details. They have also created [react-stripe-elements](https://github.com/stripe/react-stripe-elements), which includes these elements as React components. This is what we'll be using, go ahead and install it with this command:

{% highlight text %}
npm install react-stripe-elements
{% endhighlight %}

Next we need to add the Stripe.js library inside the `head` tag of`public/index.html`. 

{% highlight html %}
<head>
  <!-- add this somewhere before the closing head tag -->
  <script src="https://js.stripe.com/v3/"></script>
</head>
{% endhighlight %}

This library is responsible for communicating with Stripe and performing the tokenization. We need to add it to the page this way for [PCI compliance](https://www.pcicomplianceguide.org/faq/). It cannot be included in our script bundle, as it needs to be loaded from Stripe's servers at runtime. The `react-stripe-elements` library depends upon this script.

Now that we've got that setup we can go ahead and create the `<CheckoutForm />` component. Create a new directory `src/components/CheckoutForm` and add a file named `CheckoutForm.js`, then add the following to it:

{% highlight jsx linenos %}
import React, { useState } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import './CheckoutForm.css';

function CheckoutForm({ stripe, totalCost }) {
  const [status, setStatus] = useState('default');

  const submit = async e => {
    e.preventDefault();

    setStatus('submitting');

    try {
      let { token } = await stripe.createToken({ name: 'Name' });

      let response = await fetch('/.netlify/functions/charge', {
        method: 'POST',
        body: JSON.stringify({
          amount: totalCost * 100,
          token: token.id,
        }),
      });

      if (response.ok) {
        setStatus('complete');
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'complete') {
    return <div className="CheckoutForm-complete">Payment successful!</div>;
  }

  return (
    <form className="CheckoutForm" onSubmit={submit}>
      <h4>Would you like to complete the purchase?</h4>
      <CardElement />
      <button
        className="CheckoutForm-button"
        type="submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Submitting' : 'Submit Order'}
      </button>
      {status === 'error' && (
        <div className="CheckoutForm-error">Something went wrong.</div>
      )}
    </form>
  );
}

export default injectStripe(CheckoutForm);
{% endhighlight %}

This is our completed checkout form. At the top we're importing the `CardElement` component from `react-stripe-elements`, this includes inputs for all of the required card fields: the card number, the expiration date, and the CVC. There other Stripe Element components available should you want to display these as separate inputs. The `CardElement` also handles client side validation of the input fields for us. To enable this, we're wrapping the `CheckoutForm` in the `injectStripe` function. This returns a new component with the Stripe object injected.

On line 6 we're initializing a `status` state with the `useState` hook. This will indicate the status of the checkout form. The different states our checkout form can be in are `'default'`, `'submitting'`, `'error'` and `'complete'`. Upon submission of the checkout form, the `submit` function will tokenize the card information and send it to the server. Let's dive deeper into how we're accomplishing this. We first set the `status` to `'submitting'` and as a result the submit button will be disabled and display the text `submitting`.

Then we're invoking the `createToken` function available on the `stripe` prop. The `stripe` prop is made available here due to the fact that on line 56, we've wrapped the component in the `injectStripe()` function. Note that we're passing in a hard coded string of `'Name'` as the value for the name key. This is because in this app, we're not asking for the name on the card since it's not a requirement. But if your shop was requesting the name, this is where you would use that value.

We're sending the token along with the charge amount, which we're converting to cents by multiplying by 100, to the server via our api endpoint. This is the endpoint generated for us based on our Netlify configuration. If the request is successful we set the `status` state to `'complete'`, which will cause the successful payment UI to display. Otherwise we set the `status` state to `'error'`, which will display an error message.

We now need to add some styles for the checkout form. Create a new CSS file in `src/components/CheckoutForm/CheckoutForm` named `CheckoutForm.css`. And add the following CSS:

{% highlight css linenos %}
.CheckoutForm {
  border-top: 1px solid #eee;
  margin: 0 auto;
  max-width: 800px;
  padding-top: 2rem;
  text-align: center;
}

.CheckoutForm-complete {
  color: #7fdc45;
  font-weight: 700;
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

.CheckoutForm-button:disabled {
  background-color: #ccc;
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

Now we need to add the checkout form to our app. So back in our `App.js` we need to add the following to where the rest of our imports are located:

{% highlight js %}
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './components/CheckoutForm/CheckoutForm';
{% endhighlight %}

Then we'll use these components in the `render` function. Directly after the `<Cart />` element, add the following:

{% highlight jsx %}
{itemsInCart.length > 0 && (
  <StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
    <Elements>
      <CheckoutForm totalCost={totalCost} />
    </Elements>
  </StripeProvider>
)}
{% endhighlight %}

Our `CheckoutForm` component is enclosed within the Stripe Elements components. The `StripeProvider` component initializes Stripe and passes in your publishable key. This is a test key, you'll need to get your key from your Stripe account dashboard.

The Elements component creates an Elements group. When you use multiple Stripe Elements components instead of the combined `CardElement` that we're using, the Elements group indicates they're related. For example, if you used separate components for the card number, expiration date, and CVC, you would put them all in the same Elements group. Note that Elements must contain the component that we wrapped with `injectStripe`.

## Tokenize payment inside Lambda function

Now we have to write our server side code to handle the api call we're making upon the form submission. As mentioned earlier, we'll be using Lambda functions on Netlify. Netlify lets you deploy Lambda functions without an AWS account, and handles setting up API gateways and deployment configurations for you. With function management handled directly within Netlify. 

Our Lambda function will be executed when we submit the checkout form. With Netlify functions, each JavaScript file to be deployed as a Lambda function must export a handler method with the following structure:

{% highlight js %}
exports.handler = function(event, context, callback) {
    // your server-side functionality
}
{% endhighlight %}

When you call a Netlify Lambda function’s endpoint, the handler receives an event object similar to what you would receive from a Lambda set up with AWS API Gateway:

{% highlight js %}
{
    "path": "Path parameter",
    "httpMethod": "Incoming request's method name"
    "headers": {Incoming request headers}
    "queryStringParameters": {query string parameters }
    "body": "A JSON string of the request payload."
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
}
{% endhighlight %}

We don't need to worry about the `context` parameter, but if you would like more info visit the [docs](https://www.netlify.com/docs/functions/). We'll be using the `callback` parameter to return either an error or a success response.

Let's start writing our Lambda function. First we need to install the [Stripe client library](https://github.com/stripe/stripe-node) as a dev dependency:

{% highlight text %}
npm install stripe --save-dev
{% endhighlight %}

Then inside the `src/lambda` directory add a new file named `charge.js`, and add the following code:

{% highlight js linenos %}
const stripe = require('stripe')('sk_test_yaKbjP7rkSGdMeQtQvTMx4cG');

exports.handler = (event, context, callback) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed' });
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
      currency: 'usd',
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

This will look familiar to you if you've ever written a Lambda function with Node.js before. On line 1 we are initializing the Stripe library with our secret key. Note that this is a test key, you can find your secret key in your Stripe dashboard. We're using the `require` syntax here, as Node.js support for `import` syntax is still experimental. Inside the `handler` method we're first checking if the request is a `POST` request method, and returning a 405 error if it is not.

Then we parse the body content, and check to see if the required data has been provided. Along with a simple check that the amount is a positive value. If not we return a 400 error.

On line 20 we're using the Stripe client library to create a charge with the token and amount provided in the request body. We're specifying US dollars. If the charge is successful we return a 200 response with the successful status object (which in this case is just a string `'succeeded'`). If the charge fails and an exception is thrown, and we return a 400 error.

## Setup Netlify Lambda
Before we can utilize our new api endpoint there's a little bit of initial setup required. First install the `netlify-lambda` package:

{% highlight text %}
npm install netlify-lambda --save-dev
{% endhighlight %}

Next we need to define where the functions will be built to and served from. Create a new file in the root directory of the project named `netlify.toml`, and add the following to it:

{% highlight text %}
[build]
  Command = "npm run build"
  Functions = "lambda"
  Publish = "build"
{% endhighlight %}

Here we're telling Netlify that our Lambda functions will be in a directory named `lambda` and our publish folder is `build` - as that is the default for `create-react-app`. Now we need to set up a way to run the Lambda function. To do so, we can add a `start:lambda` script to the scripts section of our `package.json`, so our scripts section should now look like this:

{%highlight json %}
"scripts": {
  "start": "react-scripts start",
  "start:lambda": "netlify-lambda serve src/lambda",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
},
{% endhighlight %}

Now when we run `npm run start:lambda` our Lambda function will be running on `localhost:9000`. But if we try to access our new endpoint from our react app we'll get a CORS error. In order for us to be able to access this endpoint in our react app during development we need to set up a proxy. First, `install http-proxy-middleware` using npm:

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

This creates a proxy by directly accessing the Express app instance created by create react app ([proxy documentation](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development)). Note that our Lambda function will be served from the same origin once deployed, this change is only required for local development.
If we run both the app and the Lambda by running `npm start` and `npm run start:lambda`, our api call will now work as expected when accessed through `http://localhost:3000`.

## Convenient build scripts

During development we currently have to start the react app and the Lambda function with two separate commands. We'll also need to build each of these when preparing for deployment. Let's improve that so that we only need to run a single command for each of these cases. To run multiple NPM scripts install [npm-run-all](https://www.npmjs.com/package/npm-run-all) as a dev dependency:

{%highlight js text %}
npm install npm-run-all --save-dev
{% endhighlight %}

Then update the `scripts` block of your `package.json` to the following:

{%highlight js linenos %}
  "scripts": {
    "start": "run-p start:**",
    "start:app": "react-scripts start",
    "start:lambda": "netlify-lambda serve src/lambda",
    "build": "run-p build:**",
    "build:app": "react-scripts build",
    "build:lambda": "netlify-lambda build src/lambda",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
{% endhighlight %}

We can now run `npm start` to start both the react app and the Lambda. And we can run `npm run build` to build them both.

## Deploy to Netlify

We're now ready to deploy to Netlify. This is super simple and Netlify will walk you through the few steps required. In the Netlify console be sure to configure your site to run `npm run build` as the build command, and set the build directory to `build`. If your app is using Github or something similar for version control, you'll Netlify will set up a modern continuos integration pipeline for you. Checkout the [Netlify docs](https://www.netlify.com/docs/welcome/) for more details on setting this up.

## That's it!

Our little eCommerce app is ready to start accepting payments! Here's a link to a [completed version](https://serverless-shop-demo.netlify.com/) of this tutorial. Although the user interface only provides very basic functionality, we've created a modern eCommerce app that's secure, scalable and cheap to run. You can view the full source code of the completed demo on [Github](https://github.com/mitchgavan/serverless-shop-tutorial).
