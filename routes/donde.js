var Search = require('../manage/search_by_rule');
var Questions = require ('../neoParams');


/*
 * GET donde page.
 */

exports.donde = function(req, res){
  Search.create_search_node(function(err,node) {
  	if (err){
  		console.log(err);
  		return next(err);
  	}
  	console.log(Questions.QUESTIONS[Questions.QUESTIONS_ORDER[0]]);
  	
  	res.render('donde',{
            node : node,
            index : 0,
            last : false,
            question : Questions.QUESTIONS[Questions.QUESTIONS_ORDER[0]],
            q_values : Questions.QUESTIONS_VAL[Questions.QUESTIONS_ORDER[0]]
        });
   });
};

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

/**
 * POST /donde
 */
exports.searchkey = function (req, res, next) {
    params = req.body
    node = req.body['node']
    index = Number(req.body['index'])+1;
 
    last=(index >= Questions.QUESTIONS_ORDER.length);
    arr = Object.keys(params);
    //remove first two elements : 'node' and 'index'
    arr.splice(0, 2);
    console.log(arr);
    console.log(node);
    //get the category of the last question
    cat = Questions.QUESTIONS_ORDER[index-1]
    Search.search_create_rel(node, cat, arr,function(err) {
    	if (err)
    		return next(err);
    	console.log("search in : "+node)
    	Search.search_items(node, function(err,items,count) {
    		if (err)
    			return next(err);
    		//console.log(items[0].items[0]);
    		console.log(last);
    		if (!last)
    			last = checkResults(items, count);
    		console.log(last);
    		console.log(index);
    		console.log(Questions.QUESTIONS_VAL[Questions.QUESTIONS_ORDER[index]]);
    		res.render('donde',{
    			node : node,
    			index : index,
    			last : last,
            	question : Questions.QUESTIONS[Questions.QUESTIONS_ORDER[index]],
            	q_values : Questions.QUESTIONS_VAL[Questions.QUESTIONS_ORDER[index]],
            	results : items,
    			count : count
    		});
    	});
    });
    
//    Search.search_key_db(keywords, function (err, results) {
//        if (err) return next(err);
//        //console.log(results);
//        console.log(results);
//        
//        res.render('donde',{
//            results : results
//        });
//    });
};




