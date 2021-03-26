import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (input: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // onLoad requires its return values to be of type esbuild.onLoadResult.

      // if our initial user inputted code is whats currently being bundled, return the contents of that as being index.js
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: input,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // check to see if we have already fetched the file, see if in our cache
        // use the url for the file as its key in the cache.
        // set return type of generic F getItem to be esbuild.onLoadResult
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // if so return immediately to esbuild
        if (cachedResult) {
          return cachedResult;
        }
      });

      // if what were trying to import is a css file and not cached
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        // the file is css, so we need to inject it as a string into the DOM. however we need to first escape
        // or replace characters that might break the string
        // first we remove any newline chars, so its all one big line. then escape double quotes, then escape single quotes
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        // now we can create a style element, insert our css into it, and inject it into the DOM
        const contents = `
              const style = document.createElement('style');
              style.innerText = '${escaped}';
              document.head.appendChild(style);
            `;

        // build a result object to store in cache
        // confirm result will be of type esbuild.onLoadResult
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          //use resolveDir to pass the path of the previous file in a nested heirarchy back in case we need it again
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store result in cache, using args. path as key and result as value
        await fileCache.setItem(args.path, result);

        // this return sends file back to esbuild to continue bundling
        return result;
      });

      // if we are currently trying to import a js file and not cached
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        const { data, request } = await axios.get(args.path);

        // build a result object to store in cache
        // confirm result will be of type esbuild.onLoadResult
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          //use resolveDir to pass the path of the previous file in a nested heirarchy back in case we need it again
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store result in cache, using args. path as key and result as value
        await fileCache.setItem(args.path, result);

        // this return sends file back to esbuild to continue bundling
        return result;
      });
    },
  };
};
