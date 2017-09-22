
var http = require("http");
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
  var feed = createFeed(body);
  response.addHeaders(configuration.crossDomainHeaders);
  // response.setHeader("content-type","image/png");
  // response.setStatus(200);
  response.write(feed);
  response.close();
}    
catch (e) {
  return e;
}
function createFeed(source) {
  var head = '';
  var body = '';
  var tail = '';
  head += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
  head += '\t<title>'+source['title']+'</title>\n';
  head += '\t<subtitle></subtitle>\n';
  head += '\t<link href="..."/>\n';
  head += '\t<updated>'+source['updated']+'</updated>\n';
  for(var i = 0; i < source['items'].length; i++)
  {
    body += '\t<entry>\n';
    body += '\t\t<author><name>'+source['items'][i]['actor']['displayName']+'</name></author>\n';
    body += '\t\t<title>'+source['items'][i]['title']+'</title>\n';
    body += '\t\t<link>'+source['items'][i]['url']+'</link>\n'
    body += '\t\t<id>'+source['items'][i]['id']+'</id>\n';
    body += '\t\t<published>'+source['items'][i]['published']+'</published>\n';
    body += '\t\t<updated>'+source['items'][i]['updated']+'</update\n';
    body += '\t\t<summary type="text">'+stripTags(source['items'][i]['object']['content'])+'</summary>\n';
    body += '\t</entry>\n';
  }
  tail = '</feed>';
  return head+body+tail;
}
function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ');
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
