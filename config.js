const config = {
    elasticsearch: {        
        url: process.env.ELASTIC_URL,
        index: process.env.INDEX
    }
}

module.exports = config;