/// <reference types="next/image-types/global" />

// Use type safe message keys with `next-intl`
type Messages = typeof import("./src/messages/fr.json");

interface IntlMessages extends Messages {}
