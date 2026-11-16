import { Redirect, router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, type ScrollViewInstance } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { Figure } from "@/components/avatar/Figure";
import { lookFor } from "@/components/avatar/looks";
import { Icon } from "@/components/Icon";
import { MAP_HEIGHT, MAP_WIDTH, NlTownMap } from "@/components/map/NlTownMap";
import { C, shadow } from "@/components/map/palette";
import { PlaceLabel } from "@/components/map/PlaceLabel";
import { PlaceSheet } from "@/components/map/PlaceSheet";
import { routePath, standPoint } from "@/components/map/route";
import { WalkingAvatar } from "@/components/map/WalkingAvatar";
import { currentPlace, discoveredCount, placeStatus, type Place } from "@/engine/places";
import { sceneStatus } from "@/engine/progress";
import { useGame } from "@/hooks/useGame";
import { scenesNl } from "@/scenes";
import { placesNl } from "@/scenes/nl/places";
import { useTheme } from "@/themes";

const places = placesNl;
const scenes = scenesNl;

/** "Kaart": the illustrated map of the Netherlands. Every place is a scenario; the avatar shows where you are. */
export default function MapScreen() {
  const t = useTheme();
  const game = useGame();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const here = currentPlace(places, scenes, game.progress);
  const statuses = useMemo(
    () => places.map((p) => ({ id: p.id, door: p.door, status: placeStatus(p, scenes, game.progress) })),
    [game.progress],
  );
  const statusOf = (p: Place) => statuses.find((x) => x.id === p.id)!.status;

  // A walk is due when the scene screen has just finished a place.
  const { pendingWalk, setPendingWalk } = game;
  const walk = useMemo(() => {
    const from = places.find((p) => p.id === pendingWalk?.from);
    const to = places.find((p) => p.id === pendingWalk?.to);
    return from && to ? { from, to } : null;
  }, [pendingWalk]);
  const [arrivedAt, setArrivedAt] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [laidOut, setLaidOut] = useState(false);
  const walking = !!walk && arrivedAt !== walk.to.id;

  const vScroll = useRef<ScrollViewInstance>(null);
  const hScroll = useRef<ScrollViewInstance>(null);
  const centreOn = useCallback(
    (x: number, y: number, animated: boolean) => {
      hScroll.current?.scrollTo({ x: Math.max(0, Math.min(MAP_WIDTH - width, x - width / 2)), animated });
      vScroll.current?.scrollTo({ y: Math.max(0, Math.min(MAP_HEIGHT - height, y - height * 0.4)), animated });
    },
    [width, height],
  );

  const finishWalk = useCallback(
    (to: Place) => {
      setArrivedAt(to.id);
      setSelectedId(to.id);
      setPendingWalk(null);
    },
    [setPendingWalk],
  );

  useEffect(() => {
    // Point the camera once the map has its size: at the walk (the avatar arrives at once with
    // reduce motion on, see WalkingAvatar), or else at the place where the avatar stands.
    if (!laidOut) return;
    if (!walk) return;
    if (reduceMotion) centreOn(walk.to.door.x, walk.to.door.y, false);
    else centreOn((walk.from.door.x + walk.to.door.x) / 2, (walk.from.door.y + walk.to.door.y) / 2, true);
  }, [laidOut, walk, reduceMotion, centreOn]);

  if (!game.ready) return <View style={[s.screen, { backgroundColor: C.cream }]} />;
  if (!game.avatar) return <Redirect href="/avatar" />;

  const look = lookFor(game.avatar);
  const selected = places.find((p) => p.id === selectedId) ?? here;
  const sheetPlace = walking ? null : selected;

  const subFor = (p: Place) => {
    if (!p.sceneIds.length) return p.roles.join(" · ");
    return p.sceneIds
      .map((id) => {
        const scene = scenes.find((x) => x.id === id);
        return `${scene?.role.title ?? id}${sceneStatus(scenes, game.progress, id) === "completed" ? " ✓" : ""}`;
      })
      .join(" · ");
  };

  const play = (sceneId: string) => router.push({ pathname: "/scene/[id]", params: { id: sceneId } });
  const avatarAt = walking && walk ? walk.from : here;

  return (
    <View style={[s.screen, { backgroundColor: C.cream }]}>
      <ScrollView
        ref={vScroll}
        bounces={false}
        showsVerticalScrollIndicator={false}
        onLayout={() => {
          if (!walk) centreOn(here.door.x, here.door.y, false);
          setLaidOut(true);
        }}
        contentContainerStyle={{ paddingBottom: 260 }}
      >
        <ScrollView ref={hScroll} horizontal bounces={false} showsHorizontalScrollIndicator={false}>
          <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
            <NlTownMap places={statuses} />
            {walking && walk && (
              <Svg style={StyleSheet.absoluteFill} width={MAP_WIDTH} height={MAP_HEIGHT} pointerEvents="none">
                <Path
                  d={routePath(standPoint(walk.from.door), standPoint(walk.to.door))}
                  stroke={C.coral}
                  strokeWidth={5}
                  strokeDasharray="2 12"
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>
            )}
            {places.map((p) => (
              <PlaceLabel
                key={p.id}
                place={p}
                status={statusOf(p)}
                here={p.id === here.id}
                isNew={p.id === arrivedAt}
                selected={p.id === selected.id}
                sub={subFor(p)}
                onPress={() => !walking && setSelectedId(p.id)}
              />
            ))}
            <WalkingAvatar
              key={walking && walk ? `walk-${walk.from.id}-${walk.to.id}` : `stand-${avatarAt.id}`}
              look={look}
              from={avatarAt.door}
              to={walking && walk ? walk.to.door : undefined}
              instant={reduceMotion}
              onArrive={walk ? () => finishWalk(walk.to) : undefined}
            />
          </View>
        </ScrollView>
      </ScrollView>

      {walking && walk ? (
        <View style={[s.hud, shadow, { top: insets.top + 8 }]}>
          <View style={[s.check, { backgroundColor: C.paleGreen }]}>
            <Icon name="tick" size={16} color={C.teal} strokeWidth={3.4} />
          </View>
          <View style={s.hudText}>
            <Text style={[s.hudTitle, { fontFamily: t.fonts.display }]}>{walk.from.title} voltooid</Text>
            <Text style={[s.hudSub, { fontFamily: t.fonts.bodyBold }]}>Op weg naar {walk.to.title.toLowerCase()}…</Text>
          </View>
          <Pressable onPress={() => finishWalk(walk.to)} accessibilityRole="button" hitSlop={10}>
            <Text style={[s.skip, { fontFamily: t.fonts.bodyBold }]}>Overslaan</Text>
          </Pressable>
        </View>
      ) : (
        <View style={[s.hud, shadow, { top: insets.top + 8 }]}>
          <View style={s.hudText}>
            <Text style={[s.hudTitle, { fontFamily: t.fonts.display }]}>Hallo!</Text>
            <Text style={[s.hudSub, { fontFamily: t.fonts.bodyBold }]}>
              {discoveredCount(places, scenes, game.progress)} van {places.length} plekken ontdekt
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/avatar")}
            accessibilityRole="button"
            accessibilityLabel="Avatar kiezen"
            style={s.avatarButton}
          >
            <View style={s.avatarCrop}>
              <Figure look={look} scale={0.38} />
            </View>
          </Pressable>
        </View>
      )}

      {sheetPlace && (
        <PlaceSheet
          place={sheetPlace}
          status={statusOf(sheetPlace)}
          here={sheetPlace.id === here.id}
          isNew={sheetPlace.id === arrivedAt}
          scenes={scenes}
          progress={game.progress}
          bottom={insets.bottom}
          onPlay={play}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  hud: { position: "absolute", left: 16, right: 16, height: 56, borderRadius: 16, backgroundColor: "rgba(255,253,248,0.96)", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10 },
  hudText: { flex: 1 },
  hudTitle: { fontSize: 17, color: C.ink },
  hudSub: { fontSize: 12, color: C.grey },
  check: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  skip: { fontSize: 13, color: C.coralD },
  avatarButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.peach, borderWidth: 2, borderColor: C.coral, overflow: "hidden" },
  avatarCrop: { position: "absolute", left: -4, top: 0 },
});
