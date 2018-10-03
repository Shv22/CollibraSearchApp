package org.nbc.gateway.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.nbc.gateway.model.MemberReference;
import org.nbc.gateway.model.RelationList;
import org.nbc.gateway.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

@CrossOrigin
@RestController
public class SearchController {

	private static Logger logger = Logger.getLogger(SearchController.class);

	@Autowired
	private SearchService searchService;

	/*
	 * @RequestMapping(value = "/getCollibraUrl", method = RequestMethod.GET,
	 * headers = "Accept=application/text") public String getCollibraUrl() {
	 * return Config.getInstance().getConfig(Constants.COLLIBRA_DGC); }
	 */
	
	//private 

//	@RequestMapping(value="/setApplication", method=RequestMethod.GET headers = "Accept=application/json")
	//public void setApplication()
	@RequestMapping(value = "/getDomains", method = RequestMethod.GET, headers = "Accept=application/json")
	public JSONArray getDomains(
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "searchApi") String searchApi,
			@RequestParam(value = "domainId") String domainId,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {

		String domains = "";
		JSONArray domainList = null;
		try {
			domains = searchService.getDomainList(dgcRestUrl, searchApi,
					domainId, proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while fetching glossary domains");
			e.printStackTrace();
		}

		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(domains);
			domainList = (JSONArray) jsonObject.get("results");
			logger.debug("Glossary domain list (Json format) :"
					+ domainList.toJSONString());
		} catch (ParseException e) {
			logger.error("Error while parsing glossary domain list");
			e.printStackTrace();
		}
		return domainList;
	}
	
	@RequestMapping(value = "/getLOBList", method = RequestMethod.GET, headers = "Accept=application/json")
	public JSONArray getLOBList(
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "searchApi") String searchApi,
			@RequestParam(value = "lobAssetTypeId") String lobAssetTypeId,
			@RequestParam(value = "businessDimentionsDomainId") String businessDimentionsDomainId,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {

		String domains = "";
		JSONArray lobList = null;
		try {
			domains = searchService.getLOBList(dgcRestUrl, searchApi,lobAssetTypeId,
					businessDimentionsDomainId, proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while fetching glossary domains");
			e.printStackTrace();
		}

		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(domains);
			lobList = (JSONArray) jsonObject.get("results");
			logger.debug("Glossary domain list (Json format) :"
					+ lobList.toJSONString());
		} catch (ParseException e) {
			logger.error("Error while parsing glossary domain list");
			e.printStackTrace();
		}
		return lobList;
	}
	
	@RequestMapping(value = "/getBusinessSegments", method = RequestMethod.GET, headers = "Accept=application/json")
	public JSONArray getBusinessSegments(
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "searchApi") String searchApi,
			@RequestParam(value = "businessSegmentAssetTypeId") String businessSegmentAssetTypeId,
			@RequestParam(value = "businessDimentionsDomainId") String businessDimentionsDomainId,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {

		String domains = "";
		JSONArray businessSegmentList = null;
		try {
			domains = searchService.getBusinessSegmentList(dgcRestUrl, searchApi,businessSegmentAssetTypeId,
					businessDimentionsDomainId, proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while fetching glossary domains");
			e.printStackTrace();
		}

		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(domains);
			businessSegmentList = (JSONArray) jsonObject.get("results");
			logger.debug("Glossary domain list (Json format) :"
					+ businessSegmentList.toJSONString());
		} catch (ParseException e) {
			logger.error("Error while parsing glossary domain list");
			e.printStackTrace();
		}
		return businessSegmentList;
	}

	@RequestMapping(value = "/getSearchResultsNew", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<?> getSearchResultsNew(
			@RequestParam(value = "searchTerm") String searchTerm,
			@RequestParam(value = "pageSize") int pageSize,
			@RequestParam(value = "currentPage") int currentPage,
			@RequestParam(value = "domainFilter") String domainFilter,
			@RequestParam(value = "statusFilter") String statusFilter,
			@RequestParam(value = "userName") String userName,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "dgcUrl") String dgcUrl,
			@RequestParam(value = "searchApi") String searchApi,
			@RequestParam(value = "domainId") String domainId,
			@RequestParam(value = "termId") String termId,
			@RequestParam(value = "searchCategory") String searchCategory,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword,
			@RequestParam(value = "searchType") String searchType) {
		List<Object> searchListArray = new ArrayList<Object>();
		String searchList = "";
		String size = "";
		JSONArray msg = null;
		try {
			searchList = searchService.getSearchResultsNew(searchTerm,
					pageSize, currentPage, domainFilter, statusFilter,
					userName, dgcRestUrl, dgcUrl, searchApi, domainId, termId,
					searchCategory, proxyUrl, proxyPort, apiUser,
					apiUserPassword, searchType);
		} catch (Exception e) {
			logger.error("Error while fetching searched terms during filtering process for the term :"
					+ searchTerm);
			e.printStackTrace();
		}

		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(searchList);
			size = jsonObject.get("total").toString();
			searchListArray.add(size);
			msg = (JSONArray) jsonObject.get("results");
			searchListArray.add(msg);
			logger.info("Search result during filtering (JSON format):"
					+ msg.toJSONString());
		} catch (ParseException e) {
			logger.error("Error while parsing searched terms during filtering process for the term :"
					+ searchTerm);
			e.printStackTrace();
		}
		return searchListArray;
	}
	
	@RequestMapping(value = "/getRelationsByTarget", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<?> getRelationsByTarget(
			@RequestParam(value = "targetId") String targetId,
			@RequestParam(value = "sourceId") String sourceId,
			@RequestParam(value = "dgcRestUrlLatest") String dgcRestUrlLatest,
			@RequestParam(value = "relationApi") String relationApi,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		String relationList = null;
		JSONArray msg = null;
		String size = "";
		List<Object> searchListArray = new ArrayList<Object>();
		try {
			relationList = searchService.getRelationsByTarget(targetId, sourceId, dgcRestUrlLatest, relationApi,
					proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while getting relations  by target for the term :"
					+ targetId);
			e.printStackTrace();
		}
		
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(relationList);
			size = jsonObject.get("total").toString();
			searchListArray.add(size);
			msg = (JSONArray) jsonObject.get("results");
			searchListArray.add(msg);
			logger.info("Search result during filtering (JSON format):"
					+ msg.toJSONString());
		} catch (ParseException e) {
			logger.error("Error while parsing searched terms during filtering process for the term :"
					+ targetId);
			e.printStackTrace();
		}
			
		return searchListArray;
	}
	
	@RequestMapping(value = "/getBusinessSteward", method = RequestMethod.GET, headers = "Accept=application/json")
	public String getBusinessSteward(
			@RequestParam(value = "targetId") String targetId,
			@RequestParam(value = "dgcRestUrlLatest") String dgcRestUrlLatest,
			@RequestParam(value = "responsibilityApi") String responsibilityApi,
			@RequestParam(value = "roleIds") String roleIds,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) throws ParseException {
		String relationList = null;
		JSONArray msg = null;
		JSONObject steward = null;
		String userInfo = null;
		try {
			relationList = searchService.getBusinessSteward(targetId, dgcRestUrlLatest, responsibilityApi, roleIds,
					proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while getting getBusinessSteward for the term :"
					+ targetId);
		}
		
		JSONParser parser = new JSONParser();

		JSONObject jsonObject = (JSONObject) parser.parse(relationList);
		msg = (JSONArray) jsonObject.get("results");
		if(!msg.isEmpty()){
			steward = (JSONObject) msg.get(0);
			JSONObject owner = (JSONObject) steward.get("owner");
			
			if(owner != null){
				String ownerId = (String) owner.get("id");
				
				try {
					userInfo = searchService.getUsers(dgcRestUrlLatest, "/users/", ownerId,
							proxyUrl, proxyPort, apiUser, apiUserPassword);
				} catch (Exception e) {
					logger.error("Error while getting getBusinessSteward  by target for the term :"
							+ targetId);
				}
			}
		}
		
		return userInfo;
	}	
	
	@RequestMapping(value = "/getSearchResults", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<?> getSearchResults(
			@RequestParam(value = "term") String searchTerm,
			@RequestParam(value = "showSearch") String showSearch,
			@RequestParam(value = "pageSize") String pageSize,
			@RequestParam(value = "userName") String userName,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "dgcUrl") String dgcUrl,
			@RequestParam(value = "searchApi") String searchApi,
			@RequestParam(value = "domainId") String domainId,
			@RequestParam(value = "termId") String termId,
			@RequestParam(value = "searchCategory") String searchCategory,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		List<Object> searchListArray = new ArrayList<Object>();
		String searchList = "";
		String size = "";
		JSONArray msg = null;
		logger.info("User is:" + userName);
		try {
			if (!searchTerm.equals("") || !searchTerm.isEmpty()) {
				searchList = searchService.getSearchResult(searchTerm,
						pageSize, userName, dgcRestUrl, dgcUrl, searchApi,
						domainId, termId, searchCategory, proxyUrl, proxyPort,
						apiUser, apiUserPassword);
			}
		} catch (Exception e) {
			logger.error("Error while searching Business terms with searchterm:"
					+ searchTerm);
			e.printStackTrace();
		}

		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(searchList);
			size = jsonObject.get("total").toString();
			searchListArray.add(size);
			msg = (JSONArray) jsonObject.get("results");
			searchListArray.add(msg);
			logger.info("Search result (JSON format):" + msg.toJSONString());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			logger.error("Error while parsing the searched results for the searchterm:"
					+ searchTerm);
			e.printStackTrace();
		}
		return searchListArray;
	}

	@RequestMapping(value = "/getSearchResultsByFilter", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<?> getSearchResultsByFilter(
			@RequestParam(value = "searchTerm") String searchTerm,
			@RequestParam(value = "domainFilter") String domainFilter,
			@RequestParam(value = "statusFilter") String statusFilter,
			@RequestParam(value = "pageSize") String pageSize,
			@RequestParam(value = "userName") String userName,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "dgcUrl") String dgcUrl,
			@RequestParam(value = "searchApi") String searchApi,
			@RequestParam(value = "domainId") String domainId,
			@RequestParam(value = "termId") String termId,
			@RequestParam(value = "searchCategory") String searchCategory,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		List<Object> searchListArray = new ArrayList<Object>();
		String searchList = "";
		String size = "";
		JSONArray msg = null;
		try {
			searchList = searchService.getSearchResultByFilter(searchTerm,
					domainFilter, statusFilter, pageSize, userName, dgcRestUrl,
					dgcUrl, searchApi, domainId, termId, searchCategory,
					proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while fetching searched terms during filtering process for the term :"
					+ searchTerm);
			e.printStackTrace();
		}

		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(searchList);
			size = jsonObject.get("total").toString();
			searchListArray.add(size);
			msg = (JSONArray) jsonObject.get("results");
			searchListArray.add(msg);
			logger.info("Search result during filtering (JSON format):"
					+ msg.toJSONString());
		} catch (ParseException e) {
			logger.error("Error while parsing searched terms during filtering process for the term :"
					+ searchTerm);
			e.printStackTrace();
		}
		return searchListArray;
	}

	@RequestMapping(value = "/getSearchResultsByPagination", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<?> getSearchResultsByPagination(
			@RequestParam(value = "searchTerm") String searchTerm,
			@RequestParam(value = "currentPage") int currentPage,
			@RequestParam(value = "pageSize") int pageSize,
			@RequestParam(value = "domainFilter") String domainFilter,
			@RequestParam(value = "statusFilter") String statusFilter,
			@RequestParam(value = "userName") String userName,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "dgcUrl") String dgcUrl,
			@RequestParam(value = "searchApi") String searchApi,
			@RequestParam(value = "domainId") String domainId,
			@RequestParam(value = "termId") String termId,
			@RequestParam(value = "searchCategory") String searchCategory,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		List<Object> searchListArray = new ArrayList<Object>();
		String searchList = "";
		String size = "";

		JSONArray msg = null;
		try {
			searchList = searchService.getSearchResultByPagination(searchTerm,
					currentPage, pageSize, domainFilter, statusFilter,
					userName, dgcRestUrl, dgcUrl, searchApi, domainId, termId,
					searchCategory, proxyUrl, proxyPort, apiUser,
					apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while fetching searched terms during pagination process  for the term :"
					+ searchTerm);
			e.printStackTrace();
		}

		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(searchList);
			size = jsonObject.get("total").toString();
			searchListArray.add(size);
			msg = (JSONArray) jsonObject.get("results");
			searchListArray.add(msg);
			logger.info("Search result during pagination (JSON format):"
					+ msg.toJSONString());
		} catch (ParseException e) {
			logger.error("Error while parsing searched terms during pagination process  for the term :"
					+ searchTerm);
			e.printStackTrace();
		}
		return searchListArray;
	}

	@RequestMapping(value = "/relations", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<RelationList> getRelations(
			@RequestParam(value = "term") String term,
			@RequestParam(value = "index") String index,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		List<RelationList> relationList = new ArrayList<RelationList>();
		try {
			relationList = searchService.getRelatedTerms(term, dgcRestUrl,
					proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while getting related terms for the term :"
					+ term);
			e.printStackTrace();
		}
		return relationList;
	}

	@RequestMapping(value = "/roles", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<MemberReference> getRoles(
			@RequestParam(value = "term") String term,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		List<MemberReference> memberList = new ArrayList<MemberReference>();
		try {
			memberList = searchService.getMembers(term, dgcRestUrl, proxyUrl,
					proxyPort, apiUser, apiUserPassword);
			logger.info("Successfully fetched members for the term :" + term);
		} catch (Exception e) {
			logger.error("Error while getting memberlist for the term :" + term);
			e.printStackTrace();
		}
		return memberList;
	}

	@RequestMapping(value = "/commentList", method = RequestMethod.GET, headers = "Accept=application/json")
	public JSONArray getCommentList(@RequestParam(value = "term") String term,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "commentsApi1") String commentsApi1,
			@RequestParam(value = "commentsApi2") String commentsApi2) {
		String commentsList = "";
		try {
			commentsList = searchService.getCommentList(term, proxyUrl,
					proxyPort, apiUser, apiUserPassword, dgcRestUrl,
					commentsApi1, commentsApi2);
		} catch (Exception e) {
			logger.error("Error while fetching commentslist for the term :"
					+ term);
			e.printStackTrace();
		}
		JSONArray commentsData = null;
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(commentsList);
			commentsData = (JSONArray) jsonObject.get("comment");
			logger.info("comments info (Json format):"
					+ commentsData.toJSONString());
		} catch (ParseException e) {
			logger.error("Error while parsing commentslist for the term :"
					+ term);
			e.printStackTrace();
		}
		return commentsData;
	}

	@RequestMapping(value = "/proposeTerm", method = RequestMethod.GET, headers = "Accept=application/json")
	public String proposeTerm(
			@RequestParam(value = "conceptType") String conceptType,
			@RequestParam(value = "vocubulary") String vocubulary,
			@RequestParam(value = "signifier") String signifier,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "termApi") String termApi) {
		String createTermResult = "";
		try {
			createTermResult = searchService.proposeTerm(conceptType,
					vocubulary, signifier, proxyUrl, proxyPort, dgcRestUrl,
					termApi);
			logger.info("Created new term successfully: more information:"
					+ createTermResult);
		} catch (Exception e) {
			logger.error("Error while creating the business asset : more information:");
			e.printStackTrace();
		}
		return createTermResult;
	}

	@RequestMapping(value = "/updateAttribute", method = RequestMethod.GET, headers = "Accept=application/json")
	public String updateAttribute(
			@RequestParam(value = "termId") String termId,
			@RequestParam(value = "attributeId") String attributeId,
			@RequestParam(value = "attributeVal") String attributeVal,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "commentsApi1") String commentsApi1,
			@RequestParam(value = "attributesApi") String attributesApi) {
		String updateResult = "";
		try {
			updateResult = searchService.updateAttribute(termId, attributeId,
					attributeVal, proxyUrl, proxyPort, dgcRestUrl,
					commentsApi1, attributesApi);
			System.out.println("updateResult ::" + updateResult);
			logger.info("Updated the term's attribute (id:" + attributeId
					+ ") successfully with id:" + termId
					+ ": more information:" + updateResult);
		} catch (Exception e) {
			logger.error("Error while updating the term's attribute (id:"
					+ attributeId + ") : more information:");
			e.printStackTrace();
		}
		return updateResult;
	}

	@RequestMapping(value = "/updateAttributes", method = RequestMethod.POST, headers = "Accept=application/json")
	public String updateAttributes(
			@RequestParam(value = "termId") String termId,
			@RequestParam(value = "attributeId") String attributeId,
			@RequestParam(value = "attributeVal") String attributeVal,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl) {
		String updateResult = "";
		try {
			updateResult = searchService.updateAttributes(termId, attributeId,
					attributeVal, proxyUrl, proxyPort, dgcRestUrl);
			logger.info("Successfuly updated the term attributes for the term with id:"
					+ termId);
		} catch (Exception e) {
			logger.error(
					"Error during updation of  the term attributes for the term with id:"
							+ termId, e);
			e.printStackTrace();
		}
		return updateResult;
	}

	@RequestMapping(value = "/getAttributeValues", method = RequestMethod.GET, headers = "Accept=application/json")
	public String getAttributeValues(
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "attributeTypeApi") String attributeTypeApi,
			@RequestParam(value = "attributeTypeId") String attributeTypeId,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		String apiResult = "";
		try {
			apiResult = searchService.getAttributeValues(dgcRestUrl,
					attributeTypeApi, attributeTypeId, proxyUrl, proxyPort,
					apiUser, apiUserPassword);
			System.out.println("apiResult ::" + apiResult);
			logger.info("Successfully fetched the attribute type Details"+ apiResult);
		} catch (Exception e) {
			logger.error("Error while fetching the attribute type Details");
			e.printStackTrace();
		}
		return apiResult;
	}
	
	@RequestMapping(value = "/getAssignmentsValues", method = RequestMethod.GET, headers = "Accept=application/json")
	public String getAssignmentsValues(
			@RequestParam(value = "dgcRestUrlLatest") String dgcRestUrlLatest,
			@RequestParam(value = "assignmentValueApi") String assignmentValueApi,
			@RequestParam(value = "lobAssetTypeId") String lobAssetTypeId,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		String apiResult = "";
		try {
			apiResult = searchService.getAssignmentsValues(dgcRestUrlLatest,
					assignmentValueApi, lobAssetTypeId, proxyUrl, proxyPort,
					apiUser, apiUserPassword);
			System.out.println("apiResult for getAssignmentsValues::" + apiResult);
			logger.info("Successfully fetched the attribute type Details"+ apiResult);
		} catch (Exception e) {
			logger.error("Error while fetching the attribute type Details");
			e.printStackTrace();
		}
		return apiResult;
	}
	
	
	
	@RequestMapping(value = "/getRelationValues", method = RequestMethod.GET, headers = "Accept=application/json")
	public String getRelationValues(
			@RequestParam(value = "dgcRestUrlLatest") String dgcRestUrlLatest,
			@RequestParam(value = "assignmentValueApi") String assignmentValueApi,
			@RequestParam(value = "targetId") String targetId,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) {
		String apiResult = "";
		try {
			apiResult = searchService.getRelationValues(dgcRestUrlLatest,
					assignmentValueApi, targetId, proxyUrl, proxyPort,
					apiUser, apiUserPassword);
			System.out.println("apiResult for getAssignmentsValues::" + apiResult);
			logger.info("Successfully fetched the attribute type Details"+ apiResult);
		} catch (Exception e) {
			logger.error("Error while fetching the attribute type Details");
			e.printStackTrace();
		}
		return apiResult;
	}
	
	@RequestMapping(value = "/initiateWorkFlow", method = RequestMethod.GET, headers = "Accept=application/json")
	public String initiateWorkFlow(
			@RequestParam(value = "items") String items,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword,
			@RequestParam(value = "dgcRestUrl") String dgcRestUrl,
			@RequestParam(value = "workflowApi1") String workflowApi1,
			@RequestParam(value = "workflowApi2") String workflowApi2,
			@RequestParam(value = "simpleApprovalWorkflowId") String simpleApprovalWorkflowId) {
		String workflowResult = "";
		try {
			workflowResult = searchService.initiateWorkflow(items, proxyUrl,
					proxyPort, dgcRestUrl, workflowApi1, workflowApi2,
					simpleApprovalWorkflowId);
			logger.info("Successfuly initiated the Simple Approval workflow for the items:"
					+ items);
		} catch (Exception e) {
			logger.error("Error while initiating the Simple Approval workflow for the items:"
					+ items);
			e.printStackTrace();
		}
		return workflowResult;
	}
	
	@RequestMapping(value = "/getHomePageConfig", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<?> getHomePageConfig(
			@RequestParam(value = "typeId") String typeId,
			@RequestParam(value = "dgcRestUrlLatest") String dgcRestUrlLatest,
			@RequestParam(value = "relationApi") String relationApi,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword,
			@RequestParam(value = "dataList") List<String> dataList) throws JsonParseException, JsonMappingException, IOException {
		
		String relationList = null;
		JSONArray msg = null;
		String size = "";
		List<Object> searchListArray = new ArrayList<Object>();
		try {
			relationList = searchService.getHomeConfig(typeId, dgcRestUrlLatest, relationApi,
					proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while getting relations  by target for the term :"
					+ null);
			e.printStackTrace();
		}
		
		JSONParser parser = new JSONParser();
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(relationList);
			size = jsonObject.get("total").toString();
			searchListArray.add(size);
			msg = (JSONArray) jsonObject.get("results");
			
			JSONArray filteredData = searchService.filterHomeConfig(dataList, msg);;
			
			searchListArray.add(filteredData);
			logger.info("Search result during filtering (JSON format):"
					+ msg.toJSONString());
			
		} catch (ParseException e) {
			logger.error("Error while parsing searched terms during filtering process for the term :"
					+ null);
			e.printStackTrace();
		}
		
			
		return searchListArray;
	}
	
	@RequestMapping(value = "/filterHomeConfigData", method = RequestMethod.GET, headers = "Accept=application/json")
	public JSONArray filterHomeConfig(
			@RequestParam(value = "assetId") String assetId,
			@RequestParam(value = "dgcRestUrlLatest") String dgcRestUrlLatest,
			@RequestParam(value = "relationApi") String relationApi,
			@RequestParam(value = "proxyUrl") String proxyUrl,
			@RequestParam(value = "proxyPort") String proxyPort,
			@RequestParam(value = "apiUser") String apiUser,
			@RequestParam(value = "apiUserPassword") String apiUserPassword) throws JsonParseException, JsonMappingException, IOException {
		
		JSONArray relationList = null;
		try {
			relationList = searchService.getHomeConfigRelation(assetId, dgcRestUrlLatest, relationApi,
					proxyUrl, proxyPort, apiUser, apiUserPassword);
		} catch (Exception e) {
			logger.error("Error while getting relations  by target for the term :"
					+ null);
			e.printStackTrace();
		}
		
		return relationList;
	}
	
}
