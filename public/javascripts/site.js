var enableNotificationButtons = document.querySelectorAll('.enable-notifications')
//service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      console.log(`Successfully registered service worker to ${registration.scope}`);
    })
    .catch(function(error) {
      console.error('registration error:', error);
    });
  }

  function displayNotification() {
    if ('serviceWorker' in navigator) {
      var options = {
        body: 'You Successfully Subscribed to our Notification Services!',
      };
      navigator.serviceWorker.ready
        .then(function(swreg) {
          swreg.showNotification('Successfully subscribed!', options);
        });
    }
  }

  function askForNotificationPermission() {
    Notification.requestPermission(function(result) {
      console.log('user choice', result);
      if (result !== 'granted') {
        console.log('No Permission granted!');
      } else {
        displayNotification();
      }
    });
  }

  if ('Notification' in window) {
    for (var i = 0; i < enableNotificationButtons.length; i++) {
      enableNotificationButtons[i].style.display = 'inline-block';
      enableNotificationButtons[i].addEventListener('click', askForNotificationPermission);
    }
  }

var socket = io.connect('/');

var table = document.querySelector('body > table > tbody');

socket.on('init', function(data) {
    //console.log('Inital Data: '+data);
    if(table.rows.length == 1){
    data.forEach(function(activatorEntry){
        //console.log(activatorEntry);
      addRow(activatorEntry);
    });
    }
});


/*
* Data is sent as the new data plus a extra field for what fields changed
* Ex: {"activator": "", "name": "", "reference": "", "locationDesc": "",
* "activityStart": "", "activityEnd": "", "startDate": "", "endDate": "",
* "startTime": "", "endTime": "", "frequencies": "", "comments": "","changeLocations":["frequencies"],"type":"change"}
*/

socket.on('change', function(data) {
  if(data.length > 0){
	removeRowAndColor();
  }
  data.forEach(activatorEntry => {
      if(activatorEntry.type == "added"){
        var row = addRow(activatorEntry)
        row.style.backgroundColor = "#00FF00", row.style.fontFamily = "Monospace", row.style.fontSize = "18px";
      }
      if(activatorEntry.type == "removed"){
          var row = document.getElementById(activatorEntry.activator+activatorEntry.reference);
          if(row != null){
              row.style.backgroundColor = "#FF0000", row.style.fontFamily = "sans-serif", row.style.fontSize = "20px";
          }
      }
      if(activatorEntry.type == "changed"){
          var row = document.getElementById(activatorEntry.activator+activatorEntry.reference);
          if(row != null){
            row.style.backgroundColor = "#FFFF00", row.style.fontFamily = "Courier New", row.style.fontSize = "22px";
          }
      }

  });

});

function removeRowAndColor(){
	var i = 0;
	while(i < table.rows.length){
		var row = table.rows.item(i)
		if(row.style.backgroundColor == "#FF0000"){
			row.remove();
		}else{
			row.style.backgroundColor = "#FFFFFF";
		}
		i = i + 1;
	}
}

function addRow(activatorEntry){
        var row = table.insertRow();
        var activator = row.insertCell();
        var name = row.insertCell();
        var reference = row.insertCell();
        var frequencies = row.insertCell();
        var comments = row.insertCell();
        var activityStart = row.insertCell();
        var activityEnd = row.insertCell();
        activator.innerHTML = activatorEntry.activator;
        name.innerHTML = activatorEntry.name;
        reference.innerHTML = activatorEntry.reference;
        frequencies.innerHTML = activatorEntry.frequencies;
        comments.innerHTML = activatorEntry.comments;
        activityStart.innerHTML = activatorEntry.activityStart;
        activityEnd.innerHTML = activatorEntry.activityEnd;
        row.id = activatorEntry.activator + activatorEntry.reference;
        return row;
}
