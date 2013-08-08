// add_rules.js
// add_rules.

var dbconn = require('../routes/dbconn');
var neo4j = dbconn.neo4j;
var db = dbconn.db;

var item_property = require('../models/item_property');

var rules2 = ["Time of day","Noon","Style","Day"]

var rules = ["Time of day","Noon","Style","Day",
"Time of day","Evening","Style","Cocktail&Party",
"Weather","Hot","Season","Summer",
"Weather","Cool","Season","Spring",
"Weather","Cool","Season","Fall",
"Weather","Cold","Season","Winter",
"Location","Bar","Style","Cocktail&Party",
"Location","Caffe","Style","Day",
"Geo Trend","Stripes","Pattern","Stripe",
"Geo Trend","Black&White","Color","Black&White",
"Location","University","Style","Day"]

parse_rules = function ( callback) {
	var i_properties = [];
	var s_properties = [];
	//var rules = this.rules;
	
	for (var i = 0; i < rules.length; i++) {
         	switch (i%4)
		{
			case 1:
				s_properties.push(rules[i]);
				break;
			case 3:
				i_properties.push(rules[i]);
				break;
			default :
				break;
		}
	}
	callback(null, s_properties, i_properties);			

};

create_rule = function (i_property, s_pro_name, i, callback){
  	var query = [
        'START item=node({propId})',
        'CREATE UNIQUE (item) <-[rel:RULE]- (other{ name : {sProName}, type : "search_property" })',
        'RETURN item.name, other.name' 
    ].join('\n')
        
 
    var params = {
        propId : i_property.id,
        sProName :   s_pro_name[i]
    };

    var item = this;
    db.query(query, params, function (err, results) {
    	console.log(results);
		callback(i+1);
	});
}

add_rules= function (callback) {
	
	parse_rules(function(err, s_prs, i_prs) {
		//s_prs : search properties
		//i_prs : item properties
		//we insert 'rule' that s_prs[i] connected to i_prs[i]
		if (err) return callback(err);
		
		//we want to add a relationship: (s_prs[i]) - [RULE] -> (i_prs[i]) 
		var create_relationship= function (i) {
			console.log("run "+i+" on " +s_prs[i]);
			if (i==s_prs.length) return;
		//for (var i = 0; i < s_prs.length; i++) {
			//check if i_prs[i]  exist
			item_property.getByName(i_prs[i],function(err, property) {
				if (err) return callback(err);
							
				//if it doesn't exist create it
				if (!property){
					item_property.create({name: i_prs[i]}, function (err, n_property) {
					        if (err) return callback(err);
					        create_rule(n_property, s_prs, i,create_relationship);
				    });
				}
				else{
					create_rule(property, s_prs, i,create_relationship);
				}
			});
		}
		create_relationship(0)
		callback(null);
	});
}


	


add_rules(function (err) { if(err) console.log(err)});



///////////////////////////////////////////////////////////////////////////////////////
//parse_rules(function(err,s_prs,i_prs){
//		console.log(s_prs)
//		console.log(i_prs)
//	});


