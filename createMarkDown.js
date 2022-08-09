const moment = require("moment");
const json2md = require("json2md");
const iconv = require("iconv-lite");
const createMarkDown = (currentIterationIssues, lastIterationIssues, currentWeek) => {
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
    const userDict = {}
    const emptyString = iconv.encode("", "utf8").toString()
    const title = {h3: iconv.encode("Remo Web/app 개발팀 작업 보고서", "utf8").toString()}
    const writeDate = {h4: iconv.encode(`written at ${currentWeek}`, "utf8").toString()}
    const headers = Object.keys(headersDict)
    const issueToRow = (issue) => {
        const dict = {}
        headers.forEach((header) => {
            if(header === "Users"){
                dict[header] = issue[header] ? iconv.encode(issue[header].map((user) => {
                    return user.name ? user.name : user.id
                }).join(","), "utf8").toString() : emptyString
                return;
            }else if(header === "Label") {
                dict[header] = issue[header] ? iconv.encode(issue[header].name,"utf8").toString() : emptyString
                return;
            }else if(header === "Iteration")  {
                dict[header] = issue[header] ? iconv.encode(`${issue[header].title} 시작일: ${issue[header].startDate}`,"utf8").toString(): emptyString;
                return;
            }
            else if(header === "Milestone") {
                dict[header] = issue[header] ? iconv.encode(`${issue[header].title} : ${issue[header].state}`, "utf8").toString() : emptyString
                return;
            }
            else if(header === "PullRequest")  {
                dict[header] = issue[header] ? iconv.encode(`제목: ${issue[header][0].title} 병합일: ${moment(issue[header][0].mergedAt).format("YYYY-MM-DD").toString()}`,"utf8").toString(): emptyString;
                return;
            }
            dict[header] = issue[header] ?iconv.encode(issue[header], "utf8").toString() : emptyString
        })
        return dict
    }
    const currentIterationTableRows = currentIterationIssues.map(issueToRow)
    const lastIterationTableRows = lastIterationIssues.map(issueToRow)
    currentIterationTableRows.forEach((issue) => {
        if(!userDict[issue.Users]) userDict[issue.Users] = {curr: [], last: []}
        userDict[issue.Users].curr.push(issue)
    })
    lastIterationTableRows.forEach((issue) => {
        if(!userDict[issue.Users]) userDict[issue.Users] = {curr: [], last: []}
        userDict[issue.Users].last.push(issue)
    })
    const pages = Object.entries(userDict).map(([key, {curr, last}]) => {
        const userNameTitle = {h1: iconv.encode(`작업자: ${key}`, "utf8").toString()}
        const currentIterationTitle = {h3: iconv.encode(`이번주 작업 ${currentIterationIssues[0].Iteration.title}`, "utf8").toString()}
        const currentIterationStartDate = {p: iconv.encode(`시작일: ${currentIterationIssues[0].Iteration.startDate}`, "utf8").toString()}
        const currentIterationDuration = {p: iconv.encode(`기간: ${currentIterationIssues[0].Iteration.duration}일`, "utf8").toString()}

        const currentIssueTable = {table: {headers, rows: curr}}
        const lastIterationTitle = {h3: iconv.encode(`지난주 작업 ${lastIterationIssues[0].Iteration.title}`, "utf8").toString()}
        const lastIterationStartDate = {p: iconv.encode(`시작일: ${lastIterationIssues[0].Iteration.startDate}`, "utf8").toString()}
        const lastIterationDuration = {p: iconv.encode(`기간: ${lastIterationIssues[0].Iteration.duration}일`, "utf8").toString()}
        const lastIssueTable = {table: {headers, rows: last}}
        return [
            userNameTitle,
            currentIterationTitle,
            currentIterationStartDate,
            currentIterationDuration,
            currentIssueTable,
            lastIterationTitle,
            lastIterationStartDate,
            lastIterationDuration,
            lastIssueTable
        ]
    })
    console.log(title)
    console.log(writeDate)
    console.log(pages)
    return json2md( [
        title,
        writeDate,
        ...pages
    ])
}

module.exports =createMarkDown;