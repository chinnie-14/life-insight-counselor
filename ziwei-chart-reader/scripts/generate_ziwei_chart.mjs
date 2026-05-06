#!/usr/bin/env node

import iztro from "iztro";

const STAR_KEYWORDS = {
  廉贞: "重组、边界、欲望与权责",
  破军: "破旧立新、拆解旧结构、强变化",
  武曲: "结果、资源、执行、硬实力",
  贪狼: "机会、跨界、资源整合、变化驱动",
  紫微: "位置、统筹、抬升、主导感",
  七杀: "压力、速度、风险与突破",
  天相: "平台、秩序、协作、外部承接",
  天机: "判断、策略、变化、系统思考",
  天梁: "责任、保护、压力承接",
  天同: "缓冲、舒展、关系感受",
  太阴: "积累、内在资源、稳定性",
  太阳: "外显、被看见、承担",
  巨门: "争议、表达、是非与辨析",
  天府: "储备、稳定、保有",
};

const PALACE_FOCUS = {
  命宫: "个人状态、身份感、主动性",
  兄弟: "同级协作、人际配合、资源分流",
  父母: "上级、制度、支持与约束",
  福德: "精神储备、恢复力、内在消耗",
  田宅: "内部根基、稳定盘、资源归属",
  官禄: "事业角色、职位、工作方式",
  仆役: "团队、协作、下游资源",
  迁移: "外部平台、环境变化、转岗与流动",
  疾厄: "压力、健康、负荷、内耗点",
  财帛: "收入模式、钱跟着什么来",
  子女: "产出、项目结果、延展线",
  夫妻: "关系承诺、合作与绑定",
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function normalizeGender(raw) {
  const value = String(raw || "").trim().toLowerCase();
  if (["female", "f", "woman", "girl", "女"].includes(value)) return "女";
  if (["male", "m", "man", "boy", "男"].includes(value)) return "男";
  throw new Error("Unsupported gender. Use female/女 or male/男.");
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function toTimeIndex(timeText) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(timeText || "").trim());
  if (!match) {
    throw new Error("Time must be in HH:MM format.");
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error("Invalid clock time.");
  }
  if (hour === 23) return 12;
  if (hour === 0) return 0;
  return Math.floor((hour + 1) / 2);
}

function palaceSummary(chart, name) {
  const palace = chart.palace(name);
  if (!palace) return null;
  return {
    name: palace.name,
    heavenlyStem: palace.heavenlyStem,
    earthlyBranch: palace.earthlyBranch,
    isBodyPalace: palace.isBodyPalace,
    isOriginalPalace: palace.isOriginalPalace,
    majorStars: palace.majorStars.map((s) => s.name),
    minorStars: palace.minorStars.map((s) => s.name),
    adjectiveStars: palace.adjectiveStars.map((s) => s.name),
    changsheng12: palace.changsheng12,
    boshi12: palace.boshi12,
    jiangqian12: palace.jiangqian12,
    suiqian12: palace.suiqian12,
    decadal: palace.decadal,
    ages: palace.ages,
  };
}

function describeStars(starNames) {
  return starNames
    .map((name) => STAR_KEYWORDS[name])
    .filter(Boolean)
    .slice(0, 3);
}

function annualPalaceFocus(chart, horoscope, palaceName) {
  const yearlyIndex = horoscope.yearly.palaceNames.indexOf(palaceName);
  if (yearlyIndex < 0) return null;

  const natalPalace = chart.palaces[yearlyIndex];
  const yearlyStars = horoscope.yearly.stars[yearlyIndex].map((s) => s.name);
  const yearlyMutagenNames = horoscope.yearly.mutagen;
  const natalMajor = natalPalace.majorStars.map((s) => s.name);
  const natalMinor = natalPalace.minorStars.map((s) => s.name);
  const headline = `流年${palaceName}落本命${natalPalace.name}`;

  const summaryParts = [
    `${headline}，主看${PALACE_FOCUS[natalPalace.name] || "该宫主题"}`,
  ];

  if (natalMajor.length > 0) {
    summaryParts.push(`本命主星是${natalMajor.join("、")}`);
  }
  if (yearlyStars.length > 0) {
    summaryParts.push(`本位流年附加星有${yearlyStars.join("、")}`);
  }
  if (yearlyMutagenNames.length > 0) {
    summaryParts.push(`流年四化触发组为${yearlyMutagenNames.join("、")}`);
  }

  const interpretation = [];
  if (natalMajor.length > 0) {
    interpretation.push(...describeStars(natalMajor));
  }
  if (natalPalace.name === "疾厄") {
    interpretation.push("推进常伴随压力、负荷和身心消耗，不能只看机会不看代价");
  }
  if (natalPalace.name === "兄弟") {
    interpretation.push("财或机会更容易和同级协作、资源分流、团队关系绑定");
  }
  if (natalPalace.name === "子女") {
    interpretation.push("外部变化更容易通过项目产出、结果呈现或新延展线体现");
  }
  if (palaceName === "官禄") {
    interpretation.push("今年事业推进更像在压力与职责重排中发生，而不是纯稳定守成");
  }
  if (palaceName === "财帛") {
    interpretation.push("今年的钱更像跟着协作结构、角色分工和资源配置走");
  }
  if (palaceName === "迁移") {
    interpretation.push("今年外部平台和环境变化重要，但是否成势取决于能不能转成实质产出");
  }

  return {
    palaceName,
    yearlyFallsOnNatalPalace: natalPalace.name,
    natalPalaceFocus: PALACE_FOCUS[natalPalace.name] || null,
    natalMajorStars: natalMajor,
    natalMinorStars: natalMinor,
    yearlyStars,
    yearlyMutagen: yearlyMutagenNames,
    summary: summaryParts.join("；"),
    interpretation,
  };
}

function horoscopeSummary(chart, targetDate, targetTimeIndex) {
  if (!targetDate) return null;
  const h = chart.horoscope(targetDate, targetTimeIndex);
  return {
    solarDate: h.solarDate,
    lunarDate: h.lunarDate,
    decadal: {
      heavenlyStem: h.decadal.heavenlyStem,
      earthlyBranch: h.decadal.earthlyBranch,
      palaceNames: h.decadal.palaceNames,
      mutagen: h.decadal.mutagen,
    },
    yearly: {
      heavenlyStem: h.yearly.heavenlyStem,
      earthlyBranch: h.yearly.earthlyBranch,
      palaceNames: h.yearly.palaceNames,
      mutagen: h.yearly.mutagen,
      yearlyDecStar: h.yearly.yearlyDecStar,
    },
    monthly: {
      heavenlyStem: h.monthly.heavenlyStem,
      earthlyBranch: h.monthly.earthlyBranch,
      palaceNames: h.monthly.palaceNames,
      mutagen: h.monthly.mutagen,
    },
    annualFocus: {
      career: annualPalaceFocus(chart, h, "官禄"),
      wealth: annualPalaceFocus(chart, h, "财帛"),
      travel: annualPalaceFocus(chart, h, "迁移"),
    },
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.date) {
    throw new Error("Missing required --date YYYY-M-D");
  }

  const gender = normalizeGender(args.gender);
  const timeIndex = args["time-index"] !== undefined ? Number(args["time-index"]) : toTimeIndex(args.time);
  if (!Number.isInteger(timeIndex) || timeIndex < 0 || timeIndex > 12) {
    throw new Error("time-index must be an integer from 0 to 12.");
  }

  const targetTimeIndex =
    args["target-time-index"] !== undefined
      ? Number(args["target-time-index"])
      : args["target-time"]
        ? toTimeIndex(args["target-time"])
        : timeIndex;

  const language = args.language || "zh-CN";
  const fixLeap = args["fix-leap"] === undefined ? true : String(args["fix-leap"]).toLowerCase() !== "false";
  const chart = iztro.astro.bySolar(args.date, timeIndex, gender, fixLeap, language);

  const summary = {
    input: {
      date: args.date,
      time: args.time || null,
      timeIndex,
      gender,
      language,
      fixLeap,
      targetDate: args["target-date"] || null,
      targetTimeIndex,
    },
    chart: {
      solarDate: chart.solarDate,
      lunarDate: chart.lunarDate,
      chineseDate: chart.chineseDate,
      time: chart.time,
      timeRange: chart.timeRange,
      sign: chart.sign,
      zodiac: chart.zodiac,
      soul: chart.soul,
      body: chart.body,
      fiveElementsClass: chart.fiveElementsClass,
      earthlyBranchOfSoulPalace: chart.earthlyBranchOfSoulPalace,
      earthlyBranchOfBodyPalace: chart.earthlyBranchOfBodyPalace,
    },
    palaces: {
      ming: palaceSummary(chart, "命宫"),
      career: palaceSummary(chart, "官禄"),
      wealth: palaceSummary(chart, "财帛"),
      travel: palaceSummary(chart, "迁移"),
      spouse: palaceSummary(chart, "夫妻"),
      spirit: palaceSummary(chart, "福德"),
      property: palaceSummary(chart, "田宅"),
    },
    horoscope: horoscopeSummary(chart, args["target-date"], targetTimeIndex),
  };

  process.stdout.write(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message || String(error));
  process.exit(1);
}
