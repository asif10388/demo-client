import Table from "@/comps/ui/Table";
import { setSelectedRows } from "@/state/slices/orgUnitSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStoreTypes";

import OrgUnitMenu from "./OrgUnitMenu";
import AddOrgUnitForm from "./AddOrgUnitForm";

import { IoRefresh } from "react-icons/io5";
import { HiMinusSm, HiPlus } from "react-icons/hi";

import Button from "@ui/Button";
import Modal from "@/comps/ui/Modal";
import * as Checkbox from "@radix-ui/react-checkbox";
import StaticLoader from "@/comps/ui/Loader/StaticLoader";

import { useCallback, useEffect, useState } from "react";
import { setOpenModal } from "@/state/slices/uiSlice";
import { useGetOrgUnitsQuery } from "@/api/resources/ous";
import { webSocketService } from "@/state/services/webSocketService";

const headers = [
  {
    header: "Organization Unit",
    accessor: "name",
  },
  {
    header: "Location",
    accessor: "location",
  },

  {
    header: "Datasets Published",
    accessor: "datasetsPublished",
  },
  {
    header: "Contracts",
    accessor: "contracts",
  },
  {
    header: "Daily Usage Frequency",
    accessor: "dailyUsageFrequency",
  },
  {
    header: "Alert ( 7 days)",
    accessor: "alerts",
  },
];

const OrgUnits = () => {
  const dispatch = useAppDispatch();
  const [connected, setConnected] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { selectedRows } = useAppSelector((state) => state.orgUnit);
  const { data, isLoading } = useGetOrgUnitsQuery(user?.account_id ?? "");

  let topic = `/exchange/my-exchange/topic.message`;

  const handleMessage = useCallback(
    (body: any) => console.log("Message:", topic, body),
    [topic]
  );

  useEffect(() => {
    webSocketService.connect();

    const handleConnection = () => {
      setConnected(true);
      webSocketService.subscribeToTopic(topic, handleMessage);
    };

    const handleDisconnection = () => {
      setConnected(false);
    };

    webSocketService.setOnConnectCallback(handleConnection);
    webSocketService.setOnDisconnectCallback(handleDisconnection);

    return () => {
      webSocketService.unsubscribeFromTopic(topic);
      webSocketService.disconnect();
    };
  }, [handleMessage, topic]);

  const handleCheckbox = (index: number) => {
    if (selectedRows.includes(index)) {
      dispatch(setSelectedRows(selectedRows.filter((row) => row !== index)));
    } else {
      dispatch(setSelectedRows([...selectedRows, index]));
    }
  };

  const clearSelectedRows = () => dispatch(setSelectedRows([]));

  const transformData =
    data?.map((row) => ({
      ...row,
      alerts: Math.round(Math.random() * 7),
      contracts: Math.round(Math.random() * 20),
      datasetsPublished: Math.round(Math.random() * 30),
      location: ` ${row.city}, ${row.state}, ${row.country}`,
      dailyUsageFrequency: `${Math.round(Math.random() * 400)} / day`,
    })) ?? [];

  type ExtendedOrgUnit = (typeof transformData)[0];
  const typedOrgUnits: ExtendedOrgUnit[] = transformData as ExtendedOrgUnit[];

  if (isLoading) return <StaticLoader />;

  return (
    <div className={`w-full`}>
      <div className={"flex flex-col w-full shadow-lg rounded-lg bg-white"}>
        <div className="rounded-lg bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between">
          {selectedRows.length > 0 && (
            <div className="flex items-center">
              <Checkbox.Root
                className="mr-3 flex h-4 w-4 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-drio-red outline-none data-[state=unchecked]:border border-gray-300"
                onCheckedChange={() => clearSelectedRows?.()}
                checked={selectedRows.length > 0}
              >
                <Checkbox.Indicator className="text-white">
                  <HiMinusSm />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <h3 className={"font-medium text-sm text-gray-700"}>
                {selectedRows.length} Item(s) Selected
              </h3>

              <button className="transition-all duration-200 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 flex items-center ml-3 rounded border-2 border-indigo-200 text-drio-red-dark">
                <IoRefresh className="mr-1 font-bold" />
                <span className="text-sm font-medium">Re-run</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 ml-auto">
            <Button
              icon={<HiPlus />}
              intent={"primary"}
              onClick={() => dispatch(setOpenModal("addOrgUnitForm"))}
            >
              Add Organization Unit
            </Button>
          </div>

          <div className="hidden">
            <Modal identifier="addOrgUnitForm">
              <AddOrgUnitForm />
            </Modal>
          </div>
        </div>

        <Table<ExtendedOrgUnit, keyof ExtendedOrgUnit>
          headers={headers}
          menu={OrgUnitMenu}
          rows={typedOrgUnits}
          selectedRows={selectedRows}
          handleCheckbox={handleCheckbox}
        />
      </div>
    </div>
  );
};

export default OrgUnits;
