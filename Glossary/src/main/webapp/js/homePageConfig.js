/**
 * 
 */
var app = angular.module("HomePageGateway", [ 'ngRoute', 'ngMaterial', 'ngMessages',
		'ui.bootstrap', 'ngResource' ]);

/*
 * Glossary Service to share information between Home page and Propose/Edit
 * modals
 */
app.service("HomePageService", function() {
	this.glossaryList = "";
	this.businessTermTypes = "";
	this.employees = "";
	this.url = "";
	this.LOBList = "";
	this.BSList = "";
	// this.targetApp="";

});


/*
 * Glossary Service to share information between Home page and Propose/Edit
 * modals
 */
app.service("HomePageService", function() {
	this.glossaryList = "";
	this.businessTermTypes = "";
	this.url = "";

});

// App Controller
app.controller("HomePageController",
				function($scope, $rootScope, $filter, $http, $location,
						$mdSidenav,$mdUtil, $timeout, $log, $element, $mdSelect,
						$mdDialog, HomePageService, $window,$q, $compile, $sce) {

					
										
					$scope.loadHomeConfig = function (){
						alert("-----loadHomeConfig-----");
					}
					
					
					
					$scope.toggleSidenav = function(menuId) {
						$scope.hoverEdit = true;

					};

					$scope.hoverIn = function() {
						if ($scope.toggleFlag) {
							$scope.hoverEdit = true;
							$scope.edit = false;
						}

					};

					$scope.hoverOut = function() {
						if ($scope.toggleFlag) {
							$scope.hoverEdit = false;
							$scope.edit = true;
						}
					};

					// END

					$scope.openLeftMenu = function() {
						$mdSidenav('left').toggle();
					};

					// END

					$scope.OpenPopupWindow = function() {
						var $popup = $window.open("PopUp.html", "popup",
								"width=250,height=100,left=10,top=150");
					}

					
				});



function startLoader(message) {
	$(
			'<div class="modal-backdrop"></div><div class="layout-progress"><span><i class="fa fa-car"></i></span><span>'
					+ message + '</span></div>').appendTo(document.body);
}

function stopLoader() {
	$(".modal-backdrop").remove();
	$(".layout-progress").remove();
}

app.filter('startFrom', function() {
	return function(input, start) {
		if (!input || !input.length) {
			return;
		}
		start = +start; // parse to int
		return input.slice(start);
	}
});






$(function() {
	var Accordion = function(el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.el.find('.link');
		// Evento
		links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
	}

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.el;
			$this = $(this),
			$next = $this.next();

		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		};
	}	

	var accordion = new Accordion($('#accordion'), false);
});


function loadHomePage($scope, $http) {  
	$http({
		method : 'GET',
		url : './homePageConfig.json'
	}).then(function successCallback(response) {
		
		var subjectAreasList = response.data.SubjectAreas.defaultList;
		if(subjectAreasList != null){
			loadSubjectArea($scope, $http, response.data.SubjectAreas.id.value, subjectAreasList);
		 }
		
		var lobList = response.data.LineOfBusiness.defaultList;
		if(lobList != null){
			loadLineOfBusiness($scope, $http, response.data.LineOfBusiness.id.value, lobList);
		 }
		
		var dsList = response.data.DataSources.defaultList;
		if(dsList != null){
			loadDataSources($scope, $http, response.data.DataSources.id.value, dsList);
		 }
	})
	
}

function loadSubjectArea($scope, $http, configId, subjectAreasList) {
    return $http({method : 'GET',url : '/Glossary/getHomePageConfig',
		params : {
			dgcRestUrlLatest : $scope.dgcRestUrlLatest,
			relationApi : $scope.relationNameApi,
			typeId : configId,
			proxyUrl : $scope.proxyUrl,
			proxyPort : $scope.proxyPort,
			apiUser : $scope.apiUser,
			apiUserPassword : $scope.apiUserPassword,
			dataList : subjectAreasList
		},
		headers : {
			'Content-Type' : 'application/json'
		}
	}).then(function successCallback(response) {
		$scope.homePageSubjectArea = response.data[1];
	})
} 

function loadLineOfBusiness($scope, $http, configId, lobList) {
    return $http({method : 'GET',url : '/Glossary/getHomePageConfig',
		params : {
			dgcRestUrlLatest : $scope.dgcRestUrlLatest,
			relationApi : $scope.relationNameApi,
			typeId : configId,
			proxyUrl : $scope.proxyUrl,
			proxyPort : $scope.proxyPort,
			apiUser : $scope.apiUser,
			apiUserPassword : $scope.apiUserPassword,
			dataList : lobList
		},
		headers : {
			'Content-Type' : 'application/json'
		}
	}).then(function successCallback(response) {
		$scope.homePageLineOfBusiness = response.data[1];
	})
}

function loadDataSources($scope, $http, configId, dsList) {
    return $http({method : 'GET',url : '/Glossary/getHomePageConfig',
		params : {
			dgcRestUrlLatest : $scope.dgcRestUrlLatest,
			relationApi : $scope.relationNameApi,
			typeId : configId,
			proxyUrl : $scope.proxyUrl,
			proxyPort : $scope.proxyPort,
			apiUser : $scope.apiUser,
			apiUserPassword : $scope.apiUserPassword,
			dataList : dsList
		},
		headers : {
			'Content-Type' : 'application/json'
		}
	}).then(function successCallback(response) {
		$scope.homePageDataSources = response.data[1];
	})
}

function filterHomePage($scope, $http, assetId) { 
	return $http({method : 'GET',url : '/Glossary/filterHomeConfigData',
		params : {
			dgcRestUrlLatest : $scope.dgcRestUrlLatest,
			relationApi : $scope.relationApi,
			assetId : assetId,
			proxyUrl : $scope.proxyUrl,
			proxyPort : $scope.proxyPort,
			apiUser : $scope.apiUser,
			apiUserPassword : $scope.apiUserPassword
		},
		headers : {
			'Content-Type' : 'application/json'
		}
	}).then(function successCallback(response) {
		$scope.filterHomeConfig = response.data;
	})
	
}