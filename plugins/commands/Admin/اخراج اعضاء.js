const config = {
  name: "تصفية",
  description: "ركلة الأعضاء غير النشطين بأقل من خبرة محددة",
  usage: "",
  cooldown: 10,
  permissions: [1],
  credits: "امير"
};

const langData = {
  "en_US": {
    "noInactiveMembers": "لا يوجد أعضاء غير نشطين لديهم أقل من {exp} EXP في هذا الموضوع",
    "kicked": "ركل {count} عضو غير نشط(ة) مع أقل من {exp} EXP",
    "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا",
    "noAdmin": "يجب أن يكون البوت مشرفًا من أجل الركل",
    "invalidExp": "قيمة تجربة غير صالحة"
  }
};

async function onCall({ message, getLang, data, args }) {
  if (!message.isGroup) return;
  const { MODERATORS } = global.config;
  const { threadID } = message;
  try {
    const threadInfo = data.thread.info;
    const { adminIDs } = threadInfo;
    if (!adminIDs.some(e => e.id == global.botID)) return message.reply(getLang("noAdmin"));

    let exp = parseInt(args[0]);
    if (isNaN(exp)) return message.reply(getLang("invalidExp"));

    const inactiveMembers = threadInfo.members.filter(member => {
      const keys = Object.keys(member);
      if (keys.length !== 2) return false;
      const [key, value] = Object.entries(member)[1];
      return key === "exp" && value < exp;
    });

    let aIds = adminIDs.map(item => Object.values(item)).flat();

    const withoutBotID = inactiveMembers.filter(item => item.userID !== global.botID && !aIds.some(val => val === item.userID));
    const IDs = withoutBotID.map(item => item.userID);
    if (IDs.length === 0) return message.reply(getLang("noInactiveMembers", { exp }));

    let count = 0;
    for (const member of IDs) {
      try {
        await global.api.removeUserFromGroup(member, threadID);
        count++;
        global.sleep(500);
      } catch (e) {
        console.error(e);
      }
    }

    await message.reply(getLang("kicked", { count, exp }));
  } catch (e) {
    console.error(e);
    message.reply(getLang("خطأ"));
  }
}

export default {
  config,
  langData,
  onCall
}