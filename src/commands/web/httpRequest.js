const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = { 
	httpGetAsync (url, callback) {
		let xmlHttp = new XMLHttpRequest(); 
		xmlHttp.open("GET", url, true);             // true for asynchronous
		xmlHttp.onload = function (e) {
			if (xmlHttp.readyState === 4) {
				if (xmlHttp.status === 200) {                                 
					//console.log(JSON.parse(xmlHttp.responseText));   
					callback(xmlHttp.responseText);             
				} else {
					console.error(xmlHttp.statusText);
				}
			}
		};
		xmlHttp.onerror = function (e) {
			console.error(xmlHttp.statusText);
		};
		xmlHttp.send(null);       
	},
};
