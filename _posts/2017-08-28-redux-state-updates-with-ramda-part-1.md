---
layout: post
title: Redux state updates with Ramda - Arrays
description: In this post I go through some practical examples that can help make Redux reducers more declarative, often requiring less code. Using the functional library Ramda.
image: /images/posts/redux-and-ramda.jpg
---

I got my first taste of functional programming when getting started with React,  since then I've gradually been learning more FP concepts and applying them to my code. It's definitely become a popular topic in JavaScript as of late. In this post I'd like to go through some practical examples that can help make Redux reducers more declarative, often requiring less code. I'll be using the functional library [Ramda](http://ramdajs.com/). These examples and concepts are by no means specific to Redux, and can be of use in any JS application.

In this post I'm going to focus on updating arrays with Ramda (a future post will focus on updating objects). A lot of the time in JavaScript, arrays are modified using `push`, `unshift` and `splice`. However these methods mutate the original array, and in Redux that's not allowed. Reducers must be pure functions, which means that:
 - given the same arguments they will always return the same result
 - they should not depend on or modify any external state

Ramda makes it easier to update data in a pure, non-mutating way compared to plain JavaScript. Let's get into some examples.

### Inserting items into an array

Given that reducers are pure functions, here's what inserting a new element into a certain position of an array would typically look like with Redux:

```js
const insertItem = (array, action) => [
  ...array.slice(0, action.index),
  action.item,
  ...array.slice(action.index)
]
```

This function doesn't mutate the original array, it creates and returns a new array through the use of the spread operator and the `slice` array method. With Ramda we can accomplish the same result using the `insert` function it provides:

```js
const insertItem = (array, action) =>
  R.insert(action.index, action.item, array)
```

The first argument in Ramda's `insert` function specifies the position to insert the element. The second argument specifies the item to be inserted. And the third argument is the array. As with all list operations in Ramda, this is non-destructive; it returns a copy of the array with the changes. So it does the exact same thing as the original example does, just in a more declarative that requires a lot less code.

If you need to insert an item to the start or end of an array, Ramda provides us a couple of functions that are even more convenient. Here's how we can add an item to the start of an array (AKA prepend):

```js
const prependItem = (array, action) =>
  R.prepend(action.item, array)
```

The `prepend` function returns a new array with the given element at the front. And here's how we can add an item to the end of the array (AKA append):

```js
const appendItem = (array, action) =>
  R.append(action.item, array)
```

`prepend` is the compliment of `append`. These functions are now nice and short and easy to understand at first glance.

### Removing items from an array
Here's how we could remove an item from an array without mutating it using plain JavaScript:

```js
const removeItem =(array, action) => [
  ...array.slice(0, action.index),
  ...array.slice(action.index + 1)
]
```

With Ramda we can utilise `remove` function to accomplish the same thing:

```js
const removeItem = (array, action) =>
  R.remove(action.index, action.item, array)
```

The `remove` function signature looks a lot like the `insert` function, it performs the opposite action, removing an element from the given index of an array. Again, this is shorter and easier to read than the plain JavaScript version.

### Removing items from an array by ID
In Redux apps a lot of the time we'll need to remove an item from an array based on it's ID. This can be accomplished with regular JavaScript like so:

```js
const removeItem = (state, action) =>
  state.filter(item => item.id !== action.id)
```

This code is nice and terse however, there's a lot for us to process in order to understand exactly what's happening. Let's see how Ramda can help make this a bit more declarative.

```js
const removeItem = (state, action) =>
  reject(item => equals(item.id, action.id), state)
```

Okay, so this isn't a lot nicer, and we can do better, but first I'll explain what's going on here. Instead of using the native `filter` array method we're using Ramda's `reject` function. `reject` is the compliment of `filter`, which means that it will return a new array with items that do not satisfy the predicate function (in other words; items that return `false`).

The first argument of the `reject` function is the predicate function and the second is the array. Inside the `reject` predicate function we are utilising the `equals` function instead of using JavaScript operators. This is a functional programming concept that's not only favoured because of it's declarative nature, but also because it plays nicely with composition. Ramda's `equals` function returns true if the arguments supplied are equivalent.

As I mentioned earlier, we can improve upon the above implementation, and here it is:

```js
const removeItem = (state, action) =>
  reject(eqProps('id', action), state)
```

We've now removed the need for the extra arrow function inside the `reject` predicate function. Ramda's `eqProps` function checks whether two objects have a particular property with the same value. We can do this thanks to the functional programming concept known as currying. All functions in Ramda are automatically curried, which means that we don't need to pass all of the arguments to it right away.

The `eqProps` actually takes in three arguments, but we're initially only calling it with two arguments. Since it's a curried function, it will return a new function that expects one more argument. When the `reject` function calls the `eqProps` function for each item in the array it will pass the current item in as the third argument, which will then return the result.

### That's it for now
This post has just scratched the surface of Ramda and how it can be utilised in Redux applications. While I'm no expert in functional programming, I hope this has given you a little taste of what's possible with the convenient functions available in Ramda. I'm planning on writing a similar post on updating objects (including objects in arrays) soon.

*References: [Immutable Update Patterns](http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html)*
