var express = require('express');
var router = express.Router();
var formidable = require('formidable')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*  CARREGAMOS A EXTENSÃO FORMIDABLE, RECEBEMOS O FORM
    POSTADO PELO USUARIO E SALVAMOS O ARQUIVO ATRAVES DA FUNÇÃO
    FORM.PARSE*/
router.post('/upload', (req, res)=>{

  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  });

  form.parse(req, (err, fields, files)=>{

    res.json({
      files
      });
    });

});

module.exports = router;
