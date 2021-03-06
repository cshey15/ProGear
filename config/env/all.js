'use strict';

module.exports = {
	app: {
        title: 'Prozgear - Find what gear your favorite pro uses',
		description: 'Website to lookup what keyboard and mouse professional gamers use',
		keywords: 'League Of Legends, Starcraft, pro gamer\'s keyboard, pro gamer\'s mouse'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/angular-ui-notification/dist/angular-ui-notification.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/ng-file-upload/ng-file-upload.js',
                'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
                'public/lib/angular-google-analytics/dist/angular-google-analytics.js'

			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};