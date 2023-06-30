const sendMail = async ({
  email,
  subject,
  message,
}: Record<string, string>) => {
  const data = {
    email: email,
    subject: subject,
    message: message,
  };

  return await fetch("/api/send-mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export default sendMail;
