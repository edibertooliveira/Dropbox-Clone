var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs')

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

// DELETE DA PASTA UPLOAD
router.delete('/file', (req, res) =>{
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  });

  form.parse(req, (err, fields, files)=>{
    let path = './' + fields.path;
    
    if (fs.existsSync(path)){
      fs.unlink(path, err=>{
              
        if (err) {
          res.status(400).json({
            err
          });
        }else{
          res.json({
            fields
            });
        }
      });
    }
  });
});

module.exports = router;
