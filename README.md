# mitchgavan.com

My personal website. A place where I write about design and development for the web.

## Local development

This site uses:

- Ruby `3.2.4`
- Jekyll via `github-pages`
- Webpack for JS/CSS bundling

The Ruby version is pinned in `.ruby-version`.

### First-time setup

If you use `rbenv`:

```bash
rbenv install
rbenv local 3.2.4
```

Then install dependencies:

```bash
bundle install
npm install
```

### Running locally

Standard dev mode:

```bash
npm start
```

This runs:

- Webpack in watch mode
- Jekyll with incremental rebuilds and live reload

The site will be available at [http://127.0.0.1:4000](http://127.0.0.1:4000) or [http://localhost:4000](http://localhost:4000).

### Fallback preview mode

If file watching is flaky on your machine, use:

```bash
npm run preview
```

This does a one-time Webpack build and then starts Jekyll without the extra watch process. It is a simpler option for previewing layout/content changes.

### Useful commands

```bash
npm run build
```

Builds the production assets and Jekyll site into `_site`.

```bash
npm run build:webpack
```

Rebuilds the frontend bundle only.

```bash
bundle exec jekyll serve --incremental
```

Runs just the Jekyll server if you want to control the asset build separately.
