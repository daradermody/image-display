export default function (server) {

  const {callWithRequest} = server.plugins.elasticsearch.getCluster('data');

  server.route({
    path: '/api/image-display/getIndexPatterns',
    method: 'GET',
    handler(req, reply) {
      callWithRequest(req, 'search', {
        "index": ".kibana",
        "body": {
          "_source": ["title", "fieldFormatMap"],
          "query": {
            "match": {
              "_type": "index-pattern"
            }
          }
        }
      }).then(function (response) {
        reply(response.hits.hits.map(pattern => {
          pattern._source.fieldFormatMap = (pattern._source.fieldFormatMap) ? JSON.parse(pattern._source.fieldFormatMap) : {};
          return pattern._source;
        }));
      });
    }
  });

  server.route({
    path: '/api/image-display/get/{index}/{id}',
    method: 'POST',
    handler(req, reply) {
      callWithRequest(req, 'search', {
        "index": req.params.index,
        "body": {
          "_source": (req.payload.fields) ? req.payload.fields : '*',
          "query": {
            "match": {
              "_id": req.params.id
            }
          }
        }
      })
        .then(response => {
          if (response.hits.total == 0) {
            reply(`Could not find ID '${req.params.id}' in index '${req.params.index}'`).code(404);
          } else {
            reply(response.hits.hits[0]._source);
          }
        })
        .catch(error => {
          console.error(error);
          reply(error);
        });
    }
  });

}
