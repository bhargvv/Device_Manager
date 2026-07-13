import {
  HiOutlineDesktopComputer,
  HiOutlineDeviceTablet,
  HiOutlineDeviceMobile,
  HiOutlineServer,
  HiOutlinePrinter,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

export const emptyDeviceForm = {
  machine_name: "",
  finance_asset_id: "",
  asset_state: "Active",
  asset_condition: "Good",
  site: "",
  device_type: "Laptop",
  manufacturer: "",
  model: "",
  serial_number: "",
  assigned_user: "",
  finance_cap_date: "",
  remarks: "",
  backup_check: "N/A",
  trend: "",
  in_navin_list: "",
  os: "",
};

export function deviceToForm(device) {
  if (!device) return { ...emptyDeviceForm };

  return {
    machine_name: device.machine_name || "",
    finance_asset_id: device.finance_asset_id || "",
    asset_state: device.asset_state || "Active",
    asset_condition: device.asset_condition || "Good",
    site: device.site || "",
    device_type: device.device_type || "",
    manufacturer: device.manufacturer || "",
    model: device.model || "",
    serial_number: device.serial_number || "",
    assigned_user: device.assigned_user || "",
    finance_cap_date: device.finance_cap_date
      ? String(device.finance_cap_date).slice(0, 10)
      : "",
    remarks: device.remarks || "",
    backup_check: device.backup_check || "N/A",
    trend: device.trend || "",
    in_navin_list: device.in_navin_list || "",
    os: device.os || "",
  };
}

export function isActiveState(state) {
  const value = (state || "").toLowerCase();
  return value === "active" || value === "in use";
}

export function stateBadgeClass(state) {
  const value = (state || "").toLowerCase();
  if (value === "active" || value === "in use") return "active";
  if (value === "inactive" || value === "retired") return "inactive";
  return "neutral";
}

export function getDeviceIcon(type) {
  const value = (type || "").toLowerCase();
  switch (value) {
    case "laptop":
      return HiOutlineDeviceTablet;
    case "desktop":
      return HiOutlineDesktopComputer;
    case "mobile":
    case "phone":
      return HiOutlineDeviceMobile;
    case "server":
      return HiOutlineServer;
    case "printer":
      return HiOutlinePrinter;
    default:
      return HiOutlineQuestionMarkCircle;
  }
}

