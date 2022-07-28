const moment = require("moment");
const json2md = require("json2md");
const createMarkDown = (currentIterationIssues, lastIterationIssues) => {
    const headersDict = {};
    currentIterationIssues.forEach((issue) => {
        const keyList = Object.keys(issue)
        keyList.forEach((key) => {
            headersDict[key] = key
        })
    })
    lastIterationIssues.forEach((issue) => {
        const keyList = Object.keys(issue)
        keyList.forEach((key) => {
            headersDict[key] = key
        })
    })
    const currentWeek = moment().startOf("weeks").format("YYYY-MM-DD").toString();
    const title = {h3: "Remo Web/app 개발팀 작업 보고서"}
    const writeDate = {h4: `written at ${currentWeek}`}
    const headers = Object.keys(headersDict)
    const issueToRow = (issue) => {
        const dict = {}
        headers.forEach((header) => {
            if(header === "Users"){
                dict[header] = issue[header] ? issue[header].map((user) => {
                    return user.name ? user.name : user.id
                }).join(",").toString() : ""
                return;
            }else if(header === "Label") {
                dict[header] = issue[header] ? issue[header].name : ""
                return;
            }else if(header === "Iteration")  {
                dict[header] = issue[header] ? `title: ${issue[header].title} startDate: ${issue[header].startDate} duration: ${issue[header].duration}`: "";
                return;
            }
            dict[header] = issue[header] ? issue[header].toString() : ""
        })
        return dict
    }
    const currentIterationTitle = {h3: `이번주 작업 ${currentIterationIssues[0].Iteration.title}`}
    const currentIterationStartDate = {p: `시작일: ${currentIterationIssues[0].Iteration.startDate}`}
    const currentIterationDuration = {p: `기간: ${currentIterationIssues[0].Iteration.duration}일`}
    const currentIterationTableRows = currentIterationIssues.map(issueToRow)
    const currentIssueTable = {table: {headers, rows: currentIterationTableRows}}
    const lastIterationTitle = {h3: `지난주 작업 ${lastIterationIssues[0].Iteration.title}`}
    const lastIterationStartDate = {p: `시작일: ${lastIterationIssues[0].Iteration.startDate}`}
    const lastIterationDuration = {p: `기간: ${lastIterationIssues[0].Iteration.duration}일`}
    const lastIterationTableRows = lastIterationIssues.map(issueToRow)
    const lastIssueTable = {table: {headers, rows: lastIterationTableRows}}
    return json2md( [
        title,
        writeDate,
        currentIterationTitle,
        currentIterationStartDate,
        currentIterationDuration,
        currentIssueTable,
        lastIterationTitle,
        lastIterationStartDate,
        lastIterationDuration,
        lastIssueTable
    ])
}

module.exports =createMarkDown;