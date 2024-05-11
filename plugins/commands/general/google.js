const config = {
    name: "بحث_جوجل",
    aliases: ["ggs", "ggsearch", "صورة", "جوجل", "بحث", "gg"],
    description: "",
    usage: "[image] <query>",
    cooldown: 5,
    permissions: [0, 1, 2],
    credits: "",
    extra: {
        "google_api_key": "https://googele.com",
        "google_search_engine_id": "",
        "lr": "lang_ar"
    }
}

const langData = {
    "vi_VN": {
        "missingGoogleAPIKeyOrEngineID": "Không tìm thấy thông tin Google API Key hoặc Google Search Engine ID.",
        "missingQuery": "Vui lòng nhập từ khóa để tìm kiếm.",
        "noResult": "Không tìm thấy kết quả nào.",
        "error": "Đã có lỗi xảy ra, vui lòng thử lại sau."
    },
    "en_US": {
        "missingGoogleAPIKeyOrEngineID": "Missing Google API Key or Google Search Engine ID.",
        "missingQuery": "Please enter a keyword to search.",
        "noResult": "No result found.",
        "error": "An error occurred, please try again later."
    },
    "ar_SY": {
        "missingGoogleAPIKeyOrEngineID": "مفتاح معرف جوجل أو معرف محرك بحث جوجل مفقود.",
        "missingQuery": "الرجاء ادخال كلمة للحبث.",
        "noResult": "لم يتم العثور على نتائج.",
        "error": "لقد حدث خطأ الرجا اعادة المحاولة لاحقا."
    }
}

const google_search_base_url = "https://www.googleapis.com/customsearch/v1";
async function onCall({ message, args, getLang, extra }) {
    const { google_api_key, google_search_engine_id, lr } = extra;
    if (!google_api_key || !google_search_engine_id) return message.reply(getLang("missingGoogleAPIKeyOrEngineID"));

    const isImageSearch = args[0]?.toLowerCase() == "صور";
    const query = args.slice(isImageSearch ? 1 : 0).join(" ");

    if (!query) return message.reply(getLang("missingQuery"));

    try {
        const res = await global.GET(google_search_base_url, {
            params: {
                key: google_api_key,
                cx: google_search_engine_id,
                q: query,
                lr,
                num: 6,
                searchType: isImageSearch ? "image" : null
            }
        });

        if (res.data.items.length == 0) return message.reply(getLang("noResult"));
        const items = res.data.items;
        const firstItem = items[0];
        const { snippet, pagemap } = firstItem;

        let msg = {}, urls = [], atmsPath = [], atms = [];
        msg.body = !isImageSearch ? "⁜\n" + snippet + "\n⁜" : "";
        if (isImageSearch) {
            for (const item of items) {
                if (item.link) {
                    urls.push(item.link);
                }
            }
        } else {
            if (pagemap?.cse_image?.length) {
                urls.push(pagemap.cse_image[0].src);
            }
        }

        for (const url of urls) {
            try {
                let path = `${global.cachePath}/_google_${Date.now()}_${message.senderID}.jpg`;

                atmsPath.push(path);
                await global.downloadFile(path, url);

                atms.push(global.reader(path));
            } catch (error) {
                console.log(error);
            }
        }

        msg.attachment = atms;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!isImageSearch) msg.body += `\n\n${i + 1}. ${item.title}\n- ${item.snippet.length > 100 ? item.snippet.slice(0, 100) + "..." : item.snippet}\n[${item.link}]`;
            else msg.body += `\n\n${i + 1}. ${item.title}\n[${item.link}]`;
        }

        await message.reply(msg).catch(e => {
            if (e) {
                console.error(e);
                message.reply(getLang("error"));
            }
        })

        for (const path of atmsPath) {
            if (global.isExists(path)) global.deleteFile(path).catch(e => e ? console.error(e) : null);
        }
    } catch (error) {
        console.log(error);
        message.reply(getLang("error"));
    }
}

export default {
    config,
    langData,
    onCall
}
