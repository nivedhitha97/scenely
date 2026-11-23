import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { Reminder } from "./settings";

/** Short, friendly nudges in simple Dutch. One is picked each time the reminder is (re)scheduled. */
export const REMINDER_MESSAGES = [
  "Tijd voor koffie? Oefen vijf minuten in de stad.",
  "Je fiets staat klaar. Op naar de volgende plek!",
  "Even oefenen? Eén scène duurt maar een paar minuten.",
  "Goedemiddag! Zeg vandaag één zin hardop.",
];

const CHANNEL = "learning-reminder";

/** Local notifications work on phones (Expo Go included); not on the web. */
export const remindersSupported = Platform.OS === "ios" || Platform.OS === "android";

let handlerSet = false;

/** Show reminders as a banner even when the app is open. Call once at start-up. */
export function setUpReminderHandler(): void {
  if (!remindersSupported || handlerSet) return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

/** Asks for permission if needed. Resolves false when the learner said no. */
export async function askReminderPermission(): Promise<boolean> {
  if (!remindersSupported) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/**
 * Makes the scheduled notifications match the setting: one daily reminder at the chosen time,
 * or none. Safe to call on every start and every change.
 */
export async function syncReminder(reminder: Reminder, pick: () => number = Math.random): Promise<"scheduled" | "off" | "no-permission" | "unsupported"> {
  if (!remindersSupported) return "unsupported";
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!reminder.enabled) return "off";
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return "no-permission";
  if (Platform.OS === "android") {
    // Default importance: a normal notification, no sound override.
    await Notifications.setNotificationChannelAsync(CHANNEL, { name: "Oefenherinnering", importance: 5 });
  }
  const body = REMINDER_MESSAGES[Math.floor(pick() * REMINDER_MESSAGES.length) % REMINDER_MESSAGES.length];
  await Notifications.scheduleNotificationAsync({
    content: { title: "Scenely", body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: reminder.hour, minute: reminder.minute, channelId: CHANNEL },
  });
  return "scheduled";
}
