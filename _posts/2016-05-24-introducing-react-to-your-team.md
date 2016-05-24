---
layout: post
title: Introducing React into your team
description: Adjusting to new technologies is something that we developers have to do. I recently introduced React into my team and I thought I'd share my thoughts.
image: /images/posts/introducing-react.jpg
---


There are new techniques and technologies being created for web developers everyday. That's what makes working in this industry exciting, but also a bit daunting at times. No matter how you look at it, it's important that we continue to grow and better our skills and products. Adjusting to new technologies is something that we developers have to do, but in general people don't like change. So it's important to make the transition as smooth as possible. I recently introduced React into my team and I thought I'd share my experience and thoughts on this process.

###Why I wanted to
React has been around for quite a while now. It's benefits are well-known and it seems like it's being used everywhere. Including some of the largest tech companies in the world; Facebook (the creators), Twitter, Instagram and Netflix to name a few. Some of it's concepts have become so acclaimed that they've even influenced major changes in other JavaScript frameworks. There's no doubting that React is here to stay. 

After hearing all of the fuss for a while, the front-end team was keen to start using React. We had a project that was still quite new, but large enough to see that using React would be quite beneficial. The project wasn't using any JavaScript framework, just jQuery. There's nothing wrong with this, it's worked for years. But as projects grow and increase in complexity, the jQuery way requires a lot of extra work to keep the app performant and maintainable. These days there is definitely a better way to build user interfaces. So we decided to look into what it would take to start using React.

###Tech Transition
React makes no assumptions about the rest of your tech stack, so it's easy to start using in any project. Our project's JavaScript was fairly well organised. It was written in a modular style using ES2015 module syntax. So it was already utilising Browserify and Babel for transpiling to ES5 compatible code. The only change to our current setup that I had to make before I could start writing React code was to the Babel configuration, in order to transpile the JSX syntax that's used with React. After that I could simply follow the same process as usual when writing JavaScript within this project.  

Of course we still have to learn React. However that's not as big of a learning curve as you may think. Sure React requires you to [think in a different way](https://facebook.github.io/react/docs/thinking-in-react.html) when you're building UI. But React is JavaScript centric, so the hardest thing about React is JavaScript! There is no template specific syntax like `ng-repeat` for example in Angular. And as it's just the UI, it doesn't take much setting up to try it out on a small feature in an existing project.

###Getting the rest of the team on board
Before I introduced React to the rest of the team, the first thing I did was convert one of the existing features of the project over to React. This was not only a great learning experience, but also a great way to see how the two implementations compared side by side. This comparison would be helpful when introducing to the team. The end result was a piece of functionality that was ready to be merged into the project (after a code review of course!).

To introduce React to the rest of the team I prepared a short presentation. In the presentation I went over what React is, the benefits it provides and a brief overview of how to write React components. As with any changes to existing procedures there may be people that aren't immediately on board. But as developers we should continually be learning and striving to improve. There is a lot more that I could go into here, but it's pretty well accepted that learning React is going to be beneficial, so I'll finish this section off with a tweet from Ryan Florence that I enjoyed, in relation to the current landscape of web technologies:

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">There has never been a better time to build INCREDIBLE user experiences on the web than right now. Don&#39;t let the old guard fool you.</p>&mdash; Ryan Florence (@ryanflorence) <a href="https://twitter.com/ryanflorence/status/730236568443576324">May 11, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

###When to do it
There's no time like the present! And there's also no one size fits all solution. You should always consider your tech options on a project by project basis. If there's a learning curve involved, you should consider whether it's the right time for your team. For example, if you have a tight deadline to meet, then it's probably not a good time. As this will just put extra strain on the team. 

After I was happy with the feature I had re-written in React and had given the presentation to the team, I decided it was time to issue a pull-request to get the new changes merged into the project. This is a chance for the other team members to take a look a the code and see it in action. Then ask any questions they may have. I thought that it could be helpful to the team if I added my own comments to the pull-request where it made sense to explain some of the React concepts. This can also be beneficial to yourself, as it helps solidify your understanding of the code. 

###Final thoughts
There may never be a perfect time, but sometimes you just have to bite the bullet and go for it. It's early times for us, but I'm excited about diving deeper into React. I hope this article has demonstrated that starting to use React in an existing project isn't a major change that requires a complete re-write of your app. And I hope that it inspires you to introduce new technologies that you feel will help your team build better products.