const request=require("request");
const jsdom=require("jsdom");
const allScoreCard=require("./AllScorecard");
const folderCreater=require("./folderCreater");
const fs=require("fs");
const path=require("path");

let iplFolderPath=path.join(__dirname,"IPL");
folderCreater.dirCreater(iplFolderPath);

let url="https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/";

// request the HTML content from the main cricinfo page

request(url,(err,response,body)=>{
    if(err){
        console.log(err);
    }else if(response && response.statusCode==404){
        console.log("Oops! Page Not Found.");
    }else{
        // console.log("Data Received Sucessfully");
        getFullMatchLink(body);
    }
})

function getFullMatchLink(iplData){
    let JSDOM=jsdom.JSDOM;
    let dom=new JSDOM(iplData);
    // convert the HTML into a document 
    let document=dom.window.document;
    // get the button link for all mathches
    let allLinksArr=document.querySelectorAll(".ds-py-3.ds-px-4>span>a");
    let resultLink=allLinksArr[0].getAttribute("href");
    resultLink="https://www.espncricinfo.com"+resultLink;
    // then go to all matches link and then do the required task
    allScoreCard.findMatches(resultLink);
}