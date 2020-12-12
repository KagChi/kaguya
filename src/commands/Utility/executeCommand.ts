import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
import { exec } from 'child_process';
@CommandConf({ 
    name: "exec",
    aliases: ["$","bash"],
    description: "",
    usage: "",
    cooldown: 3,
    ownerOnly: true
})

export default class execCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        if (!args.join(" ")) return msg.channel.send("No parameter to execute. you're stuppid");
        const mu = Date.now();
        const command = `\`\`\`bash\n${args.join(" ")}\`\`\``;
        const emb = this.client.util.embed()
        .setColor(this.client.util.color)
        .addField("📥 INPUT", command);
  exec(args.join(" "), async (error, stdout: string, stderr: string) => {
  	if (stdout) {
	  	let output = `\`\`\`bash\n${stdout}\`\`\``;
	  	if (stdout.length > 1024) {
        output = await this.client.util.hastebin(stdout);
		  }
      emb.addField("📤OUTPUT", output);
  	} else if (stderr) {
  	    emb.setColor(this.client.util.color);
	  	let error = `\`\`\`bash\n${stderr}\`\`\``;
	  	if (stderr.length > 1024) {
        error = await this.client.util.hastebin(stderr);
		  }
      emb.addField("⛔ERROR", error);
  	} else {
	  	emb.addField("📤OUPUT", "```bash\n# Command executed successfully but returned no output.```");
  	}
	  return msg.channel.send(emb.setFooter(`⏱️ ${Date.now() - mu}ms`));
  });
    }
}