var Search = require('../manage/search_by_rule');
/*
 * GET home page.
 */

exports.donde = function(req, res){
  Search.create_search_node(function(err,node) {
  	if (err){
  		console.log(err);
  		return next(err);
  	}
  	res.render('donde',{
            node : node
        });
   });
};


/**
 * POST /donde
 */
exports.searchkey = function (req, res, next) {
    keyword = req.body['keyword']
    node = req.body['node']
    console.log(keyword);
    console.log(node);
    Search.search_create_rel(node, keyword,function(err) {
    	if (err)
    		return next(err);
    	console.log("search in : "+node)
    	Search.search_items(node, function(err,items,count) {
    		if (err)
    			return next(err);
    		console.log(items[0].items[0].data.pic);
    		res.render('donde',{
    			node : node,
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

