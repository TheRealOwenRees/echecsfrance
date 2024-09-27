type ErrorBoxProps = { title?: React.ReactNode; error?: React.ReactNode };

export const ErrorBox = ({ title, error }: ErrorBoxProps) => {
  if (!error) return null;

  return (
    <div className="mt-8 rounded bg-orange-700/20 p-4 text-orange-700">
      <div className="flex flex-col gap-4">
        {title && <div className="font-bold">{title}</div>}
        <div>
          <p className="font-medium text-sm">{error}</p>
        </div>
      </div>
    </div>
  );
};
