require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({urlencoded:true,extended:true}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

const shortUrls = {};
app.post('/api/shortUrl',function(req,res){
  if(req.body.url){
    if(validURL(req.body.url)){
      let shortUrl = Math.round(Math.random()*100000);
      shortUrls[shortUrl] = req.body.url;
      res.send({"original_url":req.body.url,"short_url":shortUrl});
    }
    else{
      res.json({error: 'invalid url'})
    }
  }
  else{
    res.json({error: 'invalid url'})
  }
})
app.get('/api/shortUrl/:url',function(req,res){
  console.log(shortUrls);
  if(shortUrls[req.params.url]){
    res.redirect(shortUrls[req.params.url]);
  }
  else{
    res.send('Not found')
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
