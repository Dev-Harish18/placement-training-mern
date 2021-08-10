const { google } = require("googleapis");
const catchAsync = require("../utils/catchAsync");

exports.initSheet = catchAsync(async (req, res, next) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // Create client instance for auth
  const client = await auth.getClient();
  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });
  req.googleSheets = googleSheets;
  next();
});

exports.getSheetData = catchAsync(async (req, res, next) => {
  const googleSheets = req.googleSheets;
  const data = await googleSheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!A1:X60",
  });
  const sheetData = data.data.values;
//   sheetData.map((row) => {
//     for (let col of row) process.stdout.write(`${col} `);
//     console.log("\n");
//   });
  res.status(200).json({
    status: "success",
    data: {
      sheetData,
    },
  });
});


exports.filterSheetData = catchAsync(async (req, res, next) => {
  const googleSheets = req.googleSheets;
  const filterData = req.body.filterData;
  // {
  //   index:19,
  //   operator:'>=',
  //   value:80
  // }
  const data = await googleSheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!A1:X60",
  });
  //Extract Sheet Data
  const sheetData = data.data.values;

  //Filtering the data array based the condition string
  const filteredData = sheetData.filter((row, index) => {
    let condition = "";
    
    //Build condition string by iterating filter object array
    filterData.forEach((filter, i) => {
      //If cell is not empty
      if (row[filter.index] != "-") {
        //String Value
        if (filter.index == 23 || filter.index == 4)
          condition += `row[${filter.index}] ${filter.operator} '${filter.value}'`;
        //Integer Value
        else
          condition += `row[${filter.index}] ${filter.operator} ${filter.value}`;
        condition += "&&";
      }
    });
    
    //Remove last "&&" in condition string
    condition = condition.slice(0, -2);
    
    //Return those satisfy the condition and always return 1st row
    if (index == 0 || eval(condition)) return row;
  });

  res.status(200).json({
    status: "success",
    quantity: filteredData.length,
    data: {
      filteredData,
    },
  });
});
