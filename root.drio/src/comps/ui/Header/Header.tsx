import Link from "next/link";
import { useRouter } from "next/router";
import { HiSearch } from "react-icons/hi";

import Button from "../Button";
import { useAppSelector, useAppDispatch } from "@/hooks/useStoreTypes";

import { useLogoutMutation } from "@/api/auth";
import { logout as stateLogout } from "@/state/slices/authSlice";
import { useGetAccountByIdQuery } from "@/api/resources/accounts";

import {
  MdLogout,
  MdOutlineAccountCircle,
  MdOutlineNotifications,
  MdOutlinePeopleOutline,
} from "react-icons/md";
import { setShowSidebar } from "@/state/slices/uiSlice";

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout, result] = useLogoutMutation();
  const { user } = useAppSelector((state) => state.auth);
  const { pageTitles, showSidebar } = useAppSelector((state) => state.ui);

  const { data: account } = useGetAccountByIdQuery({
    id: user?.account_id ?? "",
    recurse: false,
  });

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      if (res.message === "Logout successful") {
        dispatch(stateLogout());
        window.location.href = "/login";
      }
    } catch (error) {
      window.location.href = "/login";
    }
  };

  const path =
    router.pathname &&
    router.pathname
      ?.split("/")
      [router?.pathname?.split("/")?.length - 1]?.replace(/-/g, " ");

  return (
    <nav className="shadow-sm h-[4rem]">
      <div className="flex items-center justify-between md:px-8 px-4 h-full">
        <Link
          className="text-gray-700 text-2xl capitalize hidden md:inline-block font-bold"
          href={router.pathname}
        >
          {pageTitles[path] ?? path}
        </Link>
        <div className="flex items-center">
          {/* <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-center">
              <HiSearch className="text-gray-400 inline-flex h-full absolute items-center justify-center w-8 pl-2 py-2" />
              <input
                placeholder="Search"
                className="pl-10 transition-colors ease-in-out duration-200 border py-2 px-3 my-1 rounded-md focus:outline-none shadow-sm"
              />
            </div>
          </form> */}
          <span
            className="mr-3 cursor-pointer"
            onClick={() => dispatch(setShowSidebar(!showSidebar))}
          >
            <MdOutlineNotifications className="w-6 h-6 text-[#1F2937]" />
          </span>
          {user && (
            <div className="text-[#4C566A] flex">
              <span className="mr-3 flex items-center gap-x-2 bg-neutral-50 rounded-md py-3 px-8">
                <MdOutlinePeopleOutline className="w-5 h-5" />
                {user.username ?? "Demo User"}
              </span>

              <span className="mr-3 flex items-center gap-x-2 bg-neutral-50 rounded-md py-3 px-8">
                <MdOutlineAccountCircle className="w-5 h-5 rounded-md" />
                {account?.name ?? "Demo Account"}
              </span>
            </div>
          )}

          <Button
            intent={"primary"}
            className="text-sm mx-2"
            isLoading={result.isLoading}
            onClick={() => handleLogout()}
            icon={<MdLogout className="w-5 h-5" />}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
