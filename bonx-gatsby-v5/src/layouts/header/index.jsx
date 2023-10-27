import { StaticImage } from "gatsby-plugin-image";
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

    const [showDropdown, setShowDropdown] = useState(false);

    const disconnectKeplr = () => {
        console.log("Keplr disconnected");
        setShowDropdown(false);
        setKeplrAddress(null);
    };

    return (
        <header ref={headerRef} className="bg-transparent absolute w-full mx-auto z-40">
            <div ref={fixedRef} className={`header-top ${sticky ? "fixed top-0 bg-secondary-100 opacity-90 w-full" : ""}`}>
                <div className="container px-4">
                    <nav className="bg-transparent flex justify-between items-center py-3">
                        <div className="text-3xl font-semibold leading-none">
                            <Logo />
                        </div>
                        <MainMenu allmenuData={data?.menu} />
                        <div className="header-right-action flex items-center">
                            {isKeplrInstalled && !keplrAddress ? (
                                <Button onClick={loadKeplr} shape="square2xl" className="text-white hidden xs:block">
                                    Connect Keplr
                                </Button>
                            ) : (
                                <div className="group inline-block relative">
                                    <Button shape="square2xl" className="text-white hidden xs:block group-hover:opacity-80">
                                        {keplrAddress ? `qwoyn...${keplrAddress.slice(-4)}` : ''}
                                    </Button>
                                    {showDropdown && (
                                        <div className="absolute top-full left-0 mt-2 bg-white text-black border rounded shadow p-3 truncate">
                                            Disconnect
                                        </div>
                                    )}
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
