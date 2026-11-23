import * as Notifications from "expo-notifications";

import { REMINDER_MESSAGES, syncReminder } from "../reminders";

const mocked = jest.mocked(Notifications);

describe("daily reminder", () => {
  beforeEach(() => jest.clearAllMocks());

  it("schedules one daily notification at the chosen time", async () => {
    await expect(syncReminder({ enabled: true, hour: 19, minute: 0 }, () => 0)).resolves.toBe("scheduled");
    expect(mocked.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: { title: "Scenely", body: REMINDER_MESSAGES[0] },
      trigger: expect.objectContaining({ type: "daily", hour: 19, minute: 0 }),
    });
  });

  it("clears the reminder when it is switched off", async () => {
    await expect(syncReminder({ enabled: false, hour: 19, minute: 0 })).resolves.toBe("off");
    expect(mocked.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("schedules nothing without permission", async () => {
    mocked.getPermissionsAsync.mockResolvedValueOnce({ granted: false, canAskAgain: true } as never);
    await expect(syncReminder({ enabled: true, hour: 8, minute: 0 })).resolves.toBe("no-permission");
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("keeps every message short and in Dutch (no English words)", () => {
    for (const m of REMINDER_MESSAGES) {
      expect(m.length).toBeLessThan(70);
      expect(m).not.toMatch(/\b(the|time|practice|your)\b/i);
    }
  });
});
