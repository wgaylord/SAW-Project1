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
* Custom version of .includes that can actually compare our objects and say if they are in an array.
*/

function includesEntry(array,item){
    let good = false;
    array.forEach(element => {
         let goodArray = []
         for(const prop in element){
             if((prop !="type") && (prop !="changeLocations")){
             if(item[prop] == element[prop]){
                 goodArray.push(true);
             }else{
                 goodArray.push(false);
             }}
         }
         if(!goodArray.includes(false)){
             good = true; //Can't just return due to being inside forEach callback
         }
    });
    return good;
}

function shallowIncludes(array,item){
    let good = false
    array.forEach(element => {
        if((item.activator == element.activator) && (item.reference == element.reference)){
            good = true;
        }
    });
    return good;
}


function deepCopy(array){
    return JSON.parse(JSON.stringify(array))
}

/* Note! Only works with data from https://api.pota.us/activation and https://api.pota.us/spot/activator
*  Requires just the data from the site with no pre-processing.
*  Returned data is an array of the changed entries with two added properties.
*  type: String that stores the type of change. Possible values are [added,changed.removed]
*  changeLocations: Array of strings that stores the names of the properties that have changed.
*/
function compareSite(oldD,newD){

   let newData = deepCopy(newD);
   let oldData = deepCopy(oldD);

   //Use intersection and difference to seaperate out changed,removed and new entries
   let newOrChangedEntries = newData.filter(x => !includesEntry(oldData,x));
   let removedOrChangedEntries = oldData.filter(x => !includesEntry(newData,x));
   let changedEntries = newOrChangedEntries.filter(x => shallowIncludes(removedOrChangedEntries,x));
   let removedEntries = removedOrChangedEntries.filter(x => !shallowIncludes(changedEntries,x));
   let newEntries = newOrChangedEntries.filter(x => !shallowIncludes(changedEntries,x));

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
