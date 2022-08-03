const formatName = function(name){
  name = name.replace(/\n/g,'');
  name = name.replace(' ','');
  let reorderedName = name.split(',').reverse().join(' ');
  let lowercaseName = reorderedName.toLowerCase()
  let names = lowercaseName.split(' ')
  try{
    for (let i = 0; i < names.length; i++) {
      names[i] = names[i][0].toUpperCase() + names[i].substr(1);
    }
  }catch{
    names[0] = names[0][0].toUpperCase() + names[0].substr(1);
  }
  let formatedName = names.join(' ')
  return formatedName
}

const makeDocCopy = function(data){
  const templateLetter = DriveApp.getFileById(keys.fileId)
  const folder = DriveApp.getFolderById(keys.folderId)
  var copy = templateLetter.makeCopy(data.Name + data.Address1 ,folder);
  var docId = copy.getId();
  return docId
}

const compileLetter = function(data){
  const copyId = makeDocCopy(data)
  doc = DocumentApp.openById(copyId)
  body = doc.getBody()

  const name = formatName(propData.Name)
  body.replaceText('{name}', name);
  body.replaceText('{address}', data.Address1)
  body.replaceText('{value}', '$' + data.LandValue)
}

const doNothing = function(){
  return
}

function doGet(e) {
  var params = JSON.stringify(e);
  parcelId = JSON.parse(params).parameter.id.replace(/\s/g, '')
  compileLetter(apiCall(parcelId))
  return ContentService.createTextOutput(parcelId)
}

function apiCall(parcelId) {
  var headers = {"contentType":"application/json","Host":keys.host,"contentLength":"30"};
   var data = {
  folioNumber: parcelId
  };
  var payload = JSON.stringify(data);
  var params = {"method":"POST","contentType":"application/json","Host":keys.host,"Content-Length":"30","payload":payload};
  var url = keys.url
  var response = UrlFetchApp.fetch(url,params);
  var content = response.getContentText();
  var rawPropertyData = JSON.parse(content);
  propData = rawPropertyData.d[0];
  return propData
}
