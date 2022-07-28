const gql = require("graphql-tag");
const {ISSUE_FIELD_NAME, ISSUE_FIELD_VALUE, ISSUE_FIELD_PARSER} = require("./constValues");
const query = gql`
		query($PROJECT_ID: ID!, $Before: String){
    node(id: $PROJECT_ID) {
        ... on ProjectV2 {
          items(last: 100, before: $Before) {
            totalCount
            pageInfo{
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }
            nodes{
              id
              fieldValues(first: 20) {
                nodes{
                  __typename
                  ... on ProjectV2ItemFieldUserValue{
                    users(first: 3){
                      nodes{
                        id
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldRepositoryValue{
                    field{
                      ... on ProjectV2Field{
                        name
                        ... on ProjectV2Field{
                          name
                        }
                      }
                    }
                    repository{
                      id
                      name
                    }
                  }
                  ... on ProjectV2ItemFieldLabelValue{
                    field{
                      ... on ProjectV2FieldCommon{
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldMilestoneValue{
                    milestone{
                      id
                      title
                      state
                      closed
                      closedAt
                    }
                  }
                  ... on ProjectV2ItemFieldPullRequestValue{
                    __typename
                    pullRequests(first: 10){
                      edges {
                        cursor
                        node{
                        id
                        isDraft
                        title
                        bodyText
                        merged
                        closed
                        closedAt
                        createdAt
                        publishedAt
                        updatedAt
                        mergedAt
                        }
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldIterationValue{
                    id
                    title
                    startDate
                    duration
                  }
                  ... on ProjectV2ItemFieldTextValue {
                    text
                    field {
                      ... on ProjectV2FieldCommon {
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldDateValue {
                    date
                    field {
                      ... on ProjectV2FieldCommon {
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    field {
                      ... on ProjectV2FieldCommon {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
	`
const reformatIssueItems = (issueFields = []) => {
    return issueFields.map((issueFields) => {
        const dict = {}
        issueFields.forEach((field) => {
            ISSUE_FIELD_PARSER[ISSUE_FIELD_NAME[ISSUE_FIELD_VALUE[field.__typename]]](field, dict)
        })
        return dict
    })
}
const getProjectIssues = async (client, PROJECT_ID, params = {currentIteration: null, lastIteration: null}) => {
    if(!params.currentIteration) throw Error("Not found currentIteration")
    if(!params.lastIteration) throw Error("Not found lastIteration")
    let needNextCall = false;
    const {data} = await client.query({
        query,
        variables: {
            PROJECT_ID,
        },
    })
    const {pageInfo, nodes} = data.node.items;
    const {hasPreviousPage, startCursor} = pageInfo;
    console.log(pageInfo)
    const issueFields = nodes.map((item) => item.fieldValues.nodes)
    issueFields.forEach((fields) => {
        const iteration = fields.find((field) => field.__typename === ISSUE_FIELD_NAME.ITERATION)
        if(!iteration) return;
        if(!needNextCall) needNextCall = iteration.startDate === params.currentIteration.startDate || iteration.startDate === params.lastIteration.startDate
    })
    const issueList = reformatIssueItems(issueFields)
    if(needNextCall && hasPreviousPage){
        /**
         * 이전 페이지 데이터 추가 호출.
         */
    }else {
        /**
         * 탈출.
         */

    }
    return issueList;
}

module.exports = getProjectIssues