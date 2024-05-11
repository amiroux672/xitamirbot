const config = {
    name: "اعادة_التشغيل",
    aliases: ["اعادة", "rest", "reboot"],
    permissions: [2],
    isAbsolute: true
}

async function onCall({ message, getLang }) {
    await message.reply("جاري اعادة التشغيل...");
    global.restart();
}

export default {
    config,
    onCall
}
