'use strict';

// Configuring the Articles module
angular.module('issues').run(['Menus',
	function(Menus) { //TODO: add to linkgearrequest...
        // Set top bar menu items
		//Menus.addMenuItem('topbar', 'Admin', 'issues', 'dropdown', '/issues(/create)?', false, ['admin'], 1);
  //      Menus.addSubMenuItem('topbar', 'issues', 'List LinkGearRequests', 'issues');
  //      Menus.addSubMenuItem('topbar', 'issues', 'List Unpublished pros', 'admin/pros?unpublishedonly=true');
  //      Menus.addSubMenuItem('topbar', 'issues', 'List Unpublished gears', 'admin/gears?unpublishedonly=true');
	}
]);