

////EXAMPLE search is its cold now
//START se = node:node_auto_index(name="Cold"), item =node:node_auto_index(type="item")
//MATCH (se) - [:RULE] -> () <- [] - (item)
//return item, item.name


//START se = node:node_auto_index(name="Cold")
//MATCH (se) - [:RULE] -> () <- [] - (item)
//WHERE item.type = "item"
//return item, item.name

