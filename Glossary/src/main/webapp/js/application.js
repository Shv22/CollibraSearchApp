/**
 * 
 */
var app = angular.module("SearchGateway", [ 'ngRoute', 'ngMaterial', 'ngMessages',
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
app.controller("SearchController",
				function($scope, $rootScope, $filter, $http, $location,
						$mdSidenav,$mdUtil, $timeout, $log, $element, $mdSelect,
						$mdDialog, GlossaryService, $window,$q, $compile, $sce, $route) {

					$scope.loadingApp = true;
					$scope.loadingTab = true;
					$scope.currentPage_Filtered = 0;
					$scope.noOfFilteredPages = 0;
					$scope.Math = window.Math;
					$scope.date = "";
					
					$scope.contentWidth = "width:100%";
					$scope.toggleRight = buildDelayedToggler('right');
					$scope.toggleLeft = buildDelayedToggler('left');
					$scope.previewAsset = function(assetForPreview){
						$scope.assetForPreview = assetForPreview;
						$scope.loadingGroup = true;
						$scope.assetDescription = null;
						$scope.isAsssetDescription = false;
						angular.forEach(assetForPreview.attributes,
								function(val) {
									$scope.locationURLEnable = false;
									if (val.type === "Location") {
										var value = val.val;
										if(value.startsWith("http")){
											$scope.locationURLEnable = true;
										}
									}
									
									if(val.type === "Description"){
										$scope.assetDescription = val.val;
										$scope.isAsssetDescription = true;
									}
									
									if(val.type === "Abbreviation"){
										$scope.assetAbbreviation = val.val;
									}
								});
						
						
					};
					
					 $scope.isOpenRight = function(){
						  $scope.contentWidth = "width:100%;";
					      return $mdSidenav('right').isOpen();
					    };

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

					GlossaryService.employees = $scope.employees;

					function debounce(func, wait, context) {
					      var timer;

					      return function debounced() {
					        var context = $scope,
					            args = Array.prototype.slice.call(arguments);
					        $timeout.cancel(timer);
					        timer = $timeout(function() {
					          timer = undefined;
					          func.apply(context, args);
					        }, wait || 10);
					      };
					    }
					
					function buildDelayedToggler(navID) {
					      return debounce(function() {
					        // Component lookup should always be available since
							// we are not using `ng-if`
					        $mdSidenav(navID)
					          .toggle()
					          .then(function () {
					            $log.debug("toggle " + navID + " is done");
					          });
					      }, 200);
					    }
					
					function buildToggler(navID) {
					      return function() {
					        // Component lookup should always be available since we are not using `ng-if`
					        $mdSidenav(navID)
					          .toggle()
					          .then(function () {
					            $log.debug("toggle " + navID + " is done");
					          });
					      };
					    }
					
					
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

					$scope.clearSearchAndReoload = function() {
						$scope.searchForm.term = '';
						this.searchTerm();
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

						$window.location.href = "/Glossary/SearchAssets.html?term="
								+ $scope.searchForm.term + "&showSearch="
								+ showSearch;
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
						$scope.loadedIndex=0;
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
										$scope.activeTabIndex = 0;
										
										if(app == 'GlossaryApp'){
											$scope.activeTabIndex = 0;
										} else if(app == 'DataSetsApp'){
											$scope.activeTabIndex = 1;
										} else if(app == 'ReportsApp'){
											$scope.activeTabIndex = 2;
										} 
									}
									
								});

						if (showSearch == "true") {
							$scope.transparent = true;
						} else {
							$scope.transparent = false;
						}
						
						$http({
							method : 'GET',
							url : './appConfig.json'
						}).then(function successCallback(response) {
											$scope.config = response.data;
											// $scope.targetApp=$scope.config.targetApp;
											console.log("AppName "+ $scope.config.appName);
											
											/*-------Applying theme------- */
											applyTheme($scope.config.themeApplied);
											
											// Reading Proxy details
											angular.forEach($scope.config.proxy,
															function(val, key) {
																console.log("Proxy VALUES"+ val.value+ " NAME:"+ key);
																if (key == "proxyUrl") {
																	$scope.proxyUrl = val.value;
																} else if (key == "proxyPort") {
																	$scope.proxyPort = val.value;
																}
															});
											
											$scope.pages1 = [];

											// Reading Page details
											angular.forEach($scope.config.pageSizes,
															function(val, key) {
																//console.log("PAGE SIZES"+ val.value+ " NAME:"+ key);
																$scope.pages1.push(val.value);
															});

											// Reading Environment details
											angular.forEach($scope.config.environment,
															function(val, key) {
																//console.log("OUTER VALUES"+ val.value+ " NAME:"+ key);
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
																} else if (key == "dgcRestUrlLatest") {
																	$scope.dgcRestUrlLatest = val.value;
																} 
															});
											
											// Reading API details
											angular.forEach($scope.config.apis,
															function(val, key) {
																//console.log("API OUTER VALUES"+ val+ " NAME:"+ key);
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
																}  else if (key == "glossaryTabColor") {
																	$scope.glossaryTabColor = val;
																}  else if (key == "dataSetTabColor") {
																	$scope.dataSetTabColor = val;
																}  else if (key == "reportTabColor") {
																	$scope.reportTabColor = val;
																} else if (key == "assignmentValueApi") {
																	$scope.assignmentValueApi = val;
																} else if (key == "relationApi") {
																	$scope.relationApi = val;
																} else if (key == "relationNameApi") {
																	$scope.relationNameApi = val;
																} else if (key == "responsibilityApi") {
																	$scope.responsibilityApi = val;
																} else if (key == "businessStewardRole") {
																	$scope.businessStewardRole = val;
																}  else if (key == "graphAppURL") {
																	$scope.graphAppURL = $sce.trustAsResourceUrl(val);
																}  else if (key == "domainsApi") {
																	$scope.domainsApi = val;
																} 
																
															});
											
											$scope.appData = [];
											$scope.appSpecificData = [];
											
											// Reading all application details ( Example: GlossaryApp or ReportsApp or Data Sets App )
											angular.forEach($scope.config.application,
															function(value, key) {
																console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Application details value:"
																				+ " and Key :"
																				+ key
																				+ " and app is:"
																				+ app);
																$scope.searchResultSet = [];
																$scope.searchResultSetSize = [];
																
																$scope.filterResultSet = [];
																$scope.filterResultSetSize = [];
																
																$scope.statusResultSet = [];
																$scope.statusResultSetSize = [];
																
																$scope.domainIdList = [];
																$scope.termIdList = [];
																
																$scope.searchResultSet1 = [];
																$scope.searchResultSet2 = [];
																$scope.searchResultSetSize1 = [];
																
																var searchPromises = [];
																var count = 0;
																$scope.defaultApp = $scope.config.defaultApp;
																$scope.tabs = [];
																$scope.tabColors = [];
																$scope.tabIcons = [];
																$scope.filter1List = [];
																$scope.filter1IconList = [];
																$scope.filter2IconList = [];
																$scope.cardWidths = [];
																$scope.cardHeights = [];
																
																console.log("**************defaultApp:*****************"+$scope.defaultApp);
																
																// Reading title values of each application and assigning into tabs array
																angular.forEach($scope.config.application,
																		function(value, key) {
																	angular.forEach(value,function(val,key) {
																		if (key == "title") {
																			$scope.tabs.push(val.value);
																		}
																		if(key == "tileTagColor"){
																			$scope.tabColors.push(val.value);
																		}
																		if(key == "tabIcon"){
																			$scope.tabIcons.push(val.value);
																		}
																		if(key == "filter1"){
																			$scope.filter1List.push(val.value);
																		}
																		if(key == "filter1Icon"){
																			$scope.filter1IconList.push(val.value);
																		}
																		if(key == "filter2Icon"){
																			$scope.filter2IconList.push(val.value);
																		}
																		if(key == "cardWidth"){
																			$scope.cardWidths.push(val.value);
																		}
																		if(key == "cardHeight"){
																			$scope.cardHeights.push(val.value);
																		}
																		
																	});
																	console.log("**************Total Tabs:*****************"+$scope.tabs);
																});
																
																
																
																var integrationSearchTerm = "";
																location.search.substr(1).split("&").forEach(
																		function(item) {
																			tmp = item.split("=");
																			if (tmp[0] === "term") {
																				integrationSearchTerm = decodeURI(tmp[1]);
																			}
																		});
																
																// Reading integration tabs Data
																$scope.integrationTab = [];
																$scope.integrationActive = false;
																angular.forEach($scope.config.integration,
																		function(value, key) {
																	var valObj = {};
																	angular.forEach(value,function(val,key) {
														                  
																		if (key == "icon") {
																			 valObj.icon = val.value;
																		}
																		
																		if (key == "heading") {
																			valObj.heading = val.value;
																		}
																		
																		if (key == "url") {
																			 var updatedUrl = val.value.replace("<searchTerm>",integrationSearchTerm);
																			 valObj.url = $sce.trustAsResourceUrl(updatedUrl);
																		}
																		
																	});
																	$scope.integrationTab.push({'icon':valObj.icon,'heading':valObj.heading,'url':valObj.url}); 
																	$scope.integrationActive = true;
																	console.log("**************Total Integration Tab:*****************"+$scope.integrationTab);
																});
																

																console.log("**************Tabs 1:*****************"+$scope.tabs[0]);
																console.log("**************Tabs 2:*****************"+$scope.tabs[1]);
																console.log("**************Tabs 3:*****************"+$scope.tabs[2]);
																
																// Reading application specific details of each application
															    angular.forEach(value,function(val,key) {
																					console.log("***************APPLICATION:::"+ key+" AND VALUE IS::"+val.value);

																					// Adding logic to fetch Search results
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
																						
																						if (key == "searchCategory") {
																							$scope.searchCategory = val.value;
																							$scope.appData.push("searchCategory:"+$scope.searchCategory);
																							count = count + 1 ;
																						} else if (key == "tileTagColor") {
																							$scope.tileTagColor = val.value;
																							$scope.appData.push("tileTagColor:"+$scope.tileTagColor);
																							
																							count = count + 1 ;
																						} else if (key == "description") {
																								$scope.description = val.value;
																								$scope.appData.push("description:"+$scope.description);
																								count = count + 1 ;
																						} else if (key == "domainId") {
																							$scope.domainId = val.value;
																							$scope.appData.push("domainId:"+$scope.domainId);
																							count = count + 1 ;
																						} else if (key == "termId") {
																							$scope.termId = val.value;
																							$scope.appData.push("termId:"+$scope.termId);
																							count = count + 1 ;
																						} else if (key == "lobAssetTypeId") {
																							$scope.lobAssetTypeId = val.value;
																							$scope.appData.push("lobAssetTypeId:"+$scope.lobAssetTypeId);
																							count = count + 1 ;
																							searchAssignmentValues($scope.lobAssetTypeId);
																						} else if (key == "businessSegmentAssetTypeId") {
																							$scope.businessSegmentAssetTypeId = val.value;
																							$scope.appData.push("businessSegmentAssetTypeId:"+$scope.businessSegmentAssetTypeId);
																							count = count + 1 ;
																						} else if (key == "businessDimentionsDomainId") {
																							$scope.businessDimentionsDomainId = val.value;
																							$scope.appData.push("businessDimentionsDomainId:"+$scope.businessDimentionsDomainId);
																							count = count + 1 ;
																						} else if (key == "simpleApprovalWorkflowId") {
																							$scope.simpleApprovalWorkflowId = val.value;
																							$scope.appData.push("simpleApprovalWorkflowId:"+$scope.simpleApprovalWorkflowId);
																							count = count + 1 ;
																						} else if (key == "logo") {
																							$scope.logo = val.value;
																							$scope.appData.push("logo:"+$scope.logo);
																							count = count + 1 ;
																						} else if (key == "favicon") {
																							$scope.favicon = val.value;
																							$scope.appData.push("favicon:"+$scope.favicon);
																							count = count + 1 ;
																						} else if (key == "filter1") {
																							$scope.filter1 = val.value;
																							$scope.appData.push("filter1:"+$scope.filter1);
																							count = count + 1 ;
																						} else if (key == "filter2") {
																							$scope.filter2 = val.value;
																							$scope.appData.push("filter2:"+$scope.filter2);
																							count = count + 1 ;
																						} else if (key == "filter3") {
																							$scope.filter3 = val.value;
																							$scope.appData.push("filter3:"+$scope.filter3);
																							count = count + 1 ;
																						} else if (key == "filter4") {
																							$scope.filter4 = val.value;
																							$scope.appData.push("filter4:"+$scope.filter4);
																							count = count + 1 ;
																						} else if (key == "PaginationHeader") {
																							$scope.PaginationHeader = val.value;
																							$scope.appData.push("PaginationHeader:"+$scope.PaginationHeader);
																							count = count + 1 ;
																						} else if (key == "title") {
																							$scope.title = val.value;
																							$scope.appData.push("title:"+$scope.title);
																							count = count + 1 ;
																						} else if (key == "attributes") {
																							//count = 0;
																							count = count + 1 ;
																							$scope.attributes = [];
																							$scope.attributeFilters = [];
																							angular.forEach(val,function(val,key) {
																												//console.log("ATTRIBUTE NAME:::"+ key+ " AND ::"+ count+ " AND ::"+ val.isFacet);
																												$scope.attributes.push(val);
																												if(val.isFacet == "true"){
																													// REST CALL TO GET ATTRIBUTE VALUES
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
																																		//console.log("22");
																																		$scope.attributeValues = [];
																																		$scope.attributeTypeDetails = response.data;
																																		$scope.attributeTypeDetails.createdOn = $filter('date')($scope.attributeTypeDetails.createdOn,"yyyy-MM-dd");
																																		$scope.attributeTypeDetails.lastModified = $filter('date')($scope.attributeTypeDetails.lastModified,"yyyy-MM-dd");
																																		if($scope.attributeTypeDetails.kind == "BooleanAttribute"){
																																			$scope.attributeValues.push("true");
																																			$scope.attributeValues.push("false");
																																			$scope.attributeFilters.push({signifier : $scope.attributeTypeDetails.signifier, value:$scope.attributeValues});

																																		}else if($scope.attributeTypeDetails.kind == "SingleValueListAttribute" || $scope.attributeTypeDetails.kind == "MultiValueListAttribute"){
																																			//console.log("EL:SE");
																																			
																																			angular.forEach($scope.attributeTypeDetails.allowedValues,function(val,key) {
																																				//console.log("ALLOWED VALUES LOGIC:"+$scope.attributeTypeDetails.signifier+" AND "+val+" AND KEY:"+key);
																																				signifier1 = $scope.attributeTypeDetails.signifier;
																																				//console.log("signifier"+signifier1);
																																				$scope.attributeValues.push(val);
																																			})
																																			$scope.attributeFilters.push({signifier : $scope.attributeTypeDetails.signifier, value: $scope.attributeValues});

																																		}
																																	},
																																	function errorCallback(
																																			response) {
																																		console.log("DOMAIN ERROR 1:"+ response);
																																		console.log(response.statusText);
																																	});
																													
																													
																													
																												}
																											});
																						}

																						console.log("+++++++++++++++++++++++++ COUNTER ::"+count);	

																						// This condition is necessary since $http is an asynchronous call and due to this
																						// feature the below http code might be invoked before the prevous http service completes
																						// reading the json files. "count == 17" where 17 is the no of keys under each app name in the applicationJson.
																						if(count == 17){
																							$scope.appSpecificData.push({assetType : $scope.title, value: $scope.appData});
																							
																							//console.log("+++++++++++++++++++++++++INSIDE SEARCH NEW FOR APP: $scope.appSpecificData::"+$scope.appSpecificData[0].assetType);
																							console.log("+++++++++++++++++++++++++INSIDE SEARCH NEW FOR APP: DOMAIN ID::"+$scope.domainId);
																							console.log("+++++++++++++++++++++++++INSIDE SEARCH NEW FOR APP: $scope.appData Length::"+$scope.appData.length);
																							$scope.appData = [];
																							console.log("+++++++++++++++++++++++++INSIDE SEARCH NEW FOR APP: $scope.appSpecificData Length::"+$scope.appSpecificData.length);
																							count=0;
																							
																						}
																					});
																	
																	console.log("OUTSIDE ---- Reading application specific details of each application");

															}); // End of Application list loop
											
											console.log("+++++++++++++++++++++++++INSIDE SEARCH NEW FOR APP: $scope.appSpecificData::"+$scope.appSpecificData[0].assetType);
											console.log("+++++++++++++++++++++++++INSIDE SEARCH NEW FOR APP: $scope.appSpecificData::"+$scope.appSpecificData[1].assetType);
											console.log("+++++++++++++++++++++++++INSIDE SEARCH NEW FOR APP: $scope.appSpecificData::"+$scope.appSpecificData[2].assetType);
											
											//alert($('assetTiles-content11') + " --assetTiles-content--");
											var searchedData= [];
											// Call to get Searched data
											searchedData = getSearchData($scope.appSpecificData);
											console.log("+++++++++++++++++++++SEARCHED DATE LENGTH +++++++++++++++++"+searchedData.length);
											
											// Call to get Searched data
											var filterData= [];
											
											filterData = getFilterData($scope.appSpecificData);
											console.log("+++++++++++++++++++++SEARCHED FILTER DATA LENGTH +++++++++++++++++"+filterData.length+" AND INDEX IS :"+$scope.loadedIndex);
											
										}, function errorCallback(response) {
											console.log("Error:" + response);
										});
						
						
						function applyTheme(themeName){
							$scope.tabColors = [];
							$http({
								method : 'GET',
								url : './' + themeName +'.json'
							}).then(function successCallback(response) {
								
								$scope.panelColor = response.data.panelColor;
								
								$scope.headingColor = response.data.headingColor;
								$scope.headingSize = response.data.headingSize;
								
								$scope.paginationColor = response.data.paginationColor;
								$scope.paginationSize = response.data.paginationSize;
								
								$scope.subHeadingColor = response.data.subHeadingColor;
								$scope.subHeadingSize = response.data.subHeadingSize;
								$("md-tabs-wrapper").css("background-color", $scope.panelColor);
								angular.forEach(response.data.application,
										function(value, key) {
									angular.forEach(value,function(val,key) {
										
										if(key == "tileTagColor"){
											$scope.tabColors.push(val.value);
										}
										
										if(key == "tabIcon"){
											$scope.tabIcons.push(val.value);
										}
										
									});
								});
								
							})
							
						}

						
						function getSearchData(appSpecificData) {
							return $q.all(appSpecificData.map(function(item){
								//console.log("++++++++++@@@@@@@@+++++++++INSIDE SEARCH NEW FOR APP: $scope.item::"+item.assetType);
								return searchResultsPromiseNew(item);
							})).then(function(response){
								     var domainIdList = {};
                                    var termIdList = {}
                                    	
									var resultObj = {};
									response.forEach(function (val, i) {
					                    resultObj[appSpecificData[i]] = val.data;
					                    console.log("++++++++++@@@@@@@@+++++++++THEN PROMISE resultObj::"+resultObj[appSpecificData[i]]);
					                    
					                    $scope.glossaryList12 = resultObj[appSpecificData[i]][1];
										$scope.glossaryListSize12 = resultObj[appSpecificData[i]][0];
										
										$scope.domainIdList.push(appSpecificData[i].value[4].split(":")[1]);
										$scope.termIdList.push(appSpecificData[i].value[5].split(":")[1]);
										
										$q.all($scope.glossaryList12.forEach(function (assetId, k) {
											var assetId = $scope.glossaryList12[k].name.id;
											$scope.assetTargetRelation($scope.glossaryList12[k]);
											
											$scope.assetSourceRelation($scope.glossaryList12[k]);
											
											$scope.assetBusinessSteward($scope.glossaryList12[k]);
											
										})).then(function(response){
										});
										
																				
										$scope.searchResultSet.push($scope.glossaryList12);
										$scope.searchResultSetSize.push($scope.glossaryListSize12);
										
										console.log("********INSIDE SEARCH  glossaryList12 LENGTH:"+ $scope.glossaryList12)
										
										console.log("********INSIDE SEARCH  searchResultSet LENGTH:"+ $scope.searchResultSet.length)
										
										console.log("********INSIDE SEARCH  domainIdList 0 :"+ $scope.domainIdList[0]+" AND TermId is ::"+$scope.termIdList[0]);
										console.log("********INSIDE SEARCH  domainIdList 1 :"+ $scope.domainIdList[1]+" AND TermId is ::"+$scope.termIdList[1]);
										console.log("********INSIDE SEARCH  domainIdList 2 :"+ $scope.domainIdList[2]+" AND TermId is ::"+$scope.termIdList[2]);
				                });
								

								$scope.loadingApp = false;
								$scope.loadingTab = false;
								
								 return resultObj;
							});
						}
						
						var searchResultsPromiseNew = function(item) {
							console.log("++++++++++++++++ SEARCH RESULTS PROMISE NEW +++++++++++++++++++: "+item.value[3].split(":")[1]+" AND ::"+$scope.dgcRestUrl);
					        return $http({method : 'GET',url : '/Glossary/getSearchResultsNew',
								params : {
									searchTerm : searchTerm + "*",
									pageSize : $scope.pageSize,
									currentPage : "0",
									domainFilter : "",
									statusFilter : "",
									userName : userName,
									dgcRestUrl : $scope.dgcRestUrl,
									dgcUrl : $scope.dgcUrl,
									searchApi : $scope.searchApi,
									domainId : item.value[4].split(":")[1],
									termId : item.value[5].split(":")[1],
									searchCategory : item.value[3].split(":")[1],
									tileTagColor : item.value[2].split(":")[1],
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
					    } // END of searchResultsPromise
						
						function getFilterData(appSpecificData) {
							console.log("+++++++++++++++++++++INSIDE GETFILTERDATA +++++++++++++++++");
							console.log("++++++++++$$$$$$$++++++++INSIDE FILTER DATA NEW FOR APP: $scope.appSpecificData::"+appSpecificData[0].assetType);
							console.log("++++++++++$$$$$$$++++++++INSIDE FILTER DATA NEW FOR APP: $scope.appSpecificData::"+appSpecificData[1].assetType);
							console.log("++++++++++$$$$$$$++++++++INSIDE FILTER DATA NEW FOR APP: $scope.appSpecificData::"+appSpecificData[2].assetType);
							return $q.all(appSpecificData.map(function(item){
								console.log("++++++++++@@@@@@@@+++++++++INSIDE filter NEW FOR APP: $scope.item::"+item.assetType);
								return filterResultsPromise(item);
							})).then(function(response){
								//console.log("++++++++++@@@@@@@@+++++++++THEN AFTER PROMISE::"+$scope.searchResultSetSize1.length);
								console.log("++++++++++@@@@@@@@+++++++++THEN PROMISE::"+response.length);
								console.log("++++++++++@@@@@@@@+++++++++THEN PROMISE RESULTS::"+response);
								//console.log("++++++++++@@@@@@@@+++++++++THEN PROMISE RESULTS::"+appSpecificData[i].value);
								

									var resultObj = {};
									response.forEach(function (val, i) {
				                    resultObj[appSpecificData[i]] = val.data;
				                    console.log("++++++++++@@@@@@@@+++++++++THEN PROMISE SearchresultObj::"+resultObj[appSpecificData[i]][0].name.val);
				                    
				                    $scope.filterDataList = resultObj[appSpecificData[i]];
									//$scope.filterDataListSize = resultObj[appSpecificData[i]][0];
									
									$scope.filterResultSet.push($scope.filterDataList);
									//$scope.filterResultSetSize.push($scope.filterDataListSize);
									
									console.log("********INSIDE FILTER  filterDataList LENGTH:"
											+ $scope.filterResultSet.length);
											
				                });
								

								$scope.loadingApp = false;
								
								 return resultObj;
							});
						}
						

						var filterResultsPromise = function(item) {
							console.log("++++++++++++++++ SEARCH FILTER RESULTS PROMISE +++++++++++++++++++: "+searchTerm+" AND ::"+item.value[4].split(":")[1]);
					        return $http({method : 'GET',
									url : '/Glossary/getDomains',
									params : {
										dgcRestUrl : $scope.dgcRestUrl,
										searchApi : $scope.searchApi,
										domainId : item.value[4].split(":")[1],
										proxyUrl : $scope.proxyUrl,
										proxyPort : $scope.proxyPort,
										apiUser : $scope.apiUser,
										apiUserPassword : $scope.apiUserPassword
									},
									headers : {
										'Content-Type' : 'application/json'
									}
							})/*.then(function successCallback(response) {
										console.log("********INSIDE FILTER LENGTH :"+ response);
										console.log("********INSIDE FILTER LENGTH 1:"+ response.data);
										$scope.filterDataList = response.data[1];
										$scope.filterDataListSize = response.data[0];
										
										$scope.filterResultSet.push($scope.filterDataList);
										$scope.filterResultSetSize.push($scope.filterDataListSize);
										
										$scope.searchResultSet1.push($scope.glossaryList12,$scope.glossaryListSize12);
										$scope.searchResultSetSize1.push($scope.searchResultSet1);
										$scope.searchResultSet1 = [];
										
										console.log("********INSIDE FILTER  filterDataList LENGTH:"
												+ $scope.filterDataList.length)

										$scope.loadingApp = false;
							})*/
					    } // END of filterResultsPromise
						//$scope.loadApp(app, $scope.activeTabIndex);
						
						/*if($scope.activeTabIndex == '0'){
							$scope.activeTabColor = $scope.tabColors[index];
						} else if($scope.activeTabIndex == '1'){
							$scope.activeTabColor =  $scope.tabColors[index];
						} else if($scope.activeTabIndex == '2'){
							$scope.activeTabColor =  $scope.tabColors[index];
						}  
						$("md-ink-bar").css('color', $scope.activeTabColor); 
						$("md-ink-bar").css('background-color', $scope.activeTabColor); */
						
						$.getScript('./js/homePageConfig.js', function () {          
							loadHomePage($scope, $http);  
						});
						
					}; /* End of init Function */
					
					var searchAssignmentValues = function(lobAssetTypeId) {
						$scope.finalStatusList = [];
				        return $http({method : 'GET',url : '/Glossary/getAssignmentsValues',
							params : {
								dgcRestUrlLatest : $scope.dgcRestUrlLatest,
								assignmentValueApi : $scope.assignmentValueApi,
								lobAssetTypeId : lobAssetTypeId,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(function successCallback(response) {
							$scope.statusList = response.data[0].statuses;
							
							$scope.iteratedStatus = [];
							angular.forEach($scope.statusList,
									function(value, key) {
								$scope.iteratedStatus.push(value);
							})
							$scope.finalStatusList.push($scope.iteratedStatus);
						})
				    } 
					
					$scope.getSearchResultsFromConfig2423 = function() {
				        return $http({method : 'GET',url : '/Glossary/getSearchResultsNew',
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
								tileTagColor : $scope.tileTagColor,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword,
								searchType : 'D'
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						});
				    }
					
					$scope.loadApp = function (selectedApp,index){
						console.log("+++++++++++++++++++++++++INDEX IN LOADAPP :++++++"+index);
						$mdSidenav('left').close();
						$mdSidenav('right').close()
						$scope.loadedIndex=index;
						//activeTabIndex();
						activeTabColor(index);
						loadFilter1(index);
						 $scope.integrationActive = false;
					}
					
					$scope.styleFunction = function(index){
						 return $scope.tabIcons[index];
					 }
					
					
					$scope.filterHome = function(assetId){
						$.getScript('./js/homePageConfig.js', function () {          
							filterHomePage($scope, $http, assetId);  
						});
					 }
					
					$scope.activeIntegrationTab = function(index){
						 $scope.integrationActive = true;
					 }
					
					$scope.redirectToSearchPage = function(tab){
						var activeTab= "GlossaryApp";
						if(tab == "Data Sets"){
							activeTab = "DataSetsApp";
						}
						if(tab == "Reports"){
							activeTab = "ReportsApp";
						}
						window.location = "/Glossary/SearchAssets.html?term=&showSearch=true&app=" + activeTab;
					 }
					
					$scope.pageReload = function(){
						window.location = "/Glossary/landingPage.html?term=&showSearch=true";
					 }
					
					function activeTabIndex(){
						if(app != null && app != undefined){
							if(app == 'GlossaryApp'){
								$scope.activeTabIndex = 0;
								$scope.loadedIndex = 0;
							} else if(app == 'DataSetsApp'){
								$scope.activeTabIndex = 1;
								$scope.loadedIndex = 1;
							} else if(app == 'ReportsApp'){
								$scope.activeTabIndex = 2;
								$scope.loadedIndex = 2;
							} 
						} 
					}
					
					function activeTabColor(index){
						if(index == '0'){
							$scope.activeTabColor = $scope.tabColors[index];
						} else if(index == '1'){
							$scope.activeTabColor =  $scope.tabColors[index];
						} else if(index == '2'){
							$scope.activeTabColor =  $scope.tabColors[index];
						}  
						$("md-ink-bar").css('color', $scope.activeTabColor); 
						$("md-ink-bar").css('background-color', $scope.activeTabColor); 
					}
					
					function loadFilter1(index){
						if(index == '0'){
							$scope.filter1 = $scope.filter1List[index];
							$scope.filter1Icon = $scope.filter1IconList[index];
							$scope.filter2Icon = $scope.filter2IconList[index];
							$scope.activeCardWidth = $scope.cardWidths[index];
							$scope.activeCardHeight = $scope.cardHeights[index];
						} else if(index == '1'){
							$scope.filter1 =  $scope.filter1List[index];
							$scope.filter1Icon = $scope.filter1IconList[index];
							$scope.filter2Icon = $scope.filter2IconList[index];
							$scope.activeCardWidth = $scope.cardWidths[index];
							$scope.activeCardHeight = $scope.cardHeights[index];
						} else if(index == '2'){
							$scope.filter1Icon = $scope.filter1IconList[index];
							$scope.filter1 =  $scope.filter1List[index];
							$scope.filter2Icon = $scope.filter2IconList[index];
							$scope.activeCardWidth = $scope.cardWidths[index];
							$scope.activeCardHeight = $scope.cardHeights[index];
						} 
					}
					
					$scope.closeRightPreviewPanel = function () {
					      // Component lookup should always be available since we are not using `ng-if`
					      $mdSidenav('right').close()
					        .then(function () {
					          //$log.debug("close RIGHT is done");
					        });

					    };
					    
					    $scope.closeLeftPreviewPanel = function () {
						      // Component lookup should always be available since we are not using `ng-if`
						      $mdSidenav('left').close()
						        .then(function () {
						          //$log.debug("close RIGHT is done");
						        });

						    };
					
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
							selectedStatusIdList,index,domainId, termId) {
                        //alert("INSIDE TOGGLE DOMAINID:"+item.name.id);
                        //alert("DOMAIN ID iS::"+domainId+" and TERM ID is::"+termId);
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

						$scope.loadingTab = true;
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

						// Need to be deleted
						$scope.numberOfPages = function() {
							return Math.ceil($scope.getData().length
									/ $scope.pageSize);
						}
						
						// Need to be deleted
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
								domainId : domainId,
								termId : termId,
								searchCategory : $scope.searchCategory,
								tileTagColor : $scope.tileTagColor,
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
									
									$scope.searchResultSet[index]= $scope.glossaryList;
									$scope.searchResultSetSize[index]= $scope.glossaryListSize;
									
									alert(JSON.stringify($scope.glossaryListSize) + "----$scope.glossaryListSize-----");
									
									console.log("++++++++++INSIDE FILTER TOGGLE glossaryList:"
											+ $scope.searchResultSet[index]);
									console.log("++++++++++INSIDE FILTER TOGGLE glossaryList:SiZE"
											+ $scope.searchResultSet[index]);
									$scope.loadingTab = false;
									
								}, function errorCallback(response) {
									console.log(response.statusText);
								});
					};

					$scope.exists = function(item, list) {
						return list.indexOf(item.name.val) > -1;
					};
					
					$scope.statusToggle = function(item, selectedDomainList,
							selectedDomainIdList, selectedStatusList,
							selectedStatusIdList,index,domainId, termId) {
						
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
						$scope.loadingTab = true;
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
								domainId : domainId,
								termId : termId,
								searchCategory : $scope.searchCategory,
								tileTagColor : $scope.tileTagColor,
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
									
									$scope.searchResultSet[index]= $scope.glossaryList;
									$scope.searchResultSetSize[index]= $scope.glossaryListSize;
									$scope.loadingTab = false;
								}, function errorCallback(response) {
									console.log(response.statusText);
								});
					};

					
					$scope.lobToggle = function(item, selectedLOBs) {
						
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
								tileTagColor : $scope.tileTagColor,
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
					
					$scope.statusExists = function (status, list) { 
						
						return
					list.indexOf(status.val) > -1; };
					
					// For LOB
					$scope.lobExists = function (lob, list) { return
						list.indexOf(status.name) > -1; };
						
					$scope.businessSegmentExists = function (businessSegment, list) { return
							list.indexOf(status.name) > -1; };
					

					$scope.isIndeterminate = function() {
						return ($scope.selected.length !== 0 && $scope.selected.length !== $scope.items.length);
					};

					$scope.isChecked = function() {
						alert("--ischecked--");
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

					//$scope.toggleLeft = buildToggler('left');
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

					/*function buildToggler(navID) {
						return function() {
							$mdSidenav(navID).toggle().then(function() {
								$log.debug("toggle " + navID + " is done");
							});
						}
					}*/

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
					
					
					$scope.assetTargetRelation = function(targetAsset) {
						var targetId = targetAsset.name.id;
				        return $http({method : 'GET',url : '/Glossary/getRelationsByTarget',
							params : {
								dgcRestUrlLatest : $scope.dgcRestUrlLatest,
								relationApi : $scope.relationApi,
								targetId : targetId,
								sourceId : "",
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(function successCallback(response) {
							targetAsset.targetRelation = response.data[1];
						})
				    } 
					
					$scope.assetSourceRelation = function(targetAsset) {
						var sourceId = targetAsset.name.id;
				        return $http({method : 'GET',url : '/Glossary/getRelationsByTarget',
							params : {
								dgcRestUrlLatest : $scope.dgcRestUrlLatest,
								relationApi : $scope.relationApi,
								targetId : "",
								sourceId : sourceId,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(function successCallback(response) {
							targetAsset.sourceRelation = response.data[1];
						})
				    } 
					
					$scope.assetBusinessSteward = function(targetAsset) {
						var assetId = targetAsset.name.id;
				        return $http({method : 'GET',url : '/Glossary/getBusinessSteward',
							params : {
								dgcRestUrlLatest : $scope.dgcRestUrlLatest,
								responsibilityApi : $scope.responsibilityApi,
								targetId : assetId,
								roleIds : $scope.businessStewardRole,
								proxyUrl : $scope.proxyUrl,
								proxyPort : $scope.proxyPort,
								apiUser : $scope.apiUser,
								apiUserPassword : $scope.apiUserPassword
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(function successCallback(response) {
							targetAsset.steward = response.data;
						})
				    }
					
					
					
					$scope.getNext = function(currentPage, pageSize,
							searchTerm, selectedDomainIdList,
							selectedStatusIdList,index,domainId,termId) {

						console.log("ON PAGINATION::domainId :;" + domainId+" AND termId:::"+termId+" AND INDEX;;"+index);
						
						$mdSidenav('right').close();
						var currentPage = currentPage;
						$scope.loadingTab = true;
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
								domainId : domainId,
								termId : termId,
								searchCategory : $scope.searchCategory,
								tileTagColor : $scope.tileTagColor,
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
									
									$q.all($scope.glossaryList.forEach(function (assetId, k) {
										var assetId = $scope.glossaryList[k].name.id;
										$scope.assetTargetRelation($scope.glossaryList[k]);
										
										$scope.assetSourceRelation($scope.glossaryList[k]);
										
										$scope.assetBusinessSteward($scope.glossaryList[k]);
										
									})).then(function(response){
									});
									
									
									
									$scope.searchResultSet[index]= $scope.glossaryList;
									$scope.searchResultSetSize[index]= $scope.glossaryListSize;
									
									console.log("SEARCH  glossaryList:"
											+ $scope.glossaryList);
									console.log("SEARCH  glossaryListSize:"
											+ $scope.glossaryListSize);
									$scope.loadingTab = false;
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

											angular.forEach($scope.finalattributeList,
															function(value, key) {
																// create a $q deferred promise
																var deferred = $q.defer();
																console.log("Atttribute ID:"+ value.id+ " and ATTRIBUTE VAL:"+ value.value);
																$http({
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
																				function successCallback(response) {
																					console.log("Successfully updated Business Term attribute");
																					$scope.attributeUpdateStatus = true;
																					deferred.resolve(response);

																				},
																				function errorCallback(response) {
																					alert("Error while proposing the Business asset :"+ response);
																					deffered.reject();
																				});
																promises.push(deferred.promise);
															});

											console.log("outside all condition");
											$q.all(promises)
													.then(function(data) {
																console.log("Inside all condition");
																if ($scope.proposeStatus) {
																	if ($scope.attributeUpdateStatus) {
																		console.log("Successfully created the business asset and updated its attributes");
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

app
.directive(
		'ddPartialText',
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
											'ddPartialText',
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

(function ($, undefined) {
    'use strict';
    var defaults = {
        item: 3,
        autoWidth: false,
        slideMove: 1,
        slideMargin: 10,
        addClass: '',
        mode: 'slide',
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',
        easing: 'linear', //'for jquery animation',//
        speed: 400, //ms'
        auto: false,
        pauseOnHover: false,
        loop: false,
        slideEndAnimation: true,
        pause: 2000,
        keyPress: false,
        controls: true,
        prevHtml: '',
        nextHtml: '',
        rtl: false,
        adaptiveHeight: false,
        vertical: false,
        verticalHeight: 500,
        vThumbWidth: 100,
        thumbItem: 10,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
        enableTouch: true,
        enableDrag: true,
        freeMove: true,
        swipeThreshold: 40,
        responsive: [],
        /* jshint ignore:start */
        onBeforeStart: function ($el) {},
        onSliderLoad: function ($el) {},
        onBeforeSlide: function ($el, scene) {},
        onAfterSlide: function ($el, scene) {},
        onBeforeNextSlide: function ($el, scene) {},
        onBeforePrevSlide: function ($el, scene) {}
        /* jshint ignore:end */
    };
    $.fn.lightSlider = function (options) {
        if (this.length === 0) {
            return this;
        }

        if (this.length > 1) {
            this.each(function () {
                $(this).lightSlider(options);
            });
            return this;
        }

        var plugin = {},
            settings = $.extend(true, {}, defaults, options),
            settingsTemp = {},
            $el = this;
        plugin.$el = this;

        if (settings.mode === 'fade') {
            settings.vertical = false;
        }
        var $children = $el.children(),
            windowW = $(window).width(),
            breakpoint = null,
            resposiveObj = null,
            length = 0,
            w = 0,
            on = false,
            elSize = 0,
            $slide = '',
            scene = 0,
            property = (settings.vertical === true) ? 'height' : 'width',
            gutter = (settings.vertical === true) ? 'margin-bottom' : 'margin-right',
            slideValue = 0,
            pagerWidth = 0,
            slideWidth = 0,
            thumbWidth = 0,
            interval = null,
            isTouch = ('ontouchstart' in document.documentElement);
        var refresh = {};

        refresh.chbreakpoint = function () {
            windowW = $(window).width();
            if (settings.responsive.length) {
                var item;
                if (settings.autoWidth === false) {
                    item = settings.item;
                }
                if (windowW < settings.responsive[0].breakpoint) {
                    for (var i = 0; i < settings.responsive.length; i++) {
                        if (windowW < settings.responsive[i].breakpoint) {
                            breakpoint = settings.responsive[i].breakpoint;
                            resposiveObj = settings.responsive[i];
                        }
                    }
                }
                if (typeof resposiveObj !== 'undefined' && resposiveObj !== null) {
                    for (var j in resposiveObj.settings) {
                        if (resposiveObj.settings.hasOwnProperty(j)) {
                            if (typeof settingsTemp[j] === 'undefined' || settingsTemp[j] === null) {
                                settingsTemp[j] = settings[j];
                            }
                            settings[j] = resposiveObj.settings[j];
                        }
                    }
                }
                if (!$.isEmptyObject(settingsTemp) && windowW > settings.responsive[0].breakpoint) {
                    for (var k in settingsTemp) {
                        if (settingsTemp.hasOwnProperty(k)) {
                            settings[k] = settingsTemp[k];
                        }
                    }
                }
                if (settings.autoWidth === false) {
                    if (slideValue > 0 && slideWidth > 0) {
                        if (item !== settings.item) {
                            scene = Math.round(slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove));
                        }
                    }
                }
            }
        };

        refresh.calSW = function () {
            if (settings.autoWidth === false) {
                slideWidth = (elSize - ((settings.item * (settings.slideMargin)) - settings.slideMargin)) / settings.item;
            }
        };

        refresh.calWidth = function (cln) {
            var ln = cln === true ? $slide.find('.lslide').length : $children.length;
            if (settings.autoWidth === false) {
                w = ln * (slideWidth + settings.slideMargin);
            } else {
                w = 0;
                for (var i = 0; i < ln; i++) {
                    w += (parseInt($children.eq(i).width()) + settings.slideMargin);
                }
            }
            return w;
        };
        plugin = {
            doCss: function () {
                var support = function () {
                    var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                    var root = document.documentElement;
                    for (var i = 0; i < transition.length; i++) {
                        if (transition[i] in root.style) {
                            return true;
                        }
                    }
                };
                if (settings.useCSS && support()) {
                    return true;
                }
                return false;
            },
            keyPress: function () {
                if (settings.keyPress) {
                    $(document).on('keyup.lightslider', function (e) {
                        if (!$(':focus').is('input, textarea')) {
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                            if (e.keyCode === 37) {
                                $el.goToPrevSlide();
                            } else if (e.keyCode === 39) {
                                $el.goToNextSlide();
                            }
                        }
                    });
                }
            },
            controls: function () {
                if (settings.controls) {
                    $el.after('<div class="lSAction"><a class="lSPrev fa fa-chevron-left">' + settings.prevHtml + '</a><a class="lSNext fa fa-chevron-right">' + settings.nextHtml + '</a></div>');
                    if (!settings.autoWidth) {
                        if (length <= settings.item) {
                            $slide.find('.lSAction').hide();
                        }
                    } else {
                        if (refresh.calWidth(false) < elSize) {
                            $slide.find('.lSAction').hide();
                        }
                    }
                    $slide.find('.lSAction a').on('click', function (e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;
                        }
                        if ($(this).attr('class') === 'lSPrev fa fa-chevron-left') {
                            $el.goToPrevSlide();
                        } else {
                            $el.goToNextSlide();
                        }
                        return false;
                    });
                }
            },
            initialStyle: function () {
                var $this = this;
                if (settings.mode === 'fade') {
                    settings.autoWidth = false;
                    settings.slideEndAnimation = false;
                }
                if (settings.auto) {
                    settings.slideEndAnimation = false;
                }
                if (settings.autoWidth) {
                    settings.slideMove = 1;
                    settings.item = 1;
                }
                if (settings.loop) {
                    settings.slideMove = 1;
                    settings.freeMove = false;
                }
                settings.onBeforeStart.call(this, $el);
                refresh.chbreakpoint();
                $el.addClass('lightSlider').wrap('<div class="lSSlideOuter ' + settings.addClass + '"><div class="lSSlideWrapper"></div></div>');
                $slide = $el.parent('.lSSlideWrapper');
                if (settings.rtl === true) {
                    $slide.parent().addClass('lSrtl');
                }
                if (settings.vertical) {
                    $slide.parent().addClass('vertical');
                    elSize = settings.verticalHeight;
                    $slide.css('height', elSize + 'px');
                } else {
                    elSize = $el.outerWidth();
                }
                $children.addClass('lslide');
                if (settings.loop === true && settings.mode === 'slide') {
                    refresh.calSW();
                    refresh.clone = function () {
                        if (refresh.calWidth(true) > elSize) {
                            /**/
                            var tWr = 0,
                                tI = 0;
                            for (var k = 0; k < $children.length; k++) {
                                tWr += (parseInt($el.find('.lslide').eq(k).width()) + settings.slideMargin);
                                tI++;
                                if (tWr >= (elSize + settings.slideMargin)) {
                                    break;
                                }
                            }
                            var tItem = settings.autoWidth === true ? tI : settings.item;

                            /**/
                            if (tItem < $el.find('.clone.left').length) {
                                for (var i = 0; i < $el.find('.clone.left').length - tItem; i++) {
                                    $children.eq(i).remove();
                                }
                            }
                            if (tItem < $el.find('.clone.right').length) {
                                for (var j = $children.length - 1; j > ($children.length - 1 - $el.find('.clone.right').length); j--) {
                                    scene--;
                                    $children.eq(j).remove();
                                }
                            }
                            /**/
                            for (var n = $el.find('.clone.right').length; n < tItem; n++) {
                                $el.find('.lslide').eq(n).clone().removeClass('lslide').addClass('clone right').appendTo($el);
                                scene++;
                            }
                            for (var m = $el.find('.lslide').length - $el.find('.clone.left').length; m > ($el.find('.lslide').length - tItem); m--) {
                                $el.find('.lslide').eq(m - 1).clone().removeClass('lslide').addClass('clone left').prependTo($el);
                            }
                            $children = $el.children();
                        } else {
                            if ($children.hasClass('clone')) {
                                $el.find('.clone').remove();
                                $this.move($el, 0);
                            }
                        }
                    };
                    refresh.clone();
                }
                refresh.sSW = function () {
                    length = $children.length;
                    if (settings.rtl === true && settings.vertical === false) {
                        gutter = 'margin-left';
                    }
                    if (settings.autoWidth === false) {
                        $children.css(property, slideWidth + 'px');
                    }
                    $children.css(gutter, settings.slideMargin + 'px');
                    w = refresh.calWidth(false);
                    $el.css(property, w + 'px');
                    if (settings.loop === true && settings.mode === 'slide') {
                        if (on === false) {
                            scene = $el.find('.clone.left').length;
                        }
                    }
                };
                refresh.calL = function () {
                    $children = $el.children();
                    length = $children.length;
                };
                if (this.doCss()) {
                    $slide.addClass('usingCss');
                }
                refresh.calL();
                if (settings.mode === 'slide') {
                    refresh.calSW();
                    refresh.sSW();
                    if (settings.loop === true) {
                        slideValue = $this.slideValue();
                        this.move($el, slideValue);
                    }
                    if (settings.vertical === false) {
                        this.setHeight($el, false);
                    }

                } else {
                    this.setHeight($el, true);
                    $el.addClass('lSFade');
                    if (!this.doCss()) {
                        $children.fadeOut(0);
                        $children.eq(scene).fadeIn(0);
                    }
                }
                if (settings.loop === true && settings.mode === 'slide') {
                    $children.eq(scene).addClass('active');
                } else {
                    $children.first().addClass('active');
                }
            },
            pager: function () {
                var $this = this;
                refresh.createPager = function () {
                    thumbWidth = (elSize - ((settings.thumbItem * (settings.thumbMargin)) - settings.thumbMargin)) / settings.thumbItem;
                    var $children = $slide.find('.lslide');
                    var length = $slide.find('.lslide').length;
                    var i = 0,
                        pagers = '',
                        v = 0;
                    for (i = 0; i < length; i++) {
                        if (settings.mode === 'slide') {
                            // calculate scene * slide value
                            if (!settings.autoWidth) {
                                v = i * ((slideWidth + settings.slideMargin) * settings.slideMove);
                            } else {
                                v += ((parseInt($children.eq(i).width()) + settings.slideMargin) * settings.slideMove);
                            }
                        }
                        var thumb = $children.eq(i * settings.slideMove).attr('data-thumb');
                        if (settings.gallery === true) {
                            pagers += '<li style="width:100%;' + property + ':' + thumbWidth + 'px;' + gutter + ':' + settings.thumbMargin + 'px"><a href="#"><img src="' + thumb + '" /></a></li>';
                        } else {
                            pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                        }
                        if (settings.mode === 'slide') {
                            if ((v) >= w - elSize - settings.slideMargin) {
                                i = i + 1;
                                var minPgr = 2;
                                if (settings.autoWidth) {
                                    pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                                    minPgr = 1;
                                }
                                if (i < minPgr) {
                                    pagers = null;
                                    $slide.parent().addClass('noPager');
                                } else {
                                    $slide.parent().removeClass('noPager');
                                }
                                break;
                            }
                        }
                    }
                    var $cSouter = $slide.parent();
                    $cSouter.find('.lSPager').html(pagers); 
                    if (settings.gallery === true) {
                        if (settings.vertical === true) {
                            // set Gallery thumbnail width
                            $cSouter.find('.lSPager').css('width', settings.vThumbWidth + 'px');
                        }
                        pagerWidth = (i * (settings.thumbMargin + thumbWidth)) + 0.5;
                        $cSouter.find('.lSPager').css({
                            property: pagerWidth + 'px',
                            'transition-duration': settings.speed + 'ms'
                        });
                        if (settings.vertical === true) {
                            $slide.parent().css('padding-right', (settings.vThumbWidth + settings.galleryMargin) + 'px');
                        }
                        $cSouter.find('.lSPager').css(property, pagerWidth + 'px');
                    }
                    var $pager = $cSouter.find('.lSPager').find('li');
                    $pager.first().addClass('active');
                    $pager.on('click', function () {
                        if (settings.loop === true && settings.mode === 'slide') {
                            scene = scene + ($pager.index(this) - $cSouter.find('.lSPager').find('li.active').index());
                        } else {
                            scene = $pager.index(this);
                        }
                        $el.mode(false);
                        if (settings.gallery === true) {
                            $this.slideThumb();
                        }
                        return false;
                    });
                };
                if (settings.pager) {
                    var cl = 'lSpg';
                    if (settings.gallery) {
                        cl = 'lSGallery';
                    }
                    $slide.after('<ul class="lSPager ' + cl + '"></ul>');
                    var gMargin = (settings.vertical) ? 'margin-left' : 'margin-top';
                    $slide.parent().find('.lSPager').css(gMargin, settings.galleryMargin + 'px');
                    refresh.createPager();
                }

                setTimeout(function () {
                    refresh.init();
                }, 0);
            },
            setHeight: function (ob, fade) {
                var obj = null,
                    $this = this;
                if (settings.loop) {
                    obj = ob.children('.lslide ').first();
                } else {
                    obj = ob.children().first();
                }
                var setCss = function () {
                    var tH = obj.outerHeight(),
                        tP = 0,
                        tHT = tH;
                    if (fade) {
                        tH = 0;
                        tP = ((tHT) * 100) / elSize;
                    }
                    ob.css({
                        'height': tH + 'px',
                        'padding-bottom': tP + '%'
                    });
                };
                setCss();
                if (obj.find('img').length) {
                    if ( obj.find('img')[0].complete) {
                        setCss();
                        if (!interval) {
                            $this.auto();
                        }   
                    }else{
                        obj.find('img').on('load', function () {
                            setTimeout(function () {
                                setCss();
                                if (!interval) {
                                    $this.auto();
                                }
                            }, 100);
                        });
                    }
                }else{
                    if (!interval) {
                        $this.auto();
                    }
                }
            },
            active: function (ob, t) {
                if (this.doCss() && settings.mode === 'fade') {
                    $slide.addClass('on');
                }
                var sc = 0;
                if (scene * settings.slideMove < length) {
                    ob.removeClass('active');
                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.fadeOut(settings.speed);
                    }
                    if (t === true) {
                        sc = scene;
                    } else {
                        sc = scene * settings.slideMove;
                    }
                    //t === true ? sc = scene : sc = scene * settings.slideMove;
                    var l, nl;
                    if (t === true) {
                        l = ob.length;
                        nl = l - 1;
                        if (sc + 1 >= l) {
                            sc = nl;
                        }
                    }
                    if (settings.loop === true && settings.mode === 'slide') {
                        //t === true ? sc = scene - $el.find('.clone.left').length : sc = scene * settings.slideMove;
                        if (t === true) {
                            sc = scene - $el.find('.clone.left').length;
                        } else {
                            sc = scene * settings.slideMove;
                        }
                        if (t === true) {
                            l = ob.length;
                            nl = l - 1;
                            if (sc + 1 === l) {
                                sc = nl;
                            } else if (sc + 1 > l) {
                                sc = 0;
                            }
                        }
                    }

                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                    ob.eq(sc).addClass('active');
                } else {
                    ob.removeClass('active');
                    ob.eq(ob.length - 1).addClass('active');
                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.fadeOut(settings.speed);
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                }
            },
            move: function (ob, v) {
                if (settings.rtl === true) {
                    v = -v;
                }
                if (this.doCss()) {
                    if (settings.vertical === true) {
                        ob.css({
                            'transform': 'translate3d(0px, ' + (-v) + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + (-v) + 'px, 0px)'
                        });
                    } else {
                        ob.css({
                            'transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                            '-webkit-transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                        });
                    }
                } else {
                    if (settings.vertical === true) {
                        ob.css('position', 'relative').animate({
                            top: -v + 'px'
                        }, settings.speed, settings.easing);
                    } else {
                        ob.css('position', 'relative').animate({
                            left: -v + 'px'
                        }, settings.speed, settings.easing);
                    }
                }
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            fade: function () {
                this.active($children, false);
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            slide: function () {
                var $this = this;
                refresh.calSlide = function () {
                    if (w > elSize) {
                        slideValue = $this.slideValue();
                        $this.active($children, false);
                        if ((slideValue) > w - elSize - settings.slideMargin) {
                            slideValue = w - elSize - settings.slideMargin;
                        } else if (slideValue < 0) {
                            slideValue = 0;
                        }
                        $this.move($el, slideValue);
                        if (settings.loop === true && settings.mode === 'slide') {
                            if (scene >= (length - ($el.find('.clone.left').length / settings.slideMove))) {
                                $this.resetSlide($el.find('.clone.left').length);
                            }
                            if (scene === 0) {
                                $this.resetSlide($slide.find('.lslide').length);
                            }
                        }
                    }
                };
                refresh.calSlide();
            },
            resetSlide: function (s) {
                var $this = this;
                $slide.find('.lSAction a').addClass('disabled');
                setTimeout(function () {
                    scene = s;
                    $slide.css('transition-duration', '0ms');
                    slideValue = $this.slideValue();
                    $this.active($children, false);
                    plugin.move($el, slideValue);
                    setTimeout(function () {
                        $slide.css('transition-duration', settings.speed + 'ms');
                        $slide.find('.lSAction a').removeClass('disabled');
                    }, 50);
                }, settings.speed + 100);
            },
            slideValue: function () {
                var _sV = 0;
                if (settings.autoWidth === false) {
                    _sV = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
                } else {
                    _sV = 0;
                    for (var i = 0; i < scene; i++) {
                        _sV += (parseInt($children.eq(i).width()) + settings.slideMargin);
                    }
                }
                return _sV;
            },
            slideThumb: function () {
                var position;
                switch (settings.currentPagerPosition) {
                case 'left':
                    position = 0;
                    break;
                case 'middle':
                    position = (elSize / 2) - (thumbWidth / 2);
                    break;
                case 'right':
                    position = elSize - thumbWidth;
                }
                var sc = scene - $el.find('.clone.left').length;
                var $pager = $slide.parent().find('.lSPager');
                if (settings.mode === 'slide' && settings.loop === true) {
                    if (sc >= $pager.children().length) {
                        sc = 0;
                    } else if (sc < 0) {
                        sc = $pager.children().length;
                    }
                }
                var thumbSlide = sc * ((thumbWidth + settings.thumbMargin)) - (position);
                if ((thumbSlide + elSize) > pagerWidth) {
                    thumbSlide = pagerWidth - elSize - settings.thumbMargin;
                }
                if (thumbSlide < 0) {
                    thumbSlide = 0;
                }
                this.move($pager, thumbSlide);
            },
            auto: function () {
                if (settings.auto) {
                    clearInterval(interval);
                    interval = setInterval(function () {
                        $el.goToNextSlide();
                    }, settings.pause);
                }
            },
            pauseOnHover: function(){
                var $this = this;
                if (settings.auto && settings.pauseOnHover) {
                    $slide.on('mouseenter', function(){
                        $(this).addClass('ls-hover');
                        $el.pause();
                        settings.auto = true;
                    });
                    $slide.on('mouseleave',function(){
                        $(this).removeClass('ls-hover');
                        if (!$slide.find('.lightSlider').hasClass('lsGrabbing')) {
                            $this.auto();
                        }
                    });
                }
            },
            touchMove: function (endCoords, startCoords) {
                $slide.css('transition-duration', '0ms');
                if (settings.mode === 'slide') {
                    var distance = endCoords - startCoords;
                    var swipeVal = slideValue - distance;
                    if ((swipeVal) >= w - elSize - settings.slideMargin) {
                        if (settings.freeMove === false) {
                            swipeVal = w - elSize - settings.slideMargin;
                        } else {
                            var swipeValT = w - elSize - settings.slideMargin;
                            swipeVal = swipeValT + ((swipeVal - swipeValT) / 5);

                        }
                    } else if (swipeVal < 0) {
                        if (settings.freeMove === false) {
                            swipeVal = 0;
                        } else {
                            swipeVal = swipeVal / 5;
                        }
                    }
                    this.move($el, swipeVal);
                }
            },

            touchEnd: function (distance) {
                $slide.css('transition-duration', settings.speed + 'ms');
                if (settings.mode === 'slide') {
                    var mxVal = false;
                    var _next = true;
                    slideValue = slideValue - distance;
                    if ((slideValue) > w - elSize - settings.slideMargin) {
                        slideValue = w - elSize - settings.slideMargin;
                        if (settings.autoWidth === false) {
                            mxVal = true;
                        }
                    } else if (slideValue < 0) {
                        slideValue = 0;
                    }
                    var gC = function (next) {
                        var ad = 0;
                        if (!mxVal) {
                            if (next) {
                                ad = 1;
                            }
                        }
                        if (!settings.autoWidth) {
                            var num = slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove);
                            scene = parseInt(num) + ad;
                            if (slideValue >= (w - elSize - settings.slideMargin)) {
                                if (num % 1 !== 0) {
                                    scene++;
                                }
                            }
                        } else {
                            var tW = 0;
                            for (var i = 0; i < $children.length; i++) {
                                tW += (parseInt($children.eq(i).width()) + settings.slideMargin);
                                scene = i + ad;
                                if (tW >= slideValue) {
                                    break;
                                }
                            }
                        }
                    };
                    if (distance >= settings.swipeThreshold) {
                        gC(false);
                        _next = false;
                    } else if (distance <= -settings.swipeThreshold) {
                        gC(true);
                        _next = false;
                    }
                    $el.mode(_next);
                    this.slideThumb();
                } else {
                    if (distance >= settings.swipeThreshold) {
                        $el.goToPrevSlide();
                    } else if (distance <= -settings.swipeThreshold) {
                        $el.goToNextSlide();
                    }
                }
            },



            enableDrag: function () {
                var $this = this;
                if (!isTouch) {
                    var startCoords = 0,
                        endCoords = 0,
                        isDraging = false;
                    $slide.find('.lightSlider').addClass('lsGrab');
                    $slide.on('mousedown', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        if ($(e.target).attr('class') !== ('lSPrev fa fa-chevron-left') && $(e.target).attr('class') !== ('lSNext fa fa-chevron-right')) {
                            startCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            isDraging = true;
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            $slide.scrollLeft += 1;
                            $slide.scrollLeft -= 1;
                            // *
                            $slide.find('.lightSlider').removeClass('lsGrab').addClass('lsGrabbing');
                            clearInterval(interval);
                        }
                    });
                    $(window).on('mousemove', function (e) {
                        if (isDraging) {
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            $this.touchMove(endCoords, startCoords);
                        }
                    });
                    $(window).on('mouseup', function (e) {
                        if (isDraging) {
                            $slide.find('.lightSlider').removeClass('lsGrabbing').addClass('lsGrab');
                            isDraging = false;
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            var distance = endCoords - startCoords;
                            if (Math.abs(distance) >= settings.swipeThreshold) {
                                $(window).on('click.ls', function (e) {
                                    if (e.preventDefault) {
                                        e.preventDefault();
                                    } else {
                                        e.returnValue = false;
                                    }
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();
                                    $(window).off('click.ls');
                                });
                            }

                            $this.touchEnd(distance);

                        }
                    });
                }
            },




            enableTouch: function () {
                var $this = this;
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $slide.on('touchstart', function (e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                        clearInterval(interval);
                    });
                    $slide.on('touchmove', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        var xMovement = Math.abs(endCoords.pageX - startCoords.pageX);
                        var yMovement = Math.abs(endCoords.pageY - startCoords.pageY);
                        if (settings.vertical === true) {
                            if ((yMovement * 3) > xMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageY, startCoords.pageY);
                        } else {
                            if ((xMovement * 3) > yMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageX, startCoords.pageX);
                        }

                    });
                    $slide.on('touchend', function () {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        var distance;
                        if (settings.vertical === true) {
                            distance = endCoords.pageY - startCoords.pageY;
                        } else {
                            distance = endCoords.pageX - startCoords.pageX;
                        }
                        $this.touchEnd(distance);
                    });
                }
            },
            build: function () {
                var $this = this;
                $this.initialStyle();
                if (this.doCss()) {

                    if (settings.enableTouch === true) {
                        $this.enableTouch();
                    }
                    if (settings.enableDrag === true) {
                        $this.enableDrag();
                    }
                }

                $(window).on('focus', function(){
                    $this.auto();
                });
                
                $(window).on('blur', function(){
                    clearInterval(interval);
                });

                $this.pager();
                $this.pauseOnHover();
                $this.controls();
                $this.keyPress();
            }
        };
        plugin.build();
        refresh.init = function () {
            refresh.chbreakpoint();
            if (settings.vertical === true) {
                if (settings.item > 1) {
                    elSize = settings.verticalHeight;
                } else {
                    elSize = $children.outerHeight();
                }
                $slide.css('height', elSize + 'px');
            } else {
                elSize = $slide.outerWidth();
            }
            if (settings.loop === true && settings.mode === 'slide') {
                refresh.clone();
            }
            refresh.calL();
            if (settings.mode === 'slide') {
                $el.removeClass('lSSlide');
            }
            if (settings.mode === 'slide') {
                refresh.calSW();
                refresh.sSW();
            }
            setTimeout(function () {
                if (settings.mode === 'slide') {
                    $el.addClass('lSSlide');
                }
            }, 1000);
            if (settings.pager) {
                refresh.createPager();
            }
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).outerHeight(true));
            }
            if (settings.adaptiveHeight === false) {
                if (settings.mode === 'slide') {
                    if (settings.vertical === false) {
                        plugin.setHeight($el, false);
                    }else{
                        plugin.auto();
                    }
                } else {
                    plugin.setHeight($el, true);
                }
            }
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
            if (settings.mode === 'slide') {
                plugin.slide();
            }
            if (settings.autoWidth === false) {
                if ($children.length <= settings.item) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            } else {
                if ((refresh.calWidth(false) < elSize) && (w !== 0)) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            }
        };
        $el.goToPrevSlide = function () {
            if (scene > 0) {
                settings.onBeforePrevSlide.call(this, $el, scene);
                scene--;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforePrevSlide.call(this, $el, scene);
                    if (settings.mode === 'fade') {
                        var l = (length - 1);
                        scene = parseInt(l / settings.slideMove);
                    }
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimation === true) {
                    $el.addClass('leftEnd');
                    setTimeout(function () {
                        $el.removeClass('leftEnd');
                    }, 400);
                }
            }
        };
        $el.goToNextSlide = function () {
            var nextI = true;
            if (settings.mode === 'slide') {
                var _slideValue = plugin.slideValue();
                nextI = _slideValue < w - elSize - settings.slideMargin;
            }
            if (((scene * settings.slideMove) < length - settings.slideMove) && nextI) {
                settings.onBeforeNextSlide.call(this, $el, scene);
                scene++;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforeNextSlide.call(this, $el, scene);
                    scene = 0;
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimation === true) {
                    $el.addClass('rightEnd');
                    setTimeout(function () {
                        $el.removeClass('rightEnd');
                    }, 400);
                }
            }
        };
        $el.mode = function (_touch) {
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).outerHeight(true));
            }
            if (on === false) {
                if (settings.mode === 'slide') {
                    if (plugin.doCss()) {
                        $el.addClass('lSSlide');
                        if (settings.speed !== '') {
                            $slide.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $slide.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                } else {
                    if (plugin.doCss()) {
                        if (settings.speed !== '') {
                            $el.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $el.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                }
            }
            if (!_touch) {
                settings.onBeforeSlide.call(this, $el, scene);
            }
            if (settings.mode === 'slide') {
                plugin.slide();
            } else {
                plugin.fade();
            }
            if (!$slide.hasClass('ls-hover')) {
                plugin.auto();
            }
            setTimeout(function () {
                if (!_touch) {
                    settings.onAfterSlide.call(this, $el, scene);
                }
            }, settings.speed);
            on = true;
        };
        $el.play = function () {
            $el.goToNextSlide();
            settings.auto = true;
            plugin.auto();
        };
        $el.pause = function () {
            settings.auto = false;
            clearInterval(interval);
        };
        $el.refresh = function () {
            refresh.init();
        };
        $el.getCurrentSlideCount = function () {
            var sc = scene;
            if (settings.loop) {
                var ln = $slide.find('.lslide').length,
                    cl = $el.find('.clone.left').length;
                if (scene <= cl - 1) {
                    sc = ln + (scene - cl);
                } else if (scene >= (ln + cl)) {
                    sc = scene - ln - cl;
                } else {
                    sc = scene - cl;
                }
            }
            return sc + 1;
        }; 
        $el.getTotalSlideCount = function () {
            return $slide.find('.lslide').length;
        };
        $el.goToSlide = function (s) {
            if (settings.loop) {
                scene = (s + $el.find('.clone.left').length - 1);
            } else {
                scene = s;
            }
            $el.mode(false);
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
        };
        $el.destroy = function () {
            if ($el.lightSlider) {
                $el.goToPrevSlide = function(){};
                $el.goToNextSlide = function(){};
                $el.mode = function(){};
                $el.play = function(){};
                $el.pause = function(){};
                $el.refresh = function(){};
                $el.getCurrentSlideCount = function(){};
                $el.getTotalSlideCount = function(){};
                $el.goToSlide = function(){}; 
                $el.lightSlider = null;
                refresh = {
                    init : function(){}
                };
                $el.parent().parent().find('.lSAction, .lSPager').remove();
                $el.removeClass('lightSlider lSFade lSSlide lsGrab lsGrabbing leftEnd right').removeAttr('style').unwrap().unwrap();
                $el.children().removeAttr('style');
                $children.removeClass('lslide active');
                $el.find('.clone').remove();
                $children = null;
                interval = null;
                on = false;
                scene = 0;
            }

        };
        setTimeout(function () {
            settings.onSliderLoad.call(this, $el);
        }, 10);
        $(window).on('resize orientationchange', function (e) {
            setTimeout(function () {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                refresh.init();
            }, 200);
        });
        return this;
    };
}(jQuery));

