const axios = require("axios");
const {ApolloClient} = require("apollo-client");
const {createHttpLink} = require("apollo-link-http");
const nodeFetch = require("node-fetch");
const {InMemoryCache, IntrospectionFragmentMatcher} = require("apollo-cache-inmemory");
const fs = require("fs");

exports.getToken = () => {
    try{
        const token = JSON.parse(fs.readFileSync('token.json'));
        return token
    }catch (e) {
        throw e;
    }
}
exports.createClient = async (token) => {

    const {data} = await axios.post("https://api.github.com/graphql", JSON.stringify({
        variables: {},
        query: `
			{
				__schema {
					types {
						kind
						name
						possibleTypes {
							name
						}
					}
				}
			}`
    }), {headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.token}`
        }})
    data.data.__schema.types = data.data.__schema.types.filter(
        type => type.possibleTypes !== null,
    );

    const client = new ApolloClient({
        link: createHttpLink({
            uri: "https://api.github.com/graphql",
            fetch:nodeFetch ,
            headers: {
                "Authorization": `Bearer ${token.token}`
            }
        }),
        cache: new InMemoryCache({fragmentMatcher: new IntrospectionFragmentMatcher({introspectionQueryResultData: data.data})}),
    });
    return client
}