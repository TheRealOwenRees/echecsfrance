// Use type safe message keys with `next-intl`
type Messages = typeof import("./src/messages/fr.json");

declare interface IntlMessages extends Messages {}
