import { join } from "path";

export const config = {
    name: "صباح_لخير",
    version: "0.0.1-xaviabot-refactor",
    credits: "Choru tiktokers",
    description: "great morning"
};

const gmgifPath = join(global.assetsPath, "gm.gif");
export async function onLoad() {
    await downloadFile(gmgifPath, "https://i.ibb.co/T1FhMcq/good-morning.gif");
}

export async function onCall({ message }) {
    const conditions = [
        "صباح الخير",
        "جيد gm",
        "صباح",
        "قبل الاستيقاظ",
        "يوم جيد",
        "صباح خير",
        "صباح لخير",
        "صباح لفل",
        "صباح الفل"

    ]

    if (conditions.some(c => message.body.toLowerCase().startsWith(c))) {
        message.reply({
            body: "🌄ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ, ᴛʀʏ ꜱᴏᴍᴇ ᴄᴏꜰꜰᴇᴇ ᴏʀ ᴛᴇᴀ ᴛᴏ ᴡᴀᴋᴇ ʏᴏᴜ ᴜᴘ☀️☕",
            attachment: global.reader(gmgifPath)
        })
        message.react("🌇")
    }
}