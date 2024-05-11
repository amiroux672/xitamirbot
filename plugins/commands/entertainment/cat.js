const config = {
  name: "قط",
  aliases: ['meo', 'mèo', 'cat'],
  description: "يرسل صور قطط +gif ", 
  version: "0.0.1",
  cooldown: 7,
  credits: "amir" 
}
// có tình người đừng đổi credits 
// Please do not change the author's name!
//من فضلك لا تغير اسم المؤلف!
const onCall = ({ message, args }) => {
  let type = args[0]?.toLowerCase();

  let url = type == "gif" ? "https://cataas.com/cat/gif" : "https://cataas.com/cat";

  let text = args.slice(1).join(" ") || null;

  url = (text != null && type != "gif") ? `https://cataas.com/cat/says/${text}` : url

  global.getStream(url)
  .then(stream => message.reply({ attachment: stream }).catch(e => console.error(e)))
  .catch(e => console.error(e));
}

export {
  config,
  onCall
  }