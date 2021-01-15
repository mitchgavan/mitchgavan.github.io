---
layout: post
title: Taking care when code-splitting in React
description: TODO
image: /images/posts/styleguide-dev.jpg
---

Most React apps will use some type of bundler, such as Webpack, to combine their source files into a bundle. As your application grows so does your bundle. Code-splitting is a technique used to reduce your bundle size. A good place to split your bundle is based on routes. So that users only download files when they're needed. Rather than downloading the whole application upfront.

Code-splitting in React is relatively simple to implement these days. It can be accomplished with dynamic imports and `React.lazy`. However, it also introduces a new point of failure. Since the files are now being dynamically loaded, the requests may fail. Due to a network error for example.

The problem with lazy loading and deployments
Let's say we're using Create React App. We've implemented route based code-splitting with lazy loading in our application. We run our build process to generate files for production. The default webpack configuration in Create React App (and best practice) is to hash your assets. For example in CRA, your JavaScript and CSS file names will resemble the following:

```text
`main.[hash].chunk.js`
`1.[hash].chunk.js`
`2.[hash].chunk.js`
```

Each of your JS and CSS files will have a unique hash appended to the filename that is generated, which allows you to use aggressive caching techniques to avoid the browser re-downloading your assets if the file contents haven't changed. If the contents of the file changed in a subsequent build, the filename hash that is generated will be different.

We then upload our new assets to the server and delete the old files. Which is pretty common practice. Netlify deployments work this way. A user may have the application open in a browser tab during a new deployment. If this was the case and they tried to navigate to a different route, there is a possibility that the required JS file is no longer available from your server. So they will receive an error when the browser tries to load the file.

## Handling the chunk failed to load error

There are a few ways to handle this. Each resulting in a different user experience.

### Solution 1: Keep old files on your server after a deployment

When deploying you can keep the existing files on the server and override with your new files. Your hashed assets will remain as they have unique file names. The files you need to override, such as `index.html` will be overridden.

#### Pros

- Doesn't require any code changes in the application

#### Cons

- Need to keep old files around and eventually clean them up after a safe period.
- Change to the deployment process.
- Some services don't allow you to customise the deployment process, such as Netlify.

### Solution 2: Service worker

A service worker can be used to cache your assets. It can then intercept requests to return the cached files rather than fetching them from the server. Create React App comes with a service worker pre-configured with this behaviour (it's disabled by default). The way this works is that when you first visit the site after a new deployment, the browser will recognise the new service worker and download the new assets. The user will continue to be served the cached content until they close all tabs that have the application open. You could also display a notification to the user when there is new content available with an option to load the new version.

#### Pros

- Great performance, the user is always served cached content.

#### Cons

- The user is served cached assets for longer (as described above)
- Service workers aren't supported in older browsers

### Solution 3: Programatically reload the page

We can reload the page when the chunk loaded error has occurred. Which will fetch the new assets so the user doesn't see an error.

#### Pros

- Hosting/deployment process agnostic as the change is in application.
- Ensures the user is using the latest version of the app.

#### Cons

- Application state is blown away.

## What option should you go with?

As with many questions in software development, the answer is, it depends. In this case, it depends on your application, your constraints, and the user experience you want to provide.

## Solution 3 implementation

Let's implement solution 3, programmatically refresh the page when the chunk loaded error occurs. The downside of this approach is that your application state is blown away. Which means if your application maintains state, such as user input between routes this is not a great solution. But a lot of the time you're going to be re-rendering the entire page on route changes, in which case it may not matter.

Here's a simple example of a React app with route-based code-splitting using react-router.

{% highlight jsx linenos %}
import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Home = React.lazy(() => import("./Home"));
const Contact = React.lazy(() => import("./Contact"));

function App() {
  return (
    <Router>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
{% endhighlight %}

Next, we need to handle the possibility of a dynamically loaded file failing to load. To do so, lets add an error boundary to our `App` component:

{% highlight jsx linenos %}
import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

const Home = React.lazy(() => import("./Home"));
const Contact = React.lazy(() => import("./Contact"));

function App() {
  return (
    <Router>
      <div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/contact">
                <Contact />
              </Route>
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
{% endhighlight %}

We can add the logic to handle the chunk failed to load error in our `<ErrorFallback />` component.

(handle chunk failed code without loop check)

This code checks for the chunk failed error using a regex and will reload the page if that is the error.

One more thing we can do to make this more robust is to do is to prevent the possibility of an infinite reload loop. This could happen if the file that is trying to be dynamically loaded is missing due to a reason other than stale content. We can do this by adding the following code to our `<ErrorFallback />` component:

{% highlight jsx linenos %}
import React, { useEffect } from "react";
import { getWithExpiry, setWithExpiry } from "./storage";

export function ErrorFallback({ error }) {
  // Handles failed lazy loading of a JS/CSS chunk.
  useEffect(() => {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (error?.message && chunkFailedMessage.test(error.message)) {
      if (!getWithExpiry("chunk_failed")) {
        setWithExpiry("chunk_failed", "true", 10000);
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div>
      <p>Something went wrong.</p>
      <pre>{error?.message}</pre>
    </div>
  );
}
{% endhighlight %}

Some explanation of above code. Then the local storage with expiry introduction:

{% highlight jsx linenos %}
export function setWithExpiry(key, value, ttl) {
  const item = {
    value: value,
    expiry: new Date().getTime() + ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
  const itemString = window.localStorage.getItem(key);
  if (!itemString) return null;

  const item = JSON.parse(itemString);
  const isExpired = new Date().getTime() > item.expiry;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}
{% endhighlight %}

Conclusion/outro
