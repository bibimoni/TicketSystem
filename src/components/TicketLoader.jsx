import { Loader2 } from "lucide-react";

const Loader = ({
  text = "Đang xử lý...",
  height = "300px",
}) => {
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ height }}
    >
      <div className=" w-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-myred mb-4"></div>
        <h2 className="text-xl font-bold text-myred">
          {text}
        </h2>
      </div>
    </div>
  );
};

export default Loader;