---
layout: post
title: Prettier BEM naming in CSS
description: Our team decided to go with a variation of BEM that still has all of the same benefits, but I believe is a little more visually pleasing. 
image: /images/posts/bem-css.jpg
---

Naming conventions are just as important in CSS as they are in JavaScript or any other language. The Block, Element, Modifier methodology (BEM) is a naming convention for classes in HTML and CSS. Its goal is to help developer’s write more predictable and maintainable code. It has become very popular as of late, with its value becoming evident to anyone that has implemented it in a large project. BEM is obviously not the only way to go, there are other popular methodologies out there such as [SMACSS](https://smacss.com) and [OOCSS](http://oocss.org). It is up to the development team to choose a method that works for them, and be consistent. Our team decided to go with a variation of BEM that still has all of the same benefits, but I believe is a little more visually pleasing.

Let's start with taking a look at the BEM naming convention:

```css
/* BEM module */
.component-name { }
.component-name--modifier-name { }
.component-name__sub-object { }
.component-name__sub-object--modifier-name { }	

```

When I first looked into BEM, one of the things that put me off right away was the amount of underscores and hyphens that were required. After diving in further I could see that there was some value in using a methodology like this. For more information on exactly what a block, element and modifier is check out [this article](http://www.smashingmagazine.com/2012/04/16/a-new-front-end-methodology-bem/). But I still wasn't convinced that the benefits were worth me putting in the time to implement it.

My team had recently started working on a big project that we knew was going to continue to grow and evolve over time. We were definitely going to need to follow some sought of naming convention if we were going to keep this thing manageable. We decided to go with something not quite as elaborate as BEM. Here is an example of the convention we went with:

```css
/* Module */
.component-name { }
.component-name-modifier-name { }
.component-name-sub-object { }
.component-name-sub-object-modifier-name { }	

```

This looks a bit simpler, and not as jarring on the eye. This naming convention worked quite well for us initially. But there was no way to differentiate between a component modifier and a sub-component of that component. After a while I began to realize that many of the classes intentions weren't clear straight away. Which meant that sometimes I had to guess or take the time to investigate further. I decided that I would look into implementing something more robust for our next project.

Then I came across a [conference talk](https://vimeo.com/99877232) by Jonathon Snook where he expressed similar feelings towards the BEM naming convention that I had; it was too noisy. He then went on to do describe an alternative that he would implement in SMACSS if he were to rewrite it now: 

```css
/* Module (New SMACSS) */
.componentName { }
.componentName-modifierName { }
.componentName--subObject { }
.componentName--subObject-modifierName { }	

```

As you can see this looks a lot nicer than the original BEM syntax and it is just as robust. I think it also looks cleaner than the method that we had previously been using, as there are less hyphens. Here's a quick explanation of what is happening here: Components are named using camel case with no hyphens. Component modifiers are identified by a single hyphen. And sub objects are identified by double hyphens. No ugly double underscores... Nice! 

The next project we started, I proposed this new naming convention. We've since implemented it in a couple of large projects and have found that it works nicely for us. I also built this site using this convention. Take a look via the developer tools if you'd like to see it in action. I've found that even for small code bases it is still beneficial to use a methodology like this. Whatever naming convention you decide to go with, the most important thing is to be consistent. Working with predictable and maintainable CSS saves time and prevents headaches.
