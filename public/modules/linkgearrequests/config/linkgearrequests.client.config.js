'use strict';

// Configuring the Articles module
angular.module('linkGearRequests').run(['Menus',
	function(Menus) {
        // Set top bar menu items
		Menus.addMenuItem('topbar', 'Admin', 'linkGearRequests', 'dropdown', '/linkGearRequests(/create)?', false, ['admin'], 1);
        Menus.addSubMenuItem('topbar', 'linkGearRequests', 'List LinkGearRequests', 'linkGearRequests');
        Menus.addSubMenuItem('topbar', 'linkGearRequests', 'List Unpublished pros', 'pros?unpublishedonly=true');
        Menus.addSubMenuItem('topbar', 'linkGearRequests', 'List Unpublished gears', 'gears?unpublishedonly=true');
	}
]);