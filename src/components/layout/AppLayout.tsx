import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type JSX,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sidebar, type SidebarSection } from "../sidebar";
import Icon from "../ui/Icon";
import { cn } from "../../lib/utils";

interface LayoutContextType {
    openCreateBoard: () => void;
    openCommand: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(
    undefined
);

export const useLayout = (): LayoutContextType => {
    const context = useContext(LayoutContext);

    if (!context) {
        throw new Error("useLayout must be used within AppLayout");
    }

    return context;
};

const LayoutInner = (): JSX.Element => {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const [createOpen, setCreateOpen] =
        useState(false);

    const [commandOpen, setCommandOpen] =
        useState(false);

    const [collapsed, setCollapsed] =
        useState(
            () =>
                localStorage.getItem(
                    "sidebar-collapsed"
                ) === "true"
        );

    const openCreateBoard = useCallback(() => {
        setCreateOpen(true);
    }, []);

    const openCommand = useCallback(() => {
        setCommandOpen(true);
    }, []);

    const toggleSidebar = useCallback(() => {

        setCollapsed((prev) => {

            const next = !prev;

            localStorage.setItem(
                "sidebar-collapsed",
                String(next)
            );

            return next;

        });

    }, []);

    useEffect(() => {

        const onKey = (e: KeyboardEvent) => {

            if (
                (e.metaKey || e.ctrlKey)
                &&
                e.key.toLowerCase() === "k"
            ) {

                e.preventDefault();

                setCommandOpen(
                    value => !value
                );

            }

        };

        document.addEventListener(
            "keydown",
            onKey
        );

        return () => {

            document.removeEventListener(
                "keydown",
                onKey
            );

        };

    }, []);

    const sidebarSections: SidebarSection[] = [
        {
            title: "Menu",

            items: [
                {
                    label: "Dashboard",
                    icon: "dashboard",
                    to: "/dashboard",
                },

                {
                    label: "My Tasks",
                    icon: "task_alt",
                    to: "/my-tasks",
                },

                {
                    label: "Calendar",
                    icon: "calendar_month",
                    to: "/calendar",
                },

                {
                    label: "Team",
                    icon: "groups",
                    to: "/team",
                },
            ],
        },

        {
            title: "General",

            items: [
                {
                    label: "Settings",
                    icon: "settings",
                    to: "/settings",
                },

                {
                    label: "Help & Search",
                    icon: "help",
                    onClick: openCommand,
                },

                {
                    label: "Logout",
                    icon: "logout",
                    onClick: logout,
                },
            ],
        },
    ];

    return (

        <LayoutContext.Provider
            value={{
                openCreateBoard,
                openCommand
            }}
        >

            <div className="h-screen overflow-hidden">

                <Sidebar

                    collapsed={collapsed}

                    onToggle={toggleSidebar}

                    header={{
                        title: "Flowboard",

                        logo:
                            <Icon name="bolt" filled={true} size={20}
                                className="
                h-5 w-5
                fill-white
                text-white"
                            />

                    }}

                    sections={
                        sidebarSections
                    }

                    bottomContent={

                        <button
                            onClick={openCreateBoard}
                            className="
              brand-gradient
              rounded-2xl
              p-4
              text-left
              text-white
              "
                        >

                            <p className="font-semibold">
                                Plan with AI
                            </p>

                            <p className="text-xs opacity-80">
                                Turn a goal into backlog
                            </p>

                        </button>

                    }

                    footer={

                        <div>
                            User Profile Here
                        </div>

                    }

                />

                <main

                    className={cn(

                        "flex h-screen min-w-0 flex-col overflow-hidden transition-[padding] duration-300",

                        collapsed
                            ? "md:pl-[92px]"
                            : "md:pl-[280px]"

                    )}

                >

                    <Outlet />

                </main>

            </div>

            {/* <CreateBoardModal

                open={createOpen}

                onClose={() =>
                    setCreateOpen(false)
                }

            /> */}

            {/* <CommandMenu

                open={commandOpen}

                onClose={() =>
                    setCommandOpen(false)
                }

                onCreateBoard={() => {

                    setCommandOpen(false);

                    setCreateOpen(true);

                }}

            /> */}

        </LayoutContext.Provider>

    );

};

const AppLayout = (): JSX.Element => (

    // <BoardsProvider>

        <LayoutInner />

    // </BoardsProvider>

);

export default AppLayout;