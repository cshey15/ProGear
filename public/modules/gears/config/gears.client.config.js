'use strict';

// Configuring the Articles module
angular.module('gears').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Gears', 'gears', 'dropdown', '/gears(/create)?', true, null, 1);
		Menus.addSubMenuItem('topbar', 'gears', 'Browse by gear', 'gears');
	}
]);