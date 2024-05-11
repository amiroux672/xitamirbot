export const config = {
    name: "عناق",
    version: "0.0.1-xaviabot-port-refactor",
    description: "عانق شخص اشرة اليه", 
    usage: "[tag]",
    cooldown: 5
};

export function onCall({ message }) {
    if (!Object.keys(message.mentions).length) return message.reply("ضع اشارة على شخص");

    return global.GET(`${global.xva_api.sfw}/hug`)
        .then(async res => {
            const mention = Object.keys(message.mentions)[0];
            const tag = message.mentions[mention].replace("@", "");

            message.reply({
                body: `${tag}, لقد عانقنا للتو ، بعضنا البعض`,
                mentions: [
                    {
                        tag: tag,
                        id: mention
                    }
                ],
                attachment: await global.getStream(res.data.url)
            }).catch(console.error)
        })
        .catch(console.error);
}