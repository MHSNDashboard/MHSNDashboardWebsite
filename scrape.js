
async function request(url="https://MHSNScrape.MatthewTujague.repl.co/") { //Scraping from repl as I can control CORS settings :)))
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
  xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
  xhttp.send();
  
  while(!response) {
    await sleep(10);
  } //Blocking behavior to recieve response synchronously
  
  return response;
}

async function parsePlace() {
  const dummyID = "dummy";
  content = await request();
  content = content.replace("<html>", "").replace("</html>", "").replace("<body>", "").replace("</body>", "");

  var headEnd = content.search("</head>") + 7
  content = content.substring(headEnd, content.length); //gets rid of head tag by starting content on its end

  document.getElementById(dummyID).innerHTML = content;
  return dummyID;
}

function kill(parentID) {
  elem = document.getElementById(parentID);
  elem.innerHTML = ''; //Kills all inner HTML
  elem.remove()
}
