'use strict';

module.exports = function (grunt) {

    // Show elapsed time after tasks run to visualize performance
    require('time-grunt')(grunt);
    // Load all Grunt tasks that are listed in package.json automagically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // shell commands for use in Grunt tasks
        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            },
            jekyllServe: {
                command: 'jekyll serve'
            }
        },

        // watch for files to change and run tasks when they do
        watch: {
            sass: {
                files: ['scss/**/*.{scss,sass}'],
                tasks: ['sass', 'postcss']
            },
            javascript: {
                files: ['scripts/*.js'],
                tasks: ['jshint', 'uglify']
            },
            bitmapimages: {
                files: ['_images/**/*.{png,jpg,gif}'],
                tasks: ['newer:imagemin:bitmaps'],
            },
            svgimages: {
                files: ['_svg/**/*.svg'],
                tasks: ['newer:imagemin:svgs'],
            },
            deletesync: {
                files: ['_svg/**/*.svg', '_images/**/*.{png,jpg,gif}'],
                tasks: ['delete_sync'],
            }
        },

        // sass (libsass) config
        sass: {
            options: {
                sourceMap: true,
                relativeAssets: false,
                outputStyle: 'expanded',
                sassDir: 'scss',
                cssDir: 'css'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'scss/',
                    src: ['**/*.{scss,sass}'],
                    dest: 'css',
                    ext: '.css'
                }]
            }
        },

        // postcss (for autoprefixing)
        postcss: {
          options: {
            map: true,
            processors: [
              require('autoprefixer-core')({browsers: ['last 2 versions', 'ie 9']}),
              require('csswring')
            ]
          },
          dist: {
            src: 'css/*.css'
          }
        },

        // javascript minification/concatenation
        jshint: {
          all: ['scripts/*.js']
        },
        
        uglify: {
          my_target: {
            files: {
              'scripts/build/scripts.min.js': ['scripts/lib/jquery-1.11.3.js', 'scripts/lib/fastclick.js', 'scripts/nav.js', 'scripts/smooth-page-scroll.js', 'scripts/global.js'],
              '_includes/scripts/enhance.min.js': ['scripts/enhance.js'],
              '_includes/scripts/webfontloader.min.js': ['scripts/webfontloader.js']
            }
          }
        },

        // critical css
        criticalcss: {
            custom: {
                options: {
                    url: "http://0.0.0.0:4000/",
                    width: 1920,
                    height: 1080,
                    outputfile: "_includes/css/critical.css",
                    filename: "css/style.css", // Using path.resolve( path.join( ... ) ) is a good idea here
                    buffer: 800*1024,
                    ignoreConsole: false
                }
            }
        },

        // Image Tasks
        imagemin: {   
            bitmaps: {
                files: [{
                    expand: true,                 
                    cwd: '_images/',                  
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '_site/images/'
                }]
            },
            svgs: {
                options: {
                    svgoPlugins: [
                        { removeViewBox: false }, 
                        { removeUselessStrokeAndFill: false }
                    ]
                },
                files: [{
                    expand: true,                
                    cwd: '_svg/',             
                    src: ['**/*.svg'],
                    dest: '_site/svg/'               
                }]
            }
        },

        delete_sync: {
            bitmaps: {
                cwd: '_site/images',
                src: ['**/*'],
                syncWith: '_images'
            },
            svgs: {
                cwd: '_site/svg',
                src: ['**/*'],
                syncWith: '_svg'
            }
        },

        // run tasks in parallel
        concurrent: {
            serve: [
                'sass',
                'postcss',
                'jshint',
                'uglify',
                'watch',
                'newer:imagemin',
                'delete_sync',
                'shell:jekyllServe'
            ],
            options: {
                logConcurrentOutput: true
            }
        },

    });

    // Register the grunt serve task
    grunt.registerTask('serve', [
        'concurrent:serve'
    ]);

    // Register the grunt build task
    grunt.registerTask('build', [
        'shell:jekyllBuild',
        'sass',
        'postcss',
        'jshint',
        'uglify',
        'newer:imagemin',
        'delete_sync'
    ]);

    // Register build as the default task fallback
    grunt.registerTask('default', 'build');

};