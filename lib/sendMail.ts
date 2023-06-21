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

  const response = await fetch("/api/send-mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export default sendMail;
