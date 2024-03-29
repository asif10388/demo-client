import Modal from "@/comps/ui/Modal";
import { HiDotsVertical } from "react-icons/hi";
import * as Popover from "@radix-ui/react-popover";
import { useAppDispatch } from "@/hooks/useStoreTypes";

import DeleteOrgUnit from "../DeleteOrgUnit";
import EditOrgUnitForm from "../EditOrgUnitForm";
import { setOpenModal } from "@/state/slices/uiSlice";

const OrgUnitMenu = ({ row }: TableRow) => {
  const dispatch = useAppDispatch();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <HiDotsVertical />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="left"
          sideOffset={5}
          align="center"
          className="bg-white rounded-lg shadow-lg text-sm text-gray-700"
        >
          <span className={"cursor-pointer hover:bg-indigo-50 w-full block"}>
            <Modal
              label="Edit"
              identifier="editOrgUnitForm"
              onClick={() => dispatch(setOpenModal("editOrgUnitForm"))}
            >
              <EditOrgUnitForm row={row} />
            </Modal>
          </span>

          <span className={"cursor-pointer hover:bg-indigo-50 w-full block"}>
            <Modal
              label="Delete"
              identifier="deleteOrgUnit"
              onClick={() => dispatch(setOpenModal("deleteOrgUnit"))}
            >
              <DeleteOrgUnit row={row} />
            </Modal>
          </span>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default OrgUnitMenu;
