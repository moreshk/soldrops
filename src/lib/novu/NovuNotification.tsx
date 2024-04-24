"use client";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";
import { useTheme } from "next-themes";

export const NovuNotification = () => {
  const { systemTheme, theme } = useTheme();
  const notificationTheme = getNotificationTheme(theme, systemTheme);

  return (
    <NovuProvider
      backendUrl="https://novu.soldrops.xyz/api"
      socketUrl="https://novu.soldrops.xyz/ws/"
      subscriberId="662931db7531a9f306b34274"
      applicationIdentifier="00s_if8oSQZF"
    >
      <PopoverNotificationCenter colorScheme={notificationTheme}>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};

const getNotificationTheme = (
  theme: string | undefined,
  systemTheme: "dark" | "light" | undefined
) => {
  if (theme === "system") {
    if (systemTheme === "dark") {
      return "dark";
    }
    if (systemTheme === "light") {
      return "light";
    }
  }
  return theme === "light" ? "light" : "dark";
};
