import {
  AllOfAPlugin,
  Everything,
  Releases,
  trem_json,
} from "@/catalogue/meta-types";
import { SimpleEverything } from "@/catalogue/simple-types";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import { promisify } from "node:util";
import { gunzip } from "node:zlib";
import path from "path";
import { createSimpleEverything } from "./conversion";
import { em } from "@mantine/core";

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function devReadLocalEverything(): Promise<Everything | null> {
  if (process.env.MW_USE_LOCAL_EVERYTHING === "true") {
    const localDataPath = path.join(
      process.cwd(),
      "src",
      "catalogue",
      "everything.json"
    );
    if (await fileExists(localDataPath)) {
      const content = await fs.readFile(localDataPath, "utf8");
      return JSON.parse(content) as any as Everything;
    }
  }
  return null;
}

const gunzipAsync = promisify(gunzip);

async function fetchEverything(): Promise<Everything> {
  const url: string =
    process.env.MW_EVERYTHING_JSON_URL ||
    "https://raw.githubusercontent.com/ExpTechTW/Plugins-web/refs/heads/main/public/plugins.json";

  // The 2nd init param cannot be defined as a standalone global constant variable,
  // or the ISR might be broken: fetchEverything() will never be invoked after the first 2 round of requests,
  // because the init variable itself will be modified to an empty object after the fetch call :(
  // See https://github.com/vercel/next.js/blob/4125069840ca98981f0e7796f55265af04f3e903/packages/next/src/server/lib/patch-fetch.ts#L685 for the stupidness
  const rsp = await fetch(url, {
    next: {
      revalidate: 10 * 60, // ISR 10min
      tags: ["catalogue"],
    },
  });

  // if (url.endsWith('.gz')) {
  //   const buf = Buffer.from(await rsp.arrayBuffer())
  //   const raw = await gunzipAsync(buf)
  //   const data = JSON.parse(raw.toString('utf8'))
  //   return data as any as Everything
  // } else {
  const data = await rsp.json();
  return data as any as Everything;
  // }
}

export async function getInfo(github: string, pkg: string): Promise<trem_json> {
  const url = `https://raw.githubusercontent.com/${github}/main/${pkg}/info.json`;
  const rsp = await fetch(url, {
    next: {
      revalidate: 10 * 60, // ISR 10min
      tags: ["catalogue"],
    },
  });

  if (!rsp.ok) {
    // 處理錯誤回應
    console.log(url);
    console.log(`HTTP error! status: ${rsp.status}`);
  }

  const data = await rsp.json();
  return data;
}

export async function getEverything(): Promise<Everything> {
  const e = await devReadLocalEverything();
  if (e !== null) {
    return e;
  } else {
    return await fetchEverything();
  }
}

export async function getPluginInfo(github: string): Promise<Releases[]> {
  const url = `https://api.github.com/repos/${github}/releases`;
  const rsp = await fetch(url, {
    next: {
      revalidate: 10 * 60, // ISR 10min
      tags: ["catalogue"],
    },
  });
  const data = await rsp.json();
  return data;
}

export async function getPlugin(
  pluginId: string
): Promise<AllOfAPlugin | undefined> {
  const everything = await getEverything();
  const plugin_list: AllOfAPlugin[] = Object.values(everything.plugin_list);
  return plugin_list.find((plugin) => plugin.package_name === pluginId);
}

export async function getPluginOr404(pluginId: string): Promise<AllOfAPlugin> {
  const plugin = await getPlugin(pluginId);
  if (plugin === undefined) {
    notFound();
  }
  return plugin;
}

export async function getSimpleEverything(): Promise<SimpleEverything> {
  const everything = await getEverything();
  return createSimpleEverything(everything);
}
