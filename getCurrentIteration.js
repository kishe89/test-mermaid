const gql = require("graphql-tag");
const moment = require("moment");
const getCurrentIterationProjectsQuery = async (client, PROJECT_ID, CURRENT_DATE_TIME) =>{
    const query = {
        query: gql`
			query($PROJECT_ID: ID!){
				node(id: $PROJECT_ID){
					... on ProjectV2{
						fields(last: 100){
							nodes{
								... on ProjectV2IterationField{
									name
									configuration{
										iterations{
											id
											title
											startDate
											duration
										}
										completedIterations{
											id
											title
											startDate
											duration
										}
									}
								}
							}
						}
					}
				}
			}
		`,
        variables: {PROJECT_ID}
    }
    let isPrevIterationTime = false;
    let isPrevLastIterationIndex = 0;
    const {data} = await client.query(query);
    const iterationData = data.node.fields.nodes.find((item) => item.__typename === "ProjectV2IterationField");
    const {iterations, completedIterations} = iterationData.configuration;
    const currTime = new moment(CURRENT_DATE_TIME).startOf("weeks").format("YYYY-MM-DD").toString();
    const isExistCurr = iterations.find((iter) => iter.startDate === currTime);
    if(isExistCurr)  isPrevIterationTime = false;
    else isPrevIterationTime = true;
    const currentIteration = !isPrevIterationTime ? isExistCurr : completedIterations.find((iter, index) => {
        isPrevLastIterationIndex = index;
        return iter.startDate === currTime
    });
    const lastIteration = !isPrevIterationTime ? completedIterations[0] : completedIterations[isPrevLastIterationIndex + 1]
    return {currentIteration, lastIteration};
}
module.exports = getCurrentIterationProjectsQuery