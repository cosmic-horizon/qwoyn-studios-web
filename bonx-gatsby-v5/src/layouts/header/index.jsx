import React, { useState } from "react";
import Logo from "../../components/logo";
import MainMenu from "../../components/menu/main-menu";
import MobileNavMenu from "../../components/menu/mobile-menu";
import Button from "../../components/shared/button";
import { useSticky } from "../../hooks";

const Header = ({ data }) => {
    const { sticky, headerRef, fixedRef } = useSticky();

    const [ofcanvasOpen, setOfcanvasOpen] = useState(false);
    const [keplrAddress, setKeplrAddress] = useState(null);
    const [balance, setBalance] = useState(null);

    const ofcanvasHandler = () => {
        setOfcanvasOpen((prev) => !prev);
    };

    const disconnectKeplr = () => {
        setKeplrAddress(null);
        setBalance(null);
    };

    async function loadKeplr() {
        if (window.keplr) {
            await window.keplr.experimentalSuggestChain({
                chainId: "qwoyn-1",
                chainName: "Qwoyn",
                rpc: "https://rpc.qwoyn.studio",
                rest: "https://api.qwoyn.studio",
                stakeCurrency: {
                    coinDenom: "QWOYN",
                    coinMinimalDenom: "uqwoyn",
                    coinDecimals: 6,
                },
            });

            const cosmos = new window.cosmosjs.Cosmos("https://rpc.qwoyn.studio", "qwoyn-1");
            cosmos.setBech32MainPrefix("qwoyn"); // Note: Update this if the prefix is different for your chain
            cosmos.setPath("m/44'/118'/0'/0/0");
            const offlineSigner = window.getOfflineSigner("qwoyn-1");
            cosmos.setOfflineSigner(offlineSigner);

            const [account] = await offlineSigner.getAccounts();
            setKeplrAddress(account.address);

            // You can expand on this for fetching and setting the balance, as well as other functionalities.
        } else {
            console.error("Keplr extension not found.");
        }
    }

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
                            {keplrAddress ? (
                                <div className="hover-content">
                                    <Button onClick={disconnectKeplr} shape="square2xl" className="text-white hidden xs:block">
                                        {keplrAddress.substr(0, 5) + "..." + keplrAddress.substr(-4)}
                                    </Button>
                                    <div className="hover-dropdown">
                                        Balance: {balance}
                                        <Button onClick={disconnectKeplr}>
                                            Disconnect
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button onClick={loadKeplr} shape="square2xl" className="text-white hidden xs:block">
                                    Connect Keplr
                                </Button>
                            )}
                            <button onClick={ofcanvasHandler} onKeyDown={ofcanvasHandler} className="flex flex-col space-y-1.5 ml-8 lg:hidden">
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                            </button>
                            <MobileNavMenu MobilemenuData={data.menu} ofcanvasOpen={ofcanvasOpen} ofcanvasHandaler={ofcanvasHandler} />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
