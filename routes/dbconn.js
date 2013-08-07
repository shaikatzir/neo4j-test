var neo4j = exports.neo4j = require('neo4j');
//exports.db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');
exports.db = new neo4j.GraphDatabase('http://ec2-50-19-150-210.compute-1.amazonaws.com:7474');

