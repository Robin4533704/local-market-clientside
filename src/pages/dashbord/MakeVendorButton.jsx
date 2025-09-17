import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxios";

const MakeVendorButton = ({ userId }) => {
  const axiosInstance = useAxios();

  const handleMakeVendor = async () => {
    if (!window.confirm("Are you sure to make this user a Vendor?")) return;
    try {
      await axiosInstance.put(`/admin/make-vendor/${userId}`);
      toast.success("✅ User promoted to Vendor!");
    } catch {
      toast.error("❌ Failed to promote user");
    }
  };

  return (
    <button
      onClick={handleMakeVendor}
      className="px-3 py-1 bg-green-600 text-white rounded"
    >
      Make Vendor
    </button>
  );
};

export default MakeVendorButton;
