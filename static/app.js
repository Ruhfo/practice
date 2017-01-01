//Define global variables

//lists for datasets
var questions = [];
var answers = [];
var instructions = new Map();

var correct = 0; //correctly answered questions
var index = 0;	//Current question
var answered = 0; //questions answered

//Define buttons for practice stage 
var answer =  document.getElementById("answer"); 
var word = document.getElementById("word");
var submit = document.getElementById("send");

var canSave = canLocalStorage();
populateLoad();

//init upload/setup stage  
function init(){
	//Setup textIn
	document.getElementById("upload").style.display ="block";
	document.getElementById("textIn").focus();
	//document.getElementById("textIn").value ="";

	//Hide unnecessary parts
	document.getElementById("practice").style.display ="none";
	document.getElementById("done").style.display ="none";

	//reset questions, answers and instructions
	questions = [];
	answers = [];
	instructions = new Map();
	//test local storage
}

//change to next question
function next(){
	if (questions.length > index+1){
		index+=1;
		set_instruction();
		
	}else
	{
		result();
	}
}

function set_instruction (){
	//Apply instruction for current questions if available
	word.innerHTML = questions[index];
	if (instructions.has(index)){
		document.getElementById("instruction").innerHTML = instructions.get(index);
	}
}


function push_to_results(question, answer, index, trueAnswer, result){
	//Add new entry to results
	//TODO: cleanup
	var results = document.getElementById("results");

	//table_question.className += "table-question";
	//create new row for results
	var row_question = document.createElement("div");
	var text = document.createTextNode("Question: "+question);
	row_question.appendChild(text);
	results.appendChild(row_question);
	row_question.className += "questions_row ";

	var row_results = document.createElement("div");
	results.appendChild(row_results);
	row_results.className += "results_row ";
	row_results.className += result;

	//Use symbols instead of true/false
	if (result == "true"){
		result = '&#9745';
	} else {
		result = '&#9746';
	}

	//add elements to result row
	var table_index = document.createElement("span");
	table_index.className += "index";
	//Add text
	var text = document.createTextNode(index);
	table_index.appendChild(text);
	row_results.appendChild(table_index);

	var table_answer = document.createElement("span");
	row_results.appendChild(table_answer);
	table_answer.className += "answer";
	//Add text
	var text = document.createTextNode(answer);
	table_answer.appendChild(text);

	var table_true_answer = document.createElement("span");
	row_results.appendChild(table_true_answer);
	table_true_answer.className += "trueAnswer";
	//Add text
	var text = document.createTextNode(trueAnswer);
	table_true_answer.appendChild(text);

	var table_result = document.createElement("span");
	row_results.appendChild(table_result);
	table_result.className += "result";
	table_result.innerHTML = result;

	return true;
}

//send answer 
function send_answer (){ ;
	
	//sanitize correct and user answers currently(trim whitespaces and change to lowercas) 
	var userAnswer = answer.value.toLowerCase().trim(); 
	var correctAnswer = answers[index].toLowerCase().trim();
	
	if (userAnswer == correctAnswer){
		val = "true";
		correct +=1;
	}
	else {
		val = "false";
	}
	//Display result
	push_to_results(questions[index], answer.value, index+1, answers[index], val);

	//clear input, log result
	answer.value = "";
	console.log(val, index);

	//update question
	next();
}
//Start actual practice round
function start_practice () {
	var data_in = document.getElementById("textIn").value; //TODO: save data to variable

	if (data_in.split(":").length >1){ //TODO cleanup
		//reset counters
		correct = 0;
		index = 0;
		//reset arrays
		questions = [];
		answers = [];
		instructions = new Map();

		//hide other views 
		document.getElementById("upload").style.display ="none";
		document.getElementById("done").style.display ="none";
		//setup current view
		document.getElementById("practice").style.display ="block";
		document.getElementById("answer").focus();

		//Read questions in

		parse_input(data_in, ":");
		word.innerHTML = questions[index];

		document.getElementById("instruction").innerHTML = "";
		set_instruction();	

		
		//Remove previous results
		results = document.getElementById("results");

		//remove old results
		while (results.childNodes.length > 0){
			results.lastChild.remove();
		}
	} else {
		alert("You have to write some questions and answers first");
	}
}

//read input from textin and selectively push it into answers and questions
function parse_input (data_in, separator) {
	var lines = data_in.split("\n"); 

	for (var i=0;i<lines.length;i++){
		var elements = lines[i].split(separator);
		if (elements.length == 2){	//TODO: allow multible answers to one question
			var question = elements[0].trim();
			var answer = elements[1].trim();
			
			questions.push(question);
			answers.push(answer);
		}
		else if (elements.length == 1){
			var instruction = elements[0].trim(); //Usefull for giving special instructions 
			//So you can specify, if current task is translation or something else entirely
			instructions.set(questions.length, instruction);
		}
	}
}

//Get results
function result(){
	var total = questions.length; //TODO: allow canceling halfway and show answered questions as total set
	document.getElementById("result").innerHTML=correct+"/"+total;
	document.getElementById("mark").innerHTML=get_mark(correct, total);

	document.getElementById("practice").style.display ="none";
	document.getElementById("done").style.display ="block";
}

//Calculate mark
function get_mark (correct, total){
	var percentage = correct/total;

	var marks = [{"mark":"A", "percentage":0.9},
		    {"mark":"B", "percentage":0.8},
		    {"mark":"C", "percentage":0.7},
		    {"mark":"D", "percentage":0.6},
		    {"mark":"E", "percentage":0.5},
		    {"mark":"F", "percentage":0}];

	for (var i=0; i<marks.length;i++){
		if (marks[i].percentage <= percentage){
			return marks[i].mark
		}
	}
	return "F"
}

//Open/close Help overlay
function openSave(){
	document.getElementById('save-overlay').style.height= "100%";
}
function closeSave(){
	document.getElementById('save-overlay').style.height= "0%";
}

function populateLoad(){
	loadList = document.getElementById("loadList");
	names = get_list();
	for (i=0;i<names.length;i++){
		item = document.createElement("span");
		item.className += "loadElement ";

		var name = document.createTextNode(names[i]);
		item.appendChild(name);

		loadBtn = document.createElement("a");
		loadBtn.className += "load ";
		loadBtn.className += "button ";
		loadBtn.className += "btnNormal ";

		var text = document.createTextNode("Load"); 
		loadBtn.appendChild(text);

		item.appendChild(loadBtn);

		deleteBtn  =document.createElement("a");
		deleteBtn.onclick= remove_item(names[i]);
		deleteBtn.className += "delete ";
		deleteBtn.className += "button ";
		deleteBtn.className += "btnDark ";

		var text = document.createTextNode("Delete"); 
		deleteBtn.appendChild(text);

		item.appendChild(deleteBtn);

		loadList.appendChild(item);
		loadList.appendChild(document.createElement("br"));
	}

}	
	

//Check if enter key was pressed and execute appropriate function  
function check_key(event){
	if (event.which == 13 || event.KeyCode == 13){
		//Was enter
		send_answer();
		return false;
	} else{
		return true;
	}
}

