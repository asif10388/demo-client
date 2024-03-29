import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UIState = {
  pageTitles: {
    [key: string]: string;
  };

  expandedLinks: {
    [key: string]: boolean;
  };

  modalBoolObject: {
    [key: string]: boolean;
  };

  showSidebar: boolean;
};

const initialState: UIState = {
  expandedLinks: {},
  showSidebar: false,
  modalBoolObject: {},
  pageTitles: {
    ddx: "DDX",
    accounts: "Accounts",
    licensing: "Licensing",
    ous: "Organization Units",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setOpenModal(state, action: PayloadAction<string>) {
      state.modalBoolObject[action.payload] = true;
    },

    setCloseModal(state, action: PayloadAction<string>) {
      state.modalBoolObject[action.payload] = false;
    },

    setExpandedLinks(state, action) {
      const { linkName, expanded } = action.payload;
      state.expandedLinks[linkName] = expanded;
    },

    setShowSidebar(state, action: PayloadAction<boolean>) {
      state.showSidebar = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { setOpenModal, setCloseModal, setExpandedLinks, setShowSidebar } =
  uiSlice.actions;

export default uiSlice.reducer;
