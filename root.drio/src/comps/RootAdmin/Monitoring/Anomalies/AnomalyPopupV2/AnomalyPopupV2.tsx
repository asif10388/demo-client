/* eslint-disable react/no-unescaped-entities */
import Layout from "@/comps/Layout";
import { HiX } from "react-icons/hi";
import Button from "@/comps/ui/Button";
import { setCloseModal } from "@/state/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStoreTypes";

export default function AnomalyPopupV2() {
  const dispatch = useAppDispatch();
  const { row } = useAppSelector((state) => state.anomalies);

  const renderDescription = () => {
    switch (row?.event_type) {
      case "datatype_mismatch":
        return (
          <p>
            <span className="font-bold">'{row?.field ?? "Unknown"}'</span>{" "}
            attribute of{" "}
            <span className="font-bold">'{row?.name ?? "unknown"}'</span>{" "}
            dataset being published on{" "}
            <span className="font-bold">'{row.ds ?? "unknown source"}'</span>{" "}
            expected to be a{" "}
            <span className="font-bold">
              '{row?.datatype ?? "unknown datatype"}'
            </span>{" "}
            was received as{" "}
            <span className="font-bold">
              '{row?.new_datatype ?? "unknown datatype"}'
            </span>
          </p>
        );

      case "added_new_field":
        return (
          <p>
            A new attribute <span className="font-bold">'{row?.field}'</span> in
            the dataset{" "}
            <span className="font-bold">'{row?.name ?? "unknown"}'</span> being
            published on{" "}
            <span className="font-bold">'{row?.ds ?? "unknown"}'</span> of data
            type <span className="font-bold">'{row?.datatype}'</span> has been
            detected. The attribute was dropped.
          </p>
        );

      case "anomaly":
        return (
          <p>
            <span className="font-bold">'{row?.field}'</span> field of{" "}
            <span className="font-bold">'{row?.name}'</span> dataset being
            published on <span className="font-bold">'{row?.ds}'</span> expected
            to be within 1 and{" "}
            <span className="font-bold">'{row?.iqr ?? "unknown iqr"}'</span> but
            was measured to be{" "}
            <span className="font-bold">'{row?.value ?? "unknown value"}'</span>
          </p>
        );
      default:
        return "No description available";
    }
  };

  const renderResolution = () => {
    switch (row?.event_type) {
      case "datatype_mismatch":
        return `Please check cause of datatype change and change detected schema if the change is valid`;

      case "added_new_field":
        return `Please check if the change is valid and update schema accordingly.`;
      case "anomaly":
        return `Please check if this is a valid change or not.`;
      default:
        return "No resolution available";
    }
  };

  return (
    <Layout>
      <div className="xl:w-[50vw] relative w-[90vw] mx-auto bg-[#FAFAFA] p-8 rounded-lg">
        <span
          className="absolute top-0 right-0 p-6 cursor-pointer"
          onClick={() => dispatch(setCloseModal("anomalyDetails"))}
        >
          <HiX className="w-6 h-6" />
        </span>

        <h2 className="capitalize text-gray-700 text-2xl font-bold">
          {row?.event_type?.replaceAll("_", " ") ?? "Unknown Event"}
        </h2>

        <span className="text-gray-900 block mb-4">
          Detected deviation from learned schema on{" "}
          <span className="font-bold">
            {new Date(row?.timestamp)?.toLocaleString() ?? "Unknown Date"}
          </span>
        </span>

        <div className="flex flex-col gap-y-4">
          <div className="bg-white p-4 flex flex-col gap-y-2 rounded-md">
            <span className="font-medium text-gray-700">Details</span>
            <div className="border-2 p-4 rounded-md">
              <p className="text-gray-900">{renderDescription()}</p>
            </div>
          </div>

          <div className="bg-white p-4 flex flex-col gap-y-2 rounded-md">
            <span className="font-medium text-gray-700">Severity</span>
            <div className="border-2 p-4 rounded-md">
              <span className="text-gray-900">
                {row?.severity ?? "Informational"}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 flex flex-col gap-y-2 rounded-md">
            <span className="font-medium text-gray-700">
              Suggested Resolution
            </span>
            <div className="border-2 p-4 rounded-md">
              <span className="text-gray-700">{renderResolution()}</span>
            </div>
          </div>
        </div>

        <div className="inline-flex justify-center w-full mt-4">
          <Button
            intent={"primary"}
            className="w-full lg:w-[10rem]"
            onClick={() => dispatch(setCloseModal("anomalyDetails"))}
          >
            Close
          </Button>
        </div>
      </div>
    </Layout>
  );
}