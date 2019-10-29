const elasticsearch = require('elasticsearch');
const config = require("./config");
const util = require("util");

exports.handler = async (event, context) => {
    const client = new elasticsearch.Client({
        host: config.elasticsearch.url,
        log: 'trace'
    });
    
    //Leer los mensajes tomados desde la cola en sqs
    for (const record of event.Records) {
        //extraer el body del mensaje
        let { body } = record;      
        if(body){
            //quitar los caractares especiales de escape para que no de error al serializar ya que el body es un string
            body = body.replace(/\\'/g, '"').replace(/\r?\n|\r/g, " ");
            //serializarlo en json
            body = JSON.parse(body);
            //igualmente serializar la propiedad Message que es donde finalmente viene el objeto que isertamos en SNS
            const product = JSON.parse(body.Message);
            console.log(util.inspect(product));
            //insertar la data en elasticsearch
            await client.index({
                index: config.elasticsearch.index,
                body: product
                });
        }            
    }
    return {
        statusCode: 200,
        body: JSON.stringify("Ok")
    };   
}