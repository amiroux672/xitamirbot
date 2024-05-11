import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const config = {
    name: "checktt",
    aliases: ["check"],
    version: "0.0.1-xaviabot-port-refactor",
    description: "",
    usage: "",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "Nghia/DungUwU"
}

const checkttPATH = join(global.assetsPath, "checktt_x213");
let isReady = false;

function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

async function onLoad({ }) {
    try {
        ensureFolderExists(checkttPATH);
        if (!global.hasOwnProperty("checktt_cache"))
            global.checktt_cache = new Map();

        readdirSync(checkttPATH).forEach(file => {
            let fileData = readFileSync(join(checkttPATH, file));
            let parsedData = isJSON(fileData) ? JSON.parse(fileData) : {
                day: [],
                week: [],
                all: []
            };

            global.checktt_cache.set(file.replace(".json", ""), parsedData);
        })

        clearInterval(global.checktt_interval);

        global.checktt_interval = setInterval(async () => {
            for (const [key, value] of global.checktt_cache) {
                let threadDataPATH = join(checkttPATH, `${key}.json`);

                writeFileSync(threadDataPATH, JSON.stringify(value));
            }
        }, 1000 * 60 * 5);

        isReady = true;
    } catch (error) {
        console.error(error);
    }
}

async function onCall({ message, args, data }) {
    try {
        const { threadID, senderID, mentions, messageReply, participantIDs } = message;

        let threadDATA = global.checktt_cache.get(threadID);
        if (!threadDATA) return message.reply("لا توجد بيانات عن هذه المجموعة!");

        threadDATA.day = threadDATA.day.filter(item => participantIDs.some(e => e == item.id));
        threadDATA.week = threadDATA.week.filter(item => participantIDs.some(e => e == item.id));
        threadDATA.all = threadDATA.all.filter(item => participantIDs.some(e => e == item.id));

        if (args[0] == "all") {
            let allData = threadDATA.all.sort((a, b) => b.n - a.n);

            participantIDs.forEach(id => {
                if (!allData.some(e => e.id == id)) {
                    allData.push({
                        id: id,
                        n: 0
                    });
                }
            });

            let msg = "📊 إحصائيات متكاملة:\n";

            for (let i = 0; i < allData.length; i++) {
                let name = (await global.controllers.Users.getName(allData[i].id)) || "مستخدمو الفيسبوك";
                msg += `${i + 1}. ${name} - ${allData[i].n}\n`;
            }

            return message.reply(msg);
        } else {
            const targetID = Object.keys(mentions)[0] || messageReply?.senderID || senderID;

            let findDay = threadDATA.day.find(item => item.id == targetID);
            let findWeek = threadDATA.week.find(item => item.id == targetID);
            let findTotal = threadDATA.all.find(item => item.id == targetID);

            let name = await global.controllers.Users.getName(targetID) || "مستخدمو الفيسبوك";

            let totalRank = threadDATA.all.findIndex(item => item.id == targetID) + 1;

            let msg =
                `👥 اسم: ${name}\n` +
                `━━━━━━━━━━━━━━\n` +
                `💂‍♂️ موضع: ${getRole(targetID, data?.thread?.info || null)}\n` +
                `━━━━━━━━━━━━━━\n` +
                `💬 رسالة الأسبوع: ${findWeek ? findWeek.n : 0}\n` +
                `💬 رسالة اليوم: ${findDay ? findDay.n : 0}\n` +
                `📝 ااسبوع ${findTotal ? findTotal.n : 0} (Top ${totalRank})\n`;

            return message.reply(msg);
        }
    } catch (error) {
        console.error(error);
    }
}

export default {
    config,
    onLoad,
    onCall
}

function getRole(targetID, data) {
    let role = "ɞعــ♡ضـ♡ــوɞ";

    if (data != null && data.adminIDs.some(e => e.id == targetID)) role = "المـــشرف༻مـجـــ♚ـــمــوعـ♔ة༻";
    if (global.config.MODERATORS.some(e => e == targetID)) role = "༺ཌ༈مــ♕ـسـ♛ـؤول الـب♝ـوت༈ད༻";

    return role;
}

function ensureFolderExists(path) {
    let folderStat = getStat(path);

    if (folderStat === null || !folderStat.isDirectory()) {
        mkdirSync(path);
    }
}

function getStat(path) {
    try {
        let stat = statSync(path);

        return stat;
    } catch (error) {
        console.error(error);
        return null;
    }
}