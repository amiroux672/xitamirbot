const config = {
    name: "تشغيل",
    aliases: ["eval", "execute", "exec"],
    permissions: [2],
    description: "Run bot scripts",
    usage: "<script>",
    credits: "XaviaTeam",
    isAbsolute: true
}

function onCall({ message, args }) {
    eval(args.join(" "));
    message.send("تم تشغيل!");
}

export default {
    config,
    onCall
}
