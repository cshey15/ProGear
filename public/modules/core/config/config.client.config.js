'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
        // Set top bar menu items
		Menus.addMenuItem('topbar', 'Admin', 'admin', 'dropdown', '/linkGearRequests(/create)?', false, ['admin'], 1);
        Menus.addSubMenuItem('topbar', 'admin', 'List LinkGearRequests', 'linkGearRequests');
        Menus.addSubMenuItem('topbar', 'admin', 'List Issues', 'issues');
        Menus.addSubMenuItem('topbar', 'admin', 'Bulk Add', 'admin/bulkupload');
        Menus.addSubMenuItem('topbar', 'admin', 'List Unpublished pros', 'admin/pros?unpublishedonly=true');
        Menus.addSubMenuItem('topbar', 'admin', 'List Unpublished gears', 'admin/gears?unpublishedonly=true');
	}
]);