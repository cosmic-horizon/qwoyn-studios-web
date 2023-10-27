import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Logo from "../../components/logo";
import MainMenu from "../../components/menu/main-menu";
import MobileNavMenu from "../../components/menu/mobile-menu";
import Button from "../../components/shared/button";
import { useSticky } from "../../hooks";
import { useKeplr } from "../../utils/KeplrContext"; // Import the KeplrContext

const Header = ({ data }) => {
    const { sticky, headerRef, fixedRef } = useSticky();
    const { isConnected, keplrAddress, connectKeplr, disconnectKeplr, getBalance } = useKeplr(); // Use the KeplrContext

    // State for balance
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (window.getOfflineSigner && window.keplr) {
            console.log("Keplr detected.");
            if (localStorage.getItem('keplrAddress')) {
                connectKeplr(localStorage.getItem('keplrAddress'));
            }
        }
    }, [connectKeplr]);

    useEffect(() => {
        if (isConnected) {
            // Retrieve balance when connected
            getBalance().then((b) => setBalance(b));
        } else {
            setBalance(null); // Reset balance when disconnected
        }
    }, [isConnected, getBalance]);

    const loadKeplr = async () => {
        if (!isConnected) {
            console.log("Trying to connect to Keplr");

            try {
                const chainId = "qwoyn-1";
                await window.keplr.enable(chainId);
                const offlineSigner = window.getOfflineSigner(chainId);
                const accounts = await offlineSigner.getAccounts();
                connectKeplr(accounts[0]?.address);
            } catch (error) {
                console.error("Error connecting to Keplr:", error);
            }
        }
    };

    return (
        <header ref={headerRef} className="bg-transparent absolute w-full mx-auto z-40">
            <div ref={fixedRef} className={`header-top ${sticky ? "fixed top-0 bg-secondary-100 opacity-90 w-full" : ""}`}>
                <div className="container px-4">
                    <nav className="bg-transparent flex justify-between items-center py-3 px-4">
                        <div className="text-3xl font-semibold leading-none">
                            <Logo />
                        </div>
                        <MainMenu allmenuData={data?.menu} />
                        <div className="header-right-action flex items-center space-x-4">
                            {isConnected ? (
                                <div
                                    onMouseEnter={() => setShowDisconnect(true)}
                                    onMouseLeave={() => setShowDisconnect(false)}
                                >
                                    <Button shape="square2xl" className="text-white hidden xs:block">
                                        {`Balance: ${balance ? balance : "Loading..."}`}
                                    </Button>
                                    {showDisconnect && (
                                        <div onClick={disconnectKeplr} style={{ position: 'absolute' }}>
                                            Disconnect
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Button onClick={loadKeplr} shape="square2xl" className="text-white hidden xs:block">
                                    Connect Keplr
                                </Button>
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
