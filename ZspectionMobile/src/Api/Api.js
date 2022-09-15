import URI from './URI';
import axios from 'axios';

export default class API {
	constructor(url,params, headers = {}) {
		this.url = URI[url];
		this.params = params;
		this.headers = headers;
		console.log("URL : ",this.url)
		console.log("Body : ",this.params)
	}

	getURL() {
		return this.url;
	}

	getResponse() {
		return axios({
		  method: 'post',
		  url: this.url,
		  data: this.params,
		  headers: this.headers,
		}).then(result => {
			return result.data;
		}).catch(error => {
			return error;
		});
	}

	getResponse2(queryString = '') {
		console.log("Final uRL : ",this.url+queryString)
		console.log("Final Data : ", this.params)
		console.log("Final hEADER : ", this.headers)
		return axios({
		  method: 'post',
		  url: this.url+queryString,
		  data: this.params,
		  headers: this.headers,
		}).then(result => {
			 console.log(result);
			return result.data;
		}).catch(error => {
			console.log(error);
			return error;
		});
	}

	getApiResponse(queryString = '') {
		console.log("GET URL is :", this.url+queryString);
		let response  = axios.get(this.url+queryString);
		console.log("Response in service params : ", response);
		return response;
	}

	getApiWithId(queryString = '') {
		console.log("GET URL is :", this.url+queryString);
		return null
		// return axios({
		// 	method: 'get',
		// 	url: this.url+queryString
		//   }).then(result => {
		// 	   console.log(result);
		// 	  return result.data;
		//   }).catch(error => {
		// 	  console.log(error);
		// 	  return error;
		//   });
	}
}