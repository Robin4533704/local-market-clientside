import { useParams } from "react-router-dom";
import PriceTrendChart from "../../dashbord/pandingdelivery/ProductList/PriceTrends";


const PriceTrendChartWrapper = () => {
  const { id } = useParams(); // URL থেকে productId নেবে
  return <PriceTrendChart productId={id} />;
};

export default PriceTrendChartWrapper;
