import { Outlet } from "react-router-dom";
import { StaffLayout } from "./layouts/StaffLayout";
export const Layout = () => {
  return <StaffLayout>
      <Outlet />
    </StaffLayout>;
};
