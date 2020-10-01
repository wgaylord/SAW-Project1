
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


module.exports = {fetchHttpsJson}
