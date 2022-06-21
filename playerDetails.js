const request=require("request");
const jsdom=require("jsdom");
const fs=require("fs");
const path=require("path");
const folderCreater=require("./folderCreater");

// let url="https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";

function extractPlayerData(url)
{
    request(url,(err,response,body)=>{
        if(err){
            console.log(err);
        }else if(response && response.statusCode==404){
            console.log("!Oops Page Not Found.");
        }else{
            console.log("Data Retrieved Sucessfully.");
            getPlayerStat(body);
        }
    })
}

function getPlayerStat(playerStat){
    let JSDOM=jsdom.JSDOM;
    let dom=new JSDOM(playerStat);
    let document=dom.window.document;

    // let teamArr=document.querySelectorAll(".ds-text-tight-l.ds-font-bold");
    // console.log(teamOneName);
    // console.log(teamTwoName);
    let bothTeamData=document.querySelectorAll(".ds-bg-fill-content-prime.ds-rounded-lg");
    // let teamOneContent=bothTeamData[0].innerHTML;
    // let teamTwoContent=bothTeamData[1].innerHTML;
    // let scoreCard="<table>"+teamOneContent+"</table>"+"<table>"+teamTwoContent+"</table>";
    // fs.writeFileSync("table.html",scoreCard);
    let venue=document.querySelector(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid").textContent;
    // console.log(venue);
    let result=document.querySelector(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title").textContent;
    let teamOneName=bothTeamData[0].querySelector(".ds-py-3>.ds-text-tight-s.ds-font-bold.ds-uppercase").textContent.split("INNINGS")[0].trim();
    let teamTwoName=bothTeamData[1].querySelector(".ds-py-3>.ds-text-tight-s.ds-font-bold.ds-uppercase").textContent.split("INNINGS")[0].trim();
    teamParser(bothTeamData[0],teamOneName,teamTwoName,venue,result);
    teamParser(bothTeamData[1],teamTwoName,teamOneName,venue,result);

}

function teamParser(teamData,myTeam,opponentTeam,venue,result)
{
    let eachRowInTeam=teamData.querySelectorAll(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table>tbody>.ds-border-b.ds-border-line.ds-text-tight-s");
    for(let i=0;i<eachRowInTeam.length;++i)
    {
        let cols=eachRowInTeam[i].querySelectorAll("td");
        // console.log(cols.length);
        if(cols.length==8)
        {
            let playerName=cols[0].textContent.trim();
            let runs=cols[2].textContent;
            let balls=cols[3].textContent;
            let fours=cols[5].textContent;
            let sixes=cols[6].textContent;
            let sr=cols[7].textContent;
            // console.log(playerName+" "+runs+" "+balls+" "+fours+" "+sixes+" "+sr);
            let playerDataObj={
                playerName,runs,balls,fours,sixes,sr,opponentTeam,result,venue
            }
            teamAndPlayerFolderCreater(myTeam,playerName,playerDataObj);
        }
    }
    
}

function teamAndPlayerFolderCreater(teamName,playerName,playerDataObj)
{
    // create team name folder
    // if exist do nothing else create the folder
    let teamPath=path.join(__dirname,"IPL",teamName);
    folderCreater.dirCreater(teamPath);
    // create player .json file to store its data
    // if file present just update the data else create the file and then update the data
    let playerPath=path.join(teamPath,playerName+".xlsx");
    folderCreater.fileHandler(playerPath,playerDataObj);
}

module.exports={
    extractPlayerData:extractPlayerData
}