const http = require('https')


/*
* https://stackoverflow.com/a/56566138
* Reads our url and gets the data
*/
function httprequest() {
     return new Promise((resolve, reject) => {
        const options = {
            host: 'api.pota.us',
            path: '/activation',
            port: 443,
            method: 'GET'
        };
        const req = http.request(options, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
          reject(e.message);
        });
        // send the request
       req.end();
    });
}

/*
* Custom version of .includes that can actually compare our objects
*/
function includesEntry(array,item){
    let good = false
    array.forEach(element => {
        if((item.activator == element.activator) && (item.reference == element.reference)){
            good = true;
        }
    });
    return good;
}


/* Note! Only works with data from https://api.pota.us/activation and https://api.pota.us/spot/activator
*  Requires just the data from the site with no pre-processing.
*  Returned data is an array of the changed entries with two added properties.
*  type: String that stores the type of change. Possible values are [added,changed.removed]
*  changeLocations: Array of strings that stores the names of the properties that have changed.
*/
function compareSite(oldData,newData){

   //Use intersection and difference to seaperate out changed,removed and new entries
   let newOrChangedEntries = newData.filter(x => !includesEntry(old,x));
   let removedOrChangedEntries = old.filter(x => !includesEntry(newData,x));
   let changedEntries = newOrChangedEntries.filter(x => includesEntry(removedOrChangedEntries,x));
   let removedEntries = removedOrChangedEntries.filter(x => !includesEntry(changedEntries));
   let newEntries = newOrChangedEntries.filter(x => !includesEntry(changedEntries,x));

   let changes = []

   changedEntries.forEach(element => {
        let changedProperties = []
        oldData.forEach(oldElement => {
            if((oldElement.activator == element.activator) && (oldElement.reference == element.reference)){
                for(const prop in element){
                    if(oldElement[prop] != element[prop]){
                        changedProperties.push(prop);
                    }
                }
            }
        });
        element.type = "changed";
        element.changeLocations = changedProperties;
        changes.push(element);
    });
    removedEntries.forEach(element => {
        element.type = "removed";
        element.changeLocations = [];
        changes.push(element);
    });
    newEntries.forEach(element => {
        element.type = "added";
        element.changeLocations = [];
        changes.push(element);
    });

    return changes;
}


module.exports = {httprequest,compareSite}
