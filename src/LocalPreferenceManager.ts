import packageJson from "../package.json";
import { sha512 } from 'js-sha512';
import { PreferenceConfiguration, PreferenceIdentifier, PreferenceListener, PreferenceManagerMetadata, ResolvedPreference, SerializedPreference, SerializedPreferenceManager } from "./Models";

export class LocalPreferenceManager {

    static localStorageKey = "react-local-preferences-manager";

    static #instance: LocalPreferenceManager;

    static isLoaded: boolean = false;
    static metadata: PreferenceManagerMetadata;

    static #preferenceConfigurations: PreferenceConfiguration[] = [];
    static #preferences: SerializedPreference[] = [];
    static #preferenceListeners: PreferenceListener[] = [];

    private constructor() {
        LocalPreferenceManager.metadata = {
            package: packageJson.name,
            version: packageJson.version,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            serialUIDHash: LocalPreferenceManager.getManagerSerialUID()
        };
        if (!LocalPreferenceManager.load()) {
            LocalPreferenceManager.persist();
        }
    }

    public static registerListener(listener: PreferenceListener) {
        LocalPreferenceManager.#preferenceListeners.push(listener);
    }

    public static unregisterListener(listener: PreferenceListener) {
        LocalPreferenceManager.#preferenceListeners = LocalPreferenceManager.#preferenceListeners.filter(l => l !== listener);
    }

    public static setPreference(key: string, value: any) {
        let pref: SerializedPreference | undefined = LocalPreferenceManager.#preferences.find(p => p.key === key);
        if (!pref) {
            pref = {
                key,
                type: typeof value as any,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                value,
                serialVersionUID: -1
            }
            LocalPreferenceManager.#preferences.push(pref);
        }
        pref.value = value;
        pref.updatedAt = Date.now();
        LocalPreferenceManager.persist();
        LocalPreferenceManager.#preferenceListeners.forEach(l => {
            if (l.key === key) {
                l.listener(LocalPreferenceManager.getPreference({ key, fallback: "" })!);
            }
        });
    }

    public static getPreference(key: PreferenceIdentifier): ResolvedPreference | undefined {
        let pref = LocalPreferenceManager.#preferences.find(p => p.key === key.key);
        const prefConfig = LocalPreferenceManager.#preferenceConfigurations.find(p => p.key === key.key);
        if (!pref) {
            pref = {
                key: key.key,
                type: typeof key.fallback as any,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                value: key.fallback,
                serialVersionUID: -1
            }
            LocalPreferenceManager.#preferences.push(pref);
        }
        return {
            ...(prefConfig ? prefConfig : {}),
            ...pref,
            defaultValue: prefConfig?.defaultValue ?? pref.value, // Ensure defaultValue is always set
            set: (value: any) => {
                pref.value = value;
                pref.updatedAt = Date.now();
                LocalPreferenceManager.persist();
                LocalPreferenceManager.#preferenceListeners.forEach(l => {
                    if (l.key === key.key) {
                        l.listener(LocalPreferenceManager.getPreference(key)!);
                    }
                });
            }
        };
    }

    public static getManagerSerialUID(): string {
        const prefShape = LocalPreferenceManager.#preferences.map(p => {
            return {
                key: p.key,
                type: p.type,
                serialVersionUID: p.serialVersionUID
            }
        });
        return sha512(JSON.stringify(prefShape));
    }

    public static get instance(): LocalPreferenceManager {
        if (!LocalPreferenceManager.#instance) {
            LocalPreferenceManager.#instance = new LocalPreferenceManager();
        }

        return LocalPreferenceManager.#instance;
    }

    private static load(): boolean {
        const serialized = localStorage.getItem(LocalPreferenceManager.localStorageKey);
        if (serialized) {
            const parsed: SerializedPreferenceManager = JSON.parse(serialized);
            console.log("Loading preferences from local storage...", parsed);
            LocalPreferenceManager.#preferences = parsed.preferences;
            LocalPreferenceManager.metadata = parsed.preferenceManager;
            LocalPreferenceManager.metadata.updatedAt = Date.now();
        }
        LocalPreferenceManager.isLoaded = true;
        return serialized !== null;
    }

    private static persist() {
        LocalPreferenceManager.metadata.updatedAt = Date.now();
        const serialized: SerializedPreferenceManager = {
            preferenceManager: LocalPreferenceManager.metadata,
            preferences: LocalPreferenceManager.#preferences
        };
        console.log("Persisting preferences to local storage...", serialized);
        localStorage.setItem(LocalPreferenceManager.localStorageKey, JSON.stringify(serialized));
    }
}