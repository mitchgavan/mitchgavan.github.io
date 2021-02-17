---
layout: post
title: Delay the appearance of loading spinners with CSS
description: Sometimes delaying the appearance of loading spinners can improve the user experience of your web apps.
image: /images/posts/code-splitting-react.jpg
---

When content is loaded very quickly, loading spinners will flash in and out. This is visually unappealing. It would be a better experience if the spinner was not displayed at all in this case. Delaying the appearance of these loading spinners can improve the user experience. This also improves the perceived performance of your application. A simple way to do this is to add a slight delay to the entrance of our loading spinners.

I've found this technique particularly useful when code-splitting your bundle and lazily loading code. For example, in React, it is common to code-split routes and only load the code when required. Rather than loading the code for the entire application upfront.

## Spinner CSS

Let's create a loading spinner with a single `<div>` element and some CSS:

```css
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-color: currentColor;
  border-style: solid;
  border-radius: 99999px;
  border-width: 2px;
  border-left-color: transparent;
  color: palevioletred;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

Now to delay the appearance of the spinner, we'll add another animation to our spinner. We want it to fade in after a short amount of time. We want the delay to be barely noticeable. We'll go with 400 milliseconds.

You can define multiple animations by specifying multiple comma-separated values on an animation-* property. They will be assigned to the animations specified in the animation-name property. Add the following styles to your spinner CSS:

```css
.spinner {
  /* previous styles omitted */

  opacity: 0;
  animation-name: rotate, fadeIn;
  animation-duration: 450ms, 600ms;
  animation-timing-function: linear, ease;
  animation-iteration-count: infinite, 1;
  animation-delay: 400ms;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

You will now notice that our spinner fades in after the delay, but it then disappears again as soon as it fades in. Watch the video below to see how this looks.

[video of disappearing spinner]

After the fade in animation finishes the opacity value is reset back to the initial value of `0`. We can fix this by using the `animation-fill-mode` CSS property. This property sets how a CSS animation applies styles to the target element before and after its execution. We want to set the value of this property to `forwards`. Which means, the target will retain the computed values set by the last keyframe of the animation. Lets update our spinner CSS by adding the following line:

```css
.spinner {
  /* previous styles omitted */

  animation-fill-mode: forwards;
}
```

Now our animation works as expected! You can see it in action in the video below:

[video of spinner working correctly]

Here is the complete CSS:
```css
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-color: currentColor;
  border-style: solid;
  border-radius: 99999px;
  border-width: 2px;
  border-left-color: transparent;
  color: palevioletred;

  opacity: 0;
  animation-name: rotate, fadeIn;
  animation-duration: 450ms, 600ms;
  animation-timing-function: linear, ease;
  animation-iteration-count: infinite, 1;
  animation-delay: 400ms;
  animation-fill-mode: forwards;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

## Final Word

This is a nice and simple way to improve the user experience when content is expected to load very quickly. But you may not want to introduce a delay to all of your loading states.
