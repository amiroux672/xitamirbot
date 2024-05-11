const config = {
    name: "غينشن",
    aliases: ["غينشن", "genshin", "غينشن_امباكت", "ترافلر"],
    description: "genshin impact image",
    usage: "غينشن",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "XaviaTeam",
    isHidden: true
}

const langData = {
    "vi_VN": {
        "error": "Đã có lỗi xảy ra"
    },
    "en_US": {
        "error": "An error has occurred"
     },
    "ar_SY": {
        "error": "حدث خطأ"
    }
}

const API = "https://randomlinkapi.supergame12.repl.co/genshin_random";

async function onCall({ message, getLang }) {
    try {
        const { url } = await global.GET(API).then(res => res.data);
        if (!url) return message.reply(getLang("error"));

        const imageStream = await global.getStream(url);
        await message.reply({
            attachment: [imageStream]
        });
    } catch (e) {
        message.reply(getLang("error"));
    }

    return;
}


export default {
    config,
    langData,
    onCall
}