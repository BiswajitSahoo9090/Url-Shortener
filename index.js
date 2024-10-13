const express = require('express');
const { connectToMongoDB } = require("./routes/connect");
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const staticRoute =require('./routes/staticRouter');
const app = express();
const PORT = 8001;
const path =require('path');


connectToMongoDB('mongodb://localhost:27017/short-url')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));


  app.set("view engine" ,"ejs");
  app.set('views',path.resolve('./views'));

app.use(express.json()); //middleware
app.use(express.urlencoded({extended:false}));

app.get("/test" ,async (req,res) =>{

     const allUrls = await URL.find({}); //short ul get
  return res.end(`
    <html>
    <head></head>
    <body>
    <ol>
    ${allUrls.map(url => `<li>${url.shortId} -${url.redirectURL} -${url.visitHistory.length}</li>`).join('')}
    </ol>
    </body>
    </html>
    `);
})


// app.get('/test1', async (req, res) => {
//   try {
//     const allUrls = await URL.find({});
//     return res.render('home',{
//       urls:allUrls,
//     });
//     // return res.send(`
//     //   <html>
//     //     <head></head>
//     //     <body>
//     //       <ol>
//     //         ${allUrls.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`).join('')}
//     //       </ol>
//     //     </body>
//     //   </html>
//     // `);
//   } catch (error) {
//     res.status(500).send('Error fetching URLs');
//   }
// });


app.use('/url', urlRoute);
app.use("/" ,staticRoute);

app.get('/url/:shortId', async (req, res) => {
  try {
    const shortId = req.params.shortId;  // Corrected from req.param to req.params
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }  // Return the updated document
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error('Error finding and updating the URL:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
