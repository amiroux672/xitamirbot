const config = {
    name: "noprefix",
    version: "1.0.0",
    hasPermssion: 0,
    description: "Anh không thương em🥺",
    credits: "Nghĩa Khoai To", // Ultra Super Mega Rebuild By DungUwU
    commandCategory: "Không cần dấu lệnh",
    usages: "noprefix",
    cooldowns: 5,
    dependencies: {
        "fs": "",
        "request": ""
    }
};

const dirMaterial = __dirname + `/noprefix/`;

const conditionsAndData = [
    {
        conditions: ["anh không thương em", "anh hong thương em", "ko thương em"],
        message: "Anh không thương em🥺",
        files: {
            "ko1.mp4": "https://i.imgur.com/M7fILWe.mp4"
        }
    },
    {
        conditions: ["anh quát em", "quát em"],
        message: ".Anh quát em à 🥺",
        files: {
            "quát.mp4": "https://i.imgur.com/YS4GY67.mp4"
        }
    },
    {
        conditions: ["béo á", "t béo á", "m bảo tao béo"],
        message: "T cắn cắn m giờ😾",
        files: {
            "béo.mp4": "https://i.imgur.com/6bDUUHF.mp4"
        }
    },
    {
        conditions: ["bắn", "bùm"],
        message: "Chiu Chiu ! Trúng tim pạn chưa 😉😋",
        files: {
            "bắn.gif": "https://i.imgur.com/OUoF0Cu.gif"
        }
    },
    {
        conditions: ["buồn", "bùn", "pùn", "khóc"],
        message: "Đừng buồn nữa thương:3",
        files: {
            "buồn.mp4": "https://i.imgur.com/eWjpUcr.mp4"
        }
    },
    {
        conditions: ["bye", "tạm biệt", "pp", "bai"],
        message: "Đi đâu đoá 😾",
        files: {
            "bye.mp4": "https://i.imgur.com/s2wvTk5.mp4"
        }
    },
    {
        conditions: ["chia sẻ"],
        message: "👨‍🏫Chia sẻ cho thầy điii",
        files: {
            "chiase2.mp3": "https://unkemptaptmotion.rootandroid.repl.co/chiase2.mp3"
        }
    },
    {
        conditions: ["h này còn chưa ngủ", "chưa ngủ hả"],
        message: "Ngủ đi nhá thương😽",
        files: {
            "chuangu4.mp4": "https://i.imgur.com/r4EL6Cj.mp4"
        }
    },
    {
        conditions: ["aaaa con tró nài", "con tró nài"],
        message: "Awww con tró nàiii :3",
        files: {
            "tró.mp4": "https://i.imgur.com/dQUgOFp.mp4"
        }
    },
    {
        conditions: ["gao ồ", "siêu nhân gao"],
        message: "Gao Ồ .... :>>",
        files: {
            "gao1.mp4": "https://unkemptaptmotion.rootandroid.repl.co/gao1.mp4"
        }
    },
    {
        conditions: ["hát bài nào vui vui đi bot", "hát bài nào vui đi bot"],
        message: "Bài này vui nè😘",
        files: {
            "hát.mp4": "https://unkemptaptmotion.rootandroid.repl.co/hat.mp4"
        }
    },
    {
        conditions: ["hát đi bot"],
        message: "Nghe Bot hát nè :3",
        files: {
            "hát1.mp4": "https://unkemptaptmotion.rootandroid.repl.co/hat1.mp4",
          "hat2.mp4":"http://tinyurl.com/2bdqosk4",
          "hat3.mp4":"http://tinyurl.com/22q4ulte",
          "hat4.mp4":"http://tinyurl.com/29r5zynb"
        }
    },
    {
        conditions: ["helo", "hello", "hii", "hí"],
        message: "Haiii chào cậu :3",
        files: {
            "hii.mp4": "https://unkemptaptmotion.rootandroid.repl.co/hii.mp4",
          "híi.mp4":"http://tinyurl.com/2cty5unq"
        }
    },
    {
        conditions: ["quê :>", "ôi quê"],
        message: "Lew Lew Quê",
        files: {
            "quê.mp3": "https://unkemptaptmotion.rootandroid.repl.co/que.mp3"
        }
    },
    {
        conditions: ["sầu", "chán"],
        message: "Đừng bùn nữa nhá🥺",
        files: {
            "sầu2.mp4": "https://unkemptaptmotion.rootandroid.repl.co/sau2.mp4"
        }
    }
]

module.exports.onLoad = function () {
    const { existsSync, mkdirSync, createWriteStream, statSync } = global.nodemodule["fs"];
    const { request } = global.nodemodule;
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });

    for (let i = 0; i < conditionsAndData.length; i++) {
        for (const fileName in conditionsAndData[i].files) {
            const filePath = `${dirMaterial}${fileName}`;
            if (!existsSync(filePath) || !statSync(filePath).isFile() || statSync(filePath).size === 0) {
                const file = createWriteStream(filePath);
                request(conditionsAndData[i].files[fileName])
                    .pipe(file)
                    .on("close", () => console.log(`[ NOPREFIX ] Downloaded ${fileName}`));
            }
        }
    }
}

module.exports.handleEvent = function ({ api, event }) {
    let { threadID, messageID, body } = event;
    const { createReadStream, existsSync, statSync } = global.nodemodule["fs"];

    body = body ? body.toLowerCase() : "";
    let msg = null, randomFile, allFiles, filePath;

    for (let i = 0; i < conditionsAndData.length; i++) {
        if (conditionsAndData[i].conditions.some(condition => body.indexOf(condition) == 0)) {
            allFiles = Object.keys(conditionsAndData[i].files);
            randomFile = allFiles[Math.floor(Math.random() * allFiles.length)];
            filePath = `${dirMaterial}${randomFile}`;

            if (existsSync(filePath) || statSync(filePath).isFile() || statSync(filePath).size > 0) {
                msg = {
                    body: conditionsAndData[i].message,
                    attachment: createReadStream(filePath)
                }
            }
            break;
        }
    }

    if (msg != null) api.sendMessage(msg, threadID, messageID);
    return;
}
export default {
    config,
    langData,
    onCall
}
