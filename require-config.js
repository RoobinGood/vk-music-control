require.config({
	paths: {
		
		'helpers': 'js/utils/helpers',
		'notificationManager': 'js/utils/notificationManager',
		
		// bower_components
		// 'jquery': 'bower_components/jquery/dist/jquery',
		'underscore': 'bower_components/underscore/underscore-min',
		// 'anticipant': 'bower_components/anticipant/lib/anticipant',
	},
	shim: {
		// 'jquery':{
		// 	exports:'$'
		// },
		'underscore':{
			exports:'_'
		},
		// 'anticipant':{
		// 	exports:'anticipant'
		// }
	}
});
