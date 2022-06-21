const request=require("request");
const jsdom=require("jsdom");
const playerDetails=require("./playerDetails");

// let url="https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/match-results";

function findMatches(url){
    request(url,(err,response,body)=>{
        if(err){
            console.log(err);
        }else if(response && response.statusCode==404){
            console.log("Oops! Page Not Found.");
        }else{
            // console.log("Data Received Sucessfully");
            getScoreCardLink(body);
        }
    })
}




function getScoreCardLink(allMatchPage){
    let JSDOM=jsdom.JSDOM;
    let dom=new JSDOM(allMatchPage);
    let document=dom.window.document;

    let allMatchDetailsArr=document.querySelectorAll(".ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent");
    for(let i=0;i<allMatchDetailsArr.length;++i)
    {
        let spanArr=allMatchDetailsArr[i].querySelectorAll("span>a");
        let eachScoreCardLink=spanArr[2].getAttribute("href");
        eachScoreCardLink="https://www.espncricinfo.com"+eachScoreCardLink;
        // console.log(eachScoreCardLink);
        playerDetails.extractPlayerData(eachScoreCardLink);
    }
}

module.exports={
    findMatches:findMatches
}