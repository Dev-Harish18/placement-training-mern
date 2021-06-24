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
  sheetData.map((row) => {
    for (let col of row) process.stdout.write(`${col} `);
    console.log("\n");
  });
  res.status(200).json({
    status: "success",
    data: {
      sheetData,
    },
  });
});

exports.updateSheetData = catchAsync(async (req, res, next) => {
  const googleSheets = req.googleSheets;
  const clientData = req.body.dataArray;

  const updatedData = await googleSheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "A1:X60",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: clientData,
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedData: updatedData.config.data.values,
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
  const sheetData = data.data.values;

  console.log(`sheetData:(${sheetData.length})`);
  sheetData.map((row) => {
    for (let col of row) process.stdout.write(`${col} `);
    console.log("\n");
  });

  let condition = "";

  filterData.forEach((filter, i) => {
    if (filter.index == 23 || filter.index == 4)
      condition += `row[${filter.index}] ${filter.operator} '${filter.value}'`;
    else condition += `row[${filter.index}] ${filter.operator} ${filter.value}`;
    if (i != filterData.length - 1) condition += "&&";
  });
  console.log("Condition:\n", condition);
  //Filtering the data array based the condition string
  const filteredData = sheetData.filter((row, index) => {
    let condition = "";
    filterData.forEach((filter, i) => {
      if (row[filter.index] != "-") {
        if (filter.index == 23 || filter.index == 4)
          condition += `row[${filter.index}] ${filter.operator} '${filter.value}'`;
        else
          condition += `row[${filter.index}] ${filter.operator} ${filter.value}`;
        condition += "&&";
      }
    });
    condition = condition.slice(0, -2);
    console.log("Condition:\n", condition);

    if (index == 0 || eval(condition)) return row;
  });
  console.log(`FilteredData:(${filteredData.length})`);

  res.status(200).json({
    status: "success",
    quantity: filteredData.length,
    data: {
      filteredData,
    },
  });
});
