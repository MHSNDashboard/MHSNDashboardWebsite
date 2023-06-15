function noImages() {
  //if one of the boxes doesn't have an image, and both don't have text, it's not loaded
  const adBox = document.getElementById("adBox");
  const styles = window.getComputedStyle(adBox);
  const img = styles.backgroundImage;
  
  if(img) {
    return false;
  } else {
    return true;
  }
}
var checks = 0;

var id = setInterval(function()
{
  if(checks == 0) {
    checks++;
  } else if(!document.getElementById("eventBox").innerText && !document.getElementById("adBox").innerText && noImages()) {
    location.reload();
  } else {
    clearInterval(id);
  }
}, 4000);