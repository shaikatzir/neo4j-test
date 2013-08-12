

/////Cache number of search on item

////reset all items - 'searches' value
//START item=node:node_auto_index(type="item")
//SET item.searches = 0
//RETURN item.name , item.searches

////count 'searches' and cache the value
//START item=node:node_auto_index(type="item")
//MATCH (item) <- [:SEARCH] - (other)
//WITH item, count(other) as searches
//SET item.searches = searches
//RETURN item.name , item.searches


