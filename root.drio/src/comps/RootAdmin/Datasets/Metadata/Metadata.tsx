import Table from "@/comps/ui/Table";
import Modal from "@/comps/ui/Modal";
import Button from "@/comps/ui/Button";
import MetadataMenu from "./MetadataMenu";

import {
  setRows,
  setCurrentRow,
  setSelectedRows,
} from "@/state/slices/metadataSlice";

import { useEffect } from "react";
import { IoRefresh } from "react-icons/io5";
import AddMetaDataForm from "./AddMetaDataForm";
import { HiMinusSm, HiPlus } from "react-icons/hi";
import * as Checkbox from "@radix-ui/react-checkbox";
import { setOpenModal } from "@/state/slices/uiSlice";
import MetadataPopover from "./HeaderPopovers/MetadataPopover";
import VisibilityPopover from "./HeaderPopovers/VisibilityPopover";
import { useAppDispatch, useAppSelector } from "@/hooks/useStoreTypes";

import SchemaStats from "./SchemaStats";
import { useRouter } from "next/router";
import getSchema from "@/functions/getSchema";
import { mergedDDXData } from "@/functions/mergeDDXData";
import { setRows as setDDXRows } from "@/state/slices/DDXSlice";
import { mergedDataSourceData } from "@/functions/mergeDataSources";
import { setRows as setDataSourceRows } from "@/state/slices/dataSourceSlice";

type Params = {
  id: string;
  ou_id: string;
  account_id: string;
};

const headers = [
  {
    header: "Dataset Name",
    accessor: "property",
  },
  {
    header: "Sample Value",
    accessor: "sample_value",
  },
  {
    header: "Data Type",
    accessor: "property_type",
  },
  {
    header: "Visibility",
    accessor: "visibility",
    menu: <VisibilityPopover />,
  },
  {
    type: "array",
    accessor: "tags",
    header: "Metadata",
    menu: <MetadataPopover />,
  },
  {
    header: "Last Updated",
    accessor: "last_updated",
  },
];

const Metadata = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { recursiveRows } = useAppSelector((state) => state.orgUnit);
  const { rows, selectedRows } = useAppSelector((state) => state.metadata);
  const { rows: dataSourceRows } = useAppSelector((state) => state.dataSource);

  const datasetName = router?.query?.dataset;
  const datasourceId = router.asPath.split("/")[3];

  useEffect(() => {
    dispatch(setDDXRows(mergedDDXData()));
    dispatch(setDataSourceRows(mergedDataSourceData()));
  }, [dispatch, recursiveRows]);

  useEffect(() => {
    const params = dataSourceRows?.find((row) => row?.id === datasourceId);

    getSchema({
      ou_id: params?.ou_id ?? "",
      datasource_id: params?.id ?? "",
      account_id: params?.account_id ?? "",
    }).then((payload) => {
      const data = payload?.filter((row) => row?.dataset_name === datasetName);
      dispatch(setRows([...data]));
    });
  }, [dataSourceRows, datasetName, datasourceId, dispatch]);

  const handleCheckbox = (index: number) => {
    if (selectedRows.includes(index)) {
      dispatch(setSelectedRows(selectedRows.filter((row) => row !== index)));
    } else {
      dispatch(setSelectedRows([...selectedRows, index]));
    }
  };

  const handlelRowClick = (row: TableRow) => {
    dispatch(setCurrentRow(row));
    dispatch(setOpenModal("schemStatsDetails"));
  };

  const clearSelectedRows = () => dispatch(setSelectedRows([]));

  return (
    <div className="w-full">
      <div className={"flex flex-col w-full shadow-lg rounded-lg bg-white"}>
        <div className="rounded-lg bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between">
          {selectedRows.length > 0 && (
            <div className="flex items-center">
              <Checkbox.Root
                className="mr-3 flex h-4 w-4 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-drio-red outline-none data-[state=unchecked]:border border-gray-300"
                checked={selectedRows.length > 0}
                onCheckedChange={() => clearSelectedRows?.()}
              >
                <Checkbox.Indicator className="text-white">
                  <HiMinusSm />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <h3 className="font-medium text-sm text-gray-700">
                {selectedRows.length} Item(s) Selected
              </h3>

              <button className="transition-all duration-200 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 flex items-center ml-3 rounded border-2 border-indigo-200 text-drio-red-dark">
                <IoRefresh className="mr-1 font-bold" />
                <span className="text-sm font-medium">Re-run</span>
              </button>
            </div>
          )}

          <div className="flex gap-4 ml-auto">
            <Button
              icon={<HiPlus />}
              intent={"primary"}
              onClick={() => dispatch(setOpenModal("addMetadataForm"))}
            >
              Add New Metadata
            </Button>
          </div>

          <div className="hidden">
            <Modal identifier="addMetadataForm">
              <AddMetaDataForm />
            </Modal>
          </div>

          <div className="hidden">
            <Modal identifier="schemStatsDetails">
              <SchemaStats />
            </Modal>
          </div>
        </div>

        <Table
          rows={rows}
          menu={MetadataMenu}
          selectedRows={selectedRows}
          handleCheckbox={handleCheckbox}
          handleRowClick={handlelRowClick}
          headers={headers.map((header) => {
            return header.header === "Dataset Name"
              ? { ...header, header: datasetName as string }
              : header;
          })}
        />
      </div>
    </div>
  );
};

export default Metadata;
