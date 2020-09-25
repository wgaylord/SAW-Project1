var socket = io.connect('/');

var table = document.querySelector('body > table > tbody');

socket.on('init', function(data) {
    //console.log('Inital Data: '+data);
    data.forEach(function(activatorEntry){
        console.log(activatorEntry);
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
    });

});


/*
* Data is sent as the new data plus a extra field for what fields changed
* Ex: {"activator": "", "name": "", "reference": "", "locationDesc": "", 
* "activityStart": "", "activityEnd": "", "startDate": "", "endDate": "",
* "startTime": "", "endTime": "", "frequencies": "", "comments": "","changed":["frequencies"]}
*/

socket.on('changed', function(data) {
  console.log('Change received: ' + data);
  console.log('Fields that changed are: ' + data.changed);
  var row = document.getElementById(data.activator+data.reference);
  

});

