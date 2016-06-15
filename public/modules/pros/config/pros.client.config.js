'use strict';

// Pros module config
angular.module('pros').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Pros', 'pros', 'dropdown', '/pros(/create)?', true, null, 0);
        Menus.addSubMenuItem('topbar', 'pros', 'Search by Pros', 'pros');
        Menus.addSubMenuItem('topbar', 'pros', 'Add a new Pro', 'pros/create');
    }
]);