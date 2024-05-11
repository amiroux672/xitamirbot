export const config = {
    name: "حظن",
    version: "0.0.1-xaviabot-port-refactor",
    description: "احتضن شخصًا تضع علامة عليه",
    usage: "[tag]",
    cooldown: 5
};

export function onCall({ message }) {
    if (!Object.keys(message.mentions).length) return message.reply("اشر لشخص كي تحظنها");

    return global.GET(`${global.xva_api.sfw}/cuddle`)
        .then(async res => {
            const mention = Object.keys(message.mentions)[0];
            const tag = message.mentions[mention].replace("@", "");

            message.reply({
                body: `خذ هذا ${tag}`,
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