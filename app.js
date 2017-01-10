(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.directive('foundItems', FoundItems)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'menu',
    bindToController: true
  };

  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.searchTerm = "";
  menu.headerMessage = "";

    menu.filterMenuItems = function (searchString){
      var promise = MenuSearchService.getMatchedMenuItems(searchString);
          promise.then(function (response) {
          menu.foundItems = response;
          if(menu.foundItems.length === 0)
          {
            menu.headerMessage = "Nothing found";
          }
          else
          {
              menu.headerMessage = "Search Results";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    menu.removeItem = function (itemIndex) {
        MenuSearchService.removeItem(itemIndex);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var foundItems=[];

    service.getMatchedMenuItems = function (searchTerm) {
      var httpPromise = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });

      return httpPromise.then(function(response){

        foundItems = [];
        if(searchTerm.length === 0)
        {
          return foundItems;
        }

         for(var i = 0; i < response.data.menu_items.length; i++)
         {
           if(response.data.menu_items[i].description.toLowerCase().indexOf(searchTerm) >= 0)
           {
              foundItems.push(response.data.menu_items[i]);
            }
         }

        return foundItems
      });
    };

    service.removeItem = function (itemIndex) {
        foundItems.splice(itemIndex, 1);
};
}

})();
