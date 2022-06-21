let fs=require("fs");
const path = require("path");
// npm  i xlsx
const xlsx = require("xlsx");

function dirCreater(dirPath)
{
    // console.log(dirPath);
    let isDirExist=fs.existsSync(dirPath);
    if(isDirExist==false)
    {
        fs.mkdirSync(dirPath);
    }
}

function fileHandler(filePath,playerDataObj)
{
    let isFileExist = fs.existsSync(filePath);
    let arr = [];
    if(isFileExist==false)
    {
        // fileCreator(filePath,playerDataObj);
        arr.push(playerDataObj);
        excelWriter(filePath,arr);
    }
    else
    {
        // fileUpdater(filePath,playerDataObj);
        arr=excelReader(filePath);
        arr.push(playerDataObj);
        excelWriter(filePath,arr);
    }
}

// JSON.stringigy -> write data in JSON format
// JSON.parse  -> read data in JSON format

function fileCreator(filePath,playerDataObj)
{
    let playerObjArr=[playerDataObj];
    fs.writeFileSync(filePath,JSON.stringify(playerObjArr));
}

function fileUpdater(filePath,playerDataObj)
{
    let dataBuffer=fs.readFileSync(filePath);
    let playerObjArr=JSON.parse(dataBuffer);
    playerObjArr.push(playerDataObj);
    fs.writeFileSync(filePath,JSON.stringify(playerObjArr));
}

function excelReader(filePath) {
    // file -> read -> workbook
    let wb = xlsx.readFile(filePath);
    // get a worksheet from a workbook
    let excelData = wb.Sheets["sheet1"];
    // sheet -> json
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
function excelWriter(filePath, json) {
    // console.log(xlsx.readFile(filePath));
    // empty workbook
    let newWB = xlsx.utils.book_new();
    //  worksheet   
    let newWS = xlsx.utils.json_to_sheet(json);
    // wb -> put worksheet -> worksheet name -> sheet1
    xlsx.utils.book_append_sheet(newWB, newWS, "sheet1");
    // worksheet create 
    xlsx.writeFile(newWB, filePath);
}

module.exports={
    dirCreater:dirCreater,
    fileHandler:fileHandler
}