import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineOfficeBuilding,
  HiOutlineInformationCircle,
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineClipboardList
} from "react-icons/hi";
import DeviceForm from "../components/DeviceForm";
import {
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  searchDevices,
} from "../services/devices";
import { isActiveState, stateBadgeClass, getDeviceIcon } from "../utils/deviceFields";
import companyLogo from "../assets/company-logo.jpg";
import "./Home.css";

function Home() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Filters and Sorting State
  const [filterState, setFilterState] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterSite, setFilterSite] = useState("All");
  const [sortBy, setSortBy] = useState("id-desc");

  // Detailed View Drawer State
  const [selectedDetailDevice, setSelectedDetailDevice] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchDevices = useCallback(() => {
    setLoading(true);
    setError(null);

    getDevices()
      .then((res) => setDevices(res.data))
      .catch(() =>
        setError("Failed to load devices. Make sure the backend and database are running.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    if (!search.trim()) {
      fetchDevices();
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      searchDevices(search.trim())
        .then((res) => setDevices(res.data))
        .catch(() => setError("Search failed. Please try again."))
        .finally(() => setLoading(false));
    }, 350);

    return () => clearTimeout(timer);
  }, [search, fetchDevices]);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedDevice(null);
    setModalOpen(true);
  };

  const openEditModal = (device, e) => {
    if (e) e.stopPropagation();
    setModalMode("edit");
    setSelectedDevice(device);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (modalMode === "edit" && selectedDevice) {
      const res = await updateDevice(selectedDevice.id, formData);
      setDevices((prev) =>
        prev.map((d) => (d.id === selectedDevice.id ? res.data : d))
      );
      if (selectedDetailDevice && selectedDetailDevice.id === selectedDevice.id) {
        setSelectedDetailDevice(res.data);
      }
    } else {
      const res = await addDevice(formData);
      setDevices((prev) => [res.data, ...prev]);
    }
  };

  const handleDelete = async (device, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(
      `Delete "${device.machine_name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteDevice(device.id);
      setDevices((prev) => prev.filter((d) => d.id !== device.id));
      if (selectedDetailDevice && selectedDetailDevice.id === device.id) {
        setDetailOpen(false);
        setSelectedDetailDevice(null);
      }
    } catch {
      alert("Failed to delete device. Please try again.");
    }
  };

  const openDetail = (device) => {
    setSelectedDetailDevice(device);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedDetailDevice(null);
  };

  // Derive unique Sites dynamically for filtering
  const uniqueSites = ["All", ...new Set(devices.map((d) => d.site).filter(Boolean))];
  const uniqueTypes = ["All", "Laptop", "Desktop", "Monitor", "Printer", "Mobile", "Server", "Other"];
  const uniqueStates = ["All", "Active", "In Use", "In Repair", "Inactive", "Retired"];

  // Filter & Sort Implementation
  const filteredDevices = devices.filter((device) => {
    if (filterState !== "All" && device.asset_state !== filterState) return false;
    if (filterType !== "All" && (device.device_type || "").toLowerCase() !== filterType.toLowerCase()) return false;
    if (filterSite !== "All" && (device.site || "").toLowerCase() !== filterSite.toLowerCase()) return false;
    return true;
  });

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    switch (sortBy) {
      case "id-desc":
        return b.id - a.id;
      case "id-asc":
        return a.id - b.id;
      case "name-asc":
        return (a.machine_name || "").localeCompare(b.machine_name || "");
      case "name-desc":
        return (b.machine_name || "").localeCompare(a.machine_name || "");
      case "asset-id":
        return (a.finance_asset_id || "").localeCompare(b.finance_asset_id || "");
      default:
        return b.id - a.id;
    }
  });

  const activeCount = devices.filter((d) => isActiveState(d.asset_state)).length;
  const inactiveCount = devices.length - activeCount;

  return (
    <div className="home">
      <header className="home-header">
        <div className="header-brand">
          <img src={companyLogo} alt="Company logo" className="company-logo" />
          <div className="header-title-area">
            <h1>Device Management</h1>
            <p>Asset Tracking & Maintenance Hub</p>
          </div>
        </div>
      </header>

      <main className="home-content">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon total">
              <HiOutlineClipboardList />
            </div>
            <div className="stat-info">
              <span>Total Devices</span>
              <strong>{devices.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active">
              <HiOutlineCheckCircle />
            </div>
            <div className="stat-info">
              <span>Active / In Use</span>
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
            <div className="header-left">
              <h2>Inventory</h2>
              <span className="device-count">{sortedDevices.length} found</span>
            </div>
            
            <button type="button" className="btn-add" onClick={openAddModal}>
              + Add Device
            </button>
          </div>

          {/* Filtering and Sorting Control Panel */}
          <div className="filter-bar">
            <div className="search-box">
              <HiOutlineSearch />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, asset ID, serial..."
              />
            </div>

            <div className="filters-group">
              <div className="filter-item">
                <label><HiOutlineFilter /> State</label>
                <select value={filterState} onChange={(e) => setFilterState(e.target.value)}>
                  {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="filter-item">
                <label><HiOutlineFilter /> Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="filter-item">
                <label><HiOutlineOfficeBuilding /> Site</label>
                <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)}>
                  {uniqueSites.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="filter-item">
                <label><HiOutlineSortAscending /> Sort</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="id-desc">Newest First</option>
                  <option value="id-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="asset-id">Asset ID</option>
                </select>
              </div>
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading">Loading devices inventory...</p>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          
          {!loading && !error && sortedDevices.length === 0 && (
            <div className="empty">
              <p>{search || filterState !== "All" || filterType !== "All" || filterSite !== "All" ? "No devices match your current filters." : "No devices found."}</p>
              {!search && filterState === "All" && filterType === "All" && filterSite === "All" && (
                <button type="button" className="btn-add" onClick={openAddModal}>
                  + Add your first device
                </button>
              )}
            </div>
          )}

          {!loading && !error && sortedDevices.length > 0 && (
            <div className="device-cards">
              {sortedDevices.map((device) => {
                const IconComponent = getDeviceIcon(device.device_type);
                return (
                  <div key={device.id} className="device-card" onClick={() => openDetail(device)}>
                    <div className="device-card-header">
                      <div className="device-card-icon">
                        <IconComponent />
                      </div>
                      <span className={`status-badge ${stateBadgeClass(device.asset_state)}`}>
                        {device.asset_state}
                      </span>
                    </div>

                    <div className="device-card-body">
                      <span className="device-card-id">{device.finance_asset_id}</span>
                      <h3 className="device-card-name" title={device.machine_name}>{device.machine_name}</h3>
                      <p className="device-card-meta">{device.device_type} • {device.manufacturer || "Generic"}</p>
                      
                      <div className="device-card-user-info">
                        <span className="label">Assigned:</span>
                        <span className="value">{device.assigned_user || "Unassigned"}</span>
                      </div>
                      
                      {device.site && (
                        <div className="device-card-site-info">
                          <span className="label">Site:</span>
                          <span className="value">{device.site}</span>
                        </div>
                      )}
                    </div>

                    <div className="device-card-actions">
                      <button
                        type="button"
                        className="card-btn edit"
                        onClick={(e) => openEditModal(device, e)}
                        title="Edit device"
                      >
                        <HiOutlinePencil />
                      </button>
                      <button
                        type="button"
                        className="card-btn delete"
                        onClick={(e) => handleDelete(device, e)}
                        title="Delete device"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Slide-over Detail Drawer */}
      {detailOpen && selectedDetailDevice && (
        <div className="drawer-overlay" onClick={closeDetail}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-header-title">
                <HiOutlineInformationCircle className="info-icon" />
                <div>
                  <h2>{selectedDetailDevice.machine_name}</h2>
                  <span className="subtitle">ID: {selectedDetailDevice.finance_asset_id}</span>
                </div>
              </div>
              <button type="button" className="drawer-close" onClick={closeDetail}>
                <HiOutlineX />
              </button>
            </div>

            <div className="drawer-content">
              <div className="drawer-section">
                <h3>State & Condition</h3>
                <div className="drawer-badges">
                  <div className="badge-wrapper">
                    <span className="badge-label">State</span>
                    <span className={`status-badge ${stateBadgeClass(selectedDetailDevice.asset_state)}`}>
                      {selectedDetailDevice.asset_state}
                    </span>
                  </div>
                  <div className="badge-wrapper">
                    <span className="badge-label">Condition</span>
                    <span className={`condition-badge ${selectedDetailDevice.asset_condition.toLowerCase()}`}>
                      {selectedDetailDevice.asset_condition}
                    </span>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <h3>Technical Details</h3>
                <div className="info-grid">
                  <div className="info-cell">
                    <span className="label">Device Type</span>
                    <span className="value">{selectedDetailDevice.device_type}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">OS</span>
                    <span className="value">{selectedDetailDevice.os || "N/A"}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">Manufacturer</span>
                    <span className="value">{selectedDetailDevice.manufacturer || "N/A"}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">Model</span>
                    <span className="value">{selectedDetailDevice.model || "N/A"}</span>
                  </div>
                  <div className="info-cell full-width">
                    <span className="label">Serial Number</span>
                    <span className="value highlight">{selectedDetailDevice.serial_number || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <h3>Assignment & Site</h3>
                <div className="info-grid">
                  <div className="info-cell">
                    <span className="label">Assigned User</span>
                    <span className="value">{selectedDetailDevice.assigned_user || "Unassigned"}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">Site / Location</span>
                    <span className="value">{selectedDetailDevice.site || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <h3>Financials & Metadata</h3>
                <div className="info-grid">
                  <div className="info-cell">
                    <span className="label">Capitalization Date</span>
                    <span className="value">
                      {selectedDetailDevice.finance_cap_date
                        ? new Date(selectedDetailDevice.finance_cap_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="info-cell">
                    <span className="label">Backup Checked</span>
                    <span className="value">{selectedDetailDevice.backup_check || "N/A"}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">Trend Check</span>
                    <span className="value">{selectedDetailDevice.trend || "N/A"}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">In Navin List</span>
                    <span className="value">{selectedDetailDevice.in_navin_list || "N/A"}</span>
                  </div>
                </div>
              </div>

              {selectedDetailDevice.remarks && (
                <div className="drawer-section remarks-section">
                  <h3>Remarks & Notes</h3>
                  <p className="remarks-text">{selectedDetailDevice.remarks}</p>
                </div>
              )}

              <div className="drawer-section timestamps-section">
                <span className="timestamp">Added: {new Date(selectedDetailDevice.created_at).toLocaleString()}</span>
                {selectedDetailDevice.updated_at && (
                  <span className="timestamp">Updated: {new Date(selectedDetailDevice.updated_at).toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="drawer-actions">
              <button
                type="button"
                className="drawer-btn edit"
                onClick={(e) => openEditModal(selectedDetailDevice, e)}
              >
                <HiOutlinePencil /> Edit Details
              </button>
              <button
                type="button"
                className="drawer-btn delete"
                onClick={(e) => handleDelete(selectedDetailDevice, e)}
              >
                <HiOutlineTrash /> Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}

      <DeviceForm
        open={modalOpen}
        mode={modalMode}
        device={selectedDevice}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default Home;
