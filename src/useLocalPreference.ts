import { useEffect, useState } from "react";
import { LocalPreferenceManager } from "./LocalPreferenceManager";
import { PreferenceIdentifier, PreferenceListener, ResolvedPreference } from "./Models";


export const useLocalPreference = (prefs: PreferenceIdentifier[]) => {

    type ResolvedPreferenceMap = { [k in typeof prefs[number]["key"]]: ResolvedPreference };

    const [prefsLoaded, setPrefsLoaded] = useState<boolean>(false);
    const [resolvedPrefs, setResolvedPrefs] = useState<ResolvedPreference[]>([]);

    LocalPreferenceManager.instance;

    const prefArr: ResolvedPreference[] = [];
    if (!prefsLoaded) {
        const listeners: PreferenceListener[] = [];
        for (let pref of prefs) {
            prefArr.push(LocalPreferenceManager.getPreference(pref)!);
            const listener: PreferenceListener = {
                key: pref.key,
                listener: (pref) => {
                    setPrefsLoaded(false);
                }
            };
            listeners.push(listener);
            LocalPreferenceManager.registerListener(listener);
        }
        setResolvedPrefs(prefArr);
        setPrefsLoaded(true);
    }

    // useEffect(() => {
    //     return () => {
    //         for (let listener of listeners) {
    //             LocalPreferenceManager.unregisterListener(listener);
    //         }
    //     };
    // });

    const resolvedPrefMap: ResolvedPreferenceMap = (prefsLoaded ? resolvedPrefs : prefArr).reduce((acc, pref) => {
        return {
            ...acc,
            [pref.key]: pref
        };
    }, {} as ResolvedPreferenceMap);

    return resolvedPrefMap;
};