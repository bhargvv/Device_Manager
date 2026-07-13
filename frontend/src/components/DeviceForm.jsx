import { useEffect, useState } from "react";
import { emptyDeviceForm, deviceToForm } from "../utils/deviceFields";
import "./DeviceForm.css";

const requiredFields = [
  "machine_name",
  "finance_asset_id",
  "asset_state",
  "asset_condition",
  "site",
  "device_type",
];

function DeviceForm({ open, mode, device, onClose, onSave }) {
  const [form, setForm] = useState(emptyDeviceForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(deviceToForm(device));
      setError(null);
    }
  }, [open, device]);

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = requiredFields.find((field) => !form[field]?.trim());
    if (missing) {
      setError(`${missing.replace(/_/g, " ")} is required`);
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      finance_cap_date: form.finance_cap_date || null,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "edit" ? "Edit Device" : "Add New Device"}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-sections-container">
            
            <div className="form-section">
              <h3 className="section-title">General Identification</h3>
              <div className="form-grid">
                <label>
                  Machine Name *
                  <input
                    type="text"
                    value={form.machine_name}
                    onChange={(e) => updateField("machine_name", e.target.value)}
                    placeholder="e.g. MacBook Pro - HR"
                    autoFocus
                  />
                </label>

                <label>
                  Device Type *
                  <select
                    value={form.device_type}
                    onChange={(e) => updateField("device_type", e.target.value)}
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Printer">Printer</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Server">Server</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>
                  Assigned User
                  <input
                    type="text"
                    value={form.assigned_user}
                    onChange={(e) => updateField("assigned_user", e.target.value)}
                    placeholder="e.g. John Doe"
                  />
                </label>

                <label>
                  Site *
                  <input
                    type="text"
                    value={form.site}
                    onChange={(e) => updateField("site", e.target.value)}
                    placeholder="e.g. Bangalore HQ"
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Technical Specifications</h3>
              <div className="form-grid">
                <label>
                  Finance Asset ID *
                  <input
                    type="text"
                    value={form.finance_asset_id}
                    onChange={(e) => updateField("finance_asset_id", e.target.value)}
                    placeholder="e.g. FA-1024"
                  />
                </label>

                <label>
                  Serial Number
                  <input
                    type="text"
                    value={form.serial_number}
                    onChange={(e) => updateField("serial_number", e.target.value)}
                    placeholder="e.g. SN-ABC123"
                  />
                </label>

                <label>
                  Manufacturer
                  <input
                    type="text"
                    value={form.manufacturer}
                    onChange={(e) => updateField("manufacturer", e.target.value)}
                    placeholder="e.g. Dell"
                  />
                </label>

                <label>
                  Model
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => updateField("model", e.target.value)}
                    placeholder="e.g. Latitude 5540"
                  />
                </label>

                <label className="full-width">
                  Operating System
                  <input
                    type="text"
                    value={form.os}
                    onChange={(e) => updateField("os", e.target.value)}
                    placeholder="e.g. Windows 11 Enterprise"
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Status & Condition</h3>
              <div className="form-grid">
                <label>
                  Asset State *
                  <select
                    value={form.asset_state}
                    onChange={(e) => updateField("asset_state", e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="In Use">In Use</option>
                    <option value="In Repair">In Repair</option>
                    <option value="Retired">Retired</option>
                  </select>
                </label>

                <label>
                  Asset Condition *
                  <select
                    value={form.asset_condition}
                    onChange={(e) => updateField("asset_condition", e.target.value)}
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </label>

                <label>
                  Backup Check
                  <select
                    value={form.backup_check}
                    onChange={(e) => updateField("backup_check", e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="N/A">N/A</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Financials & Meta</h3>
              <div className="form-grid">
                <label>
                  Finance Cap Date
                  <input
                    type="date"
                    value={form.finance_cap_date}
                    onChange={(e) => updateField("finance_cap_date", e.target.value)}
                  />
                </label>

                <label>
                  Trend
                  <input
                    type="text"
                    value={form.trend}
                    onChange={(e) => updateField("trend", e.target.value)}
                  />
                </label>

                <label>
                  In Navin List
                  <input
                    type="text"
                    value={form.in_navin_list}
                    onChange={(e) => updateField("in_navin_list", e.target.value)}
                  />
                </label>

                <label className="full-width">
                  Remarks
                  <textarea
                    value={form.remarks}
                    onChange={(e) => updateField("remarks", e.target.value)}
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </label>
              </div>
            </div>

          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Device"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeviceForm;
