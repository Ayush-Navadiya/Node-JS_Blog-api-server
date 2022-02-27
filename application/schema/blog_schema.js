let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blog_schema = Schema({
    title: {
        type: String,
        required: true
    },
    short_des: {
        type: String,
        required: true
    },
    des: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    meta_title: {
        type: String,
        required: true
    },
    meta_desc: {
        type: String,
        required: true
    },
    meta_keyword: {
        type: String,
        required: true
    },
    seo_url: {
        type: String,
        required:true
    },
    status: {
        type: Number,
        default: 1
    },
    updated_date: {
        type: Date,
        default: Date.now
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    is_deleted: {
        type: Number,
        default: 0
    },
}, {collection: 'blog_master'});

let Blog = module.exports = mongoose.model('webin.blog_master', blog_schema);
module.exports.get = function (callback, limit) {
    Blog.find(callback).limit(limit);
};
