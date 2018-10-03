package org.nbc.gateway.service;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpHost;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.nbc.gateway.model.Comments;
import org.nbc.gateway.model.MemberReference;
import org.nbc.gateway.model.Members;
import org.nbc.gateway.model.Relation;
import org.nbc.gateway.model.RelationList;
import org.nbc.gateway.model.Relations;
import org.nbc.gateway.model.Results;
import org.nbc.gateway.model.SearchResults;
import org.nbc.gateway.utils.Constants;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class SearchService {

	private static Logger logger = Logger.getLogger(SearchService.class);
	private static String EMPTY_QUERY = Constants.EMPTY_QUERY;

	/* This function returns ResponseEntity */
	public ResponseEntity<String> getRestResponse(String restUrl, HttpMethod method, String query, String proxyUrl,
			String proxyPort, String apiUser, String apiUserPassword) throws Exception {
		HttpEntity<String> request = getRequestObject(query, apiUser, apiUserPassword);
		RestTemplate restTemplate = createRestTemplate(proxyUrl, proxyPort);
		ResponseEntity<String> sourceRelationsResponse = null;
		sourceRelationsResponse = restTemplate.exchange(restUrl, method, request, String.class);
		return sourceRelationsResponse;
	}

	public List<RelationList> getRelatedTerms(String termId, String dgcRestUrl, String proxyUrl, String proxyPort,
			String apiUser, String apiUserPassword) throws Exception {
		ResponseEntity<String> sourceRelationsResponse = null;
		ResponseEntity<String> targetRelationsResponse = null;

		String sourceRelationsUrl = dgcRestUrl + "/role/" + termId + "/source_relations";
		String targetRelationsUrl = dgcRestUrl + "/role/" + termId + "/target_relations";
		List<RelationList> allRelations = new ArrayList<RelationList>();

		sourceRelationsResponse = getRestResponse(sourceRelationsUrl, HttpMethod.GET, EMPTY_QUERY, proxyUrl, proxyPort,
				apiUser, apiUserPassword);
		Relations sourceRelations = getRelationListPojo(sourceRelationsResponse.getBody());

		if (null != sourceRelations.getRelation()) {
			for (Relation relation : sourceRelations.getRelation()) {
				RelationList sourceRelationList = new RelationList();
				sourceRelationList.setRole(relation.getTypeReference().getRole());
				sourceRelationList.setReourceId(relation.getTargetReference().getResourceId());
				sourceRelationList.setSignifier(relation.getTargetReference().getSignifier());
				allRelations.add(sourceRelationList);
			}
		}

		targetRelationsResponse = getRestResponse(targetRelationsUrl, HttpMethod.GET, EMPTY_QUERY, proxyUrl, proxyPort,
				apiUser, apiUserPassword);
		Relations targetRelations = getRelationListPojo(targetRelationsResponse.getBody());

		if (null != targetRelations.getRelation()) {
			for (Relation relation : targetRelations.getRelation()) {
				RelationList targetRelationList = new RelationList();
				targetRelationList.setRole(relation.getTypeReference().getCoRole());
				targetRelationList.setReourceId(relation.getSourceReference().getResourceId());
				targetRelationList.setSignifier(relation.getSourceReference().getSignifier());
				allRelations.add(targetRelationList);
			}
		}
		return allRelations;
	}

	public List<MemberReference> getMembers(String termId, String dgcRestUrl, String proxyUrl, String proxyPort,
			String apiUser, String apiUserPassword) throws Exception {
		ResponseEntity<String> membersResponse = null;

		String membersUrl = dgcRestUrl + "/member/find/all?resource=" + termId;
		List<MemberReference> totalMembers = new ArrayList<MemberReference>();

		membersResponse = getRestResponse(membersUrl, HttpMethod.GET, EMPTY_QUERY, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		Members memberList = getMembersListPojo(membersResponse.getBody());

		if (null != memberList.getMemberReference()) {
			for (MemberReference member : memberList.getMemberReference()) {
				totalMembers.add(member);
			}
		}
		return totalMembers;
	}

	public RestTemplate createRestTemplate(String proxyUrl, String proxyPort) throws Exception {
		logger.info("The Proxy details set for this instance are Url:" + proxyUrl + " and Port:" + proxyPort);
		HttpClientBuilder clientBuilder = HttpClientBuilder.create();
		HttpHost myProxy = null;
		if (!((proxyUrl == "") || (proxyPort == ""))) {
			logger.info("Proxy details are considered");
			myProxy = new HttpHost(proxyUrl, Integer.parseInt(proxyPort));
			clientBuilder.setProxy(myProxy).disableCookieManagement();
		} else {
			logger.info("No Proxy details are configured");
			System.out.println("No Proxy details are configured");
		}

		HttpClient httpClient = clientBuilder.build();
		HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
		factory.setHttpClient(httpClient);
		RestTemplate template = new RestTemplate(factory);
		template.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
		return template;
	}

	public Results[] getPojo(String json) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		SearchResults staff;
		try {
			// Convert JSON string from file to Object
			staff = mapper.readValue(json, SearchResults.class);
			return staff.getResults();
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	public Relations getRelationListPojo(String json) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		Relations relation;
		try {
			// Convert JSON string from file to Object
			relation = mapper.readValue(json, Relations.class);
			return relation;
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	public Members getMembersListPojo(String json) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		Members members;
		try {
			// Convert JSON string from file to Object
			members = mapper.readValue(json, Members.class);
			return members;
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	public Comments getCommentsListPojo(String json) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		Comments comments;
		try {
			// Convert JSON string from file to Object
			comments = mapper.readValue(json, Comments.class);
			return comments;
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	public HttpEntity<String> getRequestObject(String query, String apiUser, String apiUserPassword) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String auth = apiUser + ":" + apiUserPassword;
		byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(Charset.forName("US-ASCII")));
		String authHeader = "Basic " + new String(encodedAuth);
		headers.add("Authorization", authHeader);
		if (query.equals("")) {
			return new HttpEntity<String>(headers);
		} else {
			return new HttpEntity<String>(query, headers);
		}
	}

	public HttpEntity<String> getRequestObject1(String apiUser, String apiUserPassword) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		String auth = apiUser + ":" + apiUserPassword;
		byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(Charset.forName("US-ASCII")));
		String authHeader = "Basic " + new String(encodedAuth);
		headers.add("Authorization", authHeader);
		return new HttpEntity<String>(headers);
	}

	public String getRestResponse1(String restUrl, HttpMethod method, HttpEntity<String> request, String conceptType,
			String vocubulary, String signifier, String proxyUrl, String proxyPort) throws Exception {
		RestTemplate restTemplate = createRestTemplate(proxyUrl, proxyPort);

		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.add("conceptType", conceptType);
		map.add("vocabulary", vocubulary);
		map.add("signifier", signifier);

		String id = restTemplate.postForObject(restUrl, map, String.class);
		return id;
	}

	public String proposeTerm(String conceptType, String vocubulary, String signifier, String proxyUrl,
			String proxyPort, String dgcRestUrl, String termApi) throws Exception {
		// DateTime expiration=new DateTime();

		String createTermUrl = dgcRestUrl + termApi;
		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		params.set("Accept", "application/json");
		params.set("Content-Type", "application/x-www-form-urlencoded");
		MultiValueMap<String, String> formData = new LinkedMultiValueMap<String, String>();
		formData.add("conceptType", conceptType);
		formData.add("vocabulary", vocubulary);
		formData.add("signifier", signifier);

		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		String auth = "nbc_api_user" + ":" + "nbc_api_user_1";
		byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(Charset.forName("US-ASCII")));
		String authHeader = "Basic " + new String(encodedAuth);
		requestHeaders.add("Authorization", authHeader);
		requestHeaders.set("Accept", "application/json");
		HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(
				formData, requestHeaders);
		RestTemplate restTemplate = createRestTemplate(proxyUrl, proxyPort);

		ResponseEntity<String> finalResponse = null;
		finalResponse = restTemplate.exchange(createTermUrl, HttpMethod.POST, requestEntity, String.class);
		return finalResponse.getBody();
	}

	public String updateAttribute(String termId, String attributeId, String attributeVal, String proxyUrl,
			String proxyPort, String dgcRestUrl, String commentsApi1, String attributesApi) throws Exception {
		// DateTime expiration=new DateTime();

		String updateAttributeUrl = dgcRestUrl + commentsApi1 + termId + attributesApi;
		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		params.set("Accept", "application/json");
		params.set("Content-Type", "application/x-www-form-urlencoded");
		MultiValueMap<String, String> formData = new LinkedMultiValueMap<String, String>();
		formData.add("label", attributeId);
		formData.add("value", attributeVal);

		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		String auth = "nbc_api_user" + ":" + "nbc_api_user_1";
		byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(Charset.forName("US-ASCII")));
		String authHeader = "Basic " + new String(encodedAuth);
		requestHeaders.add("Authorization", authHeader);
		requestHeaders.set("Accept", "application/json");
		HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(
				formData, requestHeaders);
		RestTemplate restTemplate = createRestTemplate(proxyUrl, proxyPort);

		ResponseEntity<String> finalResponse = null;
		finalResponse = restTemplate.exchange(updateAttributeUrl, HttpMethod.POST, requestEntity, String.class);
		return finalResponse.getBody();
	}

	public String updateAttributes(String termId, String attributeId, String attributeVal, String proxyUrl,
			String proxyPort, String dgcRestUrl) throws Exception {
		// DateTime expiration=new DateTime();

		String updateAttributeUrl = dgcRestUrl + "/attribute/" + attributeId;
		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		params.set("Accept", "application/json");
		params.set("Content-Type", "application/x-www-form-urlencoded");
		// params.set("value", attributeVal);
		MultiValueMap<String, String> formData = new LinkedMultiValueMap<String, String>();
		formData.add("value", attributeVal);

		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		String auth = "nbc_api_user" + ":" + "nbc_api_user_1";
		byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(Charset.forName("US-ASCII")));
		String authHeader = "Basic " + new String(encodedAuth);
		requestHeaders.add("Authorization", authHeader);
		requestHeaders.set("Accept", "application/json");
		HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(
				formData, requestHeaders);
		RestTemplate restTemplate = createRestTemplate(proxyUrl, proxyPort);

		ResponseEntity<String> finalResponse = null;
		finalResponse = restTemplate.exchange(updateAttributeUrl, HttpMethod.POST, requestEntity, String.class);
		return finalResponse.getBody();
	}

	public String getAttributeValues(String dgcRestUrl, String attributeTypeApi, String attributeTypeId,
			String proxyUrl, String proxyPort, String apiUser, String apiUserPassword) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String getAttributeTypeUrl = dgcRestUrl + attributeTypeApi + attributeTypeId;
		String getAttributeTypeResult = "";
		// String searchResult1 ="";
		ResponseEntity<String> response = null;
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(getAttributeTypeUrl, HttpMethod.GET, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("getAttributeTypeResult api response: " + getAttributeTypeResult);
		return response.getBody();
	}

	public String getAssignmentsValues(String dgcRestUrlLatest, String assignmentValueApi, String lobAssetTypeId,
			String proxyUrl, String proxyPort, String apiUser, String apiUserPassword) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String getAttributeTypeUrl = dgcRestUrlLatest + assignmentValueApi + lobAssetTypeId;
		String getAttributeTypeResult = "";
		// String searchResult1 ="";
		ResponseEntity<String> response = null;
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(getAttributeTypeUrl, HttpMethod.GET, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("getAssignmentsValues api response: " + getAttributeTypeResult);
		return response.getBody();
	}

	public String getRelationsByTarget(String targetId, String sourceId, String dgcRestUrlLatest, String relationApi,
			String proxyUrl, String proxyPort, String apiUser, String apiUserPassword) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String getAttributeTypeUrl = null;
		if (!StringUtils.isEmpty(targetId)) {
			getAttributeTypeUrl = dgcRestUrlLatest + relationApi
					+ "?limit=0&offset=0&sourceTargetLogicalOperator=AND&targetId=" + targetId;
		} else {
			getAttributeTypeUrl = dgcRestUrlLatest + relationApi + "?limit=0&offset=0&sourceId=" + sourceId
					+ "&sourceTargetLogicalOperator=AND";
		}

		ResponseEntity<String> response = null;
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(getAttributeTypeUrl, HttpMethod.GET, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("getRelationsByTarget api response: " + response.getBody() + " : termId: " + targetId);
		return response.getBody();
	}

	public String getBusinessSteward(String resourceIds, String dgcRestUrlLatest, String responsibilityApi,
			String roleIds, String proxyUrl, String proxyPort, String apiUser, String apiUserPassword)
			throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String getResponsibilityUrl = dgcRestUrlLatest + responsibilityApi
				+ "?includeInherited=true&limit=0&offset=0&resourceIds=" + resourceIds + "&roleIds=" + roleIds
				+ "&sortField=LAST_MODIFIED&sortOrder=DESC";
		// String searchResult1 ="";
		ResponseEntity<String> response = null;
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(getResponsibilityUrl, HttpMethod.GET, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("getResponsibilitiesById api response: " + response.getBody() + " : termId: " + resourceIds);
		return response.getBody();
	}

	public String getUsers(String dgcRestUrlLatest, String userApi, String userId, String proxyUrl, String proxyPort,
			String apiUser, String apiUserPassword) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String getResponsibilityUrl = dgcRestUrlLatest + userApi + userId;
		// String searchResult1 ="";
		ResponseEntity<String> response = null;
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(getResponsibilityUrl, HttpMethod.GET, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("getUsers api response: " + response.getBody() + " : userId: " + userId);
		return response.getBody();
	}

	public String getRelationValues(String dgcRestUrlLatest, String assignmentValueApi, String lobAssetTypeId,
			String proxyUrl, String proxyPort, String apiUser, String apiUserPassword) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String getAttributeTypeUrl = dgcRestUrlLatest + assignmentValueApi + lobAssetTypeId;
		String getAttributeTypeResult = "";
		// String searchResult1 ="";
		ResponseEntity<String> response = null;
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(getAttributeTypeUrl, HttpMethod.GET, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("getAssignmentsValues api response: " + getAttributeTypeResult);
		return response.getBody();
	}

	public String initiateWorkflow(String termId, String proxyUrl, String proxyPort, String dgcRestUrl,
			String workflowApi1, String workflowApi2, String simpleApprovalWorkflowId) throws Exception {

		String initiateWorkflowUrl = dgcRestUrl + workflowApi1 + simpleApprovalWorkflowId + workflowApi2;
		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		params.set("Accept", "application/json");
		params.set("Content-Type", "application/x-www-form-urlencoded");
		MultiValueMap<String, String> formData = new LinkedMultiValueMap<String, String>();
		formData.add("itemResourceType", "TE");
		formData.add("items", termId);

		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		String auth = "nbc_api_user" + ":" + "nbc_api_user_1";
		byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(Charset.forName("US-ASCII")));
		String authHeader = "Basic " + new String(encodedAuth);
		requestHeaders.add("Authorization", authHeader);
		requestHeaders.set("Accept", "application/json");
		HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(
				formData, requestHeaders);
		RestTemplate restTemplate = createRestTemplate(proxyUrl, proxyPort);

		ResponseEntity<String> finalResponse = null;
		finalResponse = restTemplate.exchange(initiateWorkflowUrl, HttpMethod.POST, requestEntity, String.class);
		return finalResponse.getBody();
	}

	public String getSearchResultsNew(String searchTerm, int pageSize, int currentPage, String domainFilter,
			String statusFilter, String userName, String dgcRestUrl, String dgcUrl, String searchApi, String domainId,
			String termId, String searchCategory, String proxyUrl, String proxyPort, String apiUser,
			String apiUserPassword, String searchType) throws Exception {

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String searchUrl = dgcRestUrl + searchApi;
		String searchResult = "";
		// String searchResult1 ="";
		ResponseEntity<String> response = null;

		if (searchType.equalsIgnoreCase("D")) {
			queryInput = "{\"query\": \"" + searchTerm + "*" + "\",\"filter\":{\"category\": [\"" + searchCategory
					+ "\"], \"type\": {\"asset\":[\"" + termId + "\"],\"domain\":[\"" + domainId
					+ "\"]}},\"fields\":[\"name\"],\"limit\":\"" + pageSize + "\",\"offset\":\"0\"}";
		} else {
			if (domainFilter.equalsIgnoreCase("NODOMAINS")) {
				domainFilter = "";
			}
			if (statusFilter.equalsIgnoreCase("NOSTATUSES")) {
				statusFilter = "";
			}
			if (searchType.equalsIgnoreCase("F")) {
				queryInput = "{\"query\": \"" + searchTerm + "*" + "\",\"filter\":{\"vocabulary\": [" + domainFilter
						+ "], \"category\": [\"TE\"], \"type\": {\"asset\":[\"" + termId + "\"],\"domain\":[\""
						+ domainId + "\"]},\"status\":[" + statusFilter + "]},\"fields\":[\"name\"],\"limit\":\""
						+ pageSize + "\",\"offset\":\"0\"}";
			} else if (searchType.equalsIgnoreCase("P")) {
				queryInput = "{\"query\": \"" + searchTerm + "*" + "\",\"filter\":{\"vocabulary\": [" + domainFilter
						+ "], \"category\": [\"TE\"], \"type\": {\"asset\":[\"" + termId + "\"],\"domain\":[\""
						+ domainId + "\"]},\"status\":[" + statusFilter + "]},\"fields\":[\"name\"],\"limit\":\""
						+ pageSize + "\",\"offset\":\"" + (pageSize * currentPage) + "\"}";
			}
		}
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(searchUrl, HttpMethod.POST, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("Search api response before replacing localhost: " + response.getBody());
		searchResult = response.getBody().replace("http://localhost:8080/", dgcUrl);
		logger.info("Search api response: " + searchResult);
		return searchResult;
	}

	public String getSearchResult(String searchTerm, String pageSize, String userName, String dgcRestUrl, String dgcUrl,
			String searchApi, String domainId, String termId, String searchCategory, String proxyUrl, String proxyPort,
			String apiUser, String apiUserPassword) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String searchUrl = dgcRestUrl + searchApi;
		String searchResult = "";
		// String searchResult1 ="";
		ResponseEntity<String> response = null;
		String queryInput = "{\"query\": \"" + searchTerm + "*" + "\",\"filter\":{\"category\": [\"" + searchCategory
				+ "\"], \"type\": {\"asset\":[\"" + termId + "\"],\"domain\":[\"" + domainId
				+ "\"]}},\"fields\":[\"name\"],\"limit\":\"" + pageSize + "\",\"offset\":\"0\"}";
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(searchUrl, HttpMethod.POST, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("Search api response before replacing localhost: " + response.getBody());
		searchResult = response.getBody().replace("http://localhost:8080/", dgcUrl);
		logger.info("Search api response: " + searchResult);
		return searchResult;
	}

	public String getSearchResultByFilter(String searchTerm, String domainFilter, String statusFilter, String pageSize,
			String userName, String dgcRestUrl, String dgcUrl, String searchApi, String domainId, String termId,
			String searchCategory, String proxyUrl, String proxyPort, String apiUser, String apiUserPassword)
			throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String searchUrl = dgcRestUrl + searchApi;
		String searchResult = "";
		ResponseEntity<String> response = null;

		if (domainFilter.equalsIgnoreCase("NODOMAINS")) {
			domainFilter = "";
		}
		if (statusFilter.equalsIgnoreCase("NOSTATUSES")) {
			statusFilter = "";
		}

		queryInput = "{\"query\": \"" + searchTerm + "*" + "\",\"filter\":{\"vocabulary\": [" + domainFilter
				+ "], \"category\": [\"TE\"], \"type\": {\"asset\":[\"" + termId + "\"],\"domain\":[\"" + domainId
				+ "\"]},\"status\":[" + statusFilter + "]},\"fields\":[\"name\"],\"limit\":\"" + pageSize
				+ "\",\"offset\":\"0\"}";

		logger.debug("query input for the Search API during filtering: " + queryInput);
		response = getRestResponse(searchUrl, HttpMethod.POST, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("Search api response before replacing localhost during filtering: " + response.getBody());
		searchResult = response.getBody().replace("http://localhost:8080/", dgcUrl);
		logger.info("Search api response during filtering: " + searchResult);
		return searchResult;
	}

	public String getSearchResultByPagination(String searchTerm, int currentPage, int pageSize, String domainFilter,
			String statusFilter, String userName, String dgcRestUrl, String dgcUrl, String searchApi, String domainId,
			String termId, String searchCategory, String proxyUrl, String proxyPort, String apiUser,
			String apiUserPassword) throws Exception {

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String searchUrl = dgcRestUrl + searchApi;
		String searchResult = "";
		if (domainFilter.equalsIgnoreCase("NODOMAINS")) {
			domainFilter = "";
		}
		if (statusFilter.equalsIgnoreCase("NOSTATUSES")) {
			statusFilter = "";
		}
		ResponseEntity<String> response = null;
		String queryInput = "{\"query\": \"" + searchTerm + "*" + "\",\"filter\":{\"vocabulary\": [" + domainFilter
				+ "], \"category\": [\"TE\"], \"type\": {\"asset\":[\"" + termId + "\"],\"domain\":[\"" + domainId
				+ "\"]},\"status\":[" + statusFilter + "]},\"fields\":[\"name\"],\"limit\":\"" + pageSize
				+ "\",\"offset\":\"" + (pageSize * currentPage) + "\"}";
		logger.debug("query input for the Search API during pagination: " + queryInput);
		response = getRestResponse(searchUrl, HttpMethod.POST, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("Search api response before replacing localhost during pagination: " + response.getBody());
		searchResult = response.getBody().replace("http://localhost:8080/", dgcUrl);
		logger.info("Search api response during pagination: " + searchResult);
		return searchResult;
	}

	/* Function to fetch all Business glossary domains from the environment */
	/*
	 * TODO: Update this method to get a parameter to distinguish what to query
	 * for . Ex: For Glossary:GLOSSARY_RESOURCE_ID and For Reports :
	 * REPORTS_RESOURCE_ID
	 */
	/* TODO : Change the name of this method to getFilterList */
	public String getDomainList(String dgcRestUrl, String searchApi, String domainId, String proxyUrl, String proxyPort,
			String apiUser, String apiUserPassword) throws Exception {
		String searchUrl = dgcRestUrl + searchApi;
		logger.debug("domain list api: " + searchUrl);
		/* TODO: Filter based on Glossary / Reports Id */
		String queryInput = "{\"query\": \"*\",\"filter\":{\"category\": [\"VC\"], \"type\": {\"domain\":[\"" + domainId
				+ "\"]}},\"fields\":[\"name\"]}";
		logger.info("query input for getting domain list: " + queryInput);
		ResponseEntity<String> response = getRestResponse(searchUrl, HttpMethod.POST, queryInput, proxyUrl, proxyPort,
				apiUser, apiUserPassword);
		logger.debug("domain list response: " + response.getBody());
		return response.getBody();
	}

	/* Function to fetch all Business glossary domains from the environment */
	/*
	 * TODO: Update this method to get a parameter to distinguish what to query
	 * for . Ex: For Glossary:GLOSSARY_RESOURCE_ID and For Reports :
	 * REPORTS_RESOURCE_ID
	 */
	/* TODO : Change the name of this method to getFilterList */
	public String getLOBList(String dgcRestUrl, String searchApi, String lobAssetTypeId,
			String businessDimentionsDomainId, String proxyUrl, String proxyPort, String apiUser,
			String apiUserPassword) throws Exception {
		String searchUrl = dgcRestUrl + searchApi;
		logger.debug("domain list api: " + searchUrl);
		/* TODO: Filter based on Glossary / Reports Id */

		String queryInput = "{\"query\": \"*\",\"filter\":{\"category\": [\"TE\"], \"type\": {\"asset\":[\""
				+ lobAssetTypeId + "\"], \"domain\":[\"" + businessDimentionsDomainId + "\"]}},\"fields\":[\"name\"]}";

		logger.info("query input for getting domain list: " + queryInput);
		ResponseEntity<String> response = getRestResponse(searchUrl, HttpMethod.POST, queryInput, proxyUrl, proxyPort,
				apiUser, apiUserPassword);
		logger.debug("domain list response: " + response.getBody());
		return response.getBody();
	}

	/* Function to fetch all Business glossary domains from the environment */
	/*
	 * TODO: Update this method to get a parameter to distinguish what to query
	 * for . Ex: For Glossary:GLOSSARY_RESOURCE_ID and For Reports :
	 * REPORTS_RESOURCE_ID
	 */
	/* TODO : Change the name of this method to getFilterList */
	public String getBusinessSegmentList(String dgcRestUrl, String searchApi, String businessSegmentAssetTypeId,
			String businessDimentionsDomainId, String proxyUrl, String proxyPort, String apiUser,
			String apiUserPassword) throws Exception {
		String searchUrl = dgcRestUrl + searchApi;
		logger.debug("domain list api: " + searchUrl);
		/* TODO: Filter based on Glossary / Reports Id */
		String queryInput = "{\"query\": \"*\",\"filter\":{\"category\": [\"TE\"], \"type\": {\"asset\":[\""
				+ businessSegmentAssetTypeId + "\"],\"domain\":[\"" + businessDimentionsDomainId
				+ "\"]}},\"fields\":[\"name\"]}";

		logger.info("query input for getting domain list: " + queryInput);
		ResponseEntity<String> response = getRestResponse(searchUrl, HttpMethod.POST, queryInput, proxyUrl, proxyPort,
				apiUser, apiUserPassword);
		logger.debug("domain list response: " + response.getBody());
		return response.getBody();
	}

	/* Function to fetch comments list for a particular term */
	public String getCommentList(String termId, String proxyUrl, String proxyPort, String apiUser,
			String apiUserPassword, String dgcRestUrl, String commentsApi1, String commentsApi2) throws Exception {
		ResponseEntity<String> commentsResponse = null;
		String commentListUrl = dgcRestUrl + commentsApi1 + termId + commentsApi2;
		logger.debug("comment list api : " + commentListUrl);
		// "https://nbcu-dev.collibra.com/rest/latest/term/"+ termId +
		// "/comments";
		commentsResponse = getRestResponse(commentListUrl, HttpMethod.GET, EMPTY_QUERY, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("comment list api response: " + commentsResponse.getBody());
		return commentsResponse.getBody();
	}
	
	public String getHomeConfig(String typeId, String dgcRestUrlLatest, String relationApi,
			String proxyUrl, String proxyPort, String apiUser, String apiUserPassword) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String queryInput = "";

		String typeUrl = dgcRestUrlLatest + relationApi
				+ "?excludeMeta=true&limit=0&nameMatchMode=ANYWHERE&offset=0&typeId=" + typeId + "&typeInheritance=true";

		ResponseEntity<String> response = null;
		logger.debug("query input for the Search API: " + queryInput);
		response = getRestResponse(typeUrl, HttpMethod.GET, queryInput, proxyUrl, proxyPort, apiUser,
				apiUserPassword);
		logger.info("getRelationsByTarget api response: " + response.getBody() + " : termId: " + typeId);
		return response.getBody();
	}
	
	@SuppressWarnings("unchecked")
	public JSONArray filterHomeConfig(List<String> requiredList, JSONArray searchListArray)
			throws JsonParseException, JsonMappingException, IOException {
		
		List<String> requiredId = new ArrayList<String>();
		Map<String, String> jsonlogoMap = new HashMap<>();
		JSONArray finalList = new JSONArray();
		for (String obj : requiredList) {
			ObjectNode node = new ObjectMapper().readValue(obj, ObjectNode.class);
			if (node.has("id")) {
				requiredId.add(node.get("id").get("value").asText());
				jsonlogoMap.put(node.get("id").get("value").asText(), node.get("logo").get("value").asText());
			}
		}

		for (int i = 0; i < searchListArray.size(); i++) {
			JSONObject objects = (JSONObject) searchListArray.get(i);
			String targetId = (String) objects.get("id");
			if (requiredId.contains(targetId)) {
				JSONObject obj = (JSONObject) searchListArray.get(i);
				if(jsonlogoMap.containsKey(targetId)){
					obj.put("logo", jsonlogoMap.get(targetId));
				}
				
				finalList.add(obj);
			}

		}
		return finalList;

	}
	
	@SuppressWarnings("unchecked")
	public JSONArray getHomeConfigRelation(String assetId, String dgcRestUrlLatest, String relationApi,
			String proxyUrl, String proxyPort, String apiUser, String apiUserPassword) throws Exception {
		
		JSONArray finalRelationList = new JSONArray();
		String targetRelation= getRelationsByTarget(assetId, null, dgcRestUrlLatest, relationApi,
				proxyUrl, proxyPort, apiUser, apiUserPassword);
		
		JSONArray targetRelationList = formatStringResponse(targetRelation);
		String sourceRelation= getRelationsByTarget(null, assetId, dgcRestUrlLatest, relationApi,
				proxyUrl, proxyPort, apiUser, apiUserPassword);
		JSONArray sourceRelationList = formatStringResponse(sourceRelation);
		finalRelationList.addAll(targetRelationList);
		finalRelationList.addAll(sourceRelationList);
		return finalRelationList;
	}
	
	
	private JSONArray formatStringResponse(final String relation){
		JSONParser parser = new JSONParser();
		JSONArray msg = null;
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(relation);
			msg = (JSONArray) jsonObject.get("results");
			
		} catch (ParseException e) {
			logger.error("Error while parsing searched terms during filtering process for the term :"
					+ null);
			e.printStackTrace();
		}
		
		return msg;
	}
}
