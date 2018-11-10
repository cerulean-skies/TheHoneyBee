let wls = require("wlsjs");
wls.api.setOptions({ url: 'ws://188.166.99.136:8090' });
wls.config.set('address_prefix', 'WLS');
wls.config.set('chain_id', 'de999ada2ff7ed3d3d580381f229b40b5a0261aec48eb830e540080817b72866');
const fs = require("fs");
let color = require("colors")




const { Client, Attachment } = require('discord.js');
const client = new Client();




let finalAuthor = '';
let finalPermlink = '';
let count = 0;
let postCount = 0;
// start();

let foundPosts = 0;

var filePath = './new.html';
fs.unlink('./new.html',function(err){
     if(err) return console.log('HTML File not found. Will create for you.'.red.bold);
     console.log('File Deleted Successfully; Will Rewrite Apon Completion.'.green.bold);
});

let post = '';
let author = '';
// finalAuthor = '';
// console.log(author);
let title = '';
let permlink = '';
// finalPermlink = '';
// finalPermlink = permlink;
// console.log(author);
let body = '';
let created = '';
let value = '';
let bodyLength = '';


var runtime = new Date();
let daysOld = new Date();
// runtime.setDate(runTime.getDate() - 0)
daysOld.setDate(runtime.getDate() - 5)

// console.log("Today is: ", runtime,'\nChecking posts before: ' + daysOld);
let offset = 0;

let ONE_MINUTE = 60 * 1000;

let ONE_HOUR = 60 * 60 * 1000; /* ms */
let FIVE_HOURS = ONE_HOUR * 5;
let FOUR_DAYS = ONE_HOUR * 96;

var now = new Date();
offset = now.getTimezoneOffset();
let UTCtime = now.getTime() + offset * ONE_MINUTE;

let hourAgo = UTCtime - FOUR_DAYS;

console.log("Getting First Post.".green.bold);
getFirstData();
let posts = [];



function getFirstData(){
  wls.api.getDiscussionsByCreated({"tag": "", "limit": 10}, function(error, result) {
    // count++;
      if (error || !result) { // Check for Errors
          console.log('Something is wrong: ' + error); // Output Error
          return;
      }
      finalAuthor = result[0].author;
      finalPermlink = result[0].permlink;
      // for (n in result){
      //   let post = result[n];
      //   let author = post.author;
      //   finalAuthor = author;
      //   // console.log(author);
      //   let title = post.title;
      //   let permlink = post.permlink;
      //   finalPermlink = permlink;
      //   // finalPermlink = permlink;
      //   console.log(author);
      // }
      // console.log(finalAuthor);


    });
    setTimeout(function(){
        // console.log("RUNNING NOW!!!!");

        getMore(finalAuthor, finalPermlink, count);
        // console.log(finalAuthor);
        // console.log(finalPermlink);

  }, 1000);
}




  function getMore(finalAuthor, finalPermlink, count){
    count++;
    // console.log("Loop: ".green.bold,count.toString().yellow.bold);
    let newPostCount = postCount + 10;
    console.log("Filtering Through Posts: ".red.bold, postCount.toString().yellow.bold, " - ".red.bold, newPostCount.toString().yellow.bold);

    postCount += 10;

    if (count > 1000) {
      process.exit(1);
    }
    console.log("Using data Final author: ", finalAuthor, "and final permlink", finalPermlink);
    wls.api.getDiscussionsByCreated({"tag": "", "limit": 10, "start_permlink": finalPermlink, "start_author": finalAuthor}, function(error, result) {
        if (error || !result) { // Check for Errors
            console.log('Something is wrong: ' + error); // Output Error
            return;
        }
        for (n in result){
           post = result[n];
           author = post.author;
          finalAuthor = author;
          // console.log(author);
           title = post.title;
           permlink = post.permlink;
          finalPermlink = permlink;
          // finalPermlink = permlink;
          // console.log(author);
           body = post.body;
           created = post.created;
           value = post.pending_payout_value;
           bodyLength = post.body_length;

          let valueWLS = parseFloat(value);

          let dates = Date.parse(created);

          // if (dates < hourAgo) {
          //   console.log('Post is older than five hours!');
          //   foundPosts++
          //   console.log("Found Posts: ", foundPosts);
          // }



          if (valueWLS <= 40.00 && bodyLength >= 3000 && dates < hourAgo){
            if (foundPosts < 50) {

            console.log('Post Author: '.yellow.bold,'@'.blue.bold+author.blue.bold);
            console.log('Post Title: '.yellow.bold+title.blue.bold);
            // console.log('Post Permlink:\n'.yellow.bold+permlink.blue.bold);
            console.log('Post Body Size in Chars: '.yellow.bold+bodyLength.toString().blue.bold);
            console.log('Post Created @: '.yellow.bold+created.blue.bold);
            console.log('Post Valued @: '.yellow.bold+value.blue.bold + "\n".blue.bold);
            foundPosts++
            console.log("Found Posts: ", foundPosts);
            let url = 'https://whaleshares.io/@' + author + '/' + permlink;
            let obj = {'Author':author, 'Title':title, 'BodySize':bodyLength, 'Creation Date':created, 'Value':value, 'URL':url};
            posts.push(obj);
            let string = '<h1><a href="'+url+'">'+'Author: '+obj.Author + " Title: "+obj.Title + "  Payout: " + obj.Value+'</a></h1>';
            let string1 = '<h1><a href="'+url+'">'+'Author: '+obj.Author + "<br>Title: "+obj.Title + " <br>Payout: " + obj.Value+ "<br>Body Size: "+ obj.BodySize+'</a></h1>';

            write(string1);

            }
            if (foundPosts >= 50) {
              console.log(posts);
              console.log("Writing file and exiting.");
              client.login('CLIENT-TOKEN');

              // writeNow();
              setTimeout(function(){
              process.exit(1);
            }, 1200);

            }
          }
        }
       });
       setTimeout(function(){
           // console.log("RUNNING NOW!!!!");


           getMore(finalAuthor, finalPermlink, count);
           // console.log(finalAuthor);
           // console.log(finalPermlink);

     }, 1200);

  }
  //
  // function writeNow(){
  //   writeFile(posts);
  //
  // }



  // function writeFile(array){
  //   var fs = require('fs')
  //   var logger = fs.createWriteStream('log.html', {
  //     // flags: 'a' // 'a' means appending (old data will be preserved)
  //   })
  //   for (n in array){
  //     let post = posts[n];
  //     let url = post.URL;
  //     let string = '<h1><a href="'+url+'">'+'Author: '+post.Author + " Title: "+post.Title + "  Payout: " + post.Value+'</a></h1>';
  //     let string1 = '<h1><a href="'+url+'">'+'Author: '+post.Author + "\nTitle: "+post.Title + " \nPayout: " + post.Value+ "Body Size: "+ post.BodySize+'</a></h1>';
  //     console.log(string);
  //
  //     logger.write(string + "\n") // append string to your file
  //   }
  //
  //   // logger.write('more data') // again
  //   // logger.write('and more') // again
  //   logger.end() // close string
  //   console.log("(+) Writen to file.");
  //
  //   setTimeout(function(){
  //
  //   process.exit(1);
  // }, 2000);
  //
  //
  // }



function write(data){
  fs.appendFile('new.html', data+ "\n", function (err) {
   if (err) return console.log(err);
   // console.log('Appended!');
});
}



client.on('ready', () => {
  console.log('Hey there worker bees!');
  const attachment = new Attachment('https://i.imgur.com/w3duR07.png');

  client.channels.get('CHANNEL_ID').send(`Hey there worker bees! Just dropping off some fresh pollen, **enjoy!!**`, {
files: [
  "./new.html"
]
});
});
