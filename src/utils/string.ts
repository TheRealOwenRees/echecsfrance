export const removeDiacritics = (str: string) => {
  // We normalize to the composed Unicode form, then we can remove the accents
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const normalizedContains = (haystack: string, needle: string) => {
  const regExp = new RegExp(removeDiacritics(needle), "gi");
  return regExp.test(removeDiacritics(haystack));
};
