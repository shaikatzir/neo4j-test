var neo4j = exports.neo4j = require('neo4j');
exports.db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');

