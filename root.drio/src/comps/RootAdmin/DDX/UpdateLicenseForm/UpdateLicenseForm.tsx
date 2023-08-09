import Button from "@ui/Button";
import { SelectInput, TextInput } from "@ui/Forms/Inputs";

import showAlert from "@ui/Alert";
import Layout from "@/comps/Layout";

import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import { useZodForm, Form } from "@ui/Forms/Form";

import { useAppSelector, useAppDispatch } from "@/hooks/useStoreTypes";

import { setCloseModal } from "@/state/slices/uiSlice";
import { setLicenseDetails } from "@/state/slices/DDXSlice";

import LicenseDetails from "../LicenseDetails/LicenseDetails";

import {
  useUpdateLicenseMutation,
  useFetchLicenseMutation,
} from "@/api/resources/ddx";
import { useState } from "react";

const schema = z.object({
  sku: z.string({
    required_error: "Please Enter a value",
  }),
  licenseType: z.string({
    required_error: "Please Enter a value",
  }),
  licenseKey: z.string().nonempty("Please Enter a value"),
});

type FormData = z.infer<typeof schema>;

export default function UpdateLicenseForm() {
  const [showLicenseDetails, setShowLicenseDetails] = useState(false);

  const dispatch = useAppDispatch();
  const [updateLicense, updateResult] = useUpdateLicenseMutation();
  const [fetchLicense, fetchResult] = useFetchLicenseMutation();

  const ddxSstate = useAppSelector((state) => state.DDX);

  const form = useZodForm({
    schema: schema,
  });

  const onFetchLicense: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await fetchLicense({
        ...data,
      }).unwrap();

      console.log(res);

      if (res) {
        setShowLicenseDetails(true);
        dispatch(setLicenseDetails(res));
      }
    } catch (err: any) {
      showAlert(
        err?.data?.message ?? "Something went wrong. Please try again.",
        "error"
      );
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await updateLicense({
        ...data,
      }).unwrap();

      if (res) {
        showAlert("License updated successfully", "success");
      }
    } catch (err: any) {
      showAlert(
        err?.data?.message ?? "Something went wrong. Please try again.",
        "error"
      );
    }

    form.reset();
    dispatch(setCloseModal("updateLicenseForm"));
  };

  return (
    <Layout>
      <Form form={form} onSubmit={onSubmit} className="min-w-[50vw]">
        <div className="w-full mx-auto bg-white p-8 rounded-lg">
          <h2 className="text-gray-700 text-2xl font-bold my-4">
            Account Information
          </h2>

          <div className="flex flex-wrap -m-2 shadow-md p-2 rounded-lg bg-gray-50 my-4">
            <div className="px-4 py-2 w-full">
              <SelectInput
                registerName="sku"
                label={"Product SKU"}
                placeholder={"Enter SKU"}
                className="md:text-sm 2xl:text-base"
                options={[
                  { label: "SKU 1", value: "sku1" },
                  { label: "SKU 2", value: "sku2" },
                  { label: "SKU 3", value: "sku3" },
                ]}
              />
            </div>

            <div className="px-4 py-2 w-full">
              <SelectInput
                label={"License Type"}
                registerName="licenseType"
                placeholder={"Enter type"}
                className="md:text-sm 2xl:text-base"
                options={[
                  { label: "Demo", value: "demo" },
                  { label: "Medium", value: "medium" },
                  { label: "Standard", value: "standard" },
                ]}
              />
            </div>

            <div className="px-4 py-2 w-full flex flex-col md:flex-row md:items-center">
              <TextInput
                label={"License Key"}
                {...form.register("licenseKey")}
                placeholder={"Enter license key"}
                className="md:text-sm 2xl:text-base flex-grow"
              />

              <Button
                type="button"
                intent={`primary`}
                className="mt-5 md:ml-4"
                isLoading={fetchResult.isLoading}
                onClick={() => form.handleSubmit(onFetchLicense)()}
              >
                <span className="py-[3px] px-4">Go</span>
              </Button>
            </div>
          </div>

          {showLicenseDetails && (
            <div className="flex flex-wrap -m-2 shadow-md p-2 rounded-lg bg-gray-50 my-4">
              <LicenseDetails details={ddxSstate.licenseDetails ?? {}} />
            </div>
          )}

          <div className="py-2 flex justify-center md:justify-end w-full mt-4">
            <Button
              type="button"
              intent={`secondary`}
              className="w-full md:w-auto mr-2 md:mr-6"
              onClick={() => dispatch(setCloseModal("updateLicenseForm"))}
            >
              <span className="inline-flex justify-center w-full">Cancel</span>
            </Button>

            <Button
              intent={`primary`}
              className="w-full md:w-auto"
              disabled={!showLicenseDetails}
              isLoading={updateResult.isLoading}
            >
              <span className="inline-flex justify-center w-full">Update</span>
            </Button>
          </div>
        </div>
      </Form>
    </Layout>
  );
}
