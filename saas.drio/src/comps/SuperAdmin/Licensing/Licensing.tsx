import Table from "@/comps/ui/Table";
import { setSelectedRows } from "@/state/slices/licensingSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStoreTypes";

import LicensingMenu from "./LicensingMenu";

import Button from "@ui/Button";
import Modal from "@/comps/ui/Modal";
import { IoRefresh } from "react-icons/io5";
import { HiMinusSm, HiPlus } from "react-icons/hi";
import * as Checkbox from "@radix-ui/react-checkbox";
import { setOpenModal } from "@/state/slices/uiSlice";

import LicenseDetails from "./LicenseDetails";
import AddNewLicenseForm from "./AddNewLicenseForm";
import UpdateLicenseForm from "./UpdateLicenseForm";

const headers = [
  {
    header: "Account",
    accessor: "account",
  },
  {
    header: "Product SKU",
    accessor: "sku",
  },
  {
    header: "Expiry Date",
    accessor: "expiryDate",
  },

  {
    header: "Capacity Datasets",
    accessor: "capacityDatasets",
  },
  {
    header: "Capacity Contracts",
    accessor: "capacityContracts",
  },
  {
    header: "% Used DS/C",
    accessor: "usedDS_C",
  },
  {
    header: "# Data access rate",
    accessor: "dataAccessRate",
  },
];

const Licensing = () => {
  const dispatch = useAppDispatch();
  const licensingState = useAppSelector((state) => state.licensing);

  const handleCheckbox = (index: number) => {
    if (licensingState.selectedRows.includes(index)) {
      dispatch(
        setSelectedRows(
          licensingState.selectedRows.filter((row) => row !== index)
        )
      );
    } else {
      dispatch(setSelectedRows([...licensingState.selectedRows, index]));
    }
  };

  const clearSelectedRows = () => {
    dispatch(setSelectedRows([]));
  };

  return (
    <div className="py-8 w-full">
      <div className={"flex flex-col w-full shadow-lg rounded-lg bg-white"}>
        <div
          className={`rounded-lg bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between`}
        >
          {licensingState.selectedRows.length > 0 && (
            <div className="flex items-center">
              <Checkbox.Root
                className="mr-3 flex h-4 w-4 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-drio-red outline-none data-[state=unchecked]:border border-gray-300"
                checked={licensingState.selectedRows.length > 0}
                onCheckedChange={() => {
                  clearSelectedRows?.();
                }}
              >
                <Checkbox.Indicator className="text-white">
                  <HiMinusSm />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <h3 className={"font-medium text-sm text-gray-700"}>
                {licensingState.selectedRows.length} Item(s) Selected
              </h3>

              <button className="transition-all duration-200 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 flex items-center ml-3 rounded border-2 border-indigo-200 text-drio-red-dark">
                <IoRefresh className="mr-1 font-bold" />
                <span className="text-sm font-medium">Re-run</span>
              </button>
            </div>
          )}

          <div className="flex gap-4 ml-auto">
            <Button
              intent={"primary"}
              onClick={() => dispatch(setOpenModal("addNewLicenseForm"))}
            >
              <div className="flex items-center gap-1">
                <HiPlus />
                <span className="inline-block">Add License</span>
              </div>
            </Button>
          </div>

          <div className="hidden">
            <Modal identifier="addNewLicenseForm">
              <AddNewLicenseForm />
            </Modal>
          </div>
        </div>

        <Table
          headers={headers}
          menu={LicensingMenu}
          rows={licensingState.rows}
          editForm={UpdateLicenseForm}
          detailsWindow={LicenseDetails}
          handleCheckbox={handleCheckbox}
          selectedRows={licensingState.selectedRows}
        />
      </div>
    </div>
  );
};

export default Licensing;
