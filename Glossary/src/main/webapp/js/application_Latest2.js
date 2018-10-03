/**
 * 
 */
var app = angular.module("SearchGateway", [ 'ngRoute', 'ngMaterial',
		'ui.bootstrap', 'ngResource' ]);

/*
 * Glossary Service to share information between Home page and Propose/Edit
 * modals
 */
app.service("GlossaryService", function() {
	this.glossaryList = "";
	this.businessTermTypes = "";
	this.employees = "";
	this.url = "";
	this.LOBList = "";
	this.BSList = "";
	// this.targetApp="";

});

app.directive("mySample", function() {
	return {
		restrict: 'E',
		templateUrl : "my-sample.html"
	};
});

/*
 * Glossary Service to share information between Home page and Propose/Edit
 * modals
 */
app.service("configReaderService", function() {
	this.glossaryList = "";
	this.businessTermTypes = "";
	this.url = "";

});

// App Controller
app
		.controller(
				"SearchController",
				function($scope, $rootScope, $filter, $http, $location,
						$mdSidenav, $timeout, $log, $element, $mdSelect,
						$mdDialog, GlossaryService, $window) {

					$scope.loadingApp = true;
					$scope.currentPage_Filtered = 0;
					$scope.noOfFilteredPages = 0;
					$scope.Math = window.Math;

					$scope.pages = [ {
						size : '10'
					}, {
						size : '15'
					}, {
						size : '20'
					}, {
						size : '25'
					} ];

					$scope.articulationScoreList = [ {
						value : '5',
						name : 'Candidate'
					}, {
						value : '10',
						name : 'In Progress'
					}, {
						value : '50',
						name : 'Under Review'
					}, {
						value : '80',
						name : 'Reviewed'
					}, {
						value : '100',
						name : 'Accepted'
					} ];
					// $scope.currentPage = 0;

					$scope.articulationsScoreData = null;
					// $scope.pageSize = 10;

					$scope.changePageSize = function(pagination) {
						$scope.pageSize = pagination.size;
					}
					$scope.lockLeft = true;

					$scope.close = function() {
						$mdSidenav('left').close().then(function() {
							$log.debug("close LEFT is done");
						});

					};

					$scope.businessTermTypes = [ {
						type : "Acronym",
						id : "00000000-0000-0000-0000-000000011003"
					}, {
						type : "Business Term",
						id : "00000000-0000-0000-0000-000000011001"
					}, {
						type : "Synonym",
						id : "b370a9f5-2138-472e-b384-ebee1e97a7f7"
					} ];

					GlossaryService.businessTermTypes = $scope.businessTermTypes;
					// $scope.statuses = [{name :"Accepted"},{name
					// :"Approved"},{name:"Approval Pending"},{name
					// :"Candidate"},{name :"Invalid"},{name :"In
					// Progress"},{name :"Reviewed"},{name :"Under Review"}];

					//

					GlossaryService.employees = $scope.employees;

					$scope.statuses = [ {
						name : "Accepted",
						id : "00000000-0000-0000-0000-000000005009"
					}, {
						name : "Approved",
						id : "00000000-0000-0000-0000-000000005025"
					}, {
						name : "Approval Pending",
						id : "00000000-0000-0000-0000-000000005023"
					}, {
						name : "Candidate",
						id : "00000000-0000-0000-0000-000000005008"
					}, {
						name : "Invalid",
						id : "00000000-0000-0000-0000-000000005022"
					}, {
						name : "In Progress",
						id : "00000000-0000-0000-0000-000000005019"
					}, {
						name : "Reviewed",
						id : "00000000-0000-0000-0000-000000005021"
					}, {
						name : "Under Review",
						id : "00000000-0000-0000-0000-000000005020"
					} ];

					$scope.domainFilter = function(glossaryList) {
						if ($scope.selected.length > 0) {
							if ($.inArray(glossaryList.context.val,
									$scope.selected) < 0)
								return;
						}
						return glossaryList;
					}

					$scope.statusFilter = function(glossaryList) {
						if ($scope.selectedStatus.length > 0) {
							if ($.inArray(glossaryList.status,
									$scope.selectedStatus) < 0)
								return;
						}
						$scope.currentPage = 0;
						return glossaryList;
					}

					$scope.clearSearch = function() {
						$scope.searchForm.term = '';
					}

					/*
					 * This function handles logic to fetch business terms when
					 * a term is searched using search bar within the app
					 */
					$scope.searchTerm = function() {
						var searchTerm1 = window.location.search.substr(1);
						var params = window.location.search.substr(1)
								.split("&");

						$scope.payment = $scope.pages[0];

						location.search.substr(1).split("&").forEach(
								function(item) {
									tmp = item.split("=");
									if (tmp[0] === "term") {
										searchTerm = decodeURI(tmp[1]);
									}
									if (tmp[0] === "showSearch") {
										showSearch = tmp[1];
									}
									if (tmp[0] === "user") {
										userName = tmp[1];
									}
									if (tmp[0] === "app") {
										app = tmp[1];
										$scope.app = app;
									}
								});

						$window.location.href = "/Glossary/Search.html?term="
								+ $scope.searchForm.term + "&showSearch="
								+ showSearch + "&app=" + app;
					};

					/* This init function is invoked when Search page loads */
					$scope.init = function() {
						// $scope.loading = true ;
						// $scope.loadingDomains = true ;
						var tmp = "";
						var searchTerm1 = window.location.search.substr(1);
						var params = window.location.search.substr(1)
								.split("&");
						var searchTerm = "";
						var showSearch = "";
						var userName = "";

						var articulationScoreListArray = [];
						// $scope.articulationScoreList=[];

						$scope.currentPage = 0;
						$scope.pageSize = 10;

						// $scope.pageSize = $scope.pages[0];

						$scope.getData = function() {
							return $filter('filter')($scope.glossaryList);
						};

						$scope.numberOfPages = function() {
							return Math.ceil($scope.getData().length
									/ $scope.pageSize);
						}

						$scope.showFirstPage = function() {
							$scope.currentPage = 0;
							// return
							// Math.ceil($scope.getData().length/$scope.pageSize);
						}

						location.search.substr(1).split("&").forEach(
								function(item) {
									tmp = item.split("=");
									if (tmp[0] === "term") {
										searchTerm = decodeURI(tmp[1]);
									}
									if (tmp[0] === "showSearch") {
										showSearch = tmp[1];
									}
									if (tmp[0] === "user") {
										userName = tmp[1];
									}
									if (tmp[0] === "app") {
										app = tmp[1];
										$scope.app = app;
									}
								});
						console.log("userName:" + userName);

						if (showSearch == "true") {
							$scope.transparent = true;
						} else {
							$scope.transparent = false;
						}

						console.log("HIHIHHI");
						$http({
							method : 'GET',
							url : './appConfig.json'
						})
								.then(
										function successCallback(response) {
											$scope.config = response.data;
											// $scope.targetApp=$scope.config.targetApp;
											console.log("AppName "
													+ $scope.config.appName);
											// console.log("Target AppName
											// "+$scope.targetApp);

											angular
													.forEach(
															$scope.config.proxy,
															function(val, key) {
																console
																		.log("Proxy VALUES"
																				+ val.value
																				+ " NAME:"
																				+ key);
																if (key == "proxyUrl") {
																	$scope.proxyUrl = val.value;
																} else if (key == "proxyPort") {
																	$scope.proxyPort = val.value;
																}
															});

											console.log("Params311:"
													+ $scope.proxyUrl);
											console.log("Params312:"
													+ $scope.proxyPort);
											
											$scope.pages1 = [];

											angular.forEach($scope.config.pageSizes,
															function(val, key) {
																console.log("PAGE SIZES"
																				+ val.value
																				+ " NAME:"
																				+ key);
																$scope.pages1.push(val.value);
															});

											angular
													.forEach(
															$scope.config.environment,
															function(val, key) {
																console
																		.log("OUTER VALUES"
																				+ val.value
																				+ " NAME:"
																				+ key);
																if (key == "dgcRestUrl") {
																	$scope.dgcRestUrl = val.value;
																} else if (key == "dgcUrl") {
																	$scope.dgcUrl = val.value;
																	$scope.collibraUrl = $scope.dgcUrl;
																	GlossaryService.url = $scope.dgcUrl
																			+ "/asset/";
																} else if (key == "apiUser") {
																	$scope.apiUser = val.value;
																} else if (key == "apiUserPassword") {
																	$scope.apiUserPassword = val.value;
																}
															});
											console.log("Params1:"
													+ $scope.dgcRestUrl);
											console.log("Params2:"
													+ $scope.dgcUrl);
											console.log("Params3:"
													+ $scope.apiUser);
											console.log("Params4:"
													+ $scope.apiUserPassword);

											angular
													.forEach(
															$scope.config.apis,
															function(val, key) {
																console
																		.log("API OUTER VALUES"
																				+ val
																				+ " NAME:"
																				+ key);
																if (key == "searchApi") {
																	$scope.searchApi = val;
																} else if (key == "articulationCalculatorApi") {
																	$scope.articulationCalculatorApi = val;
																} else if (key == "commentsApi1") {
																	$scope.commentsApi1 = val;
																} else if (key == "commentsApi2") {
																	$scope.commentsApi2 = val;
																} else if (key == "roleApi") {
																	$scope.roleApi = val;
																} else if (key == "termApi") {
																	$scope.termApi = val;
																} else if (key == "attributesApi") {
																	$scope.attributesApi = val;
																} else if (key == "workflowApi1") {
																	$scope.workflowApi1 = val;
																} else if (key == "workflowApi2") {
																	$scope.workflowApi2 = val;
																} else if (key == "attributeTypeApi") {
																	$scope.attributeTypeApi = val;
																}
																
															});
											console.log("Params11:"
													+ $scope.searchApi);
											console
													.log("Params21:"
															+ $scope.articulationCalculatorApi);
											console.log("Params31:"
													+ $scope.commentsApi1);
											console.log("Params41:"
													+ $scope.commentsApi2);
											console.log("Params51:"
													+ $scope.roleApi);
											console.log("Params61:"
													+ $scope.termApi);
											console.log("Params71:"
													+ $scope.attributesApi);
											console.log("Params81:"
													+ $scope.workflowApi1);
											console.log("Params91:"
													+ $scope.workflowApi2);

											angular
													.forEach(
															$scope.config.application,
															function(value, key) {
																console
																		.log("application details value:"
																				+ value.value
																				+ " and Key :"
																				+ key
																				+ " and app is:"
																				+ app);
																if (key == app) {
																	angular
																			.forEach(
																					value,
																					function(
																							val,
																							key) {
																						console
																								.log("KEY:::"
																										+ key);
																						if (key == "searchCategory") {
																							$scope.searchCategory = val.value;
																						} else if (key == "domainId") {
																							$scope.domainId = val.value;
																						} else if (key == "termId") {
																							$scope.termId = val.value;
																						} else if (key == "lobAssetTypeId") {
																							$scope.lobAssetTypeId = val.value;
																						} else if (key == "businessSegmentAssetTypeId") {
																							$scope.businessSegmentAssetTypeId = val.value;
																						} else if (key == "businessDimentionsDomainId") {
																							$scope.businessDimentionsDomainId = val.value;																							
																						} else if (key == "simpleApprovalWorkflowId") {
																							$scope.simpleApprovalWorkflowId = val.value;
																						} else if (key == "logo") {
																							$scope.logo = val.value;
																						} else if (key == "favicon") {
																							$scope.favicon = val.value;
																						} else if (key == "filter1") {
																							$scope.filter1 = val.value;
																						} else if (key == "filter2") {
																							$scope.filter2 = val.value;
																						} else if (key == "filter3") {
																							$scope.filter3 = val.value;
																						} else if (key == "filter4") {
																							$scope.filter4 = val.value;
																						} else if (key == "PaginationHeader") {
																							$scope.PaginationHeader = val.value;
																						} else if (key == "title") {
																							$scope.title = val.value;
																						} else if (key == "attributes") {
																							count = 0;
																							$scope.attributes = [];
																							$scope.attributeFilters = [];
																							angular
																									.forEach(val,function(val,key) {
																												console.log("ATTRIBUTE NAME:::"
																																+ key
																																+ " AND ::"
																																+ count
																																+ " AND ::"
																																+ val.isFacet);
																												$scope.attributes.push(val);
																												if(val.isFacet == "true"){
																													console.log("11");
																													// $scope.attributeFilters.push(key+"-"+val.isFacet);
																													// Call
																													// REST
																													// CALL
																													// TO
																													// GET
																													// ATTRIBUTE
																													// VALUES
																													$http(
																															{
																																method : 'GET',
																																url : '/Glossary/getAttributeValues',
																																params : {
																																	dgcRestUrl : $scope.dgcRestUrl,
																																	attributeTypeApi : $scope.attributeTypeApi,
																																	attributeTypeId : val.id,
																																	proxyUrl : $scope.proxyUrl,
																																	proxyPort : $scope.proxyPort,
																																	apiUser : $scope.apiUser,
																																	apiUserPassword : $scope.apiUserPassword
																																},
																																headers : {
																																	'Content-Type' : 'application/json'
																																}
																															})
																															.then(
																																	function successCallback(
																																			response) {
																																		console.log("22");
																																		$scope.attributeValues = [];
																																		$scope.attributeTypeDetails = response.data;
																																		console.log("2232:"+$scope.attributeTypeDetails.kind);
																																		if($scope.attributeTypeDetails.kind == "BooleanAttribute"){
																																			$scope.attributeValues.push("true");
																																			$scope.attributeValues.push("false");
																																			$scope.attributeFilters.push({signifier : $scope.attributeTypeDetails.signifier, value:$scope.attributeValues});

																																		}else if($scope.attributeTypeDetails.kind == "SingleValueListAttribute" || $scope.attributeTypeDetails.kind == "MultiValueListAttribute"){
																																			console.log("EL:SE");
																																			
																																			angular.forEach($scope.attributeTypeDetails.allowedValues,function(val,key) {
																																				console.log("ALLOWED VALUES LOGIC:"+$scope.attributeTypeDetails.signifier+" AND "+val+" AND KEY:"+key);
																																				signifier1 = $scope.attributeTypeDetails.signifier;
																																				console.log("signifier"+signifier1);
																																				$scope.attributeValues.push(val);
																																			})
																																			$scope.attributeFilters.push({signifier : $scope.attributeTypeDetails.signifier, value: $scope.attributeValues});

																																		}
																																	},
																																	function errorCallback(
																																			response) {
																																		console.log("DOMAIN ERROR 1:"
																																						+ response);
																																		console.log(response.statusText);
																																	});
																													
																													
																													
																												}
																											});
																						}
																					});
																	console
																			.log("Params511:"
																					+ $scope.searchCategory);
																	console
																			.log("Params521:"
																					+ $scope.domainId);
																	console
																			.log("Params531:"
																					+ $scope.termId);
																	console
																			.log("Params541:"
																					+ $scope.simpleApprovalWorkflowId);
																	console
																			.log("Params551:"
																					+ $scope.logo);
																	console
																			.log("Params561:"
																					+ $scope.filter1);
																	console
																			.log("Params571:"
																					+ $scope.filter2);
																	console
																			.log("Params581:"
																					+ $scope.PaginationHeader);
																}
															});

											// get Domains
											$http(
													{
														method : 'GET',
														url : '/Glossary/getDomains',
														params : {
															dgcRestUrl : $scope.dgcRestUrl,
															searchApi : $scope.searchApi,
															domainId : $scope.domainId,
															proxyUrl : $scope.proxyUrl,
															proxyPort : $scope.proxyPort,
															apiUser : $scope.apiUser,
															apiUserPassword : $scope.apiUserPassword
														},
														headers : {
															'Content-Type' : 'application/json'
														}
													})
													.then(
															function successCallback(
																	response) {
																searchStatus = "true";
																console
																		.log("DOMAIN LENGTH 1:"
																				+ response.data.length);
																$scope.domainList = response.data;
																GlossaryService.glossaryList = $scope.domainList;
																console
																		.log("DOMAIN LENGTH 2:"
																				+ $scope.domainList.length);
																// $scope.loadingDomains
																// = false ;
															},
															function errorCallback(
																	response) {
																console
																		.log("DOMAIN ERROR 1:"
																				+ response);
																console
																		.log(response.statusText);
															});
											
											// get LOBS
											$http(
													{
														method : 'GET',
														url : '/Glossary/getLOBList',
														params : {
															dgcRestUrl : $scope.dgcRestUrl,
															searchApi : $scope.searchApi,
															lobAssetTypeId : $scope.lobAssetTypeId,
															businessDimentionsDomainId : $scope.businessDimentionsDomainId,
															proxyUrl : $scope.proxyUrl,
															proxyPort : $scope.proxyPort,
															apiUser : $scope.apiUser,
															apiUserPassword : $scope.apiUserPassword
														},
														headers : {
															'Content-Type' : 'application/json'
														}
													})
													.then(
															function successCallback(
																	response) {
																searchStatus = "true";
																console
																		.log("LOB LENGTH 1:"
																				+ response.data.length);
																$scope.lobList = response.data;
																GlossaryService.LOBList = $scope.lobList;
																console
																		.log("LOB LIST LENGTH 2:"
																				+ $scope.lobList.length);
																// $scope.loadingDomains
																// = false ;
															},
															function errorCallback(
																	response) {
																console
																		.log("LOB ERROR 1:"
																				+ response);
																console
																		.log(response.statusText);
															});
											
											// get Business Segments
											$http(
													{
														method : 'GET',
														url : '/Glossary/getBusinessSegments',
														params : {
															dgcRestUrl : $scope.dgcRestUrl,
															searchApi : $scope.searchApi,
															businessSegmentAssetTypeId : $scope.businessSegmentAssetTypeId,
															businessDimentionsDomainId : $scope.businessDimentionsDomainId,															proxyUrl : $scope.proxyUrl,
															proxyPort : $scope.proxyPort,
															apiUser : $scope.apiUser,
															apiUserPassword : $scope.apiUserPassword
														},
														headers : {
															'Content-Type' : 'application/json'
														}
													})
													.then(
															function successCallback(
																	response) {
																searchStatus = "true";
																console
																		.log("Business Segments LENGTH 1:"
																				+ response.data.length);
																$scope.businessSegmentList = response.data;
																GlossaryService.BSList = $scope.businessSegmentList;
																console
																		.log("Business Segments LENGTH 2:"
																				+ $scope.businessSegmentList.length);
																// $scope.loadingDomains
																// = false ;
															},
															function errorCallback(
																	response) {
																console
																		.log("Business Segments ERROR 1:"
																				+ response);
																console
																		.log(response.statusText);
															});
											

											$scope.showSearchFromUrl = showSearch;
											$scope.searchForm = {};
											$scope.searchForm.term = searchTerm;
											$scope.selected = [];
											$scope.selectedStatus = [];
											$scope.selectedDomainIds = [];
											$scope.selectedStatusIds = [];
											
											// For LOB
											$scope.selectedLOBs = [];
											$scope.selectedBusinessSegments = [];

											// Get Collibra DGC URL
											/*
											 * $http({ method : "GET", url :
											 * "/Glossary/getCollibraUrl",
											 * headers : { 'Content-Type' :
											 * 'application/text' }
											 * }).then(function
											 * successCallback(response) {
											 * $scope.collibraUrl =
											 * response.data;
											 * console.log("Collibra
											 * URL:"+$scope.collibraUrl);
											 * GlossaryService.url=
											 * $scope.collibraUrl+"asset/";
											 * console.log("Collibra URL from
											 * GlossaryService:"+GlossaryService.url); },
											 * function errorCallback(response) {
											 * console.log("Collibra URL:
											 * ELSE"+response);
											 * console.log(response.statusText);
											 * });
											 */

											// Request to Search results based
											// on input term
											$http(
													{
														method : 'GET',
														// url :
														// '/Glossary/getSearchResults',
														url : '/Glossary/getSearchResultsNew',
														params : {
															searchTerm : searchTerm
																	+ "*",
															pageSize : $scope.pageSize,
															currentPage : "0",
															domainFilter : "",
															statusFilter : "",
															userName : userName,
															dgcRestUrl : $scope.dgcRestUrl,
															dgcUrl : $scope.dgcUrl,
															searchApi : $scope.searchApi,
															domainId : $scope.domainId,
															termId : $scope.termId,
															searchCategory : $scope.searchCategory,
															proxyUrl : $scope.proxyUrl,
															proxyPort : $scope.proxyPort,
															apiUser : $scope.apiUser,
															apiUserPassword : $scope.apiUserPassword,
															searchType : 'D'
														},
														headers : {
															'Content-Type' : 'application/json'
														}
													})
													.then(
															function successCallback(
																	response) {
																console
																		.log("SEARCH LENGTH :"
																				+ response);
																console
																		.log("SEARCH LENGTH 1:"
																				+ response.data);
																$scope.glossaryList = response.data[1];
																$scope.glossaryListSize = response.data[0];
																console
																		.log("SEARCH  glossaryList:"
																				+ $scope.glossaryList);
																console
																		.log("SEARCH  glossaryListSize:"
																				+ $scope.glossaryListSize);
																// $scope.loading
																// = false;
																$scope.loadingApp = false;
															},
															function errorCallback(
																	response) {
																console
																		.log("SEARCH ERROR :"
																				+ response);
																console
																		.log(response.statusText);
															});

										}, function errorCallback(response) {
											console.log("Error:" + response);
										});

					}; /* End of init Function */

					function _error(response) {
						console.log(response.statusText);
					}

					$scope.includeDomain = function(domainName) {
						var i = $.inArray(domainName, $scope.glossaryList);
						if (i > -1) {
							$scope.glossaryList.splice(i, 1);
						} else {
							$scope.glossaryList.push(domainName);
						}
					}

					/*
					 * This function is invoked when user collapses in/out the
					 * search result panel
					 */
					$scope.loadGroup = function(termid, index) {
						$scope.loadingGroup = true;
						var method = "";
						var relationsUrl = "";
						var rolesUrl = "";
						var commentsUrl = "";

						if (termid != null) {
							// Id is absent in form data, it is create new
							// country operation
							method = "GET";
							relationsUrl = '/Glossary/relations';
							rolesUrl = '/Glossary/roles';
							commentsUrl = '/Glossary/commentList';
						} else {
							// Id is present in form data, it is edit country
							// operation
							method = "GET";
							relationsUrl = '/Glossary/relations';
							rolesUrl = '/Glossary/roles';
							commentsUrl = '/Glossary/commentList';
						}

						// Request to GET relations
						$http({
							method : method,
							url : relationsUrl,
							data : angular.toJson($scope.searchForm),
							params : {
								term : termid,
								index : index,
								dgcRestUrl : $scope.dgcRestUrl,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(function successCallback(response) {
							$scope.relationList = response.data;
							$scope.divlocation = index;
						}, function errorCallback(response) {
							console.log(response.statusText);
						});

						// Request to GET roles
						$http({
							method : method,
							url : rolesUrl,
							data : angular.toJson($scope.searchForm),
							params : {
								term : termid,
								dgcRestUrl : $scope.dgcRestUrl,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(function successCallback(response) {
							$scope.memberList = response.data;
							$scope.divlocation = index;
							$scope.loadingGroup = false;
						}, function errorCallback(response) {
							console.log(response.statusText);
						});

						// Request to GET comments
						$http({
							method : method,
							url : commentsUrl,
							data : angular.toJson($scope.searchForm),
							params : {
								term : termid,
								dgcRestUrl : $scope.dgcRestUrl,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword,
								commentsApi1 : $scope.commentsApi1,
								commentsApi2 : $scope.commentsApi2
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(function successCallback(response) {
							$scope.commentsList = response.data;
							$scope.divlocation = index;

						}, function errorCallback(response) {
							console.log(response.statusText);
						});
					}

					$scope.toggle = function(item, selectedDomainList,
							selectedDomainIdList, selectedStatusList,
							selectedStatusIdList) {

						var idx = selectedDomainList.indexOf(item.name.val);
						if (idx > -1) {
							selectedDomainList.splice(idx, 1);
							selectedDomainIdList.splice(idx, 1);
						} else {
							selectedDomainList.push(item.name.val);
							selectedDomainIdList.push("\"" + item.name.id
									+ "\"");
						}

						var itemIDs = item.name.id;

						$scope.loading = true;
						var tmp = "";
						var searchTerm1 = window.location.search.substr(1);
						var params = window.location.search.substr(1)
								.split("&");
						var searchTerm = "";
						var showSearch = "";
						var userName = "";

						var articulationScoreListArray = [];

						$scope.currentPage = 0;

						$scope.getData = function() {
							return $filter('filter')($scope.glossaryList);
						};

						$scope.numberOfPages = function() {
							return Math.ceil($scope.getData().length
									/ $scope.pageSize);
						}

						$scope.showFirstPage = function() {
							$scope.currentPage = 0;
							// return
							// Math.ceil($scope.getData().length/$scope.pageSize);
						}

						location.search.substr(1).split("&").forEach(
								function(item) {

									tmp = item.split("=");
									if (tmp[0] === "term") {
										searchTerm = decodeURI(tmp[1]);
									}
									if (tmp[0] === "showSearch") {
										showSearch = tmp[1];
									}
									if (tmp[0] === "user") {
										userName = tmp[1];
									}
									if (tmp[0] === "app") {
										app = tmp[1];
										$scope.app = app;
									}
								});

						$scope.showSearchFromUrl = showSearch;
						$scope.searchForm = {};
						$scope.searchForm.term = searchTerm;

						// $scope.selected = [];
						// $scope.selectedStatus = [];

						if (selectedStatusIdList == "") {
							selectedStatusIdList = "NOSTATUSES";
						}

						if (selectedDomainIdList == "") {
							selectedDomainIdList = "NODOMAINS";
						}

						// Request to Search results based on input term
						$http({
							method : 'GET',
							// url : '/Glossary/getSearchResultsByFilter',
							url : '/Glossary/getSearchResultsNew',
							params : {
								searchTerm : searchTerm,
								pageSize : $scope.pageSize,
								currentPage : "0",
								domainFilter : selectedDomainIdList,
								statusFilter : selectedStatusIdList,
								userName : userName,
								dgcRestUrl : $scope.dgcRestUrl,
								dgcUrl : $scope.dgcUrl,
								searchApi : $scope.searchApi,
								domainId : $scope.domainId,
								termId : $scope.termId,
								searchCategory : $scope.searchCategory,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword,
								searchType : 'F'
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(
								function successCallback(response) {
									console.log("SEARCH LENGTH :" + response);
									console.log("SEARCH LENGTH 1:"
											+ response.data);
									$scope.glossaryList = response.data[1];
									$scope.glossaryListSize = response.data[0];
									console.log("SEARCH  glossaryList:"
											+ $scope.glossaryList);
									console.log("SEARCH  glossaryListSize:"
											+ $scope.glossaryListSize);
									$scope.loading = false;
								}, function errorCallback(response) {
									console.log(response.statusText);
								});
					};

					$scope.exists = function(item, list) {
						return list.indexOf(item.name.val) > -1;
					};

					$scope.statusToggle = function(item, selectedDomainList,
							selectedDomainIdList, selectedStatusList,
							selectedStatusIdList) {

						var idx = selectedStatusList.indexOf(item.name);
						if (idx > -1) {
							selectedStatusList.splice(idx, 1);
							selectedStatusIdList.splice(idx, 1);
						} else {
							selectedStatusList.push(item.name);
							selectedStatusIdList.push("\"" + item.id + "\"");
						}

						if (selectedDomainIdList == "") {
							selectedDomainIdList = "NODOMAINS";
						}

						if (selectedStatusIdList == "") {
							selectedStatusIdList = "NOSTATUSES";
						}
						$scope.loading = true;
						var tmp = "";
						var searchTerm1 = window.location.search.substr(1);
						var params = window.location.search.substr(1)
								.split("&");
						var searchTerm = "";
						var showSearch = "";
						var userName = "";

						var articulationScoreListArray = [];
						$scope.currentPage = 0;

						$scope.getData = function() {
							return $filter('filter')($scope.glossaryList);
						};

						$scope.numberOfPages = function() {
							return Math.ceil($scope.getData().length
									/ $scope.pageSize);
						}

						$scope.showFirstPage = function() {
							$scope.currentPage = 0;
							// return
							// Math.ceil($scope.getData().length/$scope.pageSize);
						}

						location.search.substr(1).split("&").forEach(
								function(item) {

									tmp = item.split("=");
									if (tmp[0] === "term") {
										searchTerm = decodeURI(tmp[1]);
									}
									if (tmp[0] === "showSearch") {
										showSearch = tmp[1];
									}
									if (tmp[0] === "user") {
										userName = tmp[1];
									}
									if (tmp[0] === "app") {
										app = tmp[1];
										$scope.app = app;
									}
								});

						$scope.showSearchFromUrl = showSearch;
						$scope.searchForm = {};
						$scope.searchForm.term = searchTerm;

						// Request to Search results based on input term
						$http({
							method : 'GET',
							// url : '/Glossary/getSearchResultsByFilter',
							url : '/Glossary/getSearchResultsNew',
							params : {
								searchTerm : searchTerm,
								pageSize : $scope.pageSize,
								currentPage : "0",
								domainFilter : selectedDomainIdList,
								statusFilter : selectedStatusIdList,
								userName : userName,
								dgcRestUrl : $scope.dgcRestUrl,
								dgcUrl : $scope.dgcUrl,
								searchApi : $scope.searchApi,
								domainId : $scope.domainId,
								termId : $scope.termId,
								searchCategory : $scope.searchCategory,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword,
								searchType : 'F'
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(
								function successCallback(response) {
									console.log("SEARCH LENGTH :" + response);
									console.log("SEARCH LENGTH 1:"
											+ response.data);
									$scope.glossaryList = response.data[1];
									$scope.glossaryListSize = response.data[0];
									console.log("SEARCH  glossaryList:"
											+ $scope.glossaryList);
									console.log("SEARCH  glossaryListSize:"
											+ $scope.glossaryListSize);
									$scope.loading = false;
								}, function errorCallback(response) {
									console.log(response.statusText);
								});
					};

					
					$scope.lobToggle = function(item, selectedLOBs) {
						alert("Inside logToggle");

						var idx = selectedLOBs.indexOf(item.name);
						if (idx > -1) {
							selectedLOBs.splice(idx, 1);
						} else {
							selectedLOBs.push(item.name);
						}
						
						console.log("selectedLOBs :"+selectedLOBs[0]);

						// Request to Search Business Segments based on selected
						// LOB
						$http({
							method : 'GET',
							// url : '/Glossary/getSearchResultsByFilter',
							url : '/Glossary/getSearchResultsNew',
							params : {
								searchTerm : searchTerm,
								pageSize : $scope.pageSize,
								currentPage : "0",
								domainFilter : selectedDomainIdList,
								statusFilter : selectedStatusIdList,
								userName : userName,
								dgcRestUrl : $scope.dgcRestUrl,
								dgcUrl : $scope.dgcUrl,
								searchApi : $scope.searchApi,
								domainId : $scope.domainId,
								termId : $scope.termId,
								searchCategory : $scope.searchCategory,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword,
								searchType : 'F'
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(
								function successCallback(response) {
									console.log("SEARCH LENGTH :" + response);
									console.log("SEARCH LENGTH 1:"
											+ response.data);
									$scope.glossaryList = response.data[1];
									$scope.glossaryListSize = response.data[0];
									console.log("SEARCH  glossaryList:"
											+ $scope.glossaryList);
									console.log("SEARCH  glossaryListSize:"
											+ $scope.glossaryListSize);
									$scope.loading = false;
								}, function errorCallback(response) {
									console.log(response.statusText);
								});
					};
					
					$scope.statusExists = function (status, list) { return
					list.indexOf(status.name) > -1; };
					
					// For LOB
					$scope.lobExists = function (lob, list) { return
						list.indexOf(status.name) > -1; };
						
					$scope.businessSegmentExists = function (businessSegment, list) { return
							list.indexOf(status.name) > -1; };
					

					$scope.isIndeterminate = function() {
						return ($scope.selected.length !== 0 && $scope.selected.length !== $scope.items.length);
					};

					$scope.isChecked = function() {
						return $scope.selected.length === $scope.items.length;
					};

					$scope.toggleAll = function() {
						if ($scope.selected.length === $scope.items.length) {
							$scope.selected = [];
						} else if ($scope.selected.length === 0
								|| $scope.selected.length > 0) {
							$scope.selected = $scope.items.slice(0);
						}
					};

					/*
					 * Code for Side NAV TOggle
					 */

					$scope.toggleLeft = buildToggler('left');
					$scope.toggleExpandButtonLabel = "Expand";
					var sideNav = angular.element($element[0]
							.querySelector('#leftSideNav'));

					$scope.toggleExpand = function() {
						if ($scope.toggleExpandButtonLabel == "Expand") {
							sideNav.css("width", "500px")
						} else {
							sideNav.css("width", "20px")
						}
						$scope.toggleExpandButtonLabel = ($scope.toggleExpandButtonLabel == "Expand") ? "Collapse"
								: "Expand";
					}

					$scope.close = function() {
						$mdSidenav('left').close();
						$scope.toggleExpandButtonLabel = "Expand";
						sideNav.css("width", "320px")
					};

					function buildToggler(navID) {
						return function() {
							$mdSidenav(navID).toggle().then(function() {
								$log.debug("toggle " + navID + " is done");
							});
						}
					}

					// End

					$scope.myClass = "md-sidenav-left md-whiteframe-z2";
					$scope.option1 = "md-sidenav-opened md-whiteframe-z2";

					$scope.toggleFlag = true;

					$scope.edit = true;
					$scope.hoverEdit = false;
					$scope.size = "5";

					$scope.toggleClass = function() {
						if ($scope.myClass == "md-sidenav-left md-whiteframe-z2") {
							$scope.myClass = "md-sidenav-opened md-whiteframe-z2";
							$scope.toggleFlag = false;
							$scope.size = "25";
						} else {
							$scope.myClass = "md-sidenav-left md-whiteframe-z2";
							$scope.toggleFlag = true;
							$scope.size = "5";

						}
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

					$scope.open = function() {
						$mdDialog.show({
							clickOutsideToClose : true,
							templateUrl : 'ProposeBusinessTermTemplate.html',
							controller : 'ProposeBusinessTermCtrl'
						});

					};

					$scope.openEdit = function(businessTerm, isUpdate,
							businessAssetType) {
						$mdDialog.show({
							clickOutsideToClose : true,
							templateUrl : 'UpdateBusinessTermTemplate.html',
							controller : 'UpdateBusinessTermCtrl',
							locals : {
								businessTerm : businessTerm,
								isUpdate : isUpdate,
								businessAssetType : businessAssetType
							}
						});
					};

					$scope.getNext = function(currentPage, pageSize,
							searchTerm, selectedDomainIdList,
							selectedStatusIdList) {

						console.log("ON PAGINATION:::;" + $scope.dgcRestUrl);

						var currentPage = currentPage;
						$scope.loading = true;
						var tmp = "";
						var searchTerm1 = window.location.search.substr(1);
						var params = window.location.search.substr(1)
								.split("&");
						var searchTerm = "";
						var showSearch = "";
						var userName = "";

						var articulationScoreListArray = [];
						// $scope.articulationScoreList=[];
						location.search.substr(1).split("&").forEach(
								function(item) {

									tmp = item.split("=");
									if (tmp[0] === "term") {
										searchTerm = decodeURI(tmp[1]);
									}
									if (tmp[0] === "showSearch") {
										showSearch = tmp[1];
									}
									if (tmp[0] === "user") {
										userName = tmp[1];
									}
									if (tmp[0] === "app") {
										app = tmp[1];
										$scope.app = app;
									}
								});

						$scope.showSearchFromUrl = showSearch;
						$scope.searchForm = {};
						$scope.searchForm.term = searchTerm;

						if (selectedDomainIdList == "") {
							selectedDomainIdList = "NODOMAINS";
						}

						if (selectedStatusIdList == "") {
							selectedStatusIdList = "NOSTATUSES";
						}

						// Request to Search results based on input term
						$http({
							method : 'GET',
							// url : '/Glossary/getSearchResultsByPagination',
							url : '/Glossary/getSearchResultsNew',
							params : {
								searchTerm : searchTerm,
								pageSize : pageSize,
								currentPage : currentPage,
								domainFilter : selectedDomainIdList,
								statusFilter : selectedStatusIdList,
								userName : userName,
								dgcRestUrl : $scope.dgcRestUrl,
								dgcUrl : $scope.dgcUrl,
								searchApi : $scope.searchApi,
								domainId : $scope.domainId,
								termId : $scope.termId,
								searchCategory : $scope.searchCategory,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword,
								searchType : 'P'
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(
								function successCallback(response) {
									console.log("SEARCH LENGTH :" + response);
									console.log("SEARCH LENGTH 1:"
											+ response.data);
									$scope.glossaryList = response.data[1];
									$scope.glossaryListSize = response.data[0];
									console.log("SEARCH  glossaryList:"
											+ $scope.glossaryList);
									console.log("SEARCH  glossaryListSize:"
											+ $scope.glossaryListSize);
									$scope.loading = false;
								}, function errorCallback(response) {
									console.log(response.statusText);
								});
					};
				});

app
		.controller(
				'ProposeBusinessTermCtrl',
				function($q, $scope, $filter, $http, $location, $mdSidenav,
						$timeout, $log, $element, $mdSelect, $mdDialog,
						GlossaryService) {
					console.log('glossaryList in Propose from Service:',
							GlossaryService.glossaryList);
					$scope.domainListNew = GlossaryService.glossaryList;
					console.log('domainListNew in Propose from Service:',
							$scope.domainListNew);
					console.log('businessTermTypes in Propose from Service:',
							GlossaryService.businessTermTypes);
					$scope.businessTermTypes = GlossaryService.businessTermTypes;

					$scope.proposeTerm = function() {
						var attribute = {};
						var attributes = {};
						$scope.proposeStatus = false;
						$scope.attributeUpdateStatus = false;
						$scope.initiateSimpleApprovalFlow = true;

						if ($scope.term.name == null) {
							// alert("Please enter a name for the Business
							// term");
							return false;
						}

						/* Call to create a Business Term */
						$http({
							method : 'GET',
							url : '/Glossary/proposeTerm',
							params : {
								conceptType : $scope.businessAssetType,
								vocubulary : $scope.domainName,
								signifier : $scope.term.name
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						})
								.then(
										function successCallback(response) {
											$scope.createdTermId = response.data.resourceId;
											console
													.log("Successfully Created Business Term with ID:"
															+ $scope.createdTermId);
											$scope.proposeStatus = true;

											$scope.attributeList = [];

											attribute.id = "00000000-0000-0000-0000-000000000202";
											attribute.value = $scope.term.definition;
											attributes[0] = attribute;
											console.log("Data >>>><<<< ::"
													+ attributes[0].id
													+ " and ::"
													+ attributes[0].value);
											$scope.attributeList
													.push(attributes);

											attribute.id = "00000000-0000-0000-0000-000000003115";
											attribute.value = $scope.term.description;
											attributes[1] = attribute;
											console.log("Data >>>><<<< ::"
													+ attributes[1].id
													+ " and ::"
													+ attributes[1].value);
											$scope.attributeList
													.push(attributes);

											attribute.id = "00000000-0000-0000-0000-000000003116";
											attribute.value = $scope.term.note;
											attributes[2] = attribute;
											console.log("Data >>>><<<<+++++ ::"
													+ attributes[2].id
													+ " and ::"
													+ attributes[2].value);
											$scope.attributeList
													.push(attributes);
											$scope.finalattributeList = {
												'attr1' : {
													'id' : '00000000-0000-0000-0000-000000000202',
													'value' : $scope.term.definition
												},
												'attr2' : {
													'id' : '00000000-0000-0000-0000-000000003115',
													'value' : $scope.term.description
												},
												'attr3' : {
													'id' : '00000000-0000-0000-0000-000000003116',
													'value' : $scope.term.note
												}
											};
											var promises = [];

											angular
													.forEach(
															$scope.finalattributeList,
															function(value, key) {
																// create a $q
																// deferred
																// promise
																var deferred = $q
																		.defer();
																console
																		.log("Atttribute ID:"
																				+ value.id
																				+ " and ATTRIBUTE VAL:"
																				+ value.value);
																$http(
																		{
																			method : 'GET',
																			url : '/Glossary/updateAttribute',
																			params : {
																				termId : $scope.createdTermId,
																				attributeId : value.id,
																				attributeVal : value.value
																			},
																			headers : {
																				'Content-Type' : 'application/json'
																			}
																		})
																		.then(
																				function successCallback(
																						response) {
																					console
																							.log("Successfully updated Business Term attribute");
																					$scope.attributeUpdateStatus = true;
																					deferred
																							.resolve(response);

																				},
																				function errorCallback(
																						response) {
																					alert("Error while proposing the Business asset :"
																							+ response);
																					deffered
																							.reject();
																				});
																promises
																		.push(deferred.promise);
															});

											console
													.log("outside all condition");
											$q
													.all(promises)
													.then(
															function(data) {
																console
																		.log("Inside all condition");
																if ($scope.proposeStatus) {
																	if ($scope.attributeUpdateStatus) {
																		console
																				.log("Successfully created the business asset and updated its attributes");
																		// Initiate
																		// Workflow
																		// here
																		$http(
																				{
																					method : 'GET',
																					url : '/Glossary/initiateWorkFlow',
																					params : {
																						items : $scope.createdTermId
																					},
																					headers : {
																						'Content-Type' : 'application/json'
																					}
																				})
																				.then(
																						function successCallback(
																								response) {
																							console
																									.log("Successfully initiated the Simple approval workflow");
																							$scope.initiateSimpleApprovalFlow = true;
																							$mdDialog
																									.show({
																										clickOutsideToClose : true,
																										templateUrl : 'MessageTemplate.html',
																										controller : 'messageCtrl',
																										locals : {
																											message : "Simple Approval Workflow Started",
																											termUrl : GlossaryService.url
																													+ $scope.createdTermId,
																											termName : $scope.term.name,
																											status : "propose"
																										}
																									});
																						},
																						function errorCallback(
																								response) {
																							$mdDialog
																									.show({
																										clickOutsideToClose : true,
																										templateUrl : 'MessageTemplate.html',
																										controller : 'messageCtrl',
																										locals : {
																											message : "Successfully created business asset but failed to initiate Simple approval workflow",
																											termUrl : GlossaryService.url
																													+ $scope.createdTermId,
																											termName : $scope.term.name,
																											status : "propose"
																										}
																									});
																						});
																	} else {
																		console
																				.log("Successfully created business asset but failed to update its attributes");
																		$mdDialog
																				.show({
																					clickOutsideToClose : true,
																					templateUrl : 'MessageTemplate.html',
																					controller : 'messageCtrl',
																					locals : {
																						message : "Successfully created business asset but failed to update its attributes",
																						termUrl : GlossaryService.url
																								+ $scope.createdTermId,
																						termName : $scope.term.name,
																						status : "propose"
																					}
																				});
																	}
																} else {
																	$mdDialog
																			.show({
																				clickOutsideToClose : true,
																				templateUrl : 'MessageTemplate.html',
																				controller : 'messageCtrl',
																				locals : {
																					message : "Error while proposing the Business asset. Please try again",
																					termUrl : "",
																					termName : "",
																					status : "propose"
																				}
																			});
																}
															});

										},
										function errorCallback(response) {
											// alert("Error while proposing the
											// Business term:"+response);
											$mdDialog
													.hide("DONE33", "finished");
										});

					};

					$scope.close = function() {
						$mdDialog.hide(alert, "finished");
						alert = undefined;
					};
				});

app.controller('messageCtrl', function($scope, $filter, $http, $location,
		$mdSidenav, $timeout, $log, $element, $mdSelect, $mdDialog,
		GlossaryService, message, termUrl, termName, status) {
	$scope.message = message;
	$scope.termUrl = termUrl;
	$scope.termName = termName;
	$scope.status = status;

	$scope.closeMessage = function() {
		$mdDialog.hide("DONE33", "finished");
	}

	$scope.close = function() {
		$mdDialog.hide(alert, "finished");
		alert = undefined;
	};
});

app
		.controller(
				'UpdateBusinessTermCtrl',
				function($q, $scope, $filter, $http, $location, $mdSidenav,
						$timeout, $log, $element, $mdSelect, $mdDialog,
						GlossaryService, businessTerm, isUpdate) {
					console.log('glossaryList in UPDATE from Service:',
							GlossaryService.glossaryList);
					$scope.domainListNew = GlossaryService.glossaryList;
					console.log('domainListNew in UPDATE from Service:',
							$scope.domainListNew);

					console.log('businessTermTypes in UPDATE from Service:',
							GlossaryService.businessTermTypes);
					$scope.businessTermTypes = GlossaryService.businessTermTypes;

					$scope.businessTerm = businessTerm;
					$scope.isUpdate = isUpdate;

					/*
					 * angular.forEach(businessTerm.attributes,
					 * function(attribute, key) { console.log("attribute
					 * VALUE:"+attribute.val+" and TYPEID:"+attribute.typeId);
					 * if(attribute.typeId ==
					 * "00000000-0000-0000-0000-000000000202"){
					 * $scope.term.definition = attribute.val;
					 * console.log("Defintion VALUE:"+$scope.term.definition); }
					 * if(attribute.typeId ==
					 * "00000000-0000-0000-0000-000000003115"){
					 * $scope.term.description = attribute.val;
					 * console.log("Description
					 * VALUE:"+$scope.term.description); } if(attribute.typeId ==
					 * "00000000-0000-0000-0000-000000003116"){ $scope.term.note =
					 * attribute.val; console.log("Note
					 * VALUE:"+$scope.term.note); } });
					 */

					app
							.filter(
									"filterAttributesItems",
									function() {
										return function(input, attributeName) {
											var inputArray = [];
											var attributes = [ 'Definition',
													'Descriptive Example',
													'Note' ];
											console
													.log("input:"
															+ input.length);
											console.log("attributeName :"
													+ attributeName);
											console.log(attributes.length)

											for ( var attribute in attributes) {
												console
														.log("1 ::"
																+ attributes[attribute]);
												var count = 0;
												for ( var item in input) {
													console.log("2 ::"
															+ input[item].type);
													if (attributes[attribute] == input[item].type) {
														count++;
														console
																.log("Vals :"
																		+ input[item].type);
														inputArray
																.push(input[item].type
																		+ ":"
																		+ input[item].val);
													} else {
														console
																.log("Vals Else :"
																		+ input[item].type);
														// inputArray.push(input[item].type+":"+input[item].val);
													}
												}
												if (count == 0) {
													console
															.log("Attribute does not exist :"
																	+ attributes[attribute]);
													inputArray
															.push(attributes[attribute]
																	+ ":");
												} else {
													console
															.log("Attribute exists :"
																	+ attributes[attribute]);
												}
											}

											console.log("inputArray LENGTH :"
													+ inputArray.length);
											for ( var att in inputArray) {
												console.log("inputArray Val"
														+ inputArray[att]);

											}

											return inputArray;
										};
									});

					// For Updating Business Term
					$scope.updateTerm = function() {
						// alert("Inside updateTerm");
						var termId = $scope.businessTerm.name.id;
						// alert("termId:"+termId);

						var termName = $scope.businessTerm.name.val;
						var DefId = angular.element(
								document.getElementById('definitionId')).val();
						var DescExId = angular.element(
								document.getElementById('descriptiveExId'))
								.val();
						var NoteId = angular.element(
								document.getElementById('noteId')).val();
						var definition = angular
								.element(
										document
												.getElementById('BusinessTermDefinition'))
								.val();
						var descriptiveEx = angular
								.element(
										document
												.getElementById('BusinessTermDescriptiveExample'))
								.val();
						var note = angular.element(
								document.getElementById('BusinessTermNote'))
								.val();

						// alert("termName 111:"+termName);
						// alert("Definition ID:"+DefId);
						// alert("Desc ID:"+DescExId);
						// alert("Note ID:"+NoteId);
						// alert("Definition:"+definition);
						// alert("description:"+descriptiveEx);
						// alert("Note:"+note);

						// END
						var attribute = {};
						var attributes = {};

						$scope.updateStatus = false;
						$scope.attributeUpdationStatus = true;
						$scope.attributeAdditionStatus = true;
						$scope.initiateSimpleApprovalFlow1 = true;

						var attributeForAddition = {};
						var attributesForAddition = {};
						/* Call to update the Business Term */
						$scope.attributeList = [];
						$scope.attributeListForAddition = [];

						if (DefId != null) {
							// alert("Def Not null");
							attribute.id = DefId;
							attribute.value = definition;
							attributes[0] = attribute;
							console.log("Data >>>><<<< ::" + attributes[0].id
									+ " and ::" + attributes[0].value);
							$scope.attributeList.push({
								id : attributes[0].id,
								value : attributes[0].value
							});
							// $scope.attributeList.push(attributes[0]);
						} else {
							// alert("Def null");
							attributeForAddition.id = "00000000-0000-0000-0000-000000000202";
							attributeForAddition.value = definition;
							attributesForAddition[0] = attributeForAddition;
							console.log("Data for Addition >>>><<<< ::"
									+ attributesForAddition[0].id + " and ::"
									+ attributesForAddition[0].value);
							$scope.attributeListForAddition.push({
								id : attributesForAddition[0].id,
								value : attributesForAddition[0].value
							});
							// $scope.attributeListForAddition.push(attributesForAddition[0]);
						}

						if (DescExId != null) {
							// alert("DescEx NOT null");
							attribute.id = DescExId;
							attribute.value = descriptiveEx;
							attributes[1] = attribute;
							console.log("Data >>>><<<< ::" + attributes[1].id
									+ " and ::" + attributes[1].value);
							$scope.attributeList.push({
								id : attributes[1].id,
								value : attributes[1].value
							});
							// $scope.attributeList.push(attributes[1]);
						} else {
							// alert("DescEx NULL");
							attributeForAddition.id = "00000000-0000-0000-0000-000000003115";
							attributeForAddition.value = descriptiveEx;
							attributesForAddition[1] = attributeForAddition;
							console.log("Data  for Addition>>>><<<< ::"
									+ attributesForAddition[1].id + " and ::"
									+ attributesForAddition[1].value);
							$scope.attributeListForAddition.push({
								id : attributesForAddition[1].id,
								value : attributesForAddition[1].value
							});
							// $scope.attributeListForAddition.push(attributesForAddition[1]);
						}

						if (NoteId != null) {
							// alert("Note NOT null");
							attribute.id = NoteId;
							attribute.value = note;
							attributes[2] = attribute;
							console.log("Data >>>><<<< ::" + attributes[2].id
									+ " and ::" + attributes[2].value);
							$scope.attributeList.push({
								id : attributes[2].id,
								value : attributes[2].value
							});
							// $scope.attributeList.push(attributes[2]);
						} else {
							// alert("Note null");
							attributeForAddition.id = "00000000-0000-0000-0000-000000003116";
							attributeForAddition.value = note;
							attributesForAddition[2] = attributeForAddition;
							console.log("Data  for Addition >>>><<<< ::"
									+ attributesForAddition[2].id + " and ::"
									+ attributesForAddition[2].value);
							$scope.attributeListForAddition.push({
								id : attributesForAddition[2].id,
								value : attributesForAddition[2].value
							});
							// $scope.attributeListForAddition.push(attributesForAddition[2]);
						}

						var myJsonString1 = JSON
								.stringify($scope.attributeList);
						var myJsonString2 = JSON
								.stringify($scope.attributeListForAddition);

						console.log("***myJsonString1 :" + myJsonString1);
						console.log("***myJsonString2 :" + myJsonString2);

						var myJsonString11 = JSON.stringify(attributes);
						var myJsonString12 = JSON
								.stringify(attributesForAddition);

						console.log("***myJsonString11 :" + myJsonString11);
						console.log("***myJsonString12 :" + myJsonString12);

						// Addition Logic

						var promisesForAddition = [];
						angular
								.forEach(
										$scope.attributeListForAddition,
										function(value, key) {
											var deferred = $q.defer();
											console
													.log("ADDITION ::::Atttribute ID:"
															+ value.id
															+ " and ATTRIBUTE VAL:"
															+ value.value);
											$http(
													{
														method : 'GET',
														url : '/Glossary/updateAttribute',
														params : {
															termId : termId,
															attributeId : value.id,
															attributeVal : value.value
														},
														headers : {
															'Content-Type' : 'application/json'
														}
													})
													.then(
															function successCallback(
																	response) {
																console
																		.log("Successfully added Business Term attribute");
																$scope.attributeAdditionStatus = true;
																deferred
																		.resolve(response);

															},
															function errorCallback(
																	response) {
																// alert("Error
																// while
																// updating the
																// Business term
																// during
																// addition of
																// attributes
																// :"+response);
																$scope.attributeAdditionStatus = false;
																deffered
																		.reject();
															});
											promisesForAddition
													.push(deferred.promise);
										});

						$q
								.all()
								.then(
										function(data) {
											console
													.log("ATTRIBUTE ADDITION STATUS LATEST:"
															+ $scope.attributeAdditionStatus);
										});

						// Updation Logic

						var promisesForUpdation = [];
						angular
								.forEach(
										$scope.attributeList,
										function(value, key) {
											var deferred = $q.defer();
											console.log("UPDATE Atttribute ID:"
													+ value.id
													+ " and ATTRIBUTE VAL:"
													+ value.value);
											$http(
													{
														method : 'POST',
														url : '/Glossary/updateAttributes',
														params : {
															termId : termId,
															attributeId : value.id,
															attributeVal : value.value
														},
														headers : {
															'Content-Type' : 'application/json'
														}
													})
													.then(
															function successCallback(
																	response) {
																console
																		.log("Successfully updated Business Term attribute");
																$scope.attributeUpdationStatus = true;
																deferred
																		.resolve(response);
																// $mdDialog.hide(
																// "DONE",
																// "finished" );
															},
															function errorCallback(
																	response) {
																console
																		.log("Error while updating the Business term during updation of attributes:"
																				+ response);
																$scope.attributeUpdationStatus = false;
																deffered
																		.reject();
															});
											promisesForUpdation
													.push(deferred.promise);
										});

						$q
								.all()
								.then(
										function(data) {
											console
													.log("ATTRIBUTE UPDATION STATUS LATEST:"
															+ $scope.attributeUpdationStatus);
										});

						if ($scope.attributeListForAddition.length != 0
								&& $scope.attributeList.length != 0) {
							console.log("BOTH CASES");
						}

						if ($scope.attributeUpdationStatus
								&& $scope.attributeAdditionStatus) {
							console.log("BOTH TRUE");
							$http({
								method : 'GET',
								url : '/Glossary/initiateWorkFlow',
								params : {
									items : $scope.businessTerm.name.id
								},
								headers : {
									'Content-Type' : 'application/json'
								}
							})
									.then(
											function successCallback(response) {
												console
														.log("Successfully updated Business Term and initiated the Simple approval workflow");
												$mdDialog
														.show({
															clickOutsideToClose : true,
															templateUrl : 'MessageTemplate.html',
															controller : 'messageCtrl',
															locals : {
																message : "Simple Approval Workflow Started",
																termUrl : GlossaryService.url
																		+ $scope.businessTerm.name.id,
																termName : termName,
																status : "update"
															}
														});
												// alert("Successfully udpated
												// Business Term and initiated
												// the Simple approval
												// workflow");
												// $mdDialog.hide( "DONE",
												// "finished" );
											},
											function errorCallback(response) {
												// alert("Error while initiating
												// Simple Approval
												// Workflow:"+response);
												$mdDialog.hide("DONE33",
														"finished");
											});
						}
					};

					$scope.close = function() {
						$mdDialog.hide(alert, "finished");
						alert = undefined;
					};
				})

app
		.directive(
				'ddTextCollapse',
				[
						'$compile',
						function($compile) {

							return {
								restrict : 'A',
								scope : true,
								link : function(scope, element, attrs) {

									/* start collapsed */
									scope.collapsed = false;

									/*
									 * create the function to toggle the
									 * collapse
									 */
									scope.toggle = function() {
										scope.collapsed = !scope.collapsed;
									};

									/* wait for changes on the text */
									attrs
											.$observe(
													'ddTextCollapseText',
													function(text) {

														/*
														 * get the length from
														 * the attributes
														 */
														var maxLength = scope
																.$eval(attrs.ddTextCollapseMaxLength);

														if (text.length > maxLength) {
															/*
															 * split the text in
															 * two parts, the
															 * first always
															 * showing
															 */
															var firstPart = String(
																	text)
																	.substring(
																			0,
																			maxLength);
															var secondPart = String(
																	text)
																	.substring(
																			maxLength,
																			text.length);

															/*
															 * create some new
															 * html elements to
															 * hold the separate
															 * info
															 */
															var firstSpan = $compile(
																	'<span>'
																			+ firstPart
																			+ '</span>')
																	(scope);
															var secondSpan = $compile(
																	'<span ng-if="collapsed">'
																			+ secondPart
																			+ '</span>')
																	(scope);
															var moreIndicatorSpan = $compile(
																	'<span class="collapse-text-toggle" ng-if="!collapsed">...</span>')
																	(scope);
															var lineBreak = $compile(
																	'<br ng-if="collapsed">')
																	(scope);
															var toggleButton = $compile(
																	'<span class="collapse-text-toggle toggle-link-yellow" ng-click="toggle()">{{collapsed ? "Show less" : "Show more"}}</span>')
																	(scope);

															/*
															 * remove the
															 * current contents
															 * of the element
															 * and add the new
															 * ones we created
															 */
															element.empty();
															element
																	.append(firstSpan);
															element
																	.append(secondSpan);
															element
																	.append(moreIndicatorSpan);
															element
																	.append(lineBreak);
															element
																	.append(toggleButton);
														} else {
															element.empty();
															element
																	.append(text);
														}
													});
								}
							};

						} ]);

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

app.filter("filterAttributesItems", function() {
	return function(input, attributeName) {
		var inputArray = [];
		var attributes = [ 'Definition', 'Descriptive Example', 'Note' ];
		console.log("input:" + input.length);
		console.log("attributeName :" + attributeName);
		console.log(attributes.length)

		for ( var attribute in attributes) {
			console.log("1 ::" + attributes[attribute]);
			var count = 0;
			for ( var item in input) {
				console.log("2 ::" + input[item].type);
				if (attributes[attribute] == input[item].type) {
					count++;
					console.log("Vals :" + input[item].type);
					inputArray.push(input[item].type + ":" + input[item].val);
				} else {
					console.log("Vals Else :" + input[item].type);
					// inputArray.push(input[item].type+":"+input[item].val);
				}
			}
			if (count == 0) {
				console.log("Attribute does not exist :"
						+ attributes[attribute]);
				inputArray.push(attributes[attribute] + ":");
			} else {
				console.log("Attribute exists :" + attributes[attribute]);
			}
		}
		return inputArray;
	};
});
