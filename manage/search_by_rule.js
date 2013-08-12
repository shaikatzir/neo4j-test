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
var search_par = ["Bar", "Hot","Evening", "Dot"]


////search_db - get a list of keywords (searchList) and returns a list of items which connected to all keywords
//               "user" - the user name - will CREATE a new NODE named "se_%user_%item" and it is connected to both item and user.

////EXAMPLE : search by keywords, return ordered by popularity
//start n1=node:node_auto_index(name="Bar"), n2=node:node_auto_index(name="Hot"), n3 = node:node_auto_index(name="Evening"),n4=node:node_auto_index(name="Dot")
//Match (n1) -[*1..2]- (other), (n2) -[*1..2]- (other),(n3) -[*1..2]- (other), (n4) -[*1..2]- (other)
//WHERE other.type = "item"
//return other, other.name 
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



search_db (search_par, "shaika", function (err, res) {
	if (err) {
		console.log(err);
		return;
		}
	for (var i = 0; i < res.length; i++) {
		console.log(res[i]["other.name"]);
	}
});
		 			

