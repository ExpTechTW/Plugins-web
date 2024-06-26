'use client'

import { formatTime, getTimeAgo } from "@/utils/time-utils";
import { useLocale } from "next-intl";
import React, { Component, useEffect, useState } from "react";
import { ClickableTooltip } from "./clickable-tooltip";

interface TimeTexts {
  timeAgo: string
  timeFormatted: string
}

function createTimeTexts(date: Date, locale: string): TimeTexts {
  return {
    timeAgo: getTimeAgo(date, locale),
    timeFormatted: formatTime(date, 'LLL', locale),
  }
}

export function TimeAgo({date, className, component: Component = 'p'}: { date: Date, className?: string, component?: React.ElementType }) {
  // https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  let is_date = ''
  
  const locale = useLocale()
  const [timeTexts, setTimeTexts] = useState<TimeTexts>(createTimeTexts(date, locale))

  useEffect(() => {
    const interval = setInterval(
      () => {
        const newTexts = createTimeTexts(date, locale)
        if (newTexts.timeAgo !== timeTexts.timeAgo || newTexts.timeFormatted !== timeTexts.timeFormatted) {
          setTimeTexts(newTexts)
        }
      },
      60 * 1000,
    )
    return () => clearInterval(interval)
  }, [date, locale, timeTexts])

  if(date)is_date.toString(); //toISOString
  return (
    <ClickableTooltip label={isClient ? timeTexts.timeFormatted : is_date}>
      <Component className={className}>{isClient ? timeTexts.timeAgo : '...'}</Component>
    </ClickableTooltip>
  )
}
