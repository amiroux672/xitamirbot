const config = {
    name: "وايفو",
    credits: "XaviaTeam"
}

export default function ({ message }) {
    global.random(0, 5) === 3 ? message.reply("احبك باكاااااا >w<") : message.reply("نحن فقط مجرد اصدقاء 😔");
}
