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
                command: 'bundle exec jekyll serve'
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
                files: ['images/**/*.{png,jpg,gif}'],
                tasks: ['newer:imagemin:bitmaps'],
            },
            svgimages: {
                files: ['images/**/*.svg'],
                tasks: ['newer:imagemin:svgs'],
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
              require('autoprefixer')({browsers: ['last 2 versions', 'ie 11']}),
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

        // Image Tasks
        imagemin: {
            bitmaps: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'images/'
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
                    cwd: 'images/',
                    src: ['**/*.svg'],
                    dest: 'images/'
                }]
            }
        },

        // run tasks in parallel
        concurrent: {
            serve: [
                'sass',
                'postcss',
                'jshint',
                'uglify',
                'newer:imagemin:bitmaps',
                'newer:imagemin:svgs',
                'watch',
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
        'imagemin'
    ]);

    // Register build as the default task fallback
    grunt.registerTask('default', 'build');

};
