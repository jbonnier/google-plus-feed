var http = require("http");
var Feed = require("../repos/feed");

try {
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

  var rep = http.request(requestParameters);
  var body = JSON.parse(rep.body);
  var result = jsonToXml(body);
    
  response.addHeaders(configuration.crossDomainHeaders);
//      response.setHeader("content-type","image/png");
//        response.setStatus(200);
  response.write(result);
  response.close();
}    
catch (e) {
    return e;
}