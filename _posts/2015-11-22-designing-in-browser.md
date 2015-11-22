---
layout: post
title: Designing in browser - when is the right time?
description: Saving time by creating less throw-away deliverables definitely sounded appealing, so I gave it a shot when designing the UI for a new web app.
---

The concept of designing in browser has been around for a little while now - forget pixel perfect mockups and save time by jumping straight into the browser. Now that we are designing for a multitude of screen sizes, it’s becoming more common to skip creating mock-ups in design tools such as Photoshop altogether. Dave Rupert’s article on [responsive deliverables](http://daverupert.com/2013/04/responsive-deliverables/) describes how the old PSD-to-HTML workflow that served us so well, may no longer be an applicable solution.

Saving time by creating less throw-away deliverables definitely sounded appealing, so I gave it a shot. In this article I describe my experience designing the UI for a new web app applying this process.

###First steps in the design process
I thought it was also important to quickly mention the other steps involved in the design process. When starting a new project the first thing I do is gather inspiration. I like to use Pinterest boards for this. There is a very convenient [Pinterest plug-in](https://chrome.google.com/webstore/detail/pin-it-button/gpdjojdkbbmdfjfahjcgigfpmkopogic?hl=en) for Chrome that allows you to easily save any image on the web to your boards. 

The Next step is wireframing. It's in this stage where we need to figure out the user needs. The end result will hopefully provide a clear visual representation of how content and functionality should be prioritized. 

###Recognise the reusable elements
Once you have your wireframes you should be able to start to recognize some reusable modules and patterns. This seemed like a good time to start creating some of these patterns in code - which would be the beginnings of the living style guide. I was going to be using the [Foundation framework](http://foundation.zurb.com/) for this project, so I set up a basic page with the framework’s dependencies. Frameworks like Bootstrap and Foundation make it quick and easy to get started prototyping in browser. 

Now to start designing. I began by playing around with some modules and the basic layout. But I was finding it quite difficult to get going. Resizing and moving elements around felt a lot more time consuming and tedious compared to my trusty design applications. And without having a general style defined, I found it hard to start designing the individual modules. 

###Make some design decisions first
Having not made much progress with the design in browser, I decided to rethink my approach. I felt like I needed to have a general style defined before I could continue in the browser. Adobe Illustrator is my tool of choice for UI design; it’s good for quick prototyping and is vector based, which is great for the web. I set up the guides for the grid layout and began creating. The main goal of this was not to provide a pixel perfect mockup, but rather to define the layout, color palette, typography and general look and feel of the overall product.

The experimentation associated with the early stages of design now felt a lot more effortless. The end result was a mockup of the dashboard home page. I only created one mock at one screen size, however I kept in mind that these elements would need to be able to reflow and stack accordingly for other screen sizes. The modules weren’t exact representations of what the final product was going to be - that was not important at this stage. The finer details can be considered in browser. What was important was that this provided a general visual representation of the product as a whole.

###The time has come
Now beginning to code the style guide in browser felt a lot more comfortable. Just adding the color palette and basic typography styles was a quick way to get the ball rolling. I then added my first module based on the mockup. It’s at this stage where you really start to notice the benefits of designing in browser. This is how the actual product will look in the browser - not a static image of how it will never look to the user. This is where you can refine how the content will look for various screen sizes and view it on actual devices. Things that would take much longer or simply not be possible with traditional design tools.

###No two projects are the same
So when is the right time to start designing in the browser? In general; the sooner the better. But it will differ from designer to designer, project to project. For me it was important to have a general visual style defined before I felt comfortable jumping into the browser. I was only producing a small amount of throw-away deliverables, and completing the rest of the design in browser.

