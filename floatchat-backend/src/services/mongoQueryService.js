
const mongoose = require('mongoose');

class MongoQueryService {
  async executeQuery(collection, query, options = {}) {
    try {
      const db = mongoose.connection.db;
      const col = db.collection(collection);
      
      const results = await col.find(query)
        .limit(options.limit || 100)
        .skip(options.skip || 0)
        .sort(options.sort || {})
        .toArray();

      return results;
    } catch (error) {
      throw new Error(`MongoDB query execution failed: ${error.message}`);
    }
  }

  async countDocuments(collection, query) {
    try {
      const db = mongoose.connection.db;
      const col = db.collection(collection);
      return await col.countDocuments(query);
    } catch (error) {
      throw new Error(`MongoDB count failed: ${error.message}`);
    }
  }
}

module.exports = new MongoQueryService();
