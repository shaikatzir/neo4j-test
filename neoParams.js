
//Graph DB colors
COLORS = [ "SILVER","PINK","PURPLE","WHITE","BLACK","ORANGE","GREEN","BLUE","GREY","BROWN","LEOPARD","YELLOW","GOLD","ZEBRA","BEIGE","RED"]
// ['Black','White','Grey','Blue','Red','Beige','Pink','Brown','Yellow','Orange','Green','Purple','Leopard', 'Zebra','Gold','Silver']

//Graph DB patterns
PATTERNS = ["FLORAL",
"STRIPE",
"ANIMAL",
"PRINT",
"DOT",
"SNAKE",
"LEOPARD",
"ZEBRA",
"PLAID",
"TWO COLOR"]
//['Leopard', 'Zebra', 'Animal', 'Floral','Dot','Plain','Print', 'Stripe', 'Geomatric Print', 'Camouflage', 'Plaid', 'Snake','Two Color']


//Graph DB Materials
MATERIALS = ["CHIFFON",
"FUR",
"LACE",
"LEATHER",
"SILK",
"TRANSPARENT",
"STITCH",
"JEANS",
"WOOL",
"SATIN",
"NYLON"]
//['Chiffon','Lace', 'Leather', 'Suede', 'Fur', 'Silk', 'Stitch', 'Nylon', 'Wool', 'Satin', 'Sequin','Shear', 'Jeans', 'Velvet','Transparent']


//Graph DB sleeves
SLEEVES =       
//['Sleeveless', 'Strapless', '3/4', 'One-Shoulder', 'Off-Shoulder', 'Short', 'Strap',  'Long', 'Asymmetric']
["LONG-SLEEVE",
"SLEEVELESS",
"CAP-SLEEVE",
"SHORT-SLEEVE",
"STRAP",
"STRAPLESS",
"3/4-SLEEVE",
"ASYMMETRIC-SLEEVE"]

//Graph DB Lengths
LENGTH = ["SHORT",
"LONG",
"MINI",
"MIDI",
"ASYMMETRIC",
"MAXI"]
//['Long','Short','Midi','Maxi','Asymmetric','Mini']

//Graph DB neck
neck =  ["ROUND-NECK",
"BOAT-NECK",
"V-NECK",
"COLLAR",
"HEART-NECK",
"SHIRT-DRESS",
"SQUARE-NECK",
"BARDOT-NECK",
"HALTER-NECK",
"HIGH-NECK"]
//       ['V','Round','Boat','Halter','Keyhole', 'Falling', 'Wide', 'Jewlled', 'Golf', 'High', 'Button-Down', 'Button', 'Turtle','Fur','Shear', 'Lace', 'Asymmetric', 'Square','Double', 'Collar','Heart']


//Graph DB misc
//MISC = ['Buttom','Combined Fabric','Flower','Zip','Belt','Wrap', 'Stud', 'Hood', 'Tulle','Back Zip', 'Feather', 'Ruffle','Puff','Sequin', 'Asymmetric Zip','Pocket', 'Pleat', 'Rivets', 'Peplum', 'Tear', 'Bow', 'Tie', 'Patch','On Shoulders','Open Shoulders', 'Fur Hood','Button']
MISC = ["OPEN BACK",
"CUT",
"CUTOUT",
"PLEAT",
"YOKE",
"TIE",
"PATCH",
"TEAR",
"FEATHER",
"LAYERS",
"BUTTON",
"RUFFLE",
"FLOWER",
"WRAP",
"VERTICAL STRIPE",
"BELT",
"POCKET",
"HOOD",
"BACK ZIP",
"OPENING AT THE BACK",
"STUD",
"BOW",
"PEPLUM"]



exports.QUESTIONS_VAL = {"Color" : COLORS, "Pattern" : PATTERNS, "Material" : MATERIALS, "Sleeve" : SLEEVES, "Length" : LENGTH,"Neck" : neck, "Misc" : MISC}

exports.QUESTIONS = { "Color" : "What color is the dress?",
					 "Pattern" : "What is the pattern of the dress?", 
					 "Material" : "What is the material of the dress?",
					 "Sleeve" : "What kind of sleeves the dress has?",
					 "Length" : "What is the length of the dress?",
					 "Neck" : "what kind of neck the dress has?",
					  "Misc" : "Any other properties of the dress?"}
					  
exports.QUESTIONS_ORDER = ["Color", "Pattern", "Material", "Sleeve", "Length", "Neck", "Misc"] 				  

imgPrefix = 'http://donde-app.com:2222/0.1/API/getImg/323232/img='
exports.IMAGES = {}
for (q in this.QUESTIONS_ORDER){
	cat = this.QUESTIONS_ORDER[q]
	this.IMAGES[cat] = {}
	for (val in this.QUESTIONS_VAL[cat]){
		this.IMAGES[cat][this.QUESTIONS_VAL[cat][val]] = imgPrefix + this.QUESTIONS_VAL[cat][val]
	}
	//console.log(IMAGES[cat])
}

