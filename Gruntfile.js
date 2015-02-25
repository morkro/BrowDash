/**
 * Grunt setup to build and watch your application.
 * ==============================
 * 
 * Usage:
 *	'grunt dev'			=>		Sets up development environment.
 *	'grunt css'			=>		Compiles Sass to valid CSS, adds relevant vendor prefixes and minifies. 
 * 'grunt watch'		=>		Runs our predefined tasks whenever a file is updated. 
 *									Should be active the whole time while developing.
 */
module.exports = function(grunt) {
	'use strict';
	
	// Loads all required grunt tasks which are defined in devDepencies.
	require('load-grunt-tasks')(grunt);

	// Displays execution time of each task in Terminal.
	require('time-grunt')(grunt);

	// Register all grunt tasks.
	grunt.loadTasks('tasks');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Application settings.
		 * ==============================
		 */
		app: {
			title: 'BrowDash',
			description: 'Chrome Dashboard Extension',
			update: grunt.template.today('h:mm:s'),
			directory: {
				dist: {
					'public'	: 'public',
					'assets'	: '<%= app.directory.dist.public %>/assets',
					'scripts': '<%= app.directory.dist.public %>/scripts',
					'css'		: '<%= app.directory.dist.public %>/css',
				},
				config: {
					'sass'			: 'styles/sass',
					'css'				: 'styles/css',
					'assets'			: 'assets',	
					'fonts'			: '<%= app.directory.config.assets %>/fonts',
					'scripts'		: 'scripts',
					'views'			: 'views'
				}
			},
			js: {
				app: [
					// Services
					'<%= app.directory.config.scripts %>/browdash/brow.core.js',
					'<%= app.directory.config.scripts %>/browdash/brow.data.js',
					'<%= app.directory.config.scripts %>/browdash/brow.settings.js',
					'<%= app.directory.config.scripts %>/browdash/brow.timer.js',
					'<%= app.directory.config.scripts %>/browdash/brow.module.js',
					'<%= app.directory.config.scripts %>/browdash/brow.cards.js',
					// App initialisation
					'<%= app.directory.config.scripts %>/app.init.js',
				]
			}
		},

		/**
		 * Copies files into directory.
		 * ==============================
		 */
		copy: {
			html: {
				expand	: true,
				src		: '<%= app.directory.config.views %>/*.*',
				dest		: '<%= app.directory.dist.public %>/',
				flatten	: true,
				filter	: 'isFile'
			},
			assets: {
				expand	: true,
				src		: '<%= app.directory.config.assets %>/**/*.*',
				dest		: '<%= app.directory.dist.public %>'
			},
			manifest: {
				src		: 'manifest.json',
				dest		: '<%= app.directory.dist.public %>/manifest.json'
			}
		},

		/**
		 * Deletes files
		 * ==============================
		 */
		clean: {
			build: {
				src: ['<%= app.directory.dist.public %>']
			}
		},

		/**
		 * Concatinates files.
		 * ==============================
		 */
		concat: {
			app: {
				src: '<%= app.js.app %>',
				dest: '<%= app.directory.dist.scripts %>/app.js'
			},
		},

		/**
		 * Validates your .js files via JSHint.
		 * ==============================
		 */
		jshint: {
			options: {
				reporter	: require('jshint-stylish'),
				strict	: true,
				eqeqeq	: true,
				noempty	: true,
				sub		: true,
				esnext	: true
			},
			beforeconcat: '<%= app.directory.config.scripts %>/**/*.js'
		},

		/**
		 * Compiles Sass into valid CSS.
		 * ==============================
		 */
		sass: {
			options: {
				style: 'compact'
			},
			files: {
				src	:  '<%= app.directory.config.sass %>/main.scss',
				dest	: '<%= app.directory.config.css %>/main.unprefixed.css'
			}
		},

		/**
		 * Adds all relevant prefix based on Caniuse.com database.
		 * ==============================
		 */
		autoprefixer: {
			options: {
				browsers: ['last 2 Chrome versions']
			},
			files: {
				src	: '<%= app.directory.config.css %>/main.unprefixed.css',
				dest	: '<%= app.directory.config.css %>/main.css'
			}
		},

		/**
		 * Minifies CSS.
		 * ==============================
		 */
		cssmin: {
			main: {
				options: {
					keepSpecialComments: 0
				},
				files: [{
					expand	: true,
					cwd		: '<%= app.directory.config.css %>',
					src		: 'main.css',
					dest		: '<%= app.directory.dist.css %>',
					ext		: '.min.css'
				}]
			}
		},

		/**
		 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
		 * ==============================
		 */
		watch: {
			markup: {
				files: [
					'*.html',
					'<%= app.directory.config.views %>/**/*.html'
				],
				tasks: ['newer:copy:html']
			},
			css: {
				files: [
					'<%= app.directory.config.sass %>/**/*.scss',
					'<%= app.directory.config.css %>/**/*.css'
				],
				tasks: ['css']
			},
			js: {
				files: '<%= app.directory.config.scripts %>/**/*.js',
				tasks: ['newer:jshint', 'newer:concat']
			},
			assets: {
				files: '<%= app.directory.config.assets %>/**/*.*',
				tasks: ['newer:copy:assets']
			}
		},

		/**
		 * Awesome task which shows notifications on your Desktop when a specific task is finished.
		 * ==============================
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