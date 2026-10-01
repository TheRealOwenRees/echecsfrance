import { Spinner } from "./Spinner";

const LoadingMap = () => {
  return (
    <div className="mt-20 flex h-content justify-center bg-white pt-20 text-center text-gray-900 dark:bg-gray-800 dark:text-white">
      <Spinner />
    </div>
  );
};

export default LoadingMap;
