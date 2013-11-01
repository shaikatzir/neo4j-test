
//Graph DB colors
//COLORS = [ "SILVER","PINK","PURPLE","WHITE","BLACK","ORANGE","GREEN","BLUE","GREY","BROWN","LEOPARD","YELLOW","GOLD","ZEBRA","BEIGE","RED"]
COLORS = ["BLUE","GREEN","ORANGE", "PINK","YELLOW", "BLACK","WHITE","RED","PURPLE","GREY","BROWN","BEIGE"]
COLORS_MAP = {}
for (cl in COLORS)
   COLORS_MAP[COLORS[cl]] = [COLORS[cl]];
COLORS_MAP["NONE"] =[]   
// ['Black','White','Grey','Blue','Red','Beige','Pink','Brown','Yellow','Orange','Green','Purple','Leopard', 'Zebra','Gold','Silver']

//Graph DB patterns
PATTERNS_MAP = {"GEOMETRIC" : ["STRIPE","PRINT"],"LEOPARD" : ["LEOPARD","PRINT","ANIMAL"], "FLORAL" : ["FLORAL","PRINT"], "TWO COLOR": ["TWO COLOR"] , "STRIPE": ["STRIPE"], "DOT" : ["DOT"] , "SCATCH" : ["STRIPE", "PRINT"] , "PLAID" : ["PLAID"] ,
// "PLAIN" : [],
  "NONE" : []}
//["FLORAL", "STRIPE","ANIMAL","PRINT","DOT","SNAKE","LEOPARD","ZEBRA","PLAID","TWO COLOR"]}

//PATTERN_ORG = ["FLORAL", "STRIPE","ANIMAL","PRINT","DOT","SNAKE","LEOPARD","ZEBRA","PLAID","TWO COLOR"]

//Graph DB Materials
//MATERIALS_org = ["CHIFFON","FUR","LACE","LEATHER","SILK","TRANSPARENT","STITCH","JEANS","WOOL","SATIN","NYLON"]
MATERIALS_MAP = {"JEANS" : ["JEANS"], "LACE" : ["LACE"], "LEATHER" : ["LEATHER"], "NONE" : []}

//Graph DB sleeves
//SLEEVES_ORG = ["LONG-SLEEVE","SLEEVELESS","CAP-SLEEVE","SHORT-SLEEVE","STRAP","STRAPLESS","3/4-SLEEVE","ASYMMETRIC-SLEEVE"]
SLEEVES_MAP = {"SLEEVELESS" : ["SLEEVELESS", "CAP-SLEEVE"] , 
"STRAP" : ["STRAP"] , 
"SHORT-SLEEVE" : ["SHORT-SLEEVE", "CAP-SLEEVE"] , 
"THIRD_QUARTER" : ["3/4-SLEEVE"], 
"STRAPLESS" : ["STRAPLESS"], 
"HALTER" : ["HALTER-NECK"], 
"LONG-SLEEVE" : ["LONG-SLEEVE"],
"NONE" : []}


//Graph DB Lengths
//LENGTH_ORG = ["SHORT","LONG","MINI","MIDI","ASYMMETRIC","MAXI"]
LENGTH_MAP = {"SHORT" : ["SHORT","MINI"] ,"MIDI":["MIDI"] ,"LONG" : ["LONG","MAXI"], "NONE":[]}

//Graph DB neck
//neck_org =  ["ROUND-NECK","BOAT-NECK","V-NECK","COLLAR","HEART-NECK","SHIRT-DRESS","SQUARE-NECK","BARDOT-NECK","HALTER-NECK","HIGH-NECK"]
NECK_MAP = { "CLOSED" : [ "BOAT-NECK", "ROUND-NECK", "BARDOT-NECK"],
//"HEART": ["HEART-NECK"], 
"V" : ["V-NECK"],
//"BUTTONED" : ["SHIRT-DRESS"],
"GOLF"  : ["HIGH-NECK"],
//"SQUARE" : ["SQUARE-NECK"],
"COLLAR" : ["COLLAR", "SHIRT-DRESS"],
"NONE" : []}  

//Graph DB misc
//MISC_ORG = ["OPEN BACK","CUT","CUTOUT","PLEAT","YOKE","TIE","PATCH","TEAR","FEATHER","LAYERS","BUTTON","RUFFLE","FLOWER","WRAP","VERTICAL STRIPE","BELT","POCKET","HOOD","BACK ZIP","OPENING AT THE BACK","STUD","BOW","PEPLUM"]
MISC_MAP = {"TRANSPARENT" : ["TRANSPARENT"],"STUD" : ["STUD"], "POCKET" : ["POCKET"] , "BELT" : ["BELT"] , "PLEAT" : ["PLEAT"], "NONE" : []}



exports.QUESTIONS_VAL = {"Color" : COLORS_MAP, "Pattern" : PATTERNS_MAP, "Material" : MATERIALS_MAP, "Sleeve" : SLEEVES_MAP, "Length" : LENGTH_MAP,"Neck" : NECK_MAP, "Misc" : MISC_MAP}

exports.QUESTIONS = { "Color" : "What color is the dress?",
					 "Pattern" : "What is the pattern of the dress?", 
					 "Material" : "What is the material of the dress?",
					 "Sleeve" : "What kind of sleeves the dress has?",
					 "Length" : "What is the length of the dress?",
					 "Neck" : "what kind of neck the dress has?",
					  "Misc" : "Any other properties of the dress?"}
					  
exports.QUESTIONS_ORDER = ["Color", "Pattern",  "Neck", "Sleeve","Material",  "Misc", "Length"] 				  
exports.RELATIONS={"Color" : 'ITEM_COLOR', "Pattern": 'ITEM_PATTERN',  "Neck" :'ITEM_NECK' , "Sleeve" : 'ITEM_SLEEVE',"Material" : 'ITEM_MATERIAL',  "Misc" : 'ITEM_MISC', "Length" :'ITEM_LENGTH' }
 
imgPrefix = 'http://donde-app.com:2222/0.1/API/getImg/323232/img='
exports.IMAGES = {}
for (q in this.QUESTIONS_ORDER){
	cat = this.QUESTIONS_ORDER[q]
	this.IMAGES[cat] = {}
	s="["
	for (val in this.QUESTIONS_VAL[cat]){
	    for (in_val in this.QUESTIONS_VAL[cat][val])
	       s+=" "+this.QUESTIONS_VAL[cat][val][in_val]
		this.IMAGES[cat][val] = imgPrefix + val
		if (cat == "Material")
			this.IMAGES[cat][val] = ""
		if (cat == "Misc")
			this.IMAGES[cat][val] = ""	
			
	}
	s+="]"
	//console.log(s);
	//console.log(this.IMAGES[cat])
}

 

