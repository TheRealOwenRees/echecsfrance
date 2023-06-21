import { ChangeEvent, useState } from "react";

const useContactForm = () => {
  const [values, setValues] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      };
    });
  };

  const resetForm = () => {
    setValues({ email: "", subject: "", message: "" });
  };

  return { values, handleChange, resetForm };
};

export default useContactForm;
