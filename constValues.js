const ISSUE_FIELD_NAME = Object.freeze({
    USER: "ProjectV2ItemFieldUserValue",
    REPOSITORY: "ProjectV2ItemFieldRepositoryValue",
    LABEL: "ProjectV2ItemFieldLabelValue",
    TITLE: "ProjectV2ItemFieldTextValue",
    STATUS: "ProjectV2ItemFieldSingleSelectValue",
    MILESTONE: "ProjectV2ItemFieldMilestoneValue",
    DATES: "ProjectV2ItemFieldDateValue",
    ITERATION: "ProjectV2ItemFieldIterationValue",
    PULL_REQUEST: "ProjectV2ItemFieldPullRequestValue"
})
const ISSUE_FIELD_VALUE =
    Object.freeze({
        ProjectV2ItemFieldUserValue: "USER",
        ProjectV2ItemFieldRepositoryValue: "REPOSITORY",
        ProjectV2ItemFieldLabelValue: "LABEL",
        ProjectV2ItemFieldTextValue: "TITLE",
        ProjectV2ItemFieldSingleSelectValue: "STATUS",
        ProjectV2ItemFieldMilestoneValue: "MILESTONE",
        ProjectV2ItemFieldDateValue: "DATES",
        ProjectV2ItemFieldIterationValue: "ITERATION",
        ProjectV2ItemFieldPullRequestValue: "PULL_REQUEST"

    })
const ISSUE_FIELD_PARSER = {
    ProjectV2ItemFieldUserValue: (field, dict) => {
        if(field.users){
            dict.Users = field.users.nodes.map((user) => {
                return {
                    id: user.id,
                    name: user.name
                }
            });
            return dict
        }
        dict.Users = null;
        return dict
    },
    ProjectV2ItemFieldRepositoryValue: (field, dict) => {
        dict.Repository = null;
        return dict
    },
    ProjectV2ItemFieldLabelValue: (field, dict) => {
        if(field.field){
            dict.Label = field.field
            return dict
        }
        dict.Label = null;
        return dict
    },
    ProjectV2ItemFieldTextValue: (field, dict) => {
        if(field.text) {
            dict[field.field.name] = field.text
            return dict
        }
        dict.Title = null
        return dict
    },
    ProjectV2ItemFieldSingleSelectValue: (field, dict) => {
        if(field.name){
            dict.Status = field.name;
            return dict;
        }
        dict.Status = null;
        return dict;
    },
    ProjectV2ItemFieldMilestoneValue: (field, dict) => {
        if(field.milestone){
            dict.Milestone = {
                title: field.milestone.title,
                state: field.milestone.state
            };
            return dict;
        }
        dict.Milestone = null;
        return dict
    },
    ProjectV2ItemFieldDateValue: (field, dict) => {
        if(field.date){
            dict[field.field.name] = field.date;
            return dict
        }
        return dict
    },
    ProjectV2ItemFieldIterationValue: (field, dict) => {
        if(field.id){
            dict.Iteration = {
                title: field.title,
                startDate: field.startDate,
                duration: field.duration
            }
            return dict
        }
        dict.Iteration = null
        return dict;
    },
    ProjectV2ItemFieldPullRequestValue: (field, dict) => {
        dict.PullRequest = field.pullRequests ? field.pullRequests.nodes : null
        return dict;
    }
}
exports.ISSUE_FIELD_NAME = ISSUE_FIELD_NAME;
exports.ISSUE_FIELD_VALUE = ISSUE_FIELD_VALUE;
exports.ISSUE_FIELD_PARSER = ISSUE_FIELD_PARSER;