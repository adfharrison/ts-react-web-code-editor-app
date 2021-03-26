import * as esbuild from 'esbuild-wasm';

// basically this plugin is called whenever the esBuild biundler finds an import or require statement,
// and it is used to replace the process, so that this function gives esBuild the correct url to the
// fully extracted code for any package that is needed by any require, using https://unpkg.com

// localForage utilises browser indexDB. similar to localStorage.

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve for our index.js file
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      // onResove for relative import paths in our index file. regex is for ./ or ../
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        // args.path is the path within the require( ) or from '' at top of file
        // args. importer is the path of the file that is doing the importing
        return {
          namespace: 'a',
          // append args.path to args.importer to generate correct url for required file
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
        };
      });
      // onResolve for hanfdling main file of a module, where the module we are trying to import requires other files from higher in the heirarchy
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);

        return { namespace: 'a', path: `https://unpkg.com/${args.path}` };
      });
    },
  };
};
