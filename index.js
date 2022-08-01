const getCurrentIterationProjectsQuery = require("./getCurrentIteration");
const getProjectIssues = require("./getProjectIssues");
const {getToken, createClient} = require("./createClient");
const moment = require("moment");
const fs = require("fs")
const util = require("util")
const createMarkDown = require("./createMarkDown");
const {mdToPdf} = require("md-to-pdf");
const writeFile = util.promisify(fs.writeFile)
const dotenv = require("dotenv");
const argv = require("yargs/yargs")(process.argv.slice(2))
	.option('time', {
		alias: 't',
		describe: '시작 datetime(YYYY-MM-DD)'
	})
	.option('personalToken', {
		alias: 'k',
		describe: 'Github Personal Token'
	})
	.option('projectId', {
		alias: 'p',
		describe: 'Github Project id'
	})
	.demandOption(['time'], 'Please provide both run and path arguments to work with this tool')
	.help()
	.argv;
dotenv.config()
const PROJECT_ID = process.env.PROJECT_ID + "xx" || argv.p || argv.projectId;
async function managePrompts() {
	const inputWeek = argv.time || argv.t || new Date();
	const token = getToken() || argv.k || argv.personalToken || process.env.GHP_TOKEN + "xx";
	console.log(token);
	console.log(PROJECT_ID);
	const client = await createClient(token);
	const {currentIteration, lastIteration} = await getCurrentIterationProjectsQuery(client, PROJECT_ID, new Date());
	const Issues = await getProjectIssues(client, PROJECT_ID, {currentIteration, lastIteration});
	const currentIterationIssues = Issues.filter((issue) => {
		if(!issue.Iteration) return false;
		return issue.Iteration.startDate === currentIteration.startDate
	})
	const lastIterationIssues = Issues.filter((issue) => {
		if(!issue.Iteration) return false;
		return issue.Iteration.startDate === lastIteration.startDate
	})
	const currentWeek = moment(inputWeek).startOf("weeks").format("YYYY-MM-DD").toString() || moment().startOf("weeks").format("YYYY-MM-DD").toString();
	const markdown = createMarkDown(currentIterationIssues, lastIterationIssues)
	const fileTitle = `./output/${currentWeek}report`;
	const markdownExt = ".md"
	const pdfExt = ".pdf"
	await writeFile(`${fileTitle}${markdownExt}`,markdown);
	await mdToPdf(
		{content: markdown},
		{
			dest: `${fileTitle}${pdfExt}`,
			pdf_options: {format: "A2", margin: "20mm"},
			stylesheet: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css",
			body_class: "markdown-body",
			css: `|-
.page-break { page-break-after: always; }
.markdown-body { font-size: 11px; }
.markdown-body pre > code { white-space: pre-wrap; }}`
		})
}

managePrompts();