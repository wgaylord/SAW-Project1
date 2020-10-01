
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

function compareSite(oldData,newData){

   //Use intersection and difference to seaperate out changed,removed and new entries
   let newOrChangedEntries = newData.filter(x => !oldData.includes(x));
   let removedOrChangedEntries = oldData.filter(x => !newData.includes(x));
   let changedEntries = newOrChangedEntries.filter(x => removedOrChangedEntries.includes(x));
   let removedEntries = removedOrChangedEntries.filter(x => !changedEntries.includes(x));
   let newEntries = newOrChangedEntries.filter(x => !changedEntries.includes(x));

}


module.exports = {fetchHttpsJson,compareSite}
