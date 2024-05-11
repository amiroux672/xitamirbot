import axios from 'axios';

const langData = {
    "ar_SY": {
        "خطأ": "حدث خطأ أثناء ترجمة الرسالة."
    }
    // Add translation strings for other languages here
}

async function GET(url) {
    try {
        const response = await axios.get(url);
        return response;
    } catch (error) {
        console.error(error);
    }
}

const onCall = async ({ message, getLang, data }) => {
    const { senderID, body, reply } = message;

    try {
        const userData = await global.controllers.Users.getData(senderID);

        if (userData && userData.autotranslate && userData.autotranslate.status) {
            const targetLang = userData.autotranslate.lang;
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(body)}`;

            const res = await GET(url);
            const translation = res.data[0].map(item => item[0]).join("");

            reply(translation);
        }
    } catch (e) {
        console.error(e);
        reply(getLang("error"));
    }
}

export default {
    langData,
    onCall
}