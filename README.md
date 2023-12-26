# Rollup size compare action

An action that compares 2 Rollup compilation stats files, and comments on the PR with a description of the difference.

This is fork of the excellent [WebPack BundleSize Compare](https://github.com/github/webpack-bundlesize-compare-action) that adapts the name-to-size map to work for the raw output provided by [Rollup Plugin Visualizer](https://github.com/btd/rollup-plugin-visualizer).

## How to use it

In your application, ensure you output the stats.json, from `Rollup Plugin Visualizer'

```js
// rollup.config.js
// es
import { visualizer } from "rollup-plugin-visualizer";
// or
// cjs
const { visualizer } = require("rollup-plugin-visualizer");

module.exports = {
  plugins: [
    // template must be 'raw-data' for the stats.json file to be created
    visualizer({ template: 'raw-data' }),
  ],
};
```

Then, in your action configuration, build both the head and the branch (in any way you see fit) and pass paths to the stats.json files as inputs ot this action

```yaml
# .github/workflows/bundlesize-compare.yml

on:
  # this action will error unless run in a pr context
  pull_request:
  pull_request_target:

jobs:
  # Build current and upload stats.json
  # You may replace this with your own build method. All that
  # is required is that the stats.json be an artifact
  build-head:
    name: 'Build head'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{github.event.pull_request.head.ref}}
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload stats.json
        uses: actions/upload-artifact@v3
        with:
          name: head-stats
          path: ./dist/stats.json

  # Build base for comparison and upload stats.json
  # You may replace this with your own build method. All that
  # is required is that the stats.json be an artifact
  build-base:
    name: 'Build base'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.base_ref }}
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload stats.json
        uses: actions/upload-artifact@v3
        with:
          name: base-stats
          path: ./dist/stats.json

  # run the action against the stats.json files
  compare:
    name: 'Compare base & head bundle sizes'
    runs-on: ubuntu-latest
    needs: [build-base, build-head]
    permissions:
      pull-requests: write
    steps:
      - uses: actions/download-artifact@v3
      - uses: twk3/rollup-size-compare-action@v1.0.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          current-stats-json-path: ./head-stats/stats.json
          base-stats-json-path: ./base-stats/stats.json
```

This action requires the `write` permission for the [`permissions.pull-requests` scope](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions).

## Options

| name                    | description                                                                                                         | required | type   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| current-stats-json-path | The path to the current stats.json file                                                                             | true     | string |
| base-stats-json-path    | The path to the base stats.json file                                                                                | true     | string |
| github-token            | The Github token                                                                                                    | true     | string |
| title                   | An optional addition to the title, which also helps key comments, useful if running more than 1 copy of this action | false    | string |
