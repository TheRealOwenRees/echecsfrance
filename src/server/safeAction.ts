import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient({
  handleReturnedServerError(error) {
    return error.message;
  },
});
