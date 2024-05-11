const config = {
    name: "الاوامر",
    aliases: ["اوامر","help"],
    version: "1.0.3",
    description: "تحديث عربي",
    usage: "[command] (optional)",
    credits: "amir help"
}


const langData = {
    "en_US": {
        "help.list": "{list}\n\n⇒ Total: {total} commands\n⇒ Use {syntax} [command] to get more information about a command.",
        "help.commandNotExists": "Command {command} does not exists.",
        "help.commandDetails": `
            ⇒ Name: {name}
            ⇒ Aliases: {aliases}
            ⇒ Version: {version}
            ⇒ Description: {description}
            ⇒ Usage: {usage}
            ⇒ Permissions: {permissions}
            ⇒ Category: {category}
            ⇒ Cooldown: {cooldown}
            ⇒ Credits: {credits}
        `,
        "0": "Member",
        "1": "Group Admin",
        "2": "Bot Admin"
    },
    "vi_VN": {
        "help.list": "{list}\n\n⇒ Tổng cộng: {total} lệnh\n⇒ Sử dụng {syntax} [lệnh] để xem thêm thông tin về lệnh.",
        "help.commandNotExists": "Lệnh {command} không tồn tại.",
        "help.commandDetails": `
            ⇒ Tên: {name}
            ⇒ Tên khác: {aliases}
            ⇒ Phiên bản: {version}
            ⇒ Mô tả: {description}
            ⇒ Cách sử dụng: {usage}
            ⇒ Quyền hạn: {permissions}
            ⇒ Thể loại: {category}
            ⇒ Thời gian chờ: {cooldown}
            ⇒ Người viết: {credits}
        `,
        "0": "Thành viên",
        "1": "Quản trị nhóm",
        "2": "Quản trị bot"
    },
    "ar_SY": {
        "help.list": "{list}\n\n⇒ المجموع: {total} الاوامر\n⇒ استخدم {syntax} [help] لمزيد من المعلومات حول الأمر.",
        "help.commandNotExists": "امر {command} غير موجود.",
        "help.commandDetails": `
            ⇒ اسم: {name}
            ⇒ اسم مستعار: {aliases}
            ⇒ وصف: {description}
            ⇒ استعمال: {usage}
            ⇒ الصلاحيات: {permissions}
            ⇒ فئة: {category}
            ⇒ وقت الانتظار: {cooldown}
            ⇒ الاعتمادات: {amiroux dz}
        `,
        "0": "عضو",
        "1": "إدارة المجموعة",
        "2": "ادارة البوت"
    }
}

async function onCall({ message, args, getLang, userPermissions, prefix }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) {
        let commands = {};
        for (const [key, value] of commandsConfig.entries()) {
            if (!!value.isHidden) continue;
            if (!!value.isAbsolute ? !global.config?.ABSOLUTES.some(e => e == message.senderID) : false) continue;
            if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
            if (!value.permissions.some(p => userPermissions.includes(p))) continue;
            if (!commands.hasOwnProperty(value.category)) commands[value.category] = [];
            commands[value.category].push(key);
        }

        let list = Object.keys(commands)
            .map(category => `꧁ ${category.toUpperCase()}꧂\n${commands[category].join("   |🇩🇿|   ")}`)
            .join("\n\n");

        message.reply(getLang("help.list", {
            total: Object.values(commands).map(e => e.length).reduce((a, b) => a + b, 0),
            list,
            syntax: message.args[0].toLowerCase()
        }));
    } else {
        if (!commandsConfig.has(commandName)) return message.reply(getLang("help.commandNotExists", { command: commandName }));
        const command = commandsConfig.get(commandName);

        const isHidden = !!command.isHidden;
        const isUserValid = !!command.isAbsolute ? global.config?.ABSOLUTES.some(e => e == message.senderID) : true;
        const isPermissionValid = command.permissions.some(p => userPermissions.includes(p));
        if (isHidden || !isUserValid || !isPermissionValid)
            return message.reply(getLang("help.commandNotExists", { command: commandName }));

        message.reply(getLang("help.commandDetails", {
            name: command.name,
            aliases: command.aliases.join("\n"),
            version: command.version || "1.0.0",
            description: command.description || '',
            usage: `${prefix}${command.name} ${command.usage || ''}`,
            permissions: command.permissions.map(p => getLang(String(p))).join("\n"),
            category: command.category,
            cooldown: command.cooldown || 3,
            credits: command.credits || ""
        }).replace(/^ +/gm, ''));
    }
}

export default {
    config,
    langData,
    onCall
}