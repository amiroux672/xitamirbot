//autotranslate.js

const config = {
    name: "ترجمة_تلقائية",
    description: "Automatically translate messages for a user or mentioned user.",
    usage: 'on|off [lang] [@user]',
    permissions: [2],
    credits: 'TakiUwU'
}

const langData = {
    "ar_SY":{
       "autotranslate.error.invalidAction": "عمل غير صالح  استخدم 'on' or 'off'.",
        "autotranslate.error.invalidLanguage": "رمز اللغة غير صالح.",
        "autotranslate.error.noLanguage": "يرجى تقديم رمز اللغة.", 
        "autotranslate.on": "تم تمكين الترجمة التلقائية لـ {user} مع اللغة {langCode}.",
        "autotranslate.off": "تم تعطيل الترجمة التلقائية لـ{user}."
    }
    // Add translation strings for other languages here
}

const supportedLanguages = [
    "af", "sq", "am", "ar", "hy", "az", "eu", "be", "bn", "bs", "bg", "ca", "ceb", "ny", "zh-CN", "zh-TW", "co", "hr", "cs", "da", "nl", "en", "eo", "et", "tl", "fi", "fr", "fy", "gl", "ka", "de", "el", "gu", "ht", "ha", "haw", "iw", "hi", "hmn", "hu", "is", "ig", "id", "ga", "it", "ja", "jw", "kn", "kk", "km", "ko", "ku", "ky", "lo", "la", "lv", "lt", "lb", "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn", "my", "ne", "no", "or", "ps", "fa", "pl", "pt", "pa", "ro", "ru", "sm", "gd", "sr", "st", "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tg", "ta", "te", "th", "tr", "uk", "ur", "ug", "uz", "vi", "cy", "xh", "yi", "zu"
];

async function onCall({ message, args, getLang }) {
    const { senderID, mentions, reply } = message;
    const action = args[0]?.toLowerCase();
    const targetLang = args[1]?.toLowerCase();
    const mentionedUser = Object.keys(mentions)[0] || senderID;
    const mentionedUserName = await global.controllers.Users.getName(mentionedUser);

    if (action !== 'on' && action !== 'off') {
        return reply(getLang("autotranslate.error.invalidAction"));
    }

    if (action === 'on' && !targetLang) {
        return reply(getLang("autotranslate.error.noLanguage"));
    }

    if (action === 'on' && !supportedLanguages.includes(targetLang)) {
        return reply(getLang("ترجمة تلقائية.خطأ.لغة غير صالحة"));
    }

    try {
        let userData = await global.controllers.Users.getData(mentionedUser);

        if (userData == null) {
            userData = {};
        }

        if (!userData.hasOwnProperty("autotranslate")) {
            userData.autotranslate = { status: false, lang: null };
        }

        if (action === 'on') {
            userData.autotranslate.status = true;
            userData.autotranslate.lang = targetLang;
            reply(getLang("autotranslate.on", { user: mentionedUserName, langCode: targetLang }));
        } else {
            userData.autotranslate.status = false;
            userData.autotranslate.lang = null;
            reply(getLang("autotranslate.off", { user: mentionedUserName }));
        }

        await global.controllers.Users.updateData(mentionedUser, userData);
    } catch (e) {
        console.error(e);
        reply(getLang("خطأ"));
    }
}

export default {
    config,
    langData,
    onCall
}