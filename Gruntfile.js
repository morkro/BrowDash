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
				dest: {
					'public'	: 'public',
					'assets'	: '<%= app.directory.dest.public %>/assets',
					'scripts': '<%= app.directory.dest.public %>/scripts',
					'css'		: '<%= app.directory.dest.public %>/css',
				},
				build: {
					'sass'	: 'styles/sass',
					'css'		: 'styles/css',
					'assets'	: 'assets',	
					'fonts'	: '<%= app.directory.build.assets %>/fonts',
					'scripts': 'scripts',
					'views'	: 'views'
				}
			},
			scripts: [
				/* Libraries */
				'<%= app.directory.build.scripts %>/libs/fetch.polyfill.js',
				/* Modules */
				'<%= app.directory.build.scripts %>/modules/brow.core.js',
				'<%= app.directory.build.scripts %>/modules/brow.data.js',
				'<%= app.directory.build.scripts %>/modules/brow.timer.js',
				'<%= app.directory.build.scripts %>/modules/brow.dialog.js',
				'<%= app.directory.build.scripts %>/modules/brow.card.js',
				'<%= app.directory.build.scripts %>/modules/brow.settings.js',
				/* Cards */
				'<%= app.directory.build.scripts %>/cards/brow.card.basic.js',
				/* App initialisation */
				'<%= app.directory.build.scripts %>/app.init.js'
			]
		},

		/**
		 * Copies files into directory.
		 * ==============================
		 */
		copy: {
			html: {
				expand	: true,
				src		: [
					'<%= app.directory.build.views %>/index.html',
					'<%= app.directory.build.views %>/card-base.html'
				],
				dest		: '<%= app.directory.dest.public %>/',
				flatten	: true,
				filter	: 'isFile'
			},
			views: {
				expand	: true,
				src		: [
					'<%= app.directory.build.views %>/dialog-about.html',
					'<%= app.directory.build.views %>/dialog-settings.html'
				],
				dest		: '<%= app.directory.dest.public %>/views',
				flatten	: true,
				filter	: 'isFile'
			},
			assets: {
				expand	: true,
				src		: '<%= app.directory.build.assets %>/**/*.*',
				dest		: '<%= app.directory.dest.public %>'
			},
			manifest: {
				src		: 'manifest.json',
				dest		: '<%= app.directory.dest.public %>/manifest.json'
			},
			components: {
				src		: '<%= app.directory.build.scripts %>/components/card.js',
				dest		: '<%= app.directory.dest.scripts %>/card.js'
			}
		},

		/**
		 * Deletes files
		 * ==============================
		 */
		clean: {
			build: {
				src: ['<%= app.directory.dest.public %>']
			}
		},

		/**
		 * Concatinates files.
		 * ==============================
		 */
		concat: {
			app: {
				src: '<%= app.scripts %>',
				dest: '<%= app.directory.dest.scripts %>/app.js'
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
			beforeconcat: '<%= app.directory.build.scripts %>/**/*.js'
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
				src	:  '<%= app.directory.build.sass %>/main.scss',
				dest	: '<%= app.directory.build.css %>/main.unprefixed.css'
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
				src	: '<%= app.directory.build.css %>/main.unprefixed.css',
				dest	: '<%= app.directory.build.css %>/main.css'
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
					cwd		: '<%= app.directory.build.css %>',
					src		: 'main.css',
					dest		: '<%= app.directory.dest.css %>',
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
					'<%= app.directory.build.views %>/**/*.html'
				],
				tasks: ['copy:html']
			},
			css: {
				files: [
					'<%= app.directory.build.sass %>/**/*.scss',
					'<%= app.directory.build.css %>/**/*.css'
				],
				tasks: ['css']
			},
			js: {
				files: [
					'!<%= app.directory.build.scripts %>/components/*.js',
					'<%= app.directory.build.scripts %>/modules/*.js',
					'<%= app.directory.build.scripts %>/cards/*.js',
					'<%= app.directory.build.scripts %>/app.init.js'
				],
				tasks: ['newer:jshint', 'newer:concat']
			},
			components: {
				files: '<%= app.directory.build.scripts %>/components/*.js',
				tasks: ['newer:copy:components']
			},
			assets: {
				files: '<%= app.directory.build.assets %>/**/*.*',
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