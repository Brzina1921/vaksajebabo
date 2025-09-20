const LoaderOverlay = () => {
  return (
    <div className="bg-gray-200 flex items-center justify-center">
      <div className="fixed inset-0 items-center justify-center z-30">
        <div className="backdrop-blur-sm">
          <div className="flex space-x-2 justify-center items-center h-screen">
            <span className="sr-only">Loading...</span>
            <div className="h-8 w-8 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-8 w-8 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-8 w-8 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderOverlay;
