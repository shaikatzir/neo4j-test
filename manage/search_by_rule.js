//import DB
var dbconn = require('../routes/dbconn');
var neo4j = dbconn.neo4j;
var db = dbconn.db;

//EXAMPLE search is its cold now
var query1 =['START se = node:node_auto_index(name="Cold"), item =node:node_auto_index(type="item")',
	'MATCH (se) - [:RULE] -> () <- [] - (item)',
	'return item, item.name']


var query2 = ['START se = node:node_auto_index(name="Cold")',
'MATCH (se) - [:RULE] -> () <- [] - (item)',
'WHERE item.type = "item"',
'return item, item.name']


//start n=node:node_auto_index(type="item_property"), pr=node(43)
//where n.name =~ ".*_neck"
//Create unique n - [r:CAT] -> pr
//return n, n.name, r

////EXAMPLE : after inserting "item_neck" it connects it to "neck" node and cutting the "_neck" off
//start n=node:node_auto_index(type="item_property"), pr=node(43)
//where n.name =~ ".*_neck"
//SET n.name = REPLACE(n.name,"_neck","")
//Create unique n - [r:CAT] -> pr
//return n, n.name, r




//create a search on db of an item connected to this parameters
var search_par = ["Black", "Sleeveless","Zip", "V","Short"]


////search_db - get a list of keywords (searchList) and returns a list of items which connected to all keywords
//               "user" - the user name - will CREATE a new NODE named "se_%user_%item" and it is connected to both item and user.

////EXAMPLE : search by keywords, return ordered by popularity
//start n1=node:node_auto_index(name="Bar"), n2=node:node_auto_index(name="Hot"), n3 = node:node_auto_index(name="Evening"),n4=node:node_auto_index(name="Dot"), user = node:node_auto_index(name="shaika")
//Match (n1) -[*1..2]- (other), (n2) -[*1..2]- (other),(n3) -[*1..2]- (other), (n4) -[*1..2]- (other)
//MATCH (user) - [?:FRIEND] - (user2) - [rel?:HAS_ITEM] -> (other)
//WHERE other.type = "item"
//return other, other.name , rel
//ORDER BY other.searches DESC

//start n1=node:node_auto_index(name="Bar"), n2=node:node_auto_index(name="Hot"), user = node:node_auto_index(name="shaika")
//Match (n1) -[*1..2]- (other), (n2) -[*1..2]- (other)
//MATCH (user) - [?:FRIEND] - (user2) - [rel?:HAS_ITEM] -> (other)
//WHERE other.type = "item"
//return other, other.name , rel
//ORDER BY other.searches DESC


//EXAMPLE : add a serch node between user and item
//start item=node:node_auto_index(name="1112"), user=node:node_auto_index(name="shaika")
//Create unique (user) - [r:SEARCH] -> (ob{name: "se_1112_shaika", type : "search_node"}) - [r1 :SEARCH] -> (item) 
//return user.name , r, r1, ob

search_db = function (searchList, user, callback) {

	
	//first row of the query
	var query_s ="START ";
	
	for (var i = 0; i < searchList.length; i++) {
		query_s = query_s + "n" + i + "=node:node_auto_index(name='" + searchList[i] +"'), ";
	}
	//remove last ","
	query_s=query_s.slice(0,-2);
	
	//second row
	query_s=query_s + "\nMATCH ";
	for (var i = 0; i < searchList.length; i++) {
		query_s = query_s + "(n" + i + ") -[*1..2]- (other), ";
	}
	//remove last ","
	query_s= query_s.slice(0,-2);

	//third row	
	query_s = query_s + "\nWHERE other.type = 'item'";
	//fourth row
	query_s = query_s + "\nRETURN other, other.name ";
	//fifth row
	query_s = query_s + "\nORDER BY other.searches DESC";
	
	db.query(query_s,{},function (err, res) {
		if (err) return callback (err);
		if (res.length != 1) return callback (null, res);
		var create_search_node =  [
        	'start item=node:node_auto_index(name={itemName}), user=node:node_auto_index(name={userName})',
			'Create unique (user) - [r:SEARCH] -> (ob{name: {nodeName}, type : "search_node"}) - [r1 :SEARCH] -> (item)',
	        'return user.name , r, r1, ob.name'
		    ].join('\n')
		var params =  {
        	itemName: res[0]["other.name"],
        	userName: user,
        	nodeName: "se_" +user+ "_"+	res[0]["other.name"]
    	};

		db.query(create_search_node,params,function(err, res2) {
				if (err) console.log(err);
				else	console.log("create search " + res2[0]["ob.name"]);
				callback(err,res);
				});

		}); 
}



//search_db (search_par, "shaika", function (err, res) {
//	if (err) {
//		console.log(err);
//		return;
//		}
//	for (var i = 0; i < res.length; i++) {
//		console.log(res[i]["other.name"]);
//	}
//});



//start se=node:node_auto_index(name="search_try")
//MATCH (se) -[:SEARCH]- > () <--(item)
//WHERE item.type = "item"
//WITH COLLECT (DISTINCT item.name) as items,
//	COLLECT (DISTINCT ID(item)) as items_id,
//     LENGTH ((se) -[:SEARCH]- > () <--(item)) as matching_properties
//return items, matching_properties, items_id
//ORDER BY matching_properties DESC

//EXAMPLE : add a serch node connecting it to its keywords search
//start n1=node:node_auto_index(name="Black"), n2=node:node_auto_index(name="Zip"), n3 = node:node_auto_index(name="V")
//CREATE (ob{name: "search_try", type : "search_node"})
//Create unique (ob) - [r :SEARCH] -> (n1), ob - [r1 :SEARCH] -> (n2), (ob) - [r2:SEARCH] -> (n3)
//return r, r1, ob


search_query = function (search_node, callback) {
	
  	var query = [
        'START se=node({seId})',
        'MATCH (se) -[:SEARCH]- > () <--(item)',
        'WHERE item.type = "item"',
        'WITH COLLECT (DISTINCT item.name) as items,',
        'LENGTH ((se) -[:SEARCH]- > () <--(item)) as matching_properties',
        'return items, matching_properties',
        'ORDER BY matching_properties DESC',
        'LIMIT 60',
    ].join('\n')
        
 	console.log(search_node.id);
    var params = {
        seId : search_node.id
    };

    
    db.query(query, params, function (err, results) {
    	if (err){
        	callback(err);
        	return;
        }
    	callback(null,results);
	});	
};

get_time_string = function () {
    

	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "@"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return datetime;
 };
    

search_key_db = function (searchList, callback) {

	//create a node representing the search and connect it to all the keyword nodes
	
	
	var node_name = "search_" + get_time_string()
	console.log(node_name)
	//create the node with the curretn date and time as its name
	var node = db.createNode({name: node_name, type : "search_node"})
	
	node.save(function (err) {
        if (err){
        	callback(err);
        	return;
        }
        console.log('Node saved to database with id:', node.id);
        
        console.log(searchList.length)
        
        //for each keyword in "search_list",look for it in the graph db
        var createRelationship = function (i) {
        	if (i==searchList.length) {
        	    //When all keywords have been connected to the search node, run the search query
        		search_query(node, callback);
        		return;
        	};
        	console.log(searchList[i]);
        	db.getIndexedNodes("node_auto_index","name",searchList[i], function(err,properties){
        		
        		if (err){
        			callback(err);
        			return;
		        };
		        //console.log(properties[0]);
		        if (properties[0]){
		        	//after found the keyword node, create a relationship : (search_node)-[SEARCH]->(keyword_node)
		            node.createRelationshipTo(properties[0],"SEARCH",{},function(err,rel) {
		            	if (err){
		        			callback(err);
		        			return;
				        };
				        console.log("create relationship: "+rel);
				        createRelationship(i+1);
		            });
		        }
		        else{
		        	console.log("couldn't find: "+searchList[i]);
		            createRelationship(i+1);
		        };
		            
		    });
		        
        };
        createRelationship (0);
        return});
        
};

//create a search node and returns its ID
exports.create_search_node = function(callback) {
	var node_name = "search_" + get_time_string()
	console.log(node_name)
	//create the node with the curretn date and time as its name
	var node = db.createNode({name: node_name, type : "search_node"})
	
	node.save(function (err) {
        if (err){
        	callback(err);
        	return;
        }
        console.log('Node saved to database with id:', node.id);
        callback(null,node.id);
    });
    
};	

//create a search node and returns its ID
exports.get_create_search_node = function(name, callback) {
	var node_name = name
	console.log(node_name)
	db.getIndexedNodes("node_auto_index","name", name, function(err,nodes){
		if (err){
			console.log("error index search" + err)
        	callback(err);
        	return;
        }
        if (nodes.length > 0)	{
         	for (i in nodes)
         		if (nodes[i].data.type=="search_node"){
         			console.log("found node");
		        	callback(null,nodes[i].id);
		        	return;
		        }
		
		}        
        //couldn't found node - create new one
        console.log("create new node")
        //create the node with the nod_name
		var node = db.createNode({name: node_name, type : "search_node"})
	
		node.save(function (err) {
		    if (err){
		       	callback(err);
		       	return;
		    }
		    console.log('Node saved to database with id:', node.id);
		    callback(null,node.id);
		});
		
		
	});
	
		    
    
};	


//finds 'searchList' nodes and creates relationships between the search node - 'nodeId' and the searchList nodes of category 'cat' .
exports.search_create_rel = function (nodeId, cat, searchList,callback) {
		//first get the search node	
        db.getNodeById(nodeId, function(err, node) {
			if (err){
		   			callback(err);
		   			return;
		        };
		    //for each keyword in "search_list",look for it in the graph db
        	var createRelationship = function (i) {
        		//When all keywords have been connected to the search node we are donde
	        	if (i==searchList.length) {
	        		callback(null);
	        		return;
	        	}
	        	console.log(searchList[i]);
	        	db.getIndexedNodes("node_auto_index","name",searchList[i], function(err,properties){
        		
        			if (err){
        				callback(err);
	        			return;
			        };
			        console.log(properties.length);
			        console.log("cat is " +cat)
			        for (pr in properties) {
			            if (properties[pr].data.category == cat){
			                console.log("start create relationship");
			            	//after found the keyword node, create a relationship : (search_node)-[SEARCH]->(keyword_node)
				            node.createRelationshipTo(properties[pr],"SEARCH",{},function(err,rel) {
	   			               if (err){
	   			                    console.log("createRelationshipTo ERROR RRR");
				        		    callback(err);
				        		    return;
						        };
						        console.log("create relationship: "+rel);
						        createRelationship(i+1);
						        return;
			                });
			            }      	   
			        }          	   
			                   	   
             	   
					    
					//  TODO : can get stuck and never return if found relationships but couldnt find the 'cat'
			        if (properties.length == 0){
			        	console.log("couldn't find: "+searchList[i]);
			        	createRelationship(i+1);
			        }
			        
			        return;
			        
			        
			    });
		        
    	    };
        	createRelationship (0);    
		});	 
};

//search items connected to the search_nodes, sort them by matching criteria and return items and number of items
exports.search_items = function (search_node, callback) {
	
  	var query = [
        'START se=node({seId})',
        'MATCH (se) -[:SEARCH]- > () <--(item)',
        'WHERE item.type = "item"',
        'WITH COLLECT (DISTINCT item.name) as items,',
		'COLLECT (DISTINCT ID(item)) as items_id,',
		'COLLECT (DISTINCT item.pic) as pics,',
        'LENGTH ((se) -[:SEARCH]- > () <--(item)) as matching_properties',
        'return items, matching_properties, items_id, pics',
        'ORDER BY matching_properties DESC',
        'LIMIT 10',
    ].join('\n')
        
    var params = {
        seId : Number(search_node)
    };

    console.log('start query on ' +Number(search_node));
    db.query(query, params, function (err, results) {
    	if (err){
        	callback(err);
        	return;
        }
        
        count = 0
        for (res in results)
        	count += results[res].items.length
        console.log('count is ' + count);
    	callback(null,results,count);
	});	
};


//search_key_db (search_par , function(err,res) {
//	if (err){
//	    console.log(err);
//	    return;
//	};
//	   
//	console.log(res)
//	});
//function (err, res) {
//	if (err) {
//		console.log(err);
//		return;
//		}
//	for (var i = 0; i < res.length; i++) {
//		console.log(res[i]["other.name"]);
//	}
//});


//DESC : SET "cat" PROPERTY OF ALL ITEM PROPERTIES, BY THEIR CATEGORY
//start cat=node:node_auto_index(type ="item_property_cat")
//MATCH (cat) -[:CAT]- (pr)
//SET pr.category= cat.name
//return pr.name, pr.category

//DESC : FIND ALL NODES STARTING - "Forever 21" - TRYING TO FIND ALL "Forever 21+" (plus sizes)
//start n=node:node_auto_index(type="item")
//match n
//where  HAS(n.detailed_desc) AND n.detailed_desc =~ "^Forever 21.*"
//RETURN n, n.name, n.detailed_desc				

