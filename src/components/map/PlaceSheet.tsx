import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/Icon";
import type { Place, PlaceStatus } from "@/engine/places";
import { sceneStatus, type Progress } from "@/engine/progress";
import type { Scene } from "@/engine/types";
import { useTheme } from "@/themes";
import { C, shadow } from "./palette";

/** The card under the map for the tapped place: its roles, and a button to play the next one. */
export function PlaceSheet({
  place,
  status,
  here,
  isNew,
  scenes,
  progress,
  bottom,
  onPlay,
}: {
  place: Place;
  status: PlaceStatus;
  /** The avatar is standing here. */
  here: boolean;
  /** Just reached by walking. */
  isNew: boolean;
  scenes: Scene[];
  progress: Progress;
  bottom: number;
  onPlay: (sceneId: string) => void;
}) {
  const t = useTheme();
  const placeScenes = place.sceneIds.map((id) => scenes.find((s) => s.id === id)).filter((s): s is Scene => !!s);
  const states = placeScenes.map((s) => sceneStatus(scenes, progress, s.id));
  const nextIndex = states.indexOf("unlocked");
  const allDone = states.length > 0 && states.every((st) => st === "completed");
  const playIndex = nextIndex !== -1 ? nextIndex : allDone ? 0 : -1;

  const kicker = isNew ? "NIEUWE PLEK" : here ? "HIER BEN JE" : null;
  const roleNames = placeScenes.length ? placeScenes.map((s) => s.role.title) : place.roles;

  return (
    <View style={[s.sheet, { backgroundColor: t.colors.paper }, { paddingBottom: bottom + 16 }]}>
      <View style={s.grabber} />
      <View style={s.head}>
        <View style={[s.iconTile, { backgroundColor: status === "done" || status === "open" ? t.colors.primarySoft : t.colors.chip }]}>
          <Icon name={place.icon} size={26} color={status === "done" || status === "open" ? t.colors.primaryDark : t.colors.inkMuted} />
        </View>
        <View style={s.headText}>
          {kicker && <Text style={[s.kicker, { fontFamily: t.fonts.bodyBold }]}>{kicker}</Text>}
          <Text style={[s.title, { color: t.colors.ink }, { fontFamily: t.fonts.display }]}>{place.title}</Text>
          <Text style={[s.blurb, { color: t.colors.inkMuted }, { fontFamily: t.fonts.bodyMedium }]}>{place.blurb}</Text>
        </View>
      </View>

      <View style={s.roles}>
        {roleNames.map((name, i) => {
          const st = states[i];
          const done = st === "completed";
          const next = i === playIndex && !done;
          const locked = !st || st === "locked";
          return (
            <Pressable
              key={name}
              disabled={!placeScenes[i] || (locked && !__DEV__)}
              onPress={locked ? undefined : () => onPlay(placeScenes[i].id)}
              onLongPress={locked && __DEV__ && placeScenes[i] ? () => onPlay(placeScenes[i].id) : undefined}
              accessibilityRole="button"
              accessibilityLabel={`${name}${done ? ", klaar" : locked ? ", op slot" : ""}`}
              accessibilityState={{ disabled: locked }}
              style={[s.role, { backgroundColor: t.colors.card, borderColor: t.colors.line }, next ? s.roleNext : null]}
            >
              <View style={s.roleRow}>
                {done && (
                  <View style={[s.dot, { backgroundColor: C.teal }]}>
                    <Icon name="tick" size={12} color="#fff" strokeWidth={3.6} />
                  </View>
                )}
                {locked && (
                  <View style={[s.dot, { backgroundColor: t.colors.chip }]}>
                    <Icon name="lock" size={11} color={t.colors.inkMuted} strokeWidth={2.8} />
                  </View>
                )}
                <Text style={[s.roleName, { color: t.colors.ink }, { fontFamily: t.fonts.bodyBold }]}>{name}</Text>
              </View>
              <Text style={[s.roleSub, { color: t.colors.inkMuted }, { fontFamily: t.fonts.bodyMedium }]}>
                {done ? placeScenes[i].badge.message : next ? "Volgende" : status === "soon" ? "Binnenkort" : "Op slot"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {playIndex !== -1 ? (
        <Pressable
          onPress={() => onPlay(placeScenes[playIndex].id)}
          accessibilityRole="button"
          style={({ pressed }) => [s.cta, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={[s.ctaText, { fontFamily: t.fonts.bodyBold }]}>
            {states[playIndex] === "completed" ? "Opnieuw spelen" : isNew ? "Ga naar binnen" : `Speel als ${placeScenes[playIndex].role.title.toLowerCase()}`}
          </Text>
        </Pressable>
      ) : (
        <View style={[s.note, { backgroundColor: t.colors.chip }, { backgroundColor: t.colors.chip }]}>
          <Icon name="lock" size={18} color={t.colors.inkMuted} strokeWidth={2.4} />
          <Text style={[s.noteText, { color: t.colors.ink }, { fontFamily: t.fonts.bodyBold }]}>
            {status === "soon" ? "Deze plek komt binnenkort." : "Voltooi eerst de vorige plek."}
          </Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: C.cream, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 10, ...shadow, shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.14, shadowRadius: 24 },
  grabber: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#E3D8CA", alignSelf: "center", marginBottom: 12 },
  head: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconTile: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  headText: { flex: 1 },
  kicker: { fontSize: 12, color: C.coralD, letterSpacing: 0.5 },
  title: { fontSize: 20, color: C.ink },
  blurb: { fontSize: 13, color: C.grey },
  roles: { flexDirection: "row", gap: 10, marginTop: 14 },
  role: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 12, borderWidth: 1.5, borderColor: C.line, gap: 2 },
  roleNext: { borderWidth: 2, borderColor: C.coral },
  roleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  roleName: { fontSize: 15, color: C.ink },
  roleSub: { fontSize: 12, color: C.grey },
  cta: { height: 52, borderRadius: 14, backgroundColor: C.coral, alignItems: "center", justifyContent: "center", marginTop: 14 },
  ctaText: { color: "#fff", fontSize: 16 },
  note: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: C.stone },
  noteText: { fontSize: 14, color: C.ink, flex: 1 },
});
