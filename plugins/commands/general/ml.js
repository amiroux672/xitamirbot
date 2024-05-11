const config = {
  name: "وقت",
  aliases: ["upt"],
  permissions: [2],
  credits: "vml"
};

async function onCall({ message }) {
  const uptimeInSeconds = process.uptime();
  const hours = Math.floor(uptimeInSeconds / 3600);
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeInSeconds % 60);

  try {
    const replyMessage = await message.reply(`==منصت الوقت بوتة==
${hours} ساعة: ${minutes} دقيقة: ${seconds}  ثانية  
`);
    console.log(replyMessage);
  } catch (error) {
    console.error(error);
  }
}

export default {
  config,
  onCall,
};