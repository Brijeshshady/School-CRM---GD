import { Outlet } from "react-router-dom";
import { StaffLayout } from "./StaffLayout";
export const Layout = () => {
  return <StaffLayout>
      <Outlet />
    </StaffLayout>;
};
