import axios from 'axios';
import fs from 'fs';

const config = {
  name: "fakechat",
  aliases: ["fc"],
  description: "Create screenshot of a fake chat!",
  usage: "[mention/reply]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Isai Ivanov"
};

const supportedType = ["photo", "animated_image"];

async function findUid(link) {
  console.log(link)
  const headers = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "cf_clearance=cKPchDexjMho8lRoEIT_GznuxNGCpujdYm..IH2Ez5Q-1688495333-0-250",
    "Referer": "https://id.traodoisub.com/",
    "Referrer-Policy": "same-origin"
  };

  const body = new URLSearchParams({ link }).toString();

  try {
    const response = await fetch("https://id.traodoisub.com/api.php", {
      method: "POST",
      headers,
      body
    });

    const data = await response.json();

    if (!data.id) {
      let error = new Error(data.error);
      error.name = "APIError";
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


function upload(url) {
  return new Promise(resolve => {
    axios
      .post("https://imgbb.sheikhferdous1.repl.co/upload", {
        imageURL: url
      })
      .then(response => {
        resolve(response.data.imgbbLink);
      })
      .catch(error => {
        console.error(error);
        resolve(null);
      });
  });
}

async function onCall({ message, args, data }) {
  let modifiedMsg = message.body;
  let prefix = data?.thread?.data?.prefix || global.config.PREFIX;
  const { type, messageReply, senderID, mentions } = message;
  let id = undefined;
  let image = '';
  // Check if modifiedMsg ends with | followed by numbers
  const regex = /\|\s*(\d+)$/; // Matches | followed by numbers
  const match = modifiedMsg.match(regex);

  const facebookRegex = /\| (?:http(?:s)?:\/\/(?:www\.|m\.)?(?:facebook|fb)\.com\/(?:[\w-]+\/)?(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile\.php\?id=(?=\d.*))?[\w\.-]+)/;
  const facebookMatch = modifiedMsg.match(facebookRegex);

  const facebookLink = facebookMatch ? facebookMatch[0].replace("| ", "").trim() : null;


  if (type === 'message_reply' && Object.keys(mentions).length === 0) {
    if (modifiedMsg.endsWith("| me")) {
      id = message.senderID;
      modifiedMsg = await modifiedMsg.substring(0, modifiedMsg.lastIndexOf(" | me")).trim();
    } else if (match) {
      id = await match[1];
    } else if (facebookMatch) {
      const uid = facebookLink;
      id = await findUid(uid);
    } else {
      id = messageReply.senderID;
    }

    let { attachments } = messageReply;
    if (attachments.length) {
      let filteredAttachments = attachments.filter(attachment =>
        supportedType.includes(attachment.type)
      );
      if (filteredAttachments.length > 0) {
        image = `&imageLink=${await upload(filteredAttachments[0].url)}`;
      }
    }
  } else if (Object.keys(mentions).length > 0 && type !== 'message_reply') {
    id = Object.keys(mentions)[0];
  } else if (Object.keys(mentions).length > 0 && type === 'message_reply') {
    id = Object.keys(mentions)[0];
    let { attachments } = messageReply;
    if (attachments.length) {
      let filteredAttachments = attachments.filter(attachment =>
        supportedType.includes(attachment.type)
      );
      if (filteredAttachments.length > 0) {
        image = `&imageLink=${await upload(filteredAttachments[0].url)}`;
      }
    }
  } else if (modifiedMsg.endsWith("| me")) {
    id = message.senderID
    modifiedMsg = await modifiedMsg.substring(0, modifiedMsg.lastIndexOf(" | me")).trim();
  } else if (match) {
    id = await match[1];
  } else if (facebookMatch) {
    const uid = facebookLink;
    id = await findUid(uid);
  } else {
    id = senderID;
  }

  const profilePicUrl = await global.getAvatarURL(id);
  const response = await axios.head(profilePicUrl);
  const finalUrl = response.request.res.responseUrl;
  let Name = await global.controllers.Users.getName(id) || "Facebook user";

  if (!id) {
    return message.reply("Unable to determine user ID.");
  }

  const uploadResponse = await axios.post(
    'https://imgbb.sheikhferdous1.repl.co/upload',
    {
      imageURL: finalUrl,
    }
  );

  // ...

  if (uploadResponse == null) return message.reply("Failed to fetch avatar!")
  const prefixRegex = new RegExp(`^\\${prefix}${config.name}(\\s+|$)|^\\${prefix}${config.aliases.join('|')}(\\s+|$)`);
  if (prefix && prefixRegex.test(modifiedMsg)) {
    modifiedMsg = message.body.replace(prefixRegex, '').trim();
  }

  const nameIndex = modifiedMsg.lastIndexOf(Name);
  const pipeIndex = modifiedMsg.lastIndexOf('|', nameIndex);

  if (pipeIndex !== -1) {
    modifiedMsg = modifiedMsg.substring(0, pipeIndex).trim();
  }

  if (modifiedMsg.endsWith("| me")) {
    modifiedMsg = await modifiedMsg.substring(0, modifiedMsg.lastIndexOf(" | me")).trim();
  }

  if (match) {
    id = await match[1];
    modifiedMsg = await new Promise(resolve => {
      resolve(modifiedMsg.replace(match[0], '').trim()); // Remove the "| 1234567890" portion from modifiedMsg
    });
  }
  if (facebookMatch) {
    ;
    modifiedMsg = modifiedMsg.replace(facebookMatch[0], '').trim();
  }
  let imageStream = await global.getStream(`https://pen.fake-chat.repl.co/generateImage?message=${encodeURIComponent(modifiedMsg)}&avatar=${uploadResponse.data.imgbbLink}&name=${encodeURIComponent(Name)}${image}`);
  const filePath = `/home/runner/XaviaBot/core/var/data/cache/${id}.png`;
  const fileStream = fs.createWriteStream(filePath);
  imageStream.pipe(fileStream);

  await new Promise((resolve) => {
    fileStream.on('finish', resolve);
  });

  try {
    const attachment = fs.createReadStream(filePath);
    await message.reply({ body: "", attachment });
    await message.react("✅")
  } catch (e) {
    console.log(e);
    return message.reply("An error occurred, please try again later!");
  }

  fs.unlinkSync(filePath);
}

export {
  onCall,
  config
};