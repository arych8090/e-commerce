import {Kafka} from "Kafkajs";

const kafka =  new Kafka({
	clientId :"User",
	brokers:['localhost:9000']
});

const admin = kafka.admin();
admin.connect();

admin.createTopics({
	topics :  [{
		topic:"userkafka",
		numPartitions:5,
		replicationFactor:5,
		configEntries:[
			{name:"retention.ms" , value:"604800000"},
			{name:"segement.bytes" , value:"524288000"}]
		 }]});

export {kafka}
