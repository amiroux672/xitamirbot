const langData = {
    "en_US": {
        "prefix.get": "Prefix is: {prefix}"
    },
    "vi_VN": {
        "prefix.get": "Prefix hiện tại là: {prefix}"
    },
    "ar_SY": {
        "prefix.get": "البادئة هي: {prefix}"
    }
}

function onCall({ message, getLang, data }) {
    if (message.body == "prefix" && message.senderID != global.botID) {
        message.reply(getLang("prefix.get", {
            prefix: data?.thread?.data?.prefix || global.config.PREFIX
        }));
    }

    return;
}

export default {
    langData,
    onCall
}