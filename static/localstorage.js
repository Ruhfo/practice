//Storing practice sessions in local storage

function canLocalStorage() {
	if (typeof(Storage) !== "undefined") {
		console.log("Local storage available :)");
		return true;
	} else {
	       console.log("No local storage availabele :(");	
	       return false;
	}
}

//save 
function save_session(name, dataSet){
	localStorage.setItem(name, dataSet);
	populateLoad();
}
//load
function get_session(name, dataSet){
	localStorage.getItem(name, dataSet);
}

function remove_item(name){
	localStorage.removeItem(name);
	console.log("removing %s", name)
}

function get_list(){
	//gets all datasets stored localy
	var keys = [];

	for (var i=0;i<localStorage.length;i++){
		var key = localStorage.key(i);
		keys.push(key);
	}
	console.log(keys);

	return keys
}
