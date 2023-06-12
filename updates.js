function updateTime() { //Updates static page time by current time
  var dt = new Date();
  // dt.setMinutes(dt.getMinutes() + 2); //minute adjustment
  // dt.setSeconds(dt.getSeconds() + 15); //second adjustment
  
  //Gets am/pm value and switches from military time to standard
  
  var ampm;
  if(dt.getHours() == 00) {
    var hours = 12;
    ampm = 'AM';
  } else if(dt.getHours() == 12) {
    var hours = dt.getHours();
    ampm = 'PM';
  } else if(dt.getHours() > 12) {
    var hours = dt.getHours() - 12;
    ampm = 'PM';
  } else {
    var hours = dt.getHours();
    ampm = 'AM';
  }

  //Fixes minute glitch with missing zero
  if(dt.getMinutes() < 10) {
    var minutes = '0' + dt.getMinutes().toString()
  } else {
    var minutes = dt.getMinutes().toString()
  }
  
  //Fixes second glitch with missing zero
  if(dt.getSeconds() < 10) {
    var seconds = '0' + dt.getSeconds().toString()
  } else {
    var seconds = dt.getSeconds().toString()
  }

  var current_time = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
  document.getElementById("time").innerHTML = current_time;
}
				
function updateBlock(AB) {
  
  // if('sunday' in date.toLowerCase() || 'saturday' in date.toLowerCase()) {
  // 	document.getElementById('block').innerHTML = 'Today is a weekend, school is not in session today';
  // 	return;
  // } else {
  
  dt = new Date();
  dt.setMinutes(dt.getMinutes() + 0); //School clock is ~2:05 mins ahead
  dt.setSeconds(dt.getSeconds() + 0);
  hour = dt.getHours();
  minute = dt.getMinutes();

  current = new Date('December 1, 2000 ' + hour + ':' + minute);

  if(!AB) {
    AB = "";
  }
  
  const block_times = {
    '1' : {
      'start' : new Date('December 1, 2000 7:25:00').getTime(),
      'end' : new Date('December 1, 2000 8:45:59').getTime(),
      'name' : `Block 1${AB}`,
    },
    
    '2' : {
      'start' : new Date('December 1, 2000 8:46:00').getTime(),
      'end' : new Date('December 1, 2000 10:10:59').getTime(),
      'name' : `Block 2${AB}`,
    },
    
    '3' : {
      'start' : new Date('December 1, 2000 10:11:00').getTime(),
      'end' : new Date('December 1, 2000 10:41:59').getTime(),
      'name' : `Block 3${AB}`,
    },

    
    '4' : {
      'start' : new Date('December 1, 2000 10:42:00').getTime(), // change back to 10:46
      'end' : new Date('December 1, 2000 11:12:59').getTime(),
      'name' : `Block 4${AB}`,
    },
    
    '5' : {
      'start' : new Date('December 1, 2000 11:13:00').getTime(),
      'end' : new Date('December 1, 2000 12:37:59').getTime(),
      'name' : `Block 5${AB}`,
    },
    
    '6' : {
      'start' : new Date('December 1, 2000 12:38:00').getTime(),
      'end' : new Date('December 1, 2000 14:02:59').getTime(),
      'name' : `Block 6${AB}`,
    }
  }

  for(let times in block_times) {
    times = block_times[times]

    if(times['start'] < current.getTime() && times['end'] > current.getTime()) {
      document.getElementById('block').innerHTML = times['name'];
      break

    } else if(block_times['1']['start'] > current.getTime()) {
      document.getElementById('block').innerHTML = 'School has not started yet!';

    } else if(block_times['6']['end'] < current.getTime()) {
      document.getElementById('block').innerHTML = 'School has ended!'
    }

  }
}

function updateAdsToAd(ad) { //ad is ad object with stored attributes
  document.getElementById("schoolAdHeader").innerHTML = ad.header;
  document.getElementById("schoolAdSubHeader").innerHTML = ad.subheader;
  document.getElementById("schoolAdCredits").innerHTML = ad.subright;
  document.getElementById("schoolAdOptionalSide").innerHTML = ad.subleft;
  
  document.getElementById("adBox").style.backgroundImage = `url(${ad.image_data})`;
}

function updateEventsToEvent(event) { //ad is ad object with stored attributes
  document.getElementById("schoolEventHeader").innerHTML = event.header;
  document.getElementById("schoolEventSubHeader").innerHTML = event.subheader;
  document.getElementById("schoolEventCredits").innerHTML = event.subright;
  document.getElementById("schoolEventOptionalSide").innerHTML = event.subleft;
  
  document.getElementById("eventBox").style.backgroundImage = `url(${event.image_data})`;
}

async function main() {
  //API-ish call made to MHSNScrape, store everything in dummyHTML, then take the text and parse it to JSON
  var dummyID = await parsePlace("dummy", "https://MHSNEvent.MHSNDashboard.repl.co");
  var JSONData = JSON.parse(document.getElementById(dummyID).textContent);
  
  kill(dummyID); //gets rid of dummy HTML as to keep HTML neat

  //Quotes
  document.getElementById("quoteRefresh").innerHTML = JSONData.top_box.quote;
  
  //EVENTS
  document.getElementById("eventBox").style.backgroundSize = "cover";
  
  //Set up cycling of events
  var events = JSONData.events;
  var event_keys  = Object.keys(events);

  var eventCT = 1;
  var secondDelay = 10;
  
  updateEventsToEvent(events[0]);
  setInterval(function() { //takes (secondDelay * 1000)ms to run for the first time, so we run ads[0] out of interval
    updateEventsToEvent(events[eventCT % event_keys.length]);  
    eventCT++;
  }, 1000 * secondDelay);

	
  //Set up cycling of ads
  var ads = JSONData.advertisements;
  var ad_keys  = Object.keys(ads);

  var adCT = 1;
  
  updateAdsToAd(ads[0]);
  setInterval(function() { //takes (secondDelay * 1000)ms to run for the first time, so we run ads[0] out of interval
    updateAdsToAd(ads[adCT % ad_keys.length]);  
    adCT++;
  }, 1000 * secondDelay);
	
  
}

var block;
var time;
setInterval(function() { // Updates the time every second and returns hour minute values for block updates
  block = updateBlock();
  time = updateTime();				
}, 1000); //Every 1000 ms is a second

main();