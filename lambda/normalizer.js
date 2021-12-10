const normalizeEvent = event => {
    return {
        method: event['requestContext']['httpMethod'],
        data: event['body'] ? JSON.parse(event['body']) : {},
        querystring: event['queryStringParameters'] || {},
        pathParameters: event['pathParameters'] || {},
    };
};

module.exports = normalizeEvent;