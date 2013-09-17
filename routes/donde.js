var Search = require('../manage/search_by_rule');
var Questions = require ('../neoParams');
/*
 * GET home page.
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
            question : Questions.QUESTIONS[Questions.QUESTIONS_ORDER[0]],
            q_values : Questions.QUESTIONS_VAL[Questions.QUESTIONS_ORDER[0]]
        });
   });
};


/**
 * POST /donde
 */
exports.searchkey = function (req, res, next) {
    params = req.body
    node = req.body['node']
    index = Number(req.body['index'])+1
    arr = Object.keys(params);
    //remove first two elements : 'node' and 'index'
    arr.splice(0, 2);
    console.log(arr);
    console.log(node);
    Search.search_create_rel(node, arr,function(err) {
    	if (err)
    		return next(err);
    	console.log("search in : "+node)
    	Search.search_items(node, function(err,items,count) {
    		if (err)
    			return next(err);
    		//console.log(items[0].items);
    		console.log(index)
    		console.log(Questions.QUESTIONS_VAL[Questions.QUESTIONS_ORDER[index]]);
    		res.render('donde',{
    			node : node,
    			index : index,
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
