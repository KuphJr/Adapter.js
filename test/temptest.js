const test = '<!DOCTYPE html>\r\n' +
'<html lang="en">\r\n' +
'<head>\r\n' +
'    <meta charset="UTF-8">\r\n' +
'    <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n' +
'    <title>Test Website</title>\r\n' +
'</head>\r\n' +
'<body>\r\n' +
'    [test]\r\n' +
'<!-- Code injected by live-server -->\n' +
'<script type="text/javascript">\n' +
'\t// <![CDATA[  <-- For SVG support\n' +
"\tif ('WebSocket' in window) {\n" +
'\t\t(function () {\n' +
'\t\t\tfunction refreshCSS() {\n' +
'\t\t\t\tvar sheets = [].slice.call(document.getElementsByTagName("link"));\n' +
'\t\t\t\tvar head = document.getElementsByTagName("head")[0];\n' +
'\t\t\t\tfor (var i = 0; i < sheets.length; ++i) {\n' +
'\t\t\t\t\tvar elem = sheets[i];\n' +
'\t\t\t\t\tvar parent = elem.parentElement || head;\n' +
'\t\t\t\t\tparent.removeChild(elem);\n' +
'\t\t\t\t\tvar rel = elem.rel;\n' +
'\t\t\t\t\tif (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {\n' +
"\t\t\t\t\t\tvar url = elem.href.replace(/(&|\\?)_cacheOverride=\\d+/, '');\n" +
"\t\t\t\t\t\telem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());\n" +
'\t\t\t\t\t}\n' +
'\t\t\t\t\tparent.appendChild(elem);\n' +
'\t\t\t\t}\n' +
'\t\t\t}\n' +
"\t\t\tvar protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';\n" +
"\t\t\tvar address = protocol + window.location.host + window.location.pathname + '/ws';\n" +
'\t\t\tvar socket = new WebSocket(address);\n' +
'\t\t\tsocket.onmessage = function (msg) {\n' +
"\t\t\t\tif (msg.data == 'reload') window.location.reload();\n" +
"\t\t\t\telse if (msg.data == 'refreshcss') refreshCSS();\n" +
'\t\t\t};\n' +
"\t\t\tif (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {\n" +
"\t\t\t\tconsole.log('Live reload enabled.');\n" +
"\t\t\t\tsessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);\n" +
'\t\t\t}\n' +
'\t\t})();\n' +
'\t}\n' +
'\telse {\n' +
"\t\tconsole.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');\n" +
'\t}\n' +
'\t// ]]>\n' +
'</script></body>\r\n' +
'</html>';
let regexp = new RegExp("\\[(.*?)\\]", "g");
console.log(regexp.toString());
const result = test.match(regexp);
console.log(result);

console.log(test.search("IDONOTEXISTS"));
let rawstring6 = String.raw`.`;
let rawstring5 = String.raw`\n`;
let regexp2 = new RegExp(rawstring6, "g");
let regexp3 = new RegExp(rawstring5, "g");
console.log(regexp2.toString());
console.log(regexp3.toString());

console.log(test.replace(regexp2, "").replace(regexp3, ""));