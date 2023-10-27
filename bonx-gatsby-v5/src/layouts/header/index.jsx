import React, { useState } from "react";
import { SigningCosmosClient } from "@cosmjs/launchpad";
import Logo from "../../components/logo";
import MainMenu from "../../components/menu/main-menu";
import MobileNavMenu from "../../components/menu/mobile-menu";
import Button from "../../components/shared/button";
import { useSticky } from "../../hooks";

const Header = ({ data }) => {
    const { sticky, headerRef, fixedRef } = useSticky();
    const [ofcanvasOpen, setOfcanvasOpen] = useState(false);
    const [keplrAddress, setKeplrAddress] = useState("");

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

            const offlineSigner = window.keplr.getOfflineSigner("qwoyn-1");
            const [account] = await offlineSigner.getAccounts();
            setKeplrAddress(account.address);

            const cosmosClient = new SigningCosmosClient(
                "https://api.qwoyn.studio",
                account.address,
                offlineSigner
            );

            // Use `cosmosClient` as necessary for further interactions
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
                            {!keplrAddress ? (
                                <Button onClick={loadKeplr} shape="square2xl" className="text-white hidden xs:block">
                                    Connect Keplr
                                </Button>
                            ) : (
                                <span className="text-white hidden xs:block">{keplrAddress}</span>
                            )}
                            <button
                                onClick={() => setOfcanvasOpen(!ofcanvasOpen)}
                                className="flex flex-col space-y-1.5 ml-8 lg:hidden"
                            >
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                            </button>
                            <MobileNavMenu
                                MobilemenuData={data.menu}
                                ofcanvasOpen={ofcanvasOpen}
                                ofcanvasHandaler={() => setOfcanvasOpen(!ofcanvasOpen)}
                            />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
