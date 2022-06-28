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
const shortUrls = {};
app.post('/api/shortUrl',function(req,res){
  if(req.body.url){
    if(dns.lookup(req.body.url,(err,addresses)=>{
      return err;
    })){
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
