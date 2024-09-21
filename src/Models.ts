export type PreferenceValueTypeName = "string" | "number" | "boolean";
export type PreferenceValueType = string | number | boolean;

export interface Preference {
    key: string;
    type: PreferenceValueTypeName;
    serialVersionUID: number;
}

export interface PreferenceConfiguration extends Preference {
    defaultValue: PreferenceValueType;
    name?: string;
    description?: string;
}

export interface SerializedPreference extends Preference {
    createdAt: number;
    updatedAt: number;
    value: PreferenceValueType;
}

export type PreferenceIdentifier = Omit<Preference, "serialVersionUID" | "type"> & {
    fallback: PreferenceValueType
};

export type ResolvedPreference = PreferenceConfiguration & SerializedPreference & {
    set: (value: PreferenceValueType) => void;
};

export interface PreferenceListener {
    key: string;
    listener: (preference: ResolvedPreference) => void;
}

export interface PreferenceManagerMetadata {
    package: string;
    version: string;
    createdAt: number;
    updatedAt: number;
    serialUIDHash: string;
}

export interface SerializedPreferenceManager {
    preferenceManager: PreferenceManagerMetadata;
    preferences: SerializedPreference[];
}