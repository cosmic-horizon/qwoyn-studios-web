import React, { Fragment, useState, useEffect } from "react";
import Logo from "../../components/logo";
import MainMenu from "../../components/menu/main-menu";
import MobileNavMenu from "../../components/menu/mobile-menu";
import Button from "../../components/shared/button";
import { useSticky } from "../../hooks";

const Header = ({ data }) => {
    const { sticky, headerRef, fixedRef } = useSticky();
    const [ofcanvasOpen, setOfcanvasOpen] = useState(false);
    const [keplrAddress, setKeplrAddress] = useState("");
    const [balance, setBalance] = useState(0);
    const [hoveringButton, setHoveringButton] = useState(false);

    const loadKeplr = async () => {
        if (window.keplr) {
            const address = await window.keplr.getAddress();
            setKeplrAddress(address);
        }
    };

    const disconnectKeplr = () => {
        setKeplrAddress("");
    };

    useEffect(() => {
        if (window.keplr && keplrAddress) {
            // Replace this with the actual method to get balance from Keplr
            window.keplr.getBalance(keplrAddress).then((bal) => {
                setBalance(bal);
            });
        }
    }, [keplrAddress]);

    const truncatedAddress = `${keplrAddress.slice(0, 5)}...${keplrAddress.slice(-4)}`;

    const ofcanvasHandaler = () => {
        setOfcanvasOpen((prev) => !prev);
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
                            <Button
                                shape="square2xl"
                                className="text-white hidden xs:block relative"
                                onClick={keplrAddress ? null : loadKeplr}
                                onMouseEnter={() => setHoveringButton(true)}
                                onMouseLeave={() => setHoveringButton(false)}
                            >
                                {keplrAddress ? truncatedAddress : "Connect Keplr"}
                                {hoveringButton && keplrAddress && (
                                    <div className="absolute bg-white text-black p-2 mt-1">
                                        Balance: {balance}
                                        <button onClick={disconnectKeplr}>Disconnect</button>
                                    </div>
                                )}
                            </Button>
                            <button
                                onClick={ofcanvasHandaler}
                                onKeyDown={ofcanvasHandaler}
                                className="flex flex-col space-y-1.5 ml-8 lg:hidden"
                            >
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                                <span className="line h-0.5 w-6 inline-block bg-white"></span>
                            </button>
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

export default Header;
