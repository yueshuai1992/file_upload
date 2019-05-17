var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var Thenjs = require('thenjs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/upload', function(req, res, next) {

    var form = new multiparty.Form();
    form.uploadDir = "./tmp"; //本网站的根目录下下面执行复制的时候回报 cross-device link not permitted
    form.parse(req, function(err, fields, files) {
        Thenjs.each(files.data, function(cont, element) {
            fs.renameSync(element.path, './uploadFile/' + element.originalFilename, function(err) { //执行复制操作，从临时目录复制到uploadFile目录
                fs.unlinkSync(element.path); //删除临时文件
            });
            cont(null, element.originalFilename);
        }).fin(function(cont, error, result) {
            res.send(JSON.stringify({ result: 1, fileName: result.join('|') }));
        });
    });

});

module.exports = router;