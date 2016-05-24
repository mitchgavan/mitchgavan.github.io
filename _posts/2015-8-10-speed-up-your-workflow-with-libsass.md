---
layout: post
title: Speed up your workflow with LibSass and Autoprefixer
description: I recently switched one of our large projects from Ruby Sass and Compass to LibSass and Autoprefixer, resulting in drastic improvements to compilation time. 
image: /images/posts/libsass-autoprefixer.jpg
---

LibSass is a C/C++ port of the Sass engine that is much faster than the original version written in Ruby. LibSass has always been a bit behind in terms of features that it supports. But with the recent releases it has caught up significantly and supports more than enough for most use cases. And with the [announcement](https://github.com/sass/libsass/wiki/The-LibSass-Compatibility-Plan) that there will be no more updates to the Ruby version until LibSass is on par with it in every way, it’s a great time to start using it. 

One thing that LibSass doesn’t (currently) support is Compass. This however is not a deal breaker. I found that we were pretty much only using Compass for one of its popular features; vendor prefixing.  This can be replaced with the Autoprefixer library. One of the key benefits of using Autoprefixer instead of Compass is that you don’t have to use a mixin. Which means less syntax rules to remember. Autoprefixer is post processor that adds vendor prefixes to your CSS automatically where necessary. For more info on how it works check out [this excellent post](https://css-tricks.com/autoprefixer/) by Chris Coyier.

I recently switched one of our large projects from Ruby Sass and Compass to LibSass and Autoprefixer, resulting in drastic improvements to our CSS compilation time. I’ll describe this process to you in detail to demonstrate that it’s not very hard at all.

Our project is a decent sized web application. The Sass structure consists of a default theme and 4 variations of it. Each of these may contain quite a bit of unique CSS. There are 5 separate CSS files to compile in all. Using Ruby Sass this compilation time was around 7 seconds. As you can imagine, waiting 7 seconds to see your changes every time you make a CSS change gets annoying quickly.

It was time to look into implementing LibSass. It wasn’t going to be a small task, as our project was utilizing Compass. But for reasons I mentioned earlier, I was keen to get rid of that dependency. To remove Compass from our project, firstly we need to remove the Compass import from our Sass file. Next we have to go through all of our Sass files and change the Compass mixins to their standard CSS implementations. Here is an example:

```scss
// Using Compass
div {
	@include transform(rotate(-5deg));
	@include transition(opacity 0.15s ease-in-out);
}

// Using Autoprefixer
div {
	transform: rotate(-5deg);
	transition: opacity 0.15s ease-in-out;
}

```

As you can see now we only have to write actual CSS, which feels a lot cleaner. After you think you’ve removed all Compass references, go ahead and try to compile your Sass. Most likely you will have missed something. Thankfully the Sass grunt task will tell us where this error is happening, so we can quickly fix these up. When your Sass is compiling without any errors we’re good to move onto the next step. Goodbye Compass!

Now we’re ready to remove the Ruby Sass grunt task. We were using [grunt-contrib-sass](https://github.com/gruntjs/grunt-contrib-sass), so to remove this simply enter this command:

```
npm uninstall grunt-contrib-sass --save-dev

```

_Note: There are other Ruby Sass grunt tasks, so be sure to confirm which one you are using and substitute the name in the above example._ 

Next it’s time to install LibSass. We’re going to be adding it into a grunt workflow, so we’ll be using [grunt-sass](https://github.com/sindresorhus/grunt-sass). Install this using the following command:

```
npm install --save-dev grunt-sass

```

Next add the grunt-sass configuration to your gruntfile. Below is a basic example:

```javascript
grunt.initConfig({
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'main.css': 'main.scss'
            }
        }
    }
});
grunt.loadNpmTasks('grunt-sass');

```

This is very similar to our previous Ruby Sass implementation, so it should be familiar to you. Once we have this set up to reference the correct folder and file names it’s time to test this out. Run the task by entering 'grunt sass' in the command line and feel the speed! Our compilation time with Ruby Sass was around 7 seconds, and now with LibSass it’s down to less than a second! On average our compilation time is now around 0.6 seconds. And that’s compiling 5 separate style sheets, so in most use cases you can expect this compilation time to be even lower. 

 Time to add Autoprefixer to our workflow. The Autoprefixer grunt task is now deprecated in favor of PostCSS. [PostCSS](https://github.com/nDmitry/grunt-postcss) is a tool for transforming CSS with JavaScript plugins. Autoprefixer is one of these plugins. We can install both of these by entering the following command:

 ```
 npm install --save-dev grunt-postcss autoprefixer-core

 ```

 And here is an example of the configuration setup:

```javascript
grunt.initConfig({
	postcss: {
	  options: {
	    map: true,
	    processors: [
	      require('autoprefixer-core')({browsers: ['last 2 versions', 'ie 9'})
	    ]
	  },
	  dist: {
	    src: 'main.css'
	  }
	}
});
grunt.loadNpmTasks('grunt-postcss');
```

This example provides the required prefixes to support the last 2 versions of each of the major browsers and Internet Explorer 9. The final step is to add our new Sass and Autoprefixer tasks to a watch task, so that our CSS file is updated whenever we change it. Here is the configuration needed for our watch task using [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch):

```javascript
 watch: {
    css: {
        files: ['main.scss'],
        tasks: ['sass', 'postcss'],
        options: {
            spawn: false,
            livereload: true,
        }
    }
}

```

Now each time we save a Sass file LibSass is run followed by Autoprefixer. And we're done! For our project, the total compilation time is now only around 0.75 seconds, compared to the previous time of around 7 seconds with Ruby Sass and Compass. Speedy! I hope this has shown you that moving to LibSass isn’t that hard to accomplish and that the benefits are definitely worth the time.

You can view the final version of the demo gruntfile [here](https://github.com/mitchgavan/libsass-autoprefixer-gruntfile/blob/master/gruntfile.js).
