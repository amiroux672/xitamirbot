import axios from 'axios';

const config = {
  name: "سمسمي_تلقائي",
  version: "1.1.0",
  description: "تحدث بالعربية",
  usage: "[text]/on/off",
  cooldown: 3,
  permissions: [1, 2],
  credits: "XaviaTeam",
  dependencies: ["axios"]
};

const langData = {
    "en_US": {
        "noResult": "Ahona doesn't understand what you're saying :("
    },
    "vi_VN": {
        "noResult": "Ahona không hiểu bạn đang nói gì :("
    },
    "ar_SY": {
        "noResult": "سيلفي لا تفهم ما تقول :("
    }
}

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

const onCall = ({ message, getLang, data }) => {
    if (message.senderID == global.botID) return;
    if (!global.sanju.hasOwnProperty(message.threadID) && !global.sanju[message.threadID]) return;
    if (message.body.startsWith(`${data?.thread?.data?.prefix || global.config.PREFIX}sanju off`)) return;

axios
    .get(
       `https://api.simsimi.vn/v2/simtalk text=${encodeURIComponent(message.body)}&lc=ar`
    )
        .then((res) => {
            const { data } = res;
            const { status} = data;
               {
                return message.reply(data.success);
            } 
      })
   .catch((err) => {
            console.error(err);
        });
}

export default {
    langData,
    onCall
}