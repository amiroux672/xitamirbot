import fetch from "node-fetch";

const config = {
  name: "سيلفي",
  aliases: ["نينو"],
  description: "تحدث مع نينو",
  usage: "<اكتب فقط من تطوير امير حقيقي>",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "amiroux",
  extra: {}
};

async function onCall({message, args}) {
  const text = encodeURIComponent(args.join(" "));
  const url = `https://api.simsimi.vn/v1/simtalk?text=hi&lc=ar&key=`;
  const apiResponse = await fetch(url);
  const responseJson = await apiResponse.json();

  if (responseJson.success) {
    message.reply(responseJson.success);
  } else {
    message.reply("🥰");
  }
}

export default {
  config,
  onCall,
};