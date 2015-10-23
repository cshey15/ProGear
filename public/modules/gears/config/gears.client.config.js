'use strict';

// Configuring the Articles module
angular.module('gears').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Gears', 'gears', 'dropdown', '/gears(/create)?');
		Menus.addSubMenuItem('topbar', 'gears', 'List Gears', 'gears');
		Menus.addSubMenuItem('topbar', 'gears', 'New Gear', 'gears/create');
	}
]);