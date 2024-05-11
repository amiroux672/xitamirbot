import * as fs from 'fs';
import axios from 'axios';

const config = {
  name: "بنتريست",
  aliases: ["بنتر","pinterest","pinsearch", "pin"],
  version: "1.2.0",
  description: "Search for images",
  usage: "[query - Amount of images]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Isai"
};

async function onCall({ message, args }) {
  let query = args.join(" ");
  if (!query) return message.reply("يجب إدخال مصطلحات البحث.🔍");
  if(query.includes("-") == false) return message.reply(`الرجاء إدخال التنسيق الصحيح`)
  const searchQuery = query.substr(0, query.indexOf('-'));
  const amount = query.split("-").pop() || 6 ;
  const conditions = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];	
  if (amount == `0`) return message.reply("يرجى إدخال عدد صالح")
  if (amount > 50) return message.reply("وصلت إلى الحد الأقصى لإرسال الصور")
  if (conditions.some(word => amount.toLowerCase().includes(word))) {
        return message.reply("يرجى إدخال عدد صالح")

    }
  const res = await axios.get(`https://Api-Quangbao.tuanvudev2.repl.co/pinterest?search=${encodeURIComponent(searchQuery)}`);
    const data = res.data.data;
    let num = 0;
    let imgData = [];
    for (var i = 0; i < parseInt(amount); i++) {
      let path = `plugins/commands/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(`plugins/pin/${num}.jpg`));
    }
    message.reply({
        attachment: imgData,
        body: ` Showing${amount} search results for ${searchQuery}`
    })
    for (let ii = 1; ii < parseInt(amount); ii++) {
        fs.unlinkSync(`plugins/pin/${ii}.jpg`)
    }
}
export default {
  config,
  onCall
    }