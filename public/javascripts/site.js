var socket = io.connect('/');

socket.on('init', function(data) {
	console.log('Inital Data: '+data);
	data.forEach(element => console.log(element));
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
});
