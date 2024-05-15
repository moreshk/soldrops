import { checkAuth } from "@/lib/auth/utils";
import { BuyCrypto } from "./component/buyCrypto";

const Buy = async () => {
  await checkAuth();
  return <BuyCrypto />;
};

export default Buy;
