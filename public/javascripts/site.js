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

var socket = io.connect('/');

var table = document.querySelector('body > table > tbody');

socket.on('init', function(data) {
    //console.log('Inital Data: '+data);
    data.forEach(function(activatorEntry){
        //console.log(activatorEntry);
      addRow(activatorEntry);
    });

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
        row.bgColor = "green";
      }
      if(activatorEntry.type == "removed"){
          var row = document.getElementById(activatorEntry.activator+activatorEntry.reference);
          if(row != null){
              row.bgColor = "red";
          }
      }
      if(activatorEntry.type == "changed"){
          var row = document.getElementById(activatorEntry.activator+activatorEntry.reference);
          if(row != null){
            //TODO Add color to parts that changed.
          }
      }
    
  });

});

function removeRowAndColor(){
	table.rows.forEach(row => {
		if(row.bgColor == "red"){
			row.remove();
		}else{
			row.bgColor = "white";
		}
		
	});
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
