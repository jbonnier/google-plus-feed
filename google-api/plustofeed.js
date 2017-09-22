var http = require("http");
try {
  var parameters = {
    googleApiKey: request.parameters.googleApiKey,
    googlePlusFeedURL: request.parameters.googlePlusFeedURL,
    auth_token: request.parameters.auth_token
  };

  var googleApiKey = parameters.googleApiKey;
  var googlePlusFeedURL = parameters.googlePlusFeedURL;
  var auth_token = parameters.auth_token;

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
  var feed = createFeed(body, auth_token, googlePlusFeedURL, googleApiKey);

  response.addHeaders(configuration.crossDomainHeaders);
  response.write(feed);
  response.close();
}    
catch (e) {
  return e;
}
function createFeed(source, token, url, key) {
  var head = '';
  var body = '';
  var tail = '';
  
  head += '<?xml version="1.0" encoding="UTF-8"?>\n';
  head += '<feed\n';
  head += '\txmlns="http://www.w3.org/2005/Atom"\n';
  head += '\txmlns:thr="http://purl.org/syndication/thread/1.0"\n';
  head += '>\n';
  head += '\t<title>'+source['title']+'</title>\n';
  //head += '\t<subtitle></subtitle>\n';
  head += '\t<link href="https://api.scriptrapps.io/google-api/plustofeed.js" rel="self" type="application/rss+xml" />\n';
  head += '\t<updated>'+source['updated']+'</updated>\n';
  head += '\t<link rel="alternate" type="text/html" href="'+url+'" />\n';
  head += '\t<id>https://api.scriptrapps.io/google-api/plustofeed.js</id>\n';
  
  for(var i = 0; i < source['items'].length; i++)
  {
    body += '\t<entry>\n';
    body += '\t\t<author><name>'+source['items'][i]['actor']['displayName']+'</name></author>\n';
    body += '\t\t<title>'+source['items'][i]['title']+'</title>\n';
    body += '\t\t<link href="'+source['items'][i]['url']+'"/>\n'
    body += '\t\t<id>'+source['items'][i]['url']+'</id>\n';
    body += '\t\t<published>'+source['items'][i]['published']+'</published>\n';
    body += '\t\t<updated>'+source['items'][i]['updated']+'</updated>\n';
    body += '\t\t<summary type="html">'+stripTags(source['items'][i]['object']['content'])+'</summary>\n';
    body += '\t</entry>\n';
  }

  tail = '</feed>';
  return head+body+tail;
}
function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}
// source : https://github.com/dylang/node-xml
var XML_CHARACTER_MAP = {
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
  '<': '&lt;',
  '>': '&gt;'
};
function escapeForXML(string) {
  return string && string.replace ? string.replace(/([&"<>'])/g, function(str, item) { return XML_CHARACTER_MAP[item]; }) : string;
}
