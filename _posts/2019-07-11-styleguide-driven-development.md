---
layout: post
title: Style guide driven development in React with Theme UI
description: Theme UI is a new library built on top of the Emotion CSS in JS library, that helps you build consistent, themeable React apps based on a style guide.
image: /images/posts/styleguide-dev.jpg
---

We have seen the rapid growth and evolution of CSS in JS libraries in the past few years. It's an area that's both mature enough for large scale applications, and young enough to not have any flavour that's a clear favorite. [Theme UI](https://theme-ui.com/) is a new library built on top of the Emotion CSS in JS library, that helps you build consistent, themeable React apps based on a style guide. Having been a proponent of libraries that Theme UI builds upon, such as Tachyons and Styled System, Theme UI seems like a natural progression of those libraries to me.

## Benefits of style guide driven development

If you've ever worked on a medium to large application that has been worked on by many different people over time, you know that consistency can be hard to maintain. The amount of different colors, spacing, font-sizes, media queries can easily get out of control. Having a style guide combats that by providing a set of constraints that your applications UI should adhere to, helping to maintain a consistent look and feel.

I've also found that having a style guide leads to a more enjoyable developer experience. There's less time spent worrying about specific values, such as a specific padding value for an element, since your choices are limited. And it can help reduce conflicts with designers and other developers during reviews.

## What is Theme UI

Theme UI combines many popular styling tools into one mini-framework like library. Theme UI is built with:

- **Emotion:** a performant and flexible CSS-in-JS library
- **MDX:** an authorable format that lets you use JSX in markdown documents
- **Styled System:** similar theme based styling library but with a lower level API that is not coupled to Emotion or React
- **Typography.js:** optionally used for creating rich typographic styles with a simple, high-level API

Theme UI has just recently started being used as part of [Gatsby themes](https://www.gatsbyjs.org/blog/2019-07-03-customizing-styles-in-gatsby-themes-with-theme-ui/), as a way to customize and switch between blog themes. It's perfect for this, but I also believe it's a great way of styling any React application. Building React apps with Theme UI is like using Emotion with first class support for theming and a more convenient way to handle responsive styles.

## Getting started with Theme UI

Enough talk, let's see how it's used by creating a little demo app. Feel free to take a look at the [completed demo](https://theme-ui-demo.netlify.com/) and [source code](https://github.com/mitchgavan/theme-ui-app).

First of all let's create a new React app by running:

```text
npx create-react-app theme-ui-app
```

After that's finished installing, you can view what we currently have, by running the following commands:

```text
cd theme-ui-app
npm start
```

Then open [http://localhost:3000](http://localhost:3000/) in your browser to view your app. Now install the required packages for Theme UI:

```text
npm i theme-ui @emotion/core @mdx-js/react
```

To start with we need to define our theme object. This can include custom color palettes, typographic scales, fonts, and more. Create a new file `/src/theme.js` and add the following:

{% highlight javascript linenos %}
export default {
  fonts: {
    body: 'Georgia, Cambria, "Times New Roman", Times, serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48],
    fontWeights: {
    body: 400,
    heading: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    text: '#392a25',
    muted: '#aaaaaa',
    background: '#f8f8f8',
    foreground: '#ffffff',
    primary: '#92b955',
    secondary: '#9f8a6d',
  },
  space: [0, 4, 8, 16, 32, 48],
  breakpoints: ['40em', '64em', '80em'],
};
{% endhighlight %}

Theming with Theme UI is based on a standardized way to share common styles known as the [System UI Theme Spec](https://system-ui.com/theme/) (currently work in progress). Each key in theme object corresponds to a certain set of CSS properties. For example; the `fonts` key is used with font-family, the `space` key can be used to define margins, paddings, and grid-gap. We'll see this in action soon. For more details check out the Theme UI [theming documentation](https://theme-ui.com/theming).

In order to use our theme we have to add the Theme provider to our app. Open up `/src/app.js` and replace the code with the following:

{% highlight jsx linenos %}
import React from 'react';
import { ThemeProvider } from 'theme-ui';
import theme from './theme';
import Card from './Card';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Card />
    </ThemeProvider>
  );
}

export default App;
{% endhighlight %}

Above, we've wrapped our app with the `<ThemeProvider />` component from Theme UI. We're passing it our theme object via props, which will allow us to access our theme from anywhere in our app. We have added a single `<Card />` component to our app. Let's create this component by adding a new file `/src/Card.js` with the following contents:

{% highlight jsx linenos %}
import React from 'react';

const Card = () => (
  <div>
    <h2>Heading</h2>
    <div>A short tagline</div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a dui
      erat. Vivamus malesuada facilisis est, sit amet interdum turpis feugiat
      id.
    </p>
    <a href="/">Read more</a>
  </div>
);

export default Card;

{% endhighlight %}

This is a pretty basic card component, without any style added to it yet.

## Comparison with ‘vanilla’ Emotion

First I'm going to show you how you can utilize the theme object to style with Emotion (which is what Theme UI is built on top of). We have already installed the packages we need to achieve this. Then we'll refactor the code to take advantage of some of the nice features of Theme UI. Below is the `<Card />` component with a couple of elements styled using the `css` prop from Emotion:

{% highlight jsx linenos %}
/** @jsx jsx */
import { jsx } from '@emotion/core';

const Card = () => (
  <div
    css={theme => ({
      backgroundColor: theme.colors.foreground,
      borderRadius: 4,
      fontSize: theme.fonts[4],
      margin: theme.space[3],
      padding: theme.space[3],
    })}
  >
    <h2
      css={theme => ({
        fontFamily: theme.fonts.heading,
        fontWeight: theme.fonts.heading,
        margin: 0,
        fontSize: theme.fontSizes[3],
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: theme.fontSizes[4],
        },
        [`@media (min-width: ${theme.breakpoints.lg})`]: {
          fontSize: theme.fontSizes[4],
        },
      })}
    >
      Heading
    </h2>
    <div>A short tagline</div>
    <p>Lorem ipsum dolor...</p>
    <a href="/">Read more</a>
  </div>
);

export default Card;
{% endhighlight %}

If you've never used Emotion's `css` prop the first two lines might look a little strange to you. This is required in order to use the `css` prop and essentially informs Babel to use Emotion’s jsx function instead of `React.createElement` when compiling the jsx in this file.

Now we'll refactor this code to take advantage of Theme UI. Replace the code in `/src/Card.js` with the following:

{% highlight jsx linenos %}
/** @jsx jsx */
import { jsx } from 'theme-ui';

const Card = () => (
  <div
    sx={% raw %}{{{% endraw %}
      backgroundColor: 'foreground', // picks up value from `theme.colors.foreground`
      borderRadius: 4, // raw CSS value
      fontSize: 4, // picks up value from `theme.fontSizes[4]`
      margin: 3, // picks up value from `theme.space[3]`
      padding: 3, // picks up value from `theme.space[3]`
    {% raw %}}}{% endraw %}
  >
    <h2
      sx={% raw %}{{{% endraw %}
        fontFamily: 'heading', // picks up value from `theme.fonts.heading`
        fontWeight: 'heading', // picks up value from `theme.fontWeights.heading`
        fontSize: [3, 4, 5], // shorthand for specifying responsive values
        margin: 0,
      {% raw %}}}{% endraw %}
    >
      Heading
    </h2>
    <div>A short tagline</div>
    <p>Lorem ipsum dolor...</p>
    <a href="/">Read more</a>
  </div>
);

export default Card;
{% endhighlight %}

By using Theme UI we get rid of a lot of repetition and boiler plate from the previous example, without sacrificing readability. I especially like the way you define responsive styles using media queries (which I first came across in [Styled System](https://styled-system.com/)). As with Emotion's `css` prop, in order to use Theme UI's `sx` we must define the custom pragma at the top of the file.

A quick list of the benefits we see when using Theme UI's `sx` prop in the example above are:

- It doesn't require you to pass a function in order to use the theme object.
- Shorthand referencing of values from the theme object
- Shorthand syntax for writing mobile-first responsive styles

When you're writing a lot of CSS you really appreciate this terseness.

## Finishing off the styling

Let's use Theme UI a bit more to complete the styling of our `<Card />` component. Here is the complete code for `/src/Card.js`:

{% highlight jsx linenos %}
/** @jsx jsx */
import { jsx } from 'theme-ui';

const Card = () => (
  <div
    sx={% raw %}{{{% endraw %}
      backgroundColor: 'foreground',
      borderRadius: 4,
      fontSize: 4,
      margin: 3,
      padding: 3,
    {% raw %}}}{% endraw %}
  >
    <h2
      sx={% raw %}{{{% endraw %}
        fontFamily: 'heading',
        fontWeight: 'heading',
        fontSize: [3, 4, 5],
        margin: 0,
      {% raw %}}}{% endraw %}
    >
      Heading
    </h2>
    <div
      sx={% raw %}{{{% endraw %}
        fontFamily: 'heading',
        fontWeight: 'heading',
        fontSize: [1, 2],
        color: 'muted',
        marginBottom: 2,
      {% raw %}}}{% endraw %}
    >
      A short tagline
    </div>
    <p
      sx={% raw %}{{{% endraw %}
        fontSize: [1, 2],
        marginTop: 0,
        marginBottom: 3,
      {% raw %}}}{% endraw %}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a dui
      erat. Vivamus malesuada facilisis est, sit amet interdum turpis feugia.
    </p>
    <a
      href="/"
      sx={% raw %}{{{% endraw %}
        backgroundColor: 'primary',
        borderRadius: '100em',
        color: 'foreground',
        display: 'inline-block',
        fontFamily: 'heading',
        fontSize: [0, 1],
        fontWeight: 'bold',
        marginBottom: 1,
        px: 3, // shorthand for defining padding-left and padding-right
        py: 2, // shorthand for defining padding-top and padding-bottom
        textDecoration: 'none',
        textTransform: 'uppercase',
        '&:hover, &:focus': { backgroundColor: 'secondary' },
      {% raw %}}}{% endraw %}
    >
      Read more
    </a>
  </div>
);

export default Card;
{% endhighlight %}

Nice. Now let's make this a bit more interesting by displaying a list of these cards in a responsive grid. We're going to create our new layout in `/src/App.js`, here's the updated code, and I'll explain how it works below:

{% highlight jsx linenos %}
/** @jsx jsx */
import { jsx, ThemeProvider, Container, Layout, Flex, Box } from 'theme-ui';
import theme from './theme';
import Card from './Card';

const cards = [1, 2, 3, 4, 5, 6]; // Demo data to generate 6 cards

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Container>
          <Flex sx={% raw %}{{{% endraw %} flexWrap: 'wrap' {% raw %}}}{% endraw %}>
            {cards.map(card => (
              <Box key={card} sx={% raw %}{{{% endraw %} width: ['100%', '50%', '33.33%'] {% raw %}}}{% endraw %}>
                <Card />
              </Box>
            ))}
          </Flex>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
{% endhighlight %}

Theme UI provides us with some components for creating page layouts - we're importing and utilizing a few of these components:

- **Layout:** the root styled component for wrapping other layout components
- **Container:** a centered area with a max-width
- **Box & Flex:** are convenience components with a few style presets, similar to the ones found in [Rebass](https://rebassjs.org/).

The layout components can be styled via the theme object. Let's finish off our styling by adding the following `style` key to our theme object:

{% highlight js linenos %}
{
  // add this to the bottom of the theme object
  styles: {
    Layout: {
      color: 'text',
      backgroundColor: 'background',
      fontFamily: 'body',
      lineHeight: 'body',
    },
    Container: {
      maxWidth: 1160,
      padding: 3,
    },
  },
}
{% endhighlight %}

These styles will be applied to the `<Layout />` and `<Container />` components respectively. We now have a complete custom responsive layout.

## Bonus: Easy dark mode

Everybody loves dark mode. But if it isn't something that was thought through during the beginning of your project and architecture choices it may take a lot of effort to implement. The color modes feature of Theme UI changes that, it allows you to easily define and switch between dark mode or any number of color modes. Let's see just how easy we can implement this.

First we need to add the new dark theme color properties to our theme object. Here is what our updated colors property looks like:

{% highlight jsx linenos %}
initialColorMode: 'light',
colors: {
  text: '#392a25',
  muted: '#aaaaaa',
  background: '#f8f8f8',
  foreground: '#ffffff',
  primary: '#92b955',
  secondary: '#9f8a6d',
  modes: {
    dark: {
      text: '#ffffff',
      background: '#111111',
      foreground: '#333333',
      primary: '#1da1f2',
    },
  },
},
{% endhighlight %}

Then create a new file `/src/ColorSwitch.js` and add the following code:

{% highlight jsx linenos %}
/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useColorMode } from 'theme-ui';

const ColorSwitch = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <div sx={% raw %}{{{% endraw %} textAlign: 'center' {% raw %}}}{% endraw %}>
      <button
        onClick={() => {
          setColorMode(colorMode === 'light' ? 'dark' : 'light');
        }}
        sx={% raw %}{{{% endraw %}
          backgroundColor: 'secondary',
          borderRadius: '100em',
          border: 0,
          color: 'foreground',
          fontFamily: 'heading',
          fontSize: [0, 1],
          fontWeight: 'bold',
          margin: 3,
          px: 4,
          py: 3,
        {% raw %}}}{% endraw %}
      >
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </button>
    </div>
  );
};

export default ColorSwitch;
{% endhighlight %}

Theme UI comes with a custom hook `useColorMode`. We've added a button the utilizes this hook to toggle the value of `colorMode`. The color mode value will be stored in localStorage. Then all we need to do is add this component to our `<App />` and we're done!

The completed demo is viewable [here](https://theme-ui-demo.netlify.com/) and the code can be found in [this repo](https://github.com/mitchgavan/theme-ui-app).

I hope you've enjoyed this post. And I can't end this post without mentioning the creator of this and many other wonderful libraries, [Brent Jackson](https://twitter.com/jxnblk). Be sure to follow him on Twitter for the latest and greatest on this topic.
