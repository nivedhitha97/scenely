import { currentPlace, discoveredCount, placeStatus, walkAfter, type Place } from "../places";
import { completeScene, emptyProgress } from "../progress";
import { scenesNl } from "@/scenes";
import { placesNl } from "@/scenes/nl/places";

const scenes = scenesNl;
const cafe = placesNl[0];
const done = (ids: string[]) => ids.reduce((p, id) => completeScene(p, id, {}).progress, emptyProgress);

describe("places", () => {
  it("every scene belongs to exactly one place, and every place scene exists", () => {
    const ids = placesNl.flatMap((p) => p.sceneIds);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(scenes.map((s) => s.id).sort());
  });

  it("starts with the café open and every other place locked", () => {
    expect(placeStatus(cafe, scenes, emptyProgress)).toBe("open");
    for (const place of placesNl.slice(1)) expect(placeStatus(place, scenes, emptyProgress)).toBe("locked");
    expect(currentPlace(placesNl, scenes, emptyProgress).id).toBe("koffiebar");
    expect(discoveredCount(placesNl, scenes, emptyProgress)).toBe(1);
  });

  it("a place is locked while its first scene waits on an earlier place", () => {
    const later: Place = { ...placesNl[1], sceneIds: ["koffiebar-barista"] };
    expect(placeStatus(later, scenes, emptyProgress)).toBe("locked");
  });

  it("marks a place without scenes as soon", () => {
    expect(placeStatus({ ...cafe, sceneIds: [] }, scenes, emptyProgress)).toBe("soon");
  });

  it("every place has one scene per role, in the order the map shows", () => {
    for (const place of placesNl) {
      expect(place.sceneIds).toHaveLength(place.roles.length);
      place.sceneIds.forEach((id, i) => expect(scenes.find((s) => s.id === id)?.role.title).toBe(place.roles[i]));
    }
  });

  it("finishing every scene finishes the whole map", () => {
    const all = done(scenes.map((s) => s.id));
    for (const place of placesNl) expect(placeStatus(place, scenes, all)).toBe("done");
    expect(discoveredCount(placesNl, scenes, all)).toBe(placesNl.length);
  });

  it("opens the supermarket once both café roles are done", () => {
    const afterCafe = done(["koffiebar-klant", "koffiebar-barista"]);
    expect(placeStatus(placesNl[1], scenes, afterCafe)).toBe("open");
    expect(currentPlace(placesNl, scenes, afterCafe).id).toBe("supermarkt");
  });

  it("stays open after one role and is done after both", () => {
    expect(placeStatus(cafe, scenes, done(["koffiebar-klant"]))).toBe("open");
    expect(placeStatus(cafe, scenes, done(["koffiebar-klant", "koffiebar-barista"]))).toBe("done");
  });

  it("walks to the next place only when a place is finished for the first time", () => {
    const one = done(["koffiebar-klant"]);
    const both = done(["koffiebar-klant", "koffiebar-barista"]);
    expect(walkAfter(placesNl, scenes, emptyProgress, one)).toBeNull();
    const walk = walkAfter(placesNl, scenes, one, both);
    expect(walk?.from.id).toBe("koffiebar");
    expect(walk?.to.id).toBe("supermarkt");
    // Replaying a finished place doesn't walk again.
    const replay = completeScene(both, "koffiebar-klant", {}).progress;
    expect(walkAfter(placesNl, scenes, both, replay)).toBeNull();
  });

  it("puts the avatar at the next place after finishing one", () => {
    expect(currentPlace(placesNl, scenes, done(["koffiebar-klant", "koffiebar-barista"])).id).toBe("supermarkt");
  });
});
