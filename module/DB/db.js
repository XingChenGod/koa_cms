const MongoClient = require('mongodb').MongoClient;

const ObjectID = require('mongodb').ObjectID;

const config = require('./config');

// 单例模式
class Db {
    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor() {
        this.dbClient = null; // 放db对象
        this.connect();
    }

    // 连接数据库
    connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.url, {useNewUrlParser: true}, (err, client) => {
                if (!this.dbClient) {
                    // 没有进行连接
                    this.dbClient = client.db(config.dbName);
                }
                if (err) {
                    reject(err);
                }
                // 进行了连接
                resolve(this.dbClient);
            });
        });
    }

    // 查询
    find(collectionName, json = {}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const res = db.collection(collectionName).find(json);
                res.toArray((err, docs) => {
                   if (err) {
                       reject(err);
                   } else {
                       resolve(docs);
                   }
                });
            })
        })
    }

    // 增加
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertOne(json, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })
            })
        })
    }

    // 更新
    update(collectionName, oldJson, newJson) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(oldJson, {
                    $set: newJson
                })
                    .then((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
            })
        })
    }

    // 删除
    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).removeOne(json, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })
            })
        })
    }

    // ObjectID,mongodb通过id查询
    getObjectId(id) {
        return new ObjectID(id);
    }
}

module.exports = Db.getInstance();
