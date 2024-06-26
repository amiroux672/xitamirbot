const config = {
  name: "كبتور",
  usage: "<كاببيك> <عنوان>",
  aliases: ["cp", "cappic"],
  description: "التقاط لقطة شاشة للويب",
  credits: "amiroux",
  cooldown: 10
};

const langData = {
    "vi_VN": {
        "missingInput": "Bạn chưa nhập URL trang web",
        "error": "Có lỗi xảy ra, vui lòng thử lại sau"
    },
    "en_US": {
        "missingInput": "You have not entered the website URL",
        "error": "An error occurred, please try again later"
    },
    "ar_SY": {
        "missingInput": "You have not entered the website URL",
        "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا"
    }
}

async function onCall({ message, args, getLang }) {
    const input = args.join(" ");
    if (input.length == 0) return message.reply(getLang("missingInput"));

    global
        .getStream(`https://api.popcat.xyz/screenshot?url=${input}`)
        .then(stream => {
            message.reply({ attachment: stream });
        })
        .catch(err => {
            console.error(err);
            message.reply(getLang("error"));
        })
}

export default {
    config,
    langData,
    onCall
}