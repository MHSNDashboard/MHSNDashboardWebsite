
async function request(url="https://MHSNEvent.MHSNDashboard.repl.co") { //Scraping from repl as I can control CORS settings :)))
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  var response;
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { //When document is ready...
      response = xhttp.responseText; //set response to text
    }
  };
  
  xhttp.open("GET", url + (/\?/.test(url) ? "&" : "?") + new Date().getTime(), true);
  //This allows communication with other replit, otherwise data transfer is impossible
  xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
  xhttp.send();
  
  while(!response) {
    await sleep(10);
  } //Blocking behavior to recieve response synchronously
  
  return response;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));  
}

async function parsePlace(dummyID, url) {
  await request(url); //First request 'wakes up' other replit
  
  await delay(600); //waits .6 seconds to send the second request, gives repl time to wake up(THIS CAN BE TINKERED WITH)
  
  content = await request(url); //Second request actually recieves data from now awake replit
  content = content.replace("<html>", "").replace("</html>", "").replace("<body>", "").replace("</body>", "");

  var headEnd = content.search("</head>") + 7
  content = content.substring(headEnd, content.length); //gets rid of head tag by starting content on its end

  document.getElementById(dummyID).innerHTML = content;
  return dummyID;
  
}

function kill(parentID) {
  elem = document.getElementById(parentID);
  elem.innerHTML = ''; //Kills everything inside element (may not be needed, but why not?)
  elem.remove() //removes element itself
}
