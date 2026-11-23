import Constants from "expo-constants";
import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/Icon";
import { ScreenHeader } from "@/components/ScreenHeader";
import { emptyProgress } from "@/engine/progress";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useSettings } from "@/hooks/useSettings";
import { askReminderPermission, remindersSupported } from "@/services/reminders";
import { formatTime, type ThemeChoice } from "@/services/settings";
import { useTheme } from "@/themes";

const THEMES: { value: ThemeChoice; label: string; icon: string }[] = [
  { value: "system", label: "Automatisch", icon: "gear" },
  { value: "light", label: "Licht", icon: "sun" },
  { value: "dark", label: "Donker", icon: "moon" },
];

/** Reminder times to pick from (a list is easier to tap than a clock). */
export const REMINDER_TIMES: [number, number][] = [
  [8, 0],
  [12, 30],
  [17, 30],
  [19, 0],
  [21, 0],
];

/** "Instellingen": theme, daily reminder, speaking, account and progress. */
export default function SettingsScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { settings, update } = useSettings();
  const auth = useAuth();
  const game = useGame();
  const [reminderNote, setReminderNote] = useState<string | null>(null);
  const [accountNote, setAccountNote] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"reset" | "delete" | null>(null);

  const text = { color: t.colors.ink, fontFamily: t.fonts.bodyBold };
  const muted = { color: t.colors.inkMuted, fontFamily: t.fonts.body };

  const setReminder = async (enabled: boolean) => {
    setReminderNote(null);
    if (enabled && !(await askReminderPermission())) {
      setReminderNote("Zet meldingen voor Scenely aan in de instellingen van je telefoon.");
      return;
    }
    update({ reminder: { ...settings.reminder, enabled } });
  };

  const signIn = async () => {
    setAccountNote(null);
    const error = await auth.signIn();
    if (error === "unavailable") setAccountNote("Inloggen met Google werkt nog niet in deze testversie.");
    else if (error && error !== "cancelled") setAccountNote("Inloggen is niet gelukt. Probeer het opnieuw.");
  };

  const deleteAccount = async () => {
    setConfirm(null);
    const error = await auth.deleteAccount();
    if (error === "recent-login") setAccountNote("Log uit en weer in, en verwijder je account daarna opnieuw.");
    else if (error) setAccountNote("Verwijderen is niet gelukt. Probeer het opnieuw.");
    else setAccountNote("Je account is verwijderd. Je voortgang op deze telefoon blijft bewaard.");
  };

  const resetProgress = () => {
    setConfirm(null);
    game.replaceProgress(emptyProgress);
    router.replace("/");
  };

  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper, paddingTop: insets.top }]}>
      <ScreenHeader title="Instellingen" />
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 24 }]}>
        <Section title="Weergave">
          <View style={[s.segment, { backgroundColor: t.colors.chip }]} accessibilityRole="radiogroup">
            {THEMES.map((o) => {
              const on = settings.theme === o.value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => update({ theme: o.value })}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  style={[s.segmentItem, on && { backgroundColor: t.colors.card }]}
                >
                  <Icon name={o.icon} size={16} color={on ? t.colors.ink : t.colors.inkMuted} />
                  <Text style={[s.segmentText, { color: on ? t.colors.ink : t.colors.inkMuted, fontFamily: t.fonts.bodyBold }]}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Oefenherinnering">
          <Row
            icon="bell"
            label="Herinner me elke dag"
            sub={remindersSupported ? undefined : "Herinneringen werken in de app op je telefoon."}
            right={
              <Switch
                value={settings.reminder.enabled}
                onValueChange={setReminder}
                disabled={!remindersSupported}
                trackColor={{ true: t.colors.correct, false: t.colors.locked }}
                accessibilityLabel="Herinner me elke dag"
              />
            }
          />
          {settings.reminder.enabled && (
            <View style={s.times} accessibilityRole="radiogroup" accessibilityLabel="Tijd van de herinnering">
              {REMINDER_TIMES.map(([h, m]) => {
                const on = settings.reminder.hour === h && settings.reminder.minute === m;
                return (
                  <Pressable
                    key={`${h}:${m}`}
                    onPress={() => update({ reminder: { enabled: true, hour: h, minute: m } })}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: on }}
                    style={[s.time, { backgroundColor: on ? t.colors.primary : t.colors.chip }]}
                  >
                    <Text style={[s.timeText, { color: on ? "#fff" : t.colors.ink, fontFamily: t.fonts.bodyBold }]}>{formatTime(h, m)}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          {reminderNote && <Note text={reminderNote} />}
        </Section>

        <Section title="Spreken">
          <Row
            icon="mic"
            label="Spreekoefeningen"
            sub="Na een goed antwoord: zeg de zin hardop."
            right={
              <Switch
                value={settings.speaking}
                onValueChange={(speaking) => update({ speaking })}
                trackColor={{ true: t.colors.correct, false: t.colors.locked }}
                accessibilityLabel="Spreekoefeningen"
              />
            }
          />
        </Section>

        <Section title="Account">
          {auth.user ? (
            <>
              <Row icon="user" label={auth.user.displayName ?? "Ingelogd"} sub={auth.user.email ?? "Google"} />
              <Row icon="logout" label="Uitloggen" onPress={() => auth.signOut()} />
              <Row icon="trash" label="Account verwijderen" danger onPress={() => setConfirm("delete")} />
            </>
          ) : (
            <Row icon="user" label="Inloggen met Google" sub="Je voortgang blijft bewaard, ook op een nieuwe telefoon." onPress={signIn} />
          )}
          {confirm === "delete" && (
            <Confirm
              text="Je account en alles wat erin bewaard is, worden verwijderd. Dit kan niet ongedaan worden."
              action="Verwijderen"
              onConfirm={deleteAccount}
              onCancel={() => setConfirm(null)}
            />
          )}
          {accountNote && <Note text={accountNote} />}
        </Section>

        <Section title="Voortgang">
          <Row icon="retry" label="Voortgang wissen" danger onPress={() => setConfirm("reset")} />
          {confirm === "reset" && (
            <Confirm
              text={`Je begint weer bij de koffiebar.${auth.user ? " Dit geldt ook voor je account." : ""}`}
              action="Wissen"
              onConfirm={resetProgress}
              onCancel={() => setConfirm(null)}
            />
          )}
        </Section>

        <Text style={[s.footer, muted]}>Scenely {Constants.expoConfig?.version ?? ""} · Leer door te leven</Text>
      </ScrollView>
    </View>
  );

  function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
      <View style={s.section}>
        <Text accessibilityRole="header" style={[s.sectionTitle, { color: t.colors.inkMuted, fontFamily: t.fonts.bodyBold }]}>
          {title.toUpperCase()}
        </Text>
        <View style={[s.card, { backgroundColor: t.colors.card }]}>{children}</View>
      </View>
    );
  }

  function Row({ icon, label, sub, right, onPress, danger }: { icon: string; label: string; sub?: string; right?: ReactNode; onPress?: () => void; danger?: boolean }) {
    const body = (
      <>
        <View style={[s.rowIcon, { backgroundColor: t.colors.chip }]}>
          <Icon name={icon} size={18} color={danger ? t.colors.primaryDark : t.colors.ink} />
        </View>
        <View style={s.rowText}>
          <Text style={[s.rowLabel, text, danger && { color: t.colors.primaryDark }]}>{label}</Text>
          {sub && <Text style={[s.rowSub, muted]}>{sub}</Text>}
        </View>
        {right}
      </>
    );
    if (!onPress) return <View style={s.row}>{body}</View>;
    return (
      <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.row, { opacity: pressed ? 0.6 : 1 }]}>
        {body}
      </Pressable>
    );
  }

  function Note({ text: note }: { text: string }) {
    return <Text accessibilityRole="alert" style={[s.note, { color: t.colors.primaryDark, backgroundColor: t.colors.primarySoft, fontFamily: t.fonts.bodyBold }]}>{note}</Text>;
  }

  function Confirm({ text: question, action, onConfirm, onCancel }: { text: string; action: string; onConfirm: () => void; onCancel: () => void }) {
    return (
      <View style={[s.confirm, { borderTopColor: t.colors.line }]}>
        <Text style={[s.rowSub, { color: t.colors.ink, fontFamily: t.fonts.body }]}>{question}</Text>
        <View style={s.confirmButtons}>
          <Pressable onPress={onCancel} accessibilityRole="button" style={[s.confirmButton, { backgroundColor: t.colors.chip }]}>
            <Text style={[s.timeText, text]}>Annuleren</Text>
          </Pressable>
          <Pressable onPress={onConfirm} accessibilityRole="button" style={[s.confirmButton, { backgroundColor: t.colors.primaryDark }]}>
            <Text style={[s.timeText, { color: "#fff", fontFamily: t.fonts.bodyBold }]}>{action}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 18 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 12, letterSpacing: 1, paddingHorizontal: 4 },
  card: { borderRadius: 18, overflow: "hidden" },
  segment: { flexDirection: "row", margin: 8, padding: 4, borderRadius: 12, gap: 4 },
  segmentItem: { flex: 1, minHeight: 44, borderRadius: 9, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  segmentText: { fontSize: 14 },
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 8 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1, gap: 1 },
  rowLabel: { fontSize: 16 },
  rowSub: { fontSize: 13, lineHeight: 18 },
  times: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingBottom: 14 },
  time: { minHeight: 44, minWidth: 68, borderRadius: 12, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  timeText: { fontSize: 15 },
  note: { fontSize: 13, margin: 12, marginTop: 0, padding: 12, borderRadius: 12, overflow: "hidden" },
  confirm: { borderTopWidth: 1, padding: 16, gap: 12 },
  confirmButtons: { flexDirection: "row", gap: 10 },
  confirmButton: { flex: 1, minHeight: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  footer: { fontSize: 12, textAlign: "center" },
});
