import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

// function to initialise esBuild, using the esbuild.wasm from unpkg.com.
// ensure only one instance of service is running
let service: esbuild.Service;

const bundle = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }

  try {
    // use build method of startService, to bundle any files we may import in our textarea
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      // this option is to use the plugins we wrote to break the module import chain and use unpkgPathPlugin folowed by fetchPlugin instead
      // use our user input code to be the contents of the index.js file that is initially read to kick off the bundling process
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      // this option is to tell the bundler that the process.env property NODE_ENV should alsways be set to production (for react stuff)
      // MUST BE A STRING, HENCE THE DOUBLE QUOTES....   global: 'window' is for webpack
      define: { 'process.env.NODE_ENV': '"production"', global: 'window' },
    });
    return {
      code: result.outputFiles[0].text,
      err: '',
    };
  } catch (err) {
    return {
      code: '',
      err: err.message,
    };
  }
};
export default bundle;
