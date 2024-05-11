const config = {
    name: "لولي",
    credits: "XaviaTeam",
    isHidden: true,
}

function onCall({ message }) {
    global.GET(`${global.xva_api.main}/loli`)
        .then(async res => {
            try {
                let imgStream = await global.getStream(res.data.url);
                message.reply({
                    body: res.data.url,
                    attachment: imgStream
                });
            } catch {
                message.reply("خطأ!");
            }
        })
        .catch(_ => message.reply("خطأ!"));
}

export default {
    config,
    onCall
}