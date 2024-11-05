import { Link } from "@/common/navigation";
import { McdrLogo } from "@/components/icons";
import { siteConfig } from "@/site/config";
import { Button, Text, ThemeIcon, Title } from "@mantine/core";
import {
  Icon,
  IconBook2,
  IconDevicesCheck,
  IconExternalLink,
  IconPackage,
  IconPackages,
  IconPlant2,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import { getTranslations } from "next-intl/server";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import React from "react";
import styles from "./homepage.module.css";

const titleFont = Poppins({ subsets: ["latin"], weight: ["700"] });
const mcFont = localFont({ src: "./Minecrafter.Reg.ttf" });

interface FeatureItem {
  id: string;
  Icon: Icon;
  color: string;
}

const features: FeatureItem[] = [
  {
    id: "vanilla",
    Icon: IconPlant2,
    color: "green",
  },
  {
    id: "plugins",
    Icon: IconPackage,
    color: "primary",
  },
  {
    id: "compatibility",
    Icon: IconDevicesCheck,
    color: "blue",
  },
];

async function ClassicLongLogo({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        className,
        "flex flex-row lg:flex-col items-center gap-x-2 gap-y-5"
      )}
    >
      <div className="w-[64px] min-[450px]:w-[96px] lg:w-[240px]">
        <McdrLogo size="100%" />
      </div>
    </div>
  );
}

async function Hero() {
  const t = await getTranslations("page.home");

  const buttonWidth = 180;
  const intro = (
    <>
      <Title
        className={clsx(
          "font-bold text-4xl min-[450px]:text-5xl sm:text-6xl mb-7",
          styles.title,
          titleFont.className
        )}
      >
        TREM
        <Text
          component="span"
          variant="gradient"
          gradient={{ from: "blue.5", to: "cyan" }}
          inherit
        >
          Plugin
        </Text>
      </Title>

      <Text size="xl" fw={500} className="mt-3">
        {t("description")}
      </Text>

      <div className="mt-5 sm:mt-10 flex flex-wrap gap-x-5 gap-y-3 justify-center">
        <Button
          w={buttonWidth}
          leftSection={<IconPackages size={18} stroke={1.4} />}
          component={Link}
          href="/plugins"
        >
          {t("catalogue")}
        </Button>
        <Button
          w={buttonWidth}
          leftSection={<IconBook2 size={20} stroke={1.6} />}
          rightSection={<IconExternalLink size={16} stroke={1.6} />}
          variant="default"
          component={Link}
          target="_blank"
          href={siteConfig.links.docs}
        >
          {t("docs")}
        </Button>
      </div>
    </>
  );

  return (
    <div
      className={clsx(
        "w-full py-[3rem] h-svh flex flex-col align-center justify-center",
        "bg-mantine-background"
      )}
    >
      <div className="px-8 mx-auto flex max-lg:flex-col gap-12 items-center justify-center">
        <div className="max-w-[500px] max-lg:*:text-center">{intro}</div>
        <div className="max-lg:hidden">
          {/* See also: <StandaloneLongLogo/> for small screens */}
          <ClassicLongLogo />
        </div>
      </div>
    </div>
  );
}

async function StandaloneLongLogo() {
  // See also: <Hero/> for small screens
  return (
    <div className="lg:hidden w-full my-[3rem]">
      <ClassicLongLogo className="justify-center" />
    </div>
  );
}

export async function HomePage() {
  return (
    <div>
      <Hero />
      <StandaloneLongLogo />
    </div>
  );
}
