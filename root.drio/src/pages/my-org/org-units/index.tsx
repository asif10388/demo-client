import Layout from "@/comps/Layout";
import withAuth from "@/comps/HOC/withAuth";
import OrgUnits from "@/comps/RootAdmin/OrgUnits";
import DashboardContainer from "@ui/Containers/DashboardContainer";

const OrgUnitPage = () => {
  return (
    <Layout>
      <DashboardContainer>
        <OrgUnits />
      </DashboardContainer>
    </Layout>
  );
};

export default withAuth(OrgUnitPage);
