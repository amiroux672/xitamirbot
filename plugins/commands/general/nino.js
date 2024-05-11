import fetch from "node-fetch";

const config = {
  "name": "نينو",
  "aliases": ["نينو"],
  "description": "تحدث مع نينو",
  "usage": "<اكتب فقط من تطوير امير حقيقي>",
  "cooldown": 3,
  "permissions": [0, 1, 2],
  "credits": "amiroux",
  "extra": {}
};

async function onCall({message, args}) {
  const text = encodeURIComponent(args.join(" "));
  const url = `https://simsimi.fun/api/v2/?mode=talk&lang=ar&message=${text}&filter=true`;
  const apiResponse = await fetch(url);
  const responseJson = await apiResponse.json();

  if (responseJson.success) {
    message.reply(responseJson.success);
  } else {
    message.reply("لم افهمك^-^");
  }
}

export default {
  config,
  onCall,
};