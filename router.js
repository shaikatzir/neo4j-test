//http://donde-app.com:2222/0.1/API/dynamicSearch/323232/color=RED&type=Dress&clientID=51ac9b24e9f48404230000e5&
//http://donde-app.com:2222/0.1/API/findItemByTCT/323232/color=RED&type=Dress&clientID=51ac9b24e9f48404230000e5&

//var GridFS = require('GridFS').GridFS;
//var GridStream = require('GridFS').GridStream;
//var GridFS = require('GridFS').GridFS;
//var GridStore = require('mongodb').GridStore;

//var myFS = new GridFS('db');
//var fs = require('fs')

mod_path = './lib/'
db = 0
exports.init = function(app) {
	
	// for example http://0.0.0.0:2222/0.1/profiles/register/323232/username=liat&password=123
	//0.1 - application version
	//profiles - "class" name
	//register - function name
	//323232 - checksum for validity
	// username=liat&password=123 - json of parameters

    app.get('/:ver/:cat/:func/:checksum/:parameters', function(req, res, next) {
	console.log(req.host)
	console.log(req.url)
	console.log(req.originalUrl)
	console.log(req.path)
	console.log(req.method)

	// add the ip to the params for use along the way
	if (req.params.func == 'getPhoto' || req.params.func == 'getImg' || req.params.func == 'updateDondeApp') 
	{
	    req.params.ip = req.connection.remoteAddress;
	    
	    console.log("parameters len is : "+ req.params.parameters.length);
	    
	    var parsedParams = require('querystring').parse(req.params.parameters);
	    
	    console.log(JSON.stringify(parsedParams));
	
	    var args = new Array(parsedParams, db,function(ret) 
				 {
				     /*
				     if (err) { 
					 console.log("ERROR "+err );
					 console.log("ret "+ret );
					 
					 res.header('Content-Type', 'application/json');
					 res.header('Charset', 'utf-8');
					 res.send(err);
				     }
				     else {
					 if (ret.success=='false'){
					     console.log("no photo");
					     res.header('Content-Type', 'application/json');
					     res.header('Charset', 'utf-8');
					     res.send(ret);
					 }
					 else{
					     */
				     res.writeHead('200', {'Content-Type': 'image/png'});
				     res.end(ret,'binary');

			//		 }
		//		     }
				 }
				)
	    
            try {                	

		require(mod_path + req.params.ver +'/'+req.params.cat)[req.params.func].apply(this, args);
            } catch (e) {
		console.log("error : " + e);
            }
	}
	else if (req.params.func == 'startClassify' || req.params.func == 'showFilter') 
	{
	    req.params.ip = req.connection.remoteAddress;
	    console.log("startClassify");

	    console.log("parameters len is : "+ req.params.parameters.length);
	    
	    var parsedParams = require('querystring').parse(req.params.parameters);
	    
	    console.log(JSON.stringify(parsedParams));
	
	    var args = new Array(parsedParams,req.params.ver, req.params.checksum,req.host ,db,function(ret) 
				 {
				     /*
				     if (err) { 
					 console.log("ERROR "+err );
					 console.log("ret "+ret );
					 
					 res.header('Content-Type', 'application/json');
					 res.header('Charset', 'utf-8');
					 res.send(err);
				     }
				     else {
					 if (ret.success=='false'){
					     console.log("no photo");
					     res.header('Content-Type', 'application/json');
					     res.header('Charset', 'utf-8');
					     res.send(ret);
					 }
					 else{
					     */
				
				     res.header('200', {'Content-Type': 'text/html'});
				     res.send(ret);
				 }
				)
	    
            try {                	
		console.log("req.params.func "+req.params.func)

		require(mod_path + req.params.ver +'/'+req.params.cat)[req.params.func].apply(this, args);
            } catch (e) {
		console.log("error : " + e);
            }
	}
	else 
	{ 	
	    req.params.ip = req.connection.remoteAddress;
	    console.log("parameters len is : "+ req.params.parameters.length);
	    var parsedParams = require('querystring').parse(req.params.parameters);
	    console.log(JSON.stringify(parsedParams));
	    var args = new Array(parsedParams, db,function(ret) {
	    console.log("ret is : " + JSON.stringify(ret))
		res.header('Content-Type', 'application/json');
		res.header('Charset', 'utf-8');
		res.send(ret);
	    });
            try {                	
		require(mod_path + req.params.ver +'/'+req.params.cat)[req.params.func].apply(this, args);
            } catch (e) {
		console.log("error : " + e);
            }
	}
    });
    
    app.post('/:ver/:cat/:func/:checksum/:parameters', function(req, res){
	if (req.params.func == 'registerWithPhoto' || req.params.func == 'setPhoto') 
	{
	    if (req.files) 
	    {
		if (req.files.image) {
		    console.log("posting an image "+ req.files.image.name);
		    req.params.ip = req.connection.remoteAddress;
		    console.log("parameters len is : "+ req.params.parameters.length);
		    var parsedParams = require('querystring').parse(req.params.parameters);
		    console.log(JSON.stringify(parsedParams));
		    console.log(JSON.stringify(parsedParams));
		    console.log(new Date().getTime())
		    //need to return error if clientID is null
		 //   filename = (new Date().getTime()).toString()+"_"+(parsedParams.clientID).toString()
		    filename = (new Date().getTime()).toString()
		    console.log(new Date().getTime())
		    var args = new Array(parsedParams,filename,req.files.image, db,function(ret) {
			res.header('Content-Type', 'application/json');
			res.header('Charset', 'utf-8');
			res.send(ret);
		    });
		    try {                	
			require(mod_path + req.params.ver +'/'+req.params.cat)[req.params.func].apply(this, args);
			fs.readFile(req.files.image.path, function (err, data) {
			if (err) 
			    console.log("ERROR reading file " + err);
			    myFS.put(data, filename, 'w', function(err, resualt){
				if (err) 
				    console.log("ERROR putting file to gridFS" + err);
				else{
				    console.log('pic id ' + resualt._id)
				    console.log('pic id ' + resualt.filename)
				    console.log('pic name ' + JSON.stringify(resualt))
				}
			    }
				    )})}
		    catch (e) {
			console.log("error : " + e);
		    }
	/*	    }
		    else { 
			res.header('Content-Type', 'application/json');
			res.header('Charset', 'utf-8');
			res.send("ERROR - missing clientID");
		    }
	*/	}}
	}
	else if (req.params.func == 'uploadDefaultPhoto')
	{
	    if (req.files) 
	    {
		if (req.files.image) {
		    console.log("posting a default pic "+ req.files.image.name);
		    req.params.ip = req.connection.remoteAddress;
		    console.log("parameters len is : "+ req.params.parameters.length);
		    var parsedParams = require('querystring').parse(req.params.parameters);
		    console.log(JSON.stringify(parsedParams));
		    console.log(JSON.stringify(parsedParams));
		    console.log(new Date().getTime())
		    //need to return error if clientID is null
		 //   filename = (new Date().getTime()).toString()+"_"+(parsedParams.clientID).toString()
		    filename = req.files.image.name
		    var args = new Array(parsedParams,filename,req.files.image, db,function(ret) {
			res.header('Content-Type', 'application/json');
			res.header('Charset', 'utf-8');
			res.send(ret);
		    });
		    try {                	
			require(mod_path + req.params.ver +'/'+req.params.cat)[req.params.func].apply(this, args);
			fs.readFile(req.files.image.path, function (err, data) {
			if (err) 
			    console.log("ERROR reading file " + err);
			    myFS.put(data, filename, 'w', function(err, resualt){
				if (err) 
				    console.log("ERROR putting file to gridFS" + err);
				else{
				    console.log('pic id ' + resualt._id)
				    console.log('pic id ' + resualt.filename)
				    console.log('pic name ' + JSON.stringify(resualt))
				}
			    }
				    )})}
		    catch (e) {
			console.log("error : " + e);
		    }
	/*	    }
		    else { 
			res.header('Content-Type', 'application/json');
			res.header('Charset', 'utf-8');
			res.send("ERROR - missing clientID");
		    }
	*/	}
	    }
	}

	else if (req.params.func == 'startClassify')
	{
	    console.log("in nextItem or showFilteredItems")
	    req.params.ip = req.connection.remoteAddress;
	    console.log("parameters len is : "+ req.params.parameters.length);
	    var parsedParams = require('querystring').parse(req.params.parameters);
	    
	    console.log(JSON.stringify(parsedParams));
	    
	    var args = new Array(parsedParams,req.params.ver, req.params.checksum, req.host, req.body, db,function(ret) {
		{
		    res.header('200', {'Content-Type': 'text/html'});
		    res.send(ret);
		}
	    })	    
            try {                	
		console.log("req.params.func "+req.params.func)
		require(mod_path + req.params.ver +'/'+req.params.cat)['startClassify2'].apply(this, args);
            } 
	    catch (e) {
		console.log("error : " + e);
            }
	}
	else if (req.params.func == 'showFilteredItems') 
	{
	    console.log("in nextItem or showFilteredItems")
	    req.params.ip = req.connection.remoteAddress;
	    console.log("parameters len is : "+ req.params.parameters.length);
	    var parsedParams = require('querystring').parse(req.params.parameters);
	    
	    console.log(JSON.stringify(parsedParams));
	    
	    var args = new Array(parsedParams,req.params.ver, req.params.checksum, req.host, req.body, db,function(ret) {
		{
		    res.header('200', {'Content-Type': 'text/html'});
		    res.send(ret);
		}
	    })	    
            try {                	
		require(mod_path + req.params.ver +'/'+req.params.cat)[req.params.func].apply(this, args);
            } 
	    catch (e) {
		console.log("error : " + e);
            }
	}
	else if (req.params.func == 'updateColor') 
	{
	    console.log("in updateColor")
	    req.params.ip = req.connection.remoteAddress;
	    console.log("parameters len is : "+ req.params.parameters.length);
	    var parsedParams = require('querystring').parse(req.params.parameters);
	    
	    console.log(JSON.stringify(parsedParams));
	    
	    var args = new Array(parsedParams, req.body, db,function(ret) {
		{
		    res.header('200', {'Content-Type': 'text/html'});
		    res.send(ret);
		}
	    })	    
            try {                	
		require(mod_path + req.params.ver +'/'+req.params.cat)['updateColor'].apply(this, args);
            } 
	    catch (e) {
		console.log("error : " + e);
            }
	}


    })
}
	      
