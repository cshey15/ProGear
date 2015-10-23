'use strict';

// Pros module config
angular.module('pros').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Pros', 'pros', 'dropdown', '/pros(/create)?');
        Menus.addSubMenuItem('topbar', 'pros', 'List Pros', 'pros');
        Menus.addSubMenuItem('topbar', 'pros', 'New Pro', 'pros/create');
    }
]);