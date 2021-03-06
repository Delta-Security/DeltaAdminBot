const Discord = require("discord.js");
const config = require(`../config.json`)
const node = require('nodeactyl');
const Client = node.Client;
const mysql = require('mysql');
const con = mysql.createConnection({
    connectionLimit: 20,
    host: config.dbhost,
    port: config.dbport,
    user: config.dbuser,
    password: config.dbpass,
    database: config.db,
});

module.exports.run = async (client, message, args) => {
	if(!args[0]) return message.channel.send("Use: #getServerInfo [Server ID]").then(msg => msg.delete(3000)); // Proper Usage
		  let NotRegistered = new Discord.MessageEmbed()
  .setAuthor(client.user.username, client.user.avatarURL())
  .setColor("#FF0000")
  .setDescription("❎ | You are not registered on our systems. Please proceed to register at **__http://deltasec.systems/register.php__**")
  .setFooter('API Latency is ' + `${Date.now() - message.createdTimestamp}` + ' ms, Proudly Hosted by DeltaSec', client.user.avatarURL())
  .setTimestamp()
  
  let ErrCon = new Discord.MessageEmbed()
  .setAuthor(client.user.username, client.user.avatarURL())
  .setColor("#FF0000")
  .setFooter('API Latency is ' + `${Date.now() - message.createdTimestamp}` + ' ms, Proudly Hosted by DeltaSec', client.user.avatarURL())
  .setTimestamp()
  .setDescription("❎ | There was an error connecting to the database. Please report this issue to the developers")
  
	var userid = message.author.id; // The author of the message (ID) is stored in variable userid
	con.query(`SELECT * FROM users WHERE discordid = '${userid}'`, function (err, result, fields) { // Basic MySQL Query to select everything from users where discordis = the author of the message (ID).
	        if(err) return message.channel.send(ErrCon);
			if (result.length == 0) return message.channel.send(NotRegistered);      
	        var rows = JSON.parse(JSON.stringify(result[0])); // parses the json result into rows
	        if(rows.api_type == "Client" || rows.api_type == "client") { // If API_type is Client or client
		        
	        	/* Logging into the pterodactyl panel */
		        Client.login(rows.host, rows.api, (logged_in, err) => {
		    	console.log(logged_in); // True or False (Logged in or not logged in)

		    	Client.getServerInfo(args[0]).then(response => {
		    	if(!response.object) return message.channel.send(`The request could not be processed.`);

				var name = response.attributes.name;
				let namee = new Discord.MessageEmbed()
				.setAuthor(client.user.username, client.user.avatarURL())
		    	.setColor(`#43f967`)
		    	.addField("Name", name) // RAM Allocated 
		    		message.channel.send(namee);
				}).catch((error) => {
				    throw error;
				});

		    	/* getRAMUsage(`ServerID`)  */
		    	Client.getRAMUsage(args[0]).then(response1 => {
		    		if(!response1.current) return;
		    		var ramusage = response1.current;
		    		var ramusagemax = response1.limit;
		    		let rame = new Discord.MessageEmbed()
		    		.setColor(`#43f967`)
		    		.addField("RAM", `${ramusage} MB / ${ramusagemax} MB`) // 
		    		message.channel.send(rame);
				}).catch((error) => {
				    throw error;
				});
				/* getCPUUsage(`ServerID`)  */
				Client.getCPUUsage(args[0]).then(response3 => {
					if(!response3.current) return;
					var cpuusage = response3.current;
					var cpuusagemax = response3.limit;
					let cpue = new Discord.MessageEmbed()
		    		.setColor(`#43f967`)
		    		.addField("CPU", `${cpuusage} % / ${cpuusagemax} %`) //
		    		message.channel.send(cpue);
				}).catch((error) => {
				    throw error;
				});
				/* getDiskUsage(`ServerID`)  */
				Client.getDiskUsage(args[0]).then(response2 => {
					if(!response2.current) return;
					var diskusage = response2.current;
					var diskusagemax = response2.limit;
					let diske = new Discord.MessageEmbed()
		    		.setColor(`#43f967`)
		    		.addField("Disk", `${diskusage} MB / ${diskusagemax} MB`) // 
		    		message.channel.send(diske);
				}).catch((error) => {
				    throw error;
				});

			});      
	}
	else{
		let command_api = "Client";
		let wrongapi = new Discord.MessageEmbed()
		  .setAuthor(client.user.username, client.user.avatarURL())
		  .setColor("#FF0000")
		  .setDescription(`❎ | You are registered on our systems but the API is not ${command_api}. To update the API, head on to **__http://deltasec.systems/__**`)
		  .setFooter('API Latency is ' + `${Date.now() - message.createdTimestamp}` + ' ms, Proudly Hosted by DeltaSec', client.user.avatarURL())
		  .setTimestamp()
		message.channel.send(wrongapi) // If API_Type is not Client
	}
	})
}

module.exports.help = {
    name: "getServerUsage"
}
