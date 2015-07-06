---
layout: post
title: Style sheet limitations in IE9
description: I recently came across some limitations with Internet Explorer 9 that don’t seem to be documented very clearly anywhere, which caused a bit of a headache after spending way too much time trying to debug.
---

With Microsoft’s new browser ‘Edge’ about to be released, it’s an exciting time for web developers. Millions of users are going to update to Windows 10, where Edge will be the default browser. That’s great news for everybody, but in most cases our job will still require us to support older browsers for the time being. I recently came across some limitations with Internet Explorer 9 that don’t seem to be documented very clearly anywhere. And it caused a bit of a headache to say the least, after spending way too much time trying to debug.

The bug that had been raised stated that some pages weren’t displaying correctly in IE9. Not a very detailed issue, I booted up the virtual machine to take a look. I found that there were random styles missing in multiple areas of the site. So I took a look at the source - the style sheets appeared to be loading fine. Next I loaded up the local version, only to find the site was displaying correctly. However, in our local dev environment we weren’t bundling the CSS files together, this must have something to do with it.

I recalled that there was some kind CSS limit in IE9. After doing some research I confirmed that IE9 had the following limitations:

* A sheet may contain up to 4095 rules
* A sheet may @import up to 31 sheets
* @import nesting supports up to 4 levels deep

_Ref: [MSDN Blogs](http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/10164546.aspx)_

We must have been going over 4095 rules, as the other two definitely didn’t apply to our style sheet. A great tool to test for this is [CSS Stats](http://cssstats.com/). It gives you a detailed analysis of your site’s CSS. Including the amount of rules, number of unique colors, font sizes and a lot of other useful stats. Our bundled CSS file only included around 2500 rules, falling comfortably within the 4095 limit. What the hell?!

After looking into the rule limit further I found that the 4095 rule limit might actually be referring to selectors not rules. I'll demonstrate how these two differ from each other:

```css
/* 1 selector, 1 rule */
.nav-list {
	color: red;
}

/* 2 selectors, 1 rule */
.nav-list,
.item-list {
	color: red;
}

```

As you can imagine there is the potential to have quite a few more selectors than rules in a style sheet. Even though the original statement of 4095 rules was from an official Microsoft blog it appeared to be incorrect. There is a [Github gist](https://gist.github.com/ericandrewlewis/8c850adb4d779aa42e13) confirming that it is actually a selector limit and not rules. Back to the CSS stats I went, only to find that even though our style sheet was a lot closer to that limit, coming in at around 3600 selectors, it was still under the 4095 limit. 

After taking a breather and another quick google I found that people have identified that [IE9 also has a file size limit](http://stackoverflow.com/questions/11080560/does-ie9-have-a-file-size-limit-for-css) of 288kb. Although there were a couple of stack overflow comments stating this, there were also a few mentions of this being a rough limit. This has to be our issue. Please let it be the issue. Our style sheet was around 240kb, this is a decent amount below the reported 288kb limit. But there was still a possiblity that this was actually the issue. I mean, nothing about this problem seemed to be set in stone so I had to confirm.

To test whether this was the issue I moved one of our Sass partial’s that was being rendered as expected to the bottom of the scaffold, so that these styles would be at the end of the style sheet. I reloaded the browser to find that the component was no longer being styled correctly, and I couldn’t recall having ever been happier to see broken styles! The styles at the end of the document were being ignored. Even though our style sheet wasn’t over 288kb, apparently it was still too large for IE9.

To resolve the issue I simply moved the [Foundation](http://foundation.zurb.com/) framework's CSS into another style sheet. In my particular case this wasn’t a problem as we were already loading these two style sheets, so fortunately no extra resource request was required. But generally speaking keeping resource requests to a minimum is important, especially for mobile devices. A responsible way to handle this would be to only split the CSS into two files for IE9 and below. That way mobile devices won’t get hit with an extra request. This can be easily accomplished with Internet Explorer conditional statements, check out [this article](http://www.sitepoint.com/web-foundations/internet-explorer-conditional-comments/) for more information on how to implement them. And with the help of [BlessCSS](http://blesscss.com/), this file splitting can be automated and included as part of your build process. There is also a [grunt plugin](https://github.com/Ponginae/grunt-bless) available.

I know 240kb may seem like a lot of CSS, but with the popularity of CSS frameworks like Bootstrap and Foundation these days it is not that uncommon to find in large web apps. To sum it up, there appears to be no exact style sheet file size limit in IE9, but it’s generally around 250kb.







 
