System.config({
    map: {
        'app'           : 'app',

        '@angular'      : 'node_modules/@angular',

        'rxjs'          : 'node_modules/rxjs',
        'moment'        : 'node_modules/moment/min',
        'ng2-translate' : 'node_modules/ng2-translate',
        'ng2-pagination': 'node_modules/ng2-pagination',
        'lodash'        : 'node_modules/lodash'
    },
    packages: {
        'app'                               : {main: 'index.js'},

        '@angular/core'                     : {main: 'index.js'},
        '@angular/common'                   : {main: 'index.js'},
        '@angular/compiler'                 : {main: 'index.js'},
        '@angular/http'                     : {main: 'index.js'},
        '@angular/router'                   : {main: 'index.js'},
        '@angular/router-deprecated'        : {main: 'index.js'},
        '@angular/platform-browser'         : {main: 'index.js'},
        '@angular/platform-browser-dynamic' : {main: 'index.js'},
        '@angular/upgrade'                  : {main: 'index.js'},

        'rxjs'                              : {main: 'index.js'},
        'moment'                            : {main: 'moment-with-locales.min.js'},
        'ng2-translate'                     : {defaultExtension: 'js'},
        'ng2-pagination'                    : {defaultExtension: 'js'},
        'lodash'                            : {main: 'lodash.min.js'}
    }
});