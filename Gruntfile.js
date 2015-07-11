module.exports = function(grunt) {
	'use strict';

	// Loads all required grunt tasks
	require('load-grunt-tasks')(grunt);
	// Displays execution time of each task
	require('time-grunt')(grunt);
	// Register all tasks
	grunt.loadTasks('tasks');

	grunt.initConfig({
		/**
		 * Application settings.
		 * ==============================
		 */
		dir: {
			'public'	: 'public',
			'sass'	: 'src/styles/sass',
			'css'		: 'src/styles/css',
			'assets'	: 'src/assets',
			'scripts': 'src/scripts',
			'markup'	: 'src/markup'
		},
		/**
		 * Clean build folder.
		 */
		clean: ['<%= dir.public %>/'],
		/**
		 * Move all files to public.
		 */
		copy: {
			componentsmarkup: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				cwd: '<%= dir.markup %>/components/',
				src: '**',
				dest: '<%= dir.public %>/markup',
			},
			componentsscript: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				cwd: '<%= dir.scripts %>/custom-elements/',
				src: '**',
				dest: '<%= dir.public %>/scripts',
			},
			views: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				cwd: '<%= dir.markup %>/views/',
				src: '**',
				dest: '<%= dir.public %>/markup',
			},
			assets: {
				expand: true,
				filter: 'isFile',
				cwd: '<%= dir.assets %>/',
				src: '**',
				dest: '<%= dir.public %>/assets'
			},
			manifest: {
				src: 'manifest.json',
				dest: '<%= dir.public %>/manifest.json'
			}
		},
		/**
		 * Creates all markup templates.
		 */
		bake: {
			english: {
				files: {
					'<%= dir.public %>/index.html': '<%= dir.markup %>/views/index.html',
				}
			}
		},
		/**
		 * Write ES6 today, compile it to ES5.
		 */
		browserify: {
			dist: {
				options: {
					transform: [
						['babelify', { loose: 'all' }]
					],
					browserifyOptions: { debug: true },
					exclude: ''
				},
				files: {
					'<%= dir.scripts %>/es5/app.js': ['<%= dir.scripts %>/es6/**/*.js']
				}
			}
		},
		/**
		 * Concatinates files.
		 */
		uglify: {
			dev: {
				options: {
					screwIE8: true,
					preserveComments: 'all',
					beautify: true
				},
				files: {
					'<%= dir.public %>/app.min.js': ['<%= dir.scripts %>/libs/*.js', '<%= dir.scripts %>/es5/app.js']
				}
			},
			prod: {
				options: { screwIE8: true },
				files: {
					'<%= dir.public %>/app.min.js': ['<%= dir.scripts %>/libs/*.js', '<%= dir.scripts %>/es5/app.js']
				}
			}
		},
		/**
		 * Validates ES6 files via ESLint.
		 */
		eslint: {
			options: {
				format: require('eslint-tap'),
				configFile: '.eslintrc'
			},
			target: '<%= dir.scripts %>/es6/**/*.js'
		},
		/**
		 * Compiles Sass to valid CSS.
		 */
		sass: {
			options: { style: 'compact' },
			files: {
				src:  '<%= dir.sass %>/main.scss',
				dest: '<%= dir.css %>/main.unprefixed.css'
			}
		},
		/**
		 * Adds prefix to CSS based on browser matrix.
		 */
		autoprefixer: {
			options: { browsers: ['last 2 Chrome versions'] },
			files: {
				src: '<%= dir.css %>/main.unprefixed.css',
				dest: '<%= dir.css %>/main.css'
			}
		},
		/**
		 * Minifies CSS
		 */
		cssmin: {
			options: { keepSpecialComments: 0 },
			files: {
				src: '<%= dir.css %>/main.css',
				dest: '<%= dir.public %>/main.min.css'
			}
		},
		/**
		 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
		 */
		watch: {
			markup: {
				files: ['<%= dir.markup %>/**/*.html'],
				tasks: ['bake', 'copy:componentsmarkup', 'copy:views']
			},
			styles: {
				files: ['<%= dir.sass %>/**/*.scss', '<%= dir.css %>/**/*.css'],
				tasks: ['css']
			},
			scripts: {
				files: ['<%= dir.scripts %>/es6/**/*.js'],
				tasks: ['browserify', 'eslint', 'uglify:dev']
			},
			components: {
				files: ['<%= dir.scripts %>/custom-elements/*.js'],
				tasks: ['copy:componentsscript']
			},
			assets: {
				files: ['<%= dir.assets %>/**/*.*'],
				tasks: ['copy:assets']
			}
		},
		/**
		 * Awesome task which shows notifications on your Desktop when a specific task is finished.
		 */
		notify: {
			build: {
				options: {
					title		: 'Build complete!',
					message	: 'Setup was created successfully.'
				}
			}
		}
	});
};