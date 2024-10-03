import { useCallback, useEffect } from "react";

import { SetFieldValue } from "react-hook-form";

export interface FormPersistConfig {
  storage?: Storage;
  watch: (names?: string | string[]) => any;
  setValue: SetFieldValue<any>;
  exclude?: string[];
  validate?: boolean;
  dirty?: boolean;
  touch?: boolean;
}

const useFormPersist = (
  name: string,
  {
    storage,
    watch,
    setValue,
    exclude,
    validate = false,
    dirty = false,
    touch = false,
  }: FormPersistConfig,
) => {
  const watchedValues = watch();

  const getStorage = useCallback(
    () => storage || window.sessionStorage,
    [storage],
  );

  const clearStorage = useCallback(
    () => getStorage().removeItem(name),
    [getStorage, name],
  );

  useEffect(() => {
    const storedValuesJSON = getStorage().getItem(name);

    if (storedValuesJSON) {
      const values = JSON.parse(storedValuesJSON);
      const dataRestored: { [key: string]: any } = {};

      Object.keys(values).forEach((key) => {
        const shouldSet = !exclude?.includes(key);
        if (shouldSet) {
          dataRestored[key] = values[key];

          setValue(key, values[key], {
            shouldValidate: validate,
            shouldDirty: dirty,
            shouldTouch: touch,
          });
        }
      });

      return () => getStorage().setItem(name, JSON.stringify(dataRestored));
    }
  }, [
    storage,
    name,
    setValue,
    clearStorage,
    dirty,
    exclude,
    touch,
    validate,
    getStorage,
  ]);

  useEffect(() => {
    const values =
      (exclude?.length ?? 0) > 0
        ? Object.entries(watchedValues)
            .filter(([key]) => !exclude!.includes(key))
            .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
        : { ...watchedValues };

    if (Object.entries(values).length > 0) {
      getStorage().setItem(name, JSON.stringify(values));
    }
  }, [watchedValues, exclude, getStorage, name]);

  return {
    clear: () => getStorage().removeItem(name),
  };
};

export default useFormPersist;
