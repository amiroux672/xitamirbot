const config = {
  name: "نسخ",
  description: "",
  usage: "[mentions?] [content]/[off]",
  cooldown: 3,
  permissions: [2],
};

if (!global.copy_888) {
  global.copy_888 = new Map();
}

async function onCall({ message, args }) {
  let content = args.join(" ");

  if (content === "off") {
    global.copy_888.delete(message.threadID);
    return await message.reply("عاجز..");
  }

  global.copy_888.set(message.threadID, Object.keys(message.mentions));

  await message.reply("ممكن");
}

export default {
  config,
  onCall,
};