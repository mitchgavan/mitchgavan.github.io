---
layout: post
title: Configure cache policy in AWS for React apps
description: In this article, we’ll go through how to set up a caching policy for React single-page apps hosted on AWS (S3 and CloudFront)
image: /images/posts/aws-react.jpg
---

Having an efficient cache policy can greatly improve your website's page load times. HTTP caching can reduce the page load time on repeat visits by avoiding re-downloading assets if the file contents haven't changed. Running a [Lighthouse](https://developers.google.com/web/tools/lighthouse/) performance audit is a simple way to check if you could improve your site’s cache policy. In this article, we’ll go through how to set up a caching policy for React single-page apps hosted on AWS (S3 and CloudFront). We’ll be using Create React App as it comes with a [build configuration](https://create-react-app.dev/docs/production-build#static-file-caching) that allows you to use aggressive caching techniques.

## React app configuration

To start with, you need to ensure your React app is set up correctly. For the purpose of this article, we’ll assume you’re using Create React App’s production build step, but you could opt to set this up manually.

You should have a `build` folder that includes the production build of your app. Inside the `build` folder, there is a folder named `static` which includes your JavaScript, CSS and media (images/videos) files. Each of these files will have a unique hash appended to the filename. Which is generated at build time based on the contents of the file. If the file contents change in a subsequent build, the filename hash that is generated will be different.

## Caching static assets with S3 and Cloudfront

Let’s implement our caching policy based on the recommendation in the Create React App docs. We’ll be setting `Cache-Control` values for `index.html` as well as all the files in the `build/static` folder. The `Cache-Control` header allows us to specify the amount of time that browsers and CDNs will cache the assets.  For our purposes, we want to cache everything in `build/static` folder for as long as possible. And never cache `index.html`, so that the user is always served the latest version of the site.

To implement this, we'll define the cache policy by setting `Cache-Control` headers to files when uploading them to our S3 bucket. Both the browser and our CloudFront CDN will use these headers to determine how long they should keep the file in their respective caches. Check out the [AWS docs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) for more information on how CloudFront determines how long content stays in the cache.

Setting these headers can be done manually via the AWS console. But usually, our assets will be uploaded programmatically as part of a build pipeline. For this build step, we can use the [S3 sync](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html) command from the AWS CLI. For our case, we will need to do upload our files in two parts:

1. Upload all files except for the `build/static` folder with a `Cache-Control` value of `no-cache`.

  ```text
  aws s3 sync --cache-control 'no-cache' --exclude 'static/**/*' . s3://yourappbucket/
  ```

2. Then upload the files in the `build/static` folder with a `Cache-Control` value of 1 year.

  ```text
  aws s3 sync --cache-control 'max-age=2592000' . s3://yourappbucket/
  ```
*Note: Make sure you are inside the `build` folder when running these commands.*

## Review your perf gains

We can test that our cache policy is working as expected by checking the file details in the AWS S3 console or in the browser via dev tools via the network tab.

We now have a solid cache policy in place, that should help our site load as fast as possible. Look into combining this with route based code-splitting for more performance related gains.
