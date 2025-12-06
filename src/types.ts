export interface LocalizedString {
  en: string;
  zh: string;
}

export interface Shortcut {
  key: string;
  description: LocalizedString;
  category: LocalizedString;
}

export interface ShortcutGroup {
  name: string;
  items: Shortcut[];
  isFavorites?: boolean;
}
