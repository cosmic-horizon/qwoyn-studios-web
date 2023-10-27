import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Logo from "../../components/logo";
import MainMenu from "../../components/menu/main-menu";
import MobileNavMenu from "../../components/menu/mobile-menu";
import Button from "../../components/shared/button";
import { useSticky } from "../../hooks";

const Header = ({ data }) => {
    // Sticky Header
    const { sticky, headerRef, fixedRef } = useSticky();

    // OfCanvas Menu
    const [ofcanvasOpen, setOfcanvasOpen] = useState(false);

    const ofcanvasHandaler = () => {
        setOfcanvasOpen((prev) => !prev);
    };

    // Keplr state
    const [isKeplrInstalled, setKeplrInstalled] = useState(false);
    const [keplrAddress, setKeplrAddress] = useState(null);

    // State for hover disconnect option
    const [showDisconnect, setShowDisconnect] = useState(false);

    useEffect(() => {
        if (window.getOfflineSigner && window.keplr) {
            console.log("Keplr detected.");
            setKeplrInstalled(true);
        }
    }, []);

    const loadKeplr = async () => {
        console.log("loadKeplr function called");

        if (isKeplrInstalled) {
            console.log("Trying to connect to Keplr");

            try {
                const chainId = "qwoyn-1";
                await window.keplr.enable(chainId);
                const offlineSigner = window.getOfflineSigner(chainId);
                const accounts = await offlineSigner.getAccounts();
                setKeplrAddress(accounts[0]?.address);
            } catch (error) {
                console.error("Error connecting to Keplr:", error);
            }
        }
    };

    const disconnectKeplr = () => {
        setKeplrAddress(null);
        setShowDisconnect(false);
    };

    return (
        <header ref={headerRef} className="bg-transparent absolute w-full mx-auto z-40">
            <div ref={fixedRef} className={`header-top ${sticky ? "fixed top-0 bg-secondary-100 opacity-90 w-full" : ""}`}>
                <div className="container px-4">
                    <nav className="bg-transparent flex justify-between items-center py-3 px-4"> {/* Added padding for spacing */}
                        <div className="text-3xl font-semibold leading-none">
                            <Logo />
                        </div>
                        <MainMenu allmenuData={data?.menu} />
                        <div className="header-right-action flex items-center space-x-4"> {/* Added space-x-4 for spacing */}
                            {isKeplrInstalled && !keplrAddress ? (
                                <Button onClick={loadKeplr} shape="square2xl" className="text-white hidden xs:block">
                                    Connect Keplr
                                </Button>
                            ) : (
                                <div
                                    className="relative group"
                                >
                                    <Button shape="square2xl" className="text-white hidden xs:block w-48 truncate shadow-md px-2 py-1 rounded-md">
                                        {keplrAddress ? `qwoyn...${keplrAddress.slice(-4)}` : ""}
                                    </Button>
                                    <div
                                        className="absolute top-full left-0 mt-1 bg-white text-black border rounded shadow p-3 transition-opacity opacity-0 group-hover:opacity-100"
                                    >
                                        <p>Your Address:</p>
                                        <p className="truncate">{keplrAddress}</p>
                                        <div
                                            onClick={disconnectKeplr}
                                            className="mt-2 text-black bg-white px-3 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            Disconnect
                                        </div>
                                    </div>
                                </div>
                            )}
                            <MobileNavMenu
                                MobilemenuData={data.menu}
                                ofcanvasOpen={ofcanvasOpen}
                                ofcanvasHandaler={ofcanvasHandaler}
                            />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    data: PropTypes.shape({
        menu: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};

export default Header;
