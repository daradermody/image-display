# image-display

> A Kibana plugin that displays images found in document attributes

## Installation
Copy the `image-display` directory into `kibana/plugins`

## Usage
This plugin adds a new visualisation type, _Image Display_, that allows you to look at all PNG images linked in an Elasticsearch document.

It requires that fields that contain image links are are configured with the `Url` formatter in Kibana. This can be done by configuring fields in _Management_ > _Index Patterns_

## Development Setup
Before following the instructions below, see the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions on setting up Kibana for your development environment.

1. Clone the repo into `kibana/plugins`
1. Run `npm install`
1. Run unit tests with `npm test`
    > Note: Unit tests currently do not run due to environment configuration issues
1. Import test data into Elasticsearch:
    ```bash
    curl -H 'Content-Type: application/x-ndjson' -XPOST \
        'localhost:9200/test-data/user/_bulk?pretty' \
        --data-binary @sample_data.json
    ```
1. Start Kibana by running `npm start` in the `kibana` repo
1. Create a new index pattern in Kibana: `test-data*`
1. Set the `banner` and `picture` fields to be formatted as `Url`s in _Management_ > _Index Patterns_
1. Create a new visualisation of type 'Image Display', and enter a valid index pattern and document ID
