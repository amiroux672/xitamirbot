const config = {
  name: "ادمن",
  description: "",
  usage: "",
  cooldown: 3,
  permissions: [2],
};

let i = "『✒️』→اسم: امير\n『📋』→ العمر: 23\n『👥』→ جنس: ذكر\n『🎂』→ زياد ملاد: 04/07/2000\n『💫』→ الوزن وطول: 1m80/75kg\n『💘』→𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽𝘀:𝗡𝗴 𝗛𝘂𝘆𝗻𝗵 𝗠𝗶𝗻𝗵 𝗔𝗻𝗵\n『🗺️』→موقع:𝗛𝗼 سعيدة ونقرا في وهران\n『🌐』→سكن اصلي: سعيدة ";

async function onCall({ message }) {
  message.send({
    body: i,
    attachment: createReadStream(join(global.assetsPath, ``))

  })
}

export {
  config,
  onCall
}