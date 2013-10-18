var Search = require('../../manage/search_by_rule');
var Questions = require ('../../neoParams');

function JSONRes(success, error, num, profile, nextFeature){
return {
	success 	: success || false,
	error		: error || "",
	num       	: num || 0,
	profile		: profile || {},
        nextFeature     : nextFeature||0,

	}
}	

function get_question_values(q_cat){
	arr = []
	i = 0;
	for (val in Questions.QUESTIONS_VAL[q_cat]){
	   	//console.log('val is : ' + val);
	   	if (val == "NONE")
	   		continue;
		arr[i] = {};
		arr[i]['value'] = val;
		arr[i]['img'] = Questions.IMAGES[q_cat][val];
		i++;
	}
	return arr;

}

var checkResults = function (results, count){

	//no results yet - return false
	if (count == 0)
		return false;
	//no matching item for more than 2 properties - return false
	if (results[0].matching_properties <3)
		return false;
	//if there are too much items with high match - reurn false
	if (results[0].items.length > 10)
		return false;
	return true;	
};


//request : http://localhost:3000/0.1/API/dynamicSearch/323232/name=pattern&value=Print&node=shaikat
//answer: JSONRes(true, "", 0,{"nextFeature" : "pattern", "values" : {"NONE" : "http://donde-app.com:2222/0.1/API/getImg/323232/img=WHITE" }},1)


/**
 * dynamicSearch
 */
exports.dynamicSearch = function (params, db, callback) {
   node_name = params['node']
   console.log("start dynamic search. name = " + node_name)
   //first create or retreive "search node" by the name given 'node'
   Search.get_create_search_node(node_name, function (err, node) {
    	if (err){
    	    console.log("error creating node");
	    	return callback(err);
	    }

		var ans = {}
		console.log("got node id " + node);
		//if it's client search first request: send first question
    	if (typeof params.name  == 'undefined'){
    		ans['nextFeature'] = Questions.QUESTIONS_ORDER[0];
    		ans['values'] = get_question_values(ans['nextFeature'])
    		ans['question'] = Questions.QUESTIONS[ans['nextFeature']];
    		console.log("question first time " + ans)
	    	callback((JSONRes(true, "", 0,ans,1)));
	    	return;
	    }
	    console.log("search node id " +node)
	    
	    //get category name and search keys values from the client request.
	    cat = params.name
   	    key = params.value
	    arr =  Questions.QUESTIONS_VAL[cat][key]

		//move to next question
	    var index = Questions.QUESTIONS_ORDER.indexOf(cat) + 1;
	    //check if it was the last question	        
	    last=(index >= Questions.QUESTIONS_ORDER.length);
	    
	    //special case - cat can be mixed by the value
	    if (key == "HALTER")
	        //CHANGE 'cat' from "Sleeve" to "Neck"
	    	cat = "Neck"
	    if (key == "TRANSPARENT")
		    //CHANGE 'cat' from "Misc" to "Material"
	    	cat = "Material"
	    //add the given key to the search node
	    Search.search_create_rel(node, cat, arr,function(err) {
	    	if (err)
	    		return callback(err);
	    	console.log("search in : "+node)
	    	//search matching items to the search node
	    	Search.search_items(node, function(err,items,count) {
	    		if (err)
	    			return callback(err);
	    		//console.log(items[0].items[0]);
	    		//if its not the last question, check results to see if there is a match 
	    		if (!last)
    				last = checkResults(items, count);
    			//if its last question, or we found good matching results, return items pictures.	
	    		if (last) {
		            ans['nextFeature'] = 0
		            last = 0
		            ans['values'] = []
					
					ans['question'] = "Found the following DRESSES : "
		            count = 0
		            for (item in items){
			            console.log(items[item].pics)
		            	for (pic in items[item].pics){
		            		ans['values'][count] = {};
		            		ans['values'][count]["value"] = "pic"
		            		ans['values'][count]["img"] =  "http://"+items[item].pics[pic];
		            		count += 1
		            		if (count > 10)
		            			break;
		            	}
		            	if (count > 10)
		            			break;
		            }
		        }
    			//not last question (and couldn't find a match) - send the next questions and values
		        else{
					q_cat = Questions.QUESTIONS_ORDER[index]		        
	            	ans['nextFeature'] = q_cat;
   					ans['values'] = get_question_values(q_cat)
					ans['question'] = Questions.QUESTIONS[q_cat];
					last = 1
				}
	    		//console.log(last);
	    		//console.log(index)
	    		//console.log(Questions.QUESTIONS_VAL[Questions.QUESTIONS_ORDER[index]]);
	    		console.log("answer " + ans)
	    		callback((JSONRes(true, "", 0,ans,last)));

	    	});
	    });
	});    
};
