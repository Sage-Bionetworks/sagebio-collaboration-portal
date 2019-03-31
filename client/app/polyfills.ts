// Enable certain polyfills depending on which browsers you need to support
// import 'core-js/es6';
// import 'core-js/es7/reflect';
// import 'core-js/es6/reflect';
// import 'core-js/es7/reflect';
// import 'core-js/features/reflect';
// import 'reflect-metadata';
// import 'core-js';
// import 'zone.js/dist/zone';  // must be last

// Import polyfills.
// import 'babel-polyfill';
// import '@babel/polyfill';
// import 'core-js/features/reflect';
// import 'core-js/proposals/reflect-metadata';
// import 'core-js/stable/reflect';
// import 'core-js/es';
// import 'reflect-metadata';
// https://github.com/angular/angular-cli/issues/13954
// import 'core-js/es';
// import 'core-js/proposals/reflect-metadata';

import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

interface IPolyFillErrorConstructor extends ErrorConstructor {
    stackTraceLimit: any;
}

if(!ENV) {
    var ENV = 'development';
}

if(ENV === 'production') {
    // Production
} else {
    // Development

    (<IPolyFillErrorConstructor>Error).stackTraceLimit = Infinity;
    // require('zone.js/dist/long-stack-trace-zone');
}
