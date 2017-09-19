var http = require("http");

try {
  // we retrieve the received json from request.parameters and we parse it since we know
  // it is a stringified json
  //var parameters = JSON.parse(request.parameters.params);
    var parameters = {
        googleApiKey: request.parameters.googleApiKey,
        googlePlusFeedURL: request.parameters.googlePlusFeedURL
    };
  var googleApiKey = parameters.googleApiKey;
    var googlePlusFeedURL = parameters.googlePlusFeedURL;

  // Prepare the request to send to Google Places API
  var requestParameters = {
    url: googlePlusFeedURL,
    params: {
      //fields: ["url","object(content,attachments/url)"],
      key: googleApiKey
    }
  };
    console.log(googleApiKey);

  var response = http.request(requestParameters);
  var body = JSON.parse(response.body);
    var result = jsonToXml(body);
    
  return result;
}    
catch (e) {
    return e;
}