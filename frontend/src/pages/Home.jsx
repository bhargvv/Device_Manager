import { useEffect, useState } from "react";
import { HiOutlineDesktopComputer, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import api from "../services/api";
import companyLogo from "../assets/company-logo.jpg";
import "./Home.css";

function Home() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api
            .get("/devices")
            .then((res) => setDevices(res.data))
            .catch(() => setError("Failed to load devices. Make sure the backend is running."))
            .finally(() => setLoading(false));
    }, []);

    const activeCount = devices.filter((d) => d.status === "Active").length;
    const inactiveCount = devices.filter((d) => d.status === "Inactive").length;

    return (
        <div className="home">
            <header className="home-header">
                <div className="header-brand">
                    <img src={companyLogo} alt="Company logo" className="company-logo" />
                    <div>
                        <h1>Device Management</h1>
                    </div>
                </div>
            </header>

            <main className="home-content">
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon total">
                            <HiOutlineDesktopComputer />
                        </div>
                        <div className="stat-info">
                            <span>Total</span>
                            <strong>{devices.length}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon active">
                            <HiOutlineCheckCircle />
                        </div>
                        <div className="stat-info">
                            <span>Active</span>
                            <strong>{activeCount}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon inactive">
                            <HiOutlineXCircle />
                        </div>
                        <div className="stat-info">
                            <span>Inactive</span>
                            <strong>{inactiveCount}</strong>
                        </div>
                    </div>
                </div>

                <section className="devices-section">
                    <div className="section-header">
                        <h2>All Devices</h2>
                        <span className="device-count">{devices.length} registered</span>
                    </div>

                    {loading && <p className="loading">Loading devices...</p>}
                    {error && <p className="error">{error}</p>}
                    {!loading && !error && devices.length === 0 && (
                        <p className="empty">No devices found. Add your first device to get started.</p>
                    )}
                    {!loading && !error && devices.length > 0 && (
                        <div className="device-cards">
                            {devices.map((device) => (
                                <div key={device.id} className="device-card">
                                    <div className="device-card-icon">
                                        <HiOutlineDesktopComputer />
                                    </div>
                                    <span className="device-card-id">#{device.id}</span>
                                    <h3 className="device-card-name">{device.name}</h3>
                                    <span className={`status-badge ${device.status.toLowerCase()}`}>
                                        {device.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Home;
