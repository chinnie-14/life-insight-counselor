#!/usr/bin/env node

import iztro from "iztro";

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

