module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['assemble', 'grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /* assemble static site templating */
        assemble: {
            options: {
                assets: 'html/assets',
                layoutdir: 'dev/src/templates/layouts/',
                partials: 'dev/src/templates/partials/**/*.hbs',
            },
            pages: {
                files: [{
                    cwd: 'dev/src/content/',
                    src: '**/*.hbs',
                    expand: true,
                    dest: 'html/'
                }]
            }
        },

        coffee: {
            compile: {
                expand: true,
                flatten: false,
                cwd: 'dev/js/coffee',
                src: ['*.coffee'],
                dest: 'dev/js/modules/',
                ext: '.js'
            }

        },

        jshint: {
            gruntfile: 'Gruntfile.js',
            app: ['dev/js/app.js', 'dev/js/modules/**/*.js', 'dev/js/pages/**/*.js'],
            specs: ['dev/js/tests/*.js'],
            options: {
                jshintrc: true
            }
        },

        clean: {
            options: {
                force: true /* Need force to clean beyond current working dir */
            },
            js: {
                src: ['html/assets/js/**/*','!html/assets/js/modernizr.custom.js']
            },
            css: {
                src: ['html/assets/css/**/*']
            },
            images: {
                src: ['html/assets/images/**/*']
            },
            fonts: {
                src: ['html/assets/fonts/**/*']
            },
            html: {
                src: ['html/*', '!html/assets/**']
            }
        },

        sass: {
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'html/assets/css/styles.css': 'dev/scss/styles.scss'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scss: {
                files: ['dev/scss/*.scss'],
                tasks: ['scss']
            },
            js: {
                files: ['dev/js/**/*.js'],
                tasks: ['js']
            },
            coffee: {
                files: ['dev/js/**/*.coffee'],
                tasks: ['js']
            },
            html: {
                files: ['dev/src/**/*.hbs'],
                tasks: ['assembleio']
            },
            images: {
                files: ['dev/images/**/*'],
                tasks: ['images']
            },
            fonts: {
                files: ['dev/fonts/**/*'],
                tasks: ['fonts']
            },
            root: {
                files: ['dev/root/**/*'],
                tasks: ['assembleio']
            }
        },

        uglify: {
            options: {
                message: 'We are now ugly',

                // mangle: Turn on or off mangling
                mangle: true,

                // beautify: beautify your code for debugging/troubleshooting purposes
                beautify: false,

                // compress: compresses the code into one
                compress: true,

                // report: Show file size report
                report: 'gzip'
            },
            js: {
                src: ['dev/js/modules/*.js', 'dev/js/pages/*.js', 'dev/js/app.js'],
                dest: 'html/assets/js/app.min.js'
            },
            libs: {
                src: ['dev/js/libs.js', 'dev/js/libs/*.js', '!dev/js/libs/jquery-*.js', '!dev/js/libs/modernizr.js'],
                dest: 'html/assets/js/libs.min.js'
            }
        },

        concat: {
            options: {
              separator: ';',
            },
            js: {
                src: ['html/assets/js/jquery.js', 'html/assets/js/app.min.js', 'html/assets/js/libs.min.js'],
                dest: 'html/assets/js/scripts.min.js'
            }
        },

        copy: {
            jquery: {
                src: ['dev/js/libs/jquery-*.js'],
                dest: 'html/assets/js/jquery.js'
            },
            images: {
                expand: true,
                cwd: 'dev/images/',
                src: ['**'],
                dest: 'html/assets/images/'
            },
            fonts: {
                expand: true,
                cwd: 'dev/fonts/',
                src: ['**'],
                dest: 'html/assets/fonts/'
            },
            root: {
                expand: true,
                cwd: 'dev/root/',
                src: ['**'],
                dest: 'html/'
            }
        },

        jasmine: {
            app: {
                src: ['dev/js/modules/*.js','dev/js/pages/*.js'],
                options: {
                    specs: 'dev/js/tests/*.spec.js',
                    vendor: ['html/assets/js/modernizr.custom.js','html/assets/js/jquery.js','html/assets/js/libs.min.js'],
                    helpers: 'dev/js/tests/*.helper.js'
                }
            }
        },

        modernizr: {
            site: {
                'devFile': 'dev/js/libs/modernizr.js',
                'outputFile': 'html/assets/js/modernizr.custom.js'
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 version', '> 1%', 'ff esr', 'ie >= 8', 'ios >= 5', 'android >= 2.3'],
                map: false
            },
            site: {
                src: 'html/assets/css/styles.css'
            }
        },

        manifest: {
            generate: {
                options: {
                    cache: [
                        'html/assets/images/spinner.png',
                        'html/assets/js/jquery.js',
                        'html/assets/js/modernizr.custom.js',
                        'html/assets/js/app.min.js',
                        'html/assets/css/styles.css'
                    ],
                    network: ['*'],
                    fallback: ['/ /offline.html'],
                    preferOnline: false,
                    verbose: true,
                    timestamp: true,
                    hash: false
                },
                src: [
                    '/',
                    'login/',
                    'training/',
                    'training/week-01/',
                    'training/week-01/day-01/',
                    'latest/',
                    'race/',
                    'me/'
                ],
                dest: 'mfc.appcache'
            }
        }

    });

    // With AppCache
    //grunt.registerTask('bust-appCache', ['manifest']);
    //grunt.registerTask('js', ['clean:js', 'copy:jquery', 'uglify', 'bust-appCache']);
    //grunt.registerTask('scss', ['clean:css', 'sass:prod', 'bust-appCache']);

    // No AppCache
    grunt.registerTask('js', ['coffee:compile', 'jshint', 'jasmine', 'clean:js', 'copy:jquery', 'uglify:js', 'uglify:libs', 'modernizr', 'concat:js']);
    grunt.registerTask('scss', ['clean:css', 'sass:prod', 'autoprefixer:site', 'modernizr']);

    grunt.registerTask('images', ['clean:images', 'copy:images']);
    grunt.registerTask('fonts', ['clean:fonts', 'copy:fonts']);

    grunt.registerTask('assembleio', ['clean:html', 'assemble', 'copy:root']);
    // Targets
    grunt.registerTask('default', ['assembleio', 'js', 'scss', 'images', 'fonts']);
};
