'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'progear';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ngFileUpload'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('gears');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('linkGearRequests');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('pros');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar', true);
	}
]);
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
'use strict';

//Setting up route
angular.module('gears').config(['$stateProvider',
	function($stateProvider) {
		// Gears state routing
		$stateProvider.
		state('listGears', {
			url: '/gears?unpublishedonly',
			templateUrl: 'modules/gears/views/list-gears.client.view.html'
		}).
		state('createGear', {
			url: '/gears/create',
			templateUrl: 'modules/gears/views/create-gear.client.view.html'
		}).
		state('viewGear', {
			url: '/gears/:gearId',
			templateUrl: 'modules/gears/views/view-gear.client.view.html'
		}).
		state('editGear', {
			url: '/gears/:gearId/edit',
			templateUrl: 'modules/gears/views/edit-gear.client.view.html'
        }).
        state('listGearsAdmin', {
            url: '/admin/gears?unpublishedonly',
            templateUrl: 'modules/gears/views/list-gears-admin.client.view.html'
        });
	}
]);
'use strict';

// Gears controller
var app = angular.module('gears');
app.controller('GearsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gears', '$modal',
    function ($scope, $stateParams, $location, Authentication, Gears, $modal) {
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.offset = 0;
        
        // Page changed handler
        $scope.pageChanged = function () {
            $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
        };
        
        $scope.gearTypes = [
            { id: 1, name: 'Keyboard' },
            { id: 2, name: 'Mouse' }
        ];
        $scope.selectedGearType = null;
        
        $scope.selectedTypeFilter = undefined;

        $scope.setFilterGearType = function (value) {
            if ($scope.selectedTypeFilter === value) {
                $scope.selectedTypeFilter = undefined;
            } else {
                $scope.selectedTypeFilter = value;
            }
        };
        
        $scope.byType = function (entry) {
            return $scope.selectedTypeFilter === undefined || entry.type === $scope.selectedTypeFilter;
        };

        // Create new Gear
        $scope.create = function () {
            // Create new Gear object
            var gear = new Gears.resource({
                name: this.name,
                type: $scope.selectedGearType.name,
                amazonLink: this.amazonLink,
                website: this.website
            });
            
            // Redirect after save
            gear.$save(function (response) {
                $location.path('gears/' + response._id);
                
                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Remove existing Gear
        $scope.remove = function (gear) {
            if (confirm('Are you sure you want to delete?')) {
                if (gear) {
                    gear.$remove();
                    
                    for (var i in $scope.gears) {
                        if ($scope.gears [i] === gear) {
                            $scope.gears.splice(i, 1);
                        }
                    }
                } else {
                    $scope.gear.$remove(function () {
                        $location.path('gears');
                    });
                }
            }
        };
        
        // Update existing Gear
        $scope.update = function () {
            var gear = $scope.gear;
            
            gear.$update(function () {
                $location.path('gears/' + gear._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Find a list of Gears
        $scope.find = function () {
            if ($stateParams.unpublishedonly && $stateParams.unpublishedonly === 'true') {
                $scope.gears = Gears.admin.query();
            } else {
                $scope.gears = Gears.resource.query();
            }
        };
        
        // Find existing Gear
        $scope.findOne = function () {
            $scope.gear = Gears.resource.get({
                gearId: $stateParams.gearId
            });
            $scope.relatedPros = Gears.getProsForGear($stateParams.gearId);
        };

        // go to gear
        $scope.gearSearch = function (product) {
            $location.path('gears/' + product._id);
        };

        $scope.openCreate = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/gears/views/modalCreate-gear.client.view.html',
                controller: 'GearsController.modal',
                size: 'sm'
            });
            modalInstance.result.then(function (newGear) {
                $scope.find();
            }, function () {
                
            }); 
        };

        $scope.shouldRender = function (user) {
            if (user) {
                for (var userRoleIndex in user.roles) {
                    if ('admin' === user.roles[userRoleIndex]) {
                        return true;
                    }
                }
            }
            return false;
        };
}]);

app.controller('GearsController.modal', ['$scope','Gears','$modalInstance', function ($scope, Gears, $modalInstance) {
        $scope.selected = {
            gear: null
        };
        $scope.gears = Gears.resource.query();
        $scope.ok = function () {
            $modalInstance.close($scope.selected.gear);
        };
        
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.modalSubmit = function (data) {
            //event.preventDefault();
            var gear = new Gears.resource({
                name: data.name,
                type: data.selectedGearType.name,
                amazonLink: data.amazonLink,
                website: data.website
            });
            
            // close modal after save
            gear.$save(function (response) {
                $modalInstance.close(gear);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Search for a pro
        $scope.gearSearch = function (product) {
            $scope.selected.gear = product;
        };
    }]);

'use strict';

//Gears service used to communicate Gears REST endpoints
angular.module('gears').factory('Gears', ['$resource',
    function ($resource) {
        var resource = $resource('gears/:gearId', {
            gearId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
        return {
            resource: resource,
            admin: $resource('admin/gears/unpublished/:gearId', {
                gearId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            getProsForGear: function (id) {
                return $resource('gears/:gearId/pros', {
                    gearId: id
                }).query();
            }
        };
	}
]);
'use strict';

// Configuring the Articles module
angular.module('linkGearRequests').run(['Menus',
	function(Menus) {
        // Set top bar menu items
		Menus.addMenuItem('topbar', 'Admin', 'linkGearRequests', 'dropdown', '/linkGearRequests(/create)?', false, ['admin'], 1);
        Menus.addSubMenuItem('topbar', 'linkGearRequests', 'List LinkGearRequests', 'linkGearRequests');
        Menus.addSubMenuItem('topbar', 'linkGearRequests', 'List Unpublished pros', 'admin/pros?unpublishedonly=true');
        Menus.addSubMenuItem('topbar', 'linkGearRequests', 'List Unpublished gears', 'admin/gears?unpublishedonly=true');
	}
]);
'use strict';

//Setting up route
angular.module('linkGearRequests').config(['$stateProvider',
	function($stateProvider) {
		// LinkGearRequests state routing
		$stateProvider.
		state('listLinkGearRequests', {
			url: '/linkGearRequests',
			templateUrl: 'modules/linkGearRequests/views/list-linkGearRequests.client.view.html'
		}).
		state('createLinkGearRequest', {
			url: '/linkGearRequests/create/:proId',
			templateUrl: 'modules/linkGearRequests/views/create-linkGearRequest.client.view.html'
		}).
		state('viewLinkGearRequest', {
			url: '/linkGearRequests/:linkGearRequestId',
			templateUrl: 'modules/linkGearRequests/views/view-linkGearRequest.client.view.html'
		}).
		state('editLinkGearRequest', {
			url: '/linkGearRequests/:linkGearRequestId/edit',
			templateUrl: 'modules/linkGearRequests/views/edit-linkGearRequest.client.view.html'
		});
	}
]);
'use strict';

// LinkGearRequests controller
angular.module('linkGearRequests').controller('LinkGearRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'LinkGearRequests',
    function ($scope, $stateParams, $location, Authentication, LinkGearRequests) {
        $scope.authentication = Authentication;
        
        // Create new LinkGearRequest
        $scope.create = function () {
            // Create new LinkGearRequest object
            var linkGearRequest = new LinkGearRequests({
                name: this.name
            });
            
            // Redirect after save
            linkGearRequest.$save(function (response) {
                $location.path('linkGearRequests/' + response._id);
                
                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Remove existing LinkGearRequest
        $scope.remove = function (linkGearRequest) {
            if (linkGearRequest) {
                linkGearRequest.$remove();
                
                for (var i in $scope.linkGearRequests) {
                    if ($scope.linkGearRequests [i] === linkGearRequest) {
                        $scope.linkGearRequests.splice(i, 1);
                    }
                }
            } else {
                $scope.linkGearRequest.$remove(function () {
                    $location.path('linkGearRequests');
                });
            }
        };
        
        // Update existing LinkGearRequest
        $scope.update = function () {
            var linkGearRequest = $scope.linkGearRequest;
            
            linkGearRequest.$update(function () {
                $location.path('linkGearRequests/' + linkGearRequest._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Find a list of LinkGearRequests
        $scope.find = function () {
            $scope.linkGearRequests = LinkGearRequests.query();
        };
        
        // Find existing LinkGearRequest
        $scope.findOne = function () {
            $scope.linkGearRequest = LinkGearRequests.get({
                linkGearRequestId: $stateParams.linkGearRequestId
            });
        };
        
        $scope.setStatus = function (linkGearRequest, status) {
            if (linkGearRequest.status !== status) {
                linkGearRequest.status = status;
                
                linkGearRequest.$update(function (response) {
                    //$location.path('pros/' + response.pro._id);
                    $scope.message = status + ' successful!';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }); 
            }
        };
    }
]);
'use strict';

//LinkGearRequests service used to communicate LinkGearRequests REST endpoints
angular.module('linkGearRequests').factory('LinkGearRequests', ['$resource',
	function($resource) {
		return $resource('linkGearRequests/:linkGearRequestId', { linkGearRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('pros').config(['$stateProvider',
    function ($stateProvider) {
        // Pros state routing
        $stateProvider.
		state('listPros', {
            url: '/pros?unpublishedonly',
            templateUrl: 'modules/pros/views/list-pros.client.view.html'
        }).
		state('createPro', {
            url: '/pros/create',
            templateUrl: 'modules/pros/views/create-pro.client.view.html'
        }).
		state('viewPro', {
            url: '/pros/:proId',
            templateUrl: 'modules/pros/views/view-pro.client.view.html'
        }).
        state('addGear', {
            url: '/pros/:proId/addGear?type',
            templateUrl: 'modules/pros/views/addGear-pro.client.view.html'
        }).
		state('editPro', {
            url: '/pros/:proId/edit',
            templateUrl: 'modules/pros/views/edit-pro.client.view.html'
        })
        .state('listProsAdmin', {
            url: '/admin/pros?unpublishedonly',
            templateUrl: 'modules/pros/views/list-pros-admin.client.view.html'
        });
    }
]);
'use strict';
///<reference path="../../core/services/menus.client.service.js" />

// Pros controller
var app = angular.module('pros');
app.controller('ProsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pros', 'Gears', '$modal', 'LinkGearRequests', 'Menus', 'Upload',
    function ($scope, $stateParams, $location, Authentication, Pros, Gears, $modal, LinkGearRequests, Menus, Upload) {
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.offset = 0;
        
        // Page changed handler
        $scope.pageChanged = function () {
            $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
        };
        
        $scope.selectedSportFilter = undefined;
        
        $scope.setSelectedSportFilter = function (value) {
            if ($scope.selectedSportFilter === value) {
                $scope.selectedSportFilter = undefined;
            } else {
                $scope.selectedSportFilter = value;
            }
        };
        
        $scope.sportFilter = function (item) {
            return $scope.selectedSportFilter === undefined || item.sport === $scope.selectedSportFilter;
        };
        
        $scope.selectedTeamFilter = undefined;
        
        $scope.setSelectedTeamFilter = function (value) {
            if ($scope.selectedTeamFilter === value) {
                $scope.selectedTeamFilter = undefined;
            } else {
                $scope.selectedTeamFilter = value;
            }
        };
        
        $scope.teamFilter = function (item) {
            return $scope.selectedTeamFilter === undefined || item.team === $scope.selectedTeamFilter;
        };

        // Create new Pro
        $scope.create = function () {
            // Create new Pro object
            var pro = new Pros.resource({
                name: this.name,
                sport: this.sport,
                team: this.team,
                alias: this.alias,
                fbProfile: this.fbProfile,
                website: this.website
            });
            // Redirect after save
            pro.$save(function (response) {
                $location.path('pros/' + response._id);  
                $scope.upload($scope.file);
                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.upload = function (file, proid) {
            Upload.upload({
                url: 'api/upload/',
                method: 'POST',
                data: { 'type': 'pro', id: proid },
                file: file
            });
        };

        // Remove existing Pro
        $scope.remove = function (pro) {
            if (confirm('Are you sure you want to delete?')) {
                if (pro) {
                    pro.$remove();
                    
                    for (var i in $scope.pros) {
                        if ($scope.pros [i] === pro) {
                            $scope.pros.splice(i, 1);
                        }
                    }
                } else {
                    $scope.pro.$remove(function () {
                        $location.path('pros');
                    });
                }
            }
        };
        
        // Update existing Pro
        $scope.update = function () {
            var pro = $scope.pro;
            
            pro.$update(function () {
                $location.path('pros/' + pro._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Find a list of Pros
        $scope.find = function () {
            if ($stateParams.unpublishedonly && $stateParams.unpublishedonly === 'true') {
                $scope.pros = Pros.admin.query();
            } else {
                $scope.pros = Pros.resource.query();
            }
        };
        
        // Find existing Pro
        $scope.findOne = function () {
            $scope.pro = Pros.resource.get({
                proId: $stateParams.proId
            });
            $scope.gearList = Pros.getGearsForPro($stateParams.proId);
        };

        // Search for a pro
        $scope.proSearch = function (product) {
            $location.path('pros/' + product._id);
        };

        $scope.open = function (size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/gears/views/modalList-gear.client.view.html',
                controller: 'GearsController.modal',
                size: size
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
                var contains = false;
                for (var i in $scope.pro.gearList) {
                    if ($scope.pro.gearList [i]._id === selectedItem._id) {
                        contains = true;
                    }
                }
                if (!contains) {
                    $scope.pro.gearList.push(selectedItem);
                }
            }, function () {
                
            });
        };

        $scope.addGear = function () {
            $scope.pro = Pros.resource.get({
                proId: $stateParams.proId
            });
            $scope.type = $stateParams.type;
            $scope.gears = Gears.resource.query();
        };
        
        $scope.gearSelect = function (item) {
            $scope.selectedGear = item;
        };
        
        $scope.createRequest = function () {
            // Create new request object
            var request = new LinkGearRequests({
                pro: $scope.pro._id,
                gear: $scope.selectedGear._id,
                proofLink: this.proofLink,
                explanation: this.explanation
            });
            
            request.$save(function (response) {
                $scope.pro.requestList.push(response);

                // Redirect after save
                $scope.pro.$update(function (response) {
                    $location.path('pros/' + response._id);
                    
                    $scope.search = '';
                    // Clear form fields
                    $scope.proofLink = '';
                    $scope.explanation = '';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });  
        };

        $scope.openCreate = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/pros/views/modalCreate-pro.client.view.html',
                controller: 'ProsController.modal',
                size: 'sm'
            });
            modalInstance.result.then(function () {
                $scope.find();
            }, function () {
                
            });
        };

        $scope.openCreateGear = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/gears/views/modalCreate-gear.client.view.html',
                controller: 'GearsController.modal',
                size: 'sm'
            });
            modalInstance.result.then(function (gear) {
                $scope.selectedGear = gear;
            }, function () {
                
            });
        };

        $scope.shouldRender = function (user) {
            if (user) {
                for (var userRoleIndex in user.roles) {
                    if ('admin' === user.roles[userRoleIndex]) {
                        return true;
                    }
                }
            }
            return false;
        };

        $scope.removeGear = function (gear) {
            for (var i in $scope.pro.gearList) {
                if ($scope.pro.gearList [i] === gear) {
                    $scope.pro.gearList.splice(i, 1);
                }
            }
        };
    }]);

app.controller('ProsController.modal', ['$scope', 'Pros', '$modalInstance', function ($scope, Pros, $modalInstance) {        
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.modalSubmit = function (data) {
            var pro = new Pros({
                name: data.name,
                team: data.team
            });
            
            // Redirect after save
            pro.$save(function (response) {
                $modalInstance.close();
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }]);

'use strict';

//Pros service used to communicate Pros REST endpoints
angular.module('pros').factory('Pros', ['$resource',
    function ($resource) {
        return {
            resource: $resource('pros/:proId', {
                proId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            admin: $resource('admin/pros/unpublished/:proId', {
                proId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            getGearsForPro: function (id) {
                return $resource('pros/:proId/gears', {
                    proId: id
                }).query();
            }
        };
    }
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);