import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

import { setExpandedLinks } from "@/state/slices/uiSlice";

import { IoGridOutline, IoLayersOutline } from "react-icons/io5";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

import {
  HiOutlineCog,
  HiOutlineCloud,
  HiOutlineLibrary,
  HiOutlineDocumentReport,
  HiOutlineClipboardCheck,
  HiOutlinePresentationChartBar,
  HiOutlinePresentationChartLine,
} from "react-icons/hi";

import { useAppSelector, useAppDispatch } from "@/hooks/useStoreTypes";

interface NavLink {
  name: string;
  href: string;
  icon?: JSX.Element;
  children?: {
    name: string;
    href: string;
  }[];
}

const NavLinks = [
  {
    name: "Dashboard",
    href: "dashboard",
    icon: <IoGridOutline className="inline-block w-6 h-6 mr-2" />,
  },
  {
    name: "Datasets",
    href: "datasets",
    icon: <HiOutlineCloud className="inline-block w-6 h-6 mr-2" />,
    children: [
      {
        name: "My Datasets",
        href: "/my-datasets",
      },
      {
        name: "My Data Sources",
        href: "/data-sources",
      },
      {
        name: "Subscribe Datasets",
        href: "/subscribe-datasets",
      },
    ],
  },

  {
    name: "Data Contracts",
    href: "data-contracts",
    icon: <IoLayersOutline className="inline-block w-6 h-6 mr-2" />,
    children: [
      {
        name: "Inbound Contracts to Approve",
        href: "/inbound-contracts",
      },
      {
        name: "Approved Contracts",
        href: "/approved-contracts",
      },
      {
        name: "Outbound Contracts",
        href: "/outbound-contracts",
      },
      {
        name: "Personas",
        href: "/personas",
      },
    ],
  },

  {
    name: "Policies",
    href: "policies",
    icon: <HiOutlineClipboardCheck className="inline-block w-6 h-6 mr-2" />,
  },

  {
    name: "Monitoring",
    href: "monitoring",
    icon: (
      <HiOutlinePresentationChartBar className="inline-block w-6 h-6 mr-2" />
    ),
    children: [
      {
        name: "Alerts",
        href: "/alerts",
      },
      {
        name: "Reports",
        href: "/reports",
      },
      {
        name: "Anomalies",
        href: "/anomalies",
      },
      {
        name: "Audit Logs",
        href: "/audit-logs",
      },
    ],
  },

  {
    name: "Troubleshooting",
    href: "troubleshooting",
    icon: (
      <HiOutlinePresentationChartLine className="inline-block w-6 h-6 mr-2" />
    ),
  },

  {
    name: "DDX Infrastructure",
    href: "ddx",
    icon: <HiOutlineDocumentReport className="inline-block w-6 h-6 mr-2" />,
  },

  {
    name: "My Org",
    href: "my-org",
    icon: <HiOutlineLibrary className="inline-block w-6 h-6 mr-2" />,
    children: [
      {
        name: "Organizational Units",
        href: "/org-units",
      },
      {
        name: "Agreements and Assets",
        href: "agreements",
      },
      {
        name: "Authentication",
        href: "authentication",
      },
      {
        name: "Roles",
        href: "roles",
      },
    ],
  },

  {
    name: "Settings",
    href: "settings",
    icon: <HiOutlineCog className="inline-block w-6 h-6 mr-2" />,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { expandedLinks } = useAppSelector((state) => state.ui);

  const showNested = (link: NavLink) => {
    const expanded = !expandedLinks[link.name];

    NavLinks.forEach((link) => {
      if (link.children) {
        dispatch(setExpandedLinks({ linkName: link.name, expanded: false }));
      }
    });

    dispatch(setExpandedLinks({ linkName: link.name, expanded }));
  };

  return (
    <nav className="hidden md:left-0 md:flex md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden border-r border-gray-200 bg-white relative md:w-64 py-4 px-2">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        <Link href="/">
          <Image src="/logo.svg" alt="Drio Logo" width={145} height={145} />
        </Link>

        <div
          className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded`}
        >
          <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            {NavLinks.map((link) => (
              <li key={link.name}>
                <span
                  className={`text-sm py-3 px-2 font-medium flex justify-between items-center 
                        ${
                          router.pathname.indexOf(link.href) !== -1
                            ? "bg-gray-100 text-gray-600 hover:text-gray-500 rounded-lg"
                            : "text-gray-500 hover:text-gray-500"
                        }
                      `}
                >
                  <Link href={`/${link.href}`}>
                    <span
                      className={`                        ${
                        router.pathname.indexOf(link.href) !== -1
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                  {link.children && (
                    <span
                      className="ml-4"
                      onClick={() => {
                        showNested(link);
                      }}
                    >
                      {expandedLinks[link.name] ? (
                        <AiFillCaretUp className="cursor-pointer inline-block w-4 h-4 text-gray-700" />
                      ) : (
                        <AiFillCaretDown className="cursor-pointer inline-block w-4 h-4 text-gray-700" />
                      )}
                    </span>
                  )}
                </span>

                {link.children &&
                  expandedLinks[link.name] &&
                  link.children.length > 0 && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none md:pl-4 my-2">
                      {link.children.map((child) => (
                        <li key={child.name}>
                          <Link href={`/${link.href}/${child.href}`}>
                            <span
                              className={`text-sm py-3 px-2 font-medium block my-1 ${
                                router.pathname.indexOf(child.href) !== -1
                                  ? "bg-gray-100 text-gray-600 hover:text-gray-500 rounded-lg"
                                  : "text-gray-500 hover:text-gray-600"
                              }`}
                            >
                              {child.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
