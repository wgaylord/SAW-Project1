
const https = require('https')

async function fetchHttpsJson(url){
    let jsonData = new Promise(function(resolve,reject){
        https.get(url, function(response){
            response.on('data', function(data){
                try{
                    resolve(JSON.parse(data));
                    //console.log(jsonData);
                }catch(e){
		    reject(e);
                    console.log(e); //Log error
                }
            });
        });
    });
    return jsonData
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
   let newOrChangedEntries = newD.filter(x => !includesEntry(old,x));
   let removedOrChangedEntries = old.filter(x => !includesEntry(newD,x));
   let changedEntries = newOrChangedEntries.filter(x => includesEntry(removedOrChangedEntries,x));
   let removedEntries = removedOrChangedEntries.filter(x => !includesEntry(changedEntries));
   let newEntries = newOrChangedEntries.filter(x => !includesEntry(changedEntries,x));

   let changes = []

   changedEntries.forEach(element => {
        let changedProperties = []
        old.forEach(oldElement =>{
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


module.exports = {fetchHttpsJson,compareSite}
