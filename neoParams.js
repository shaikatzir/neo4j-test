

//Graph DB colors
COLORS = ['Black','White','Grey','Blue','Red','Beige','Pink','Brown','Yellow','Orange','Green','Purple','Leopard', 'Zebra','Gold','Silver']


//Graph DB patterns
PATTERNS = ['Leopard', 'Zebra', 'Animal', 'Floral','Dot','Plain','Print', 'Stripe', 'Geomatric Print', 'Camouflage', 'Plaid', 'Snake','Two Color']
//Graph DB Materials
MATERIALS = ['Chiffon','Lace', 'Leather', 'Suede', 'Fur', 'Silk', 'Stitch', 'Nylon', 'Wool', 'Satin', 'Sequin','Shear', 'Jeans', 'Velvet','Transparent']


//Graph DB sleeves
SLEEVES =       ['Sleeveless', 'Strapless', '3/4', 'One-Shoulder', 'Off-Shoulder', 'Short', 'Strap',  'Long', 'Asymmetric']

//Graph DB Lengths
LENGTH = ['Long','Short','Midi','Maxi','Asymmetric','Mini']

//Graph DB neck
neck =         ['V','Round','Boat','Halter','Keyhole', 'Falling', 'Wide', 'Jewlled', 'Golf', 'High', 'Button-Down', 'Button', 'Turtle',
'Fur','Shear', 'Lace', 'Asymmetric', 'Square','Double', 'Collar','Heart']


//Graph DB misc
MISC = ['Buttom','Combined Fabric','Flower','Zip','Belt','Wrap', 'Stud', 'Hood', 'Tulle','Back Zip', 'Feather', 'Ruffle','Puff','Sequin', 'Asymmetric Zip','Pocket', 'Pleat', 'Rivets', 'Peplum', 'Tear', 'Bow', 'Tie', 'Patch','On Shoulders','Open Shoulders', 'Fur Hood','Button']

exports.QUESTIONS_VAL = {"Color" : COLORS, "Pattern" : PATTERNS, "Material" : MATERIALS, "Sleeve" : SLEEVES, "Length" : LENGTH,"Neck" : neck, "Misc" : MISC}

exports.QUESTIONS = { "Color" : "What color is the dress?",
					 "Pattern" : "What is the pattern of the dress?", 
					 "Material" : "What is the material of the dress?",
					 "Sleeve" : "What kind of sleeves the dress has?",
					 "Length" : "What is the length of the dress?",
					 "Neck" : "what kind of neck the dress has?",
					  "Misc" : "Any other properties of the dress?"}
					  
exports.QUESTIONS_ORDER = ["Color", "Pattern", "Material", "Sleeve", "Length", "Neck", "Misc"] 				  


