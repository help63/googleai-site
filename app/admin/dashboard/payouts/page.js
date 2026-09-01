"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const METHODS = [
  ["pakistan_bank", "🇵🇰 Pakistan Bank", "Bank account"],
  ["easypaisa", "🟢 Easypaisa", "Mobile number"],
  ["jazzcash", "🟠 JazzCash", "Mobile number"],
  ["international_bank", "🌍 International Bank", "Bank account"],
  ["binance_p2p", "₿ Binance P2P", "Binance/account reference"]
];

const STATUSES = ["pending", "processing", "paid", "failed", "cancelled"];

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState({
    totalEarnings: 0,
    reservedPayouts: 0,
    availableBalance: 0,
    currency: "USD"
  });

  const [form, setForm] = useState({
    method: "easypaisa",
    recipientName: "",
    accountReference: "",
    amount: "",
    currency: "USD",
    note: ""
  });

  async function loadBalance() {
    try {
      const r = await fetch("/api/admin/payout-balance", {
        cache: "no-store"
      });

      const data = await r.json();

      if (r.ok) {
        setBalance(data);
      }
    } catch {
      console.error("Unable to load payout balance");
    }
  }

  async function loadPayouts() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/payouts", {
        cache: "no-store"
      });

      const data = await r.json();

      if (!r.ok) {
        setMessage(data.error || "Unable to load payouts");
        setPayouts([]);
        return;
      }

      setPayouts(data.payouts || []);
    } catch {
      setMessage("Unable to connect to payout API");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayouts();
    loadBalance();
  }, []);

  async function createPayout(e) {
    e.preventDefault();
    setMessage("");

    if (!form.recipientName.trim()) {
      setMessage("Recipient name is required");
      return;
    }

    if (!form.accountReference.trim()) {
      setMessage(
        form.method === "easypaisa" || form.method === "jazzcash"
          ? "Mobile number is required"
          : "Account reference is required"
      );
      return;
    }

    const payoutAmount = Number(form.amount);

    if (!Number.isFinite(payoutAmount) || payoutAmount <= 0) {
      setMessage("Enter a valid amount");
      return;
    }

    if (payoutAmount > Number(balance.availableBalance || 0)) {
      setMessage(
        `Insufficient available balance. Available: ${balance.currency} ${Number(
          balance.availableBalance || 0
        ).toFixed(2)}`
      );
      return;
    }

    setSaving(true);

    try {
      const r = await fetch("/api/admin/payouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await r.json();

      if (!r.ok) {
        setMessage(data.error || "Payout creation failed");
        return;
      }

      setMessage("Payout request created successfully");

      setForm({
        method: "easypaisa",
        recipientName: "",
        accountReference: "",
        amount: "",
        currency: "USD",
        note: ""
      });

      await loadPayouts();
      await loadBalance();
    } catch {
      setMessage("Payout creation failed");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id, status) {
    setMessage("");

    try {
      const r = await fetch("/api/admin/payouts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, status })
      });

      const data = await r.json();

      if (!r.ok) {
        setMessage(data.error || "Status update failed");
        return;
      }

      await loadPayouts();
    } catch {
      setMessage("Status update failed");
    }
  }

  const isWallet =
    form.method === "easypaisa" || form.method === "jazzcash";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#05030d",
        color: "white",
        padding: "35px",
        fontFamily: "Arial"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <Link
          href="/admin/dashboard"
          style={{ color: "#a78bfa", textDecoration: "none" }}
        >
          ← Admin Dashboard
        </Link>

        <h1 style={{ fontSize: 42, marginBottom: 5 }}>
          Payouts 💸
        </h1>

        <p style={{ color: "#94a3b8" }}>
          Pakistan banks • Easypaisa • JazzCash • International banks • Binance P2P
        </p>

        <section
          style={{
            marginTop: 25,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15
          }}
        >
          {[
            ["Total Earnings", balance.totalEarnings],
            ["Reserved Payouts", balance.reservedPayouts],
            ["Available Balance", balance.availableBalance]
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: "#111827",
                border: "1px solid #1e293b",
                borderRadius: 18,
                padding: 22
              }}
            >
              <div style={{ color: "#94a3b8", fontSize: 14 }}>
                {label}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  marginTop: 8
                }}
              >
                {balance.currency} {Number(value || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 25,
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 18,
            padding: 25
          }}
        >
          <h2>Create Payout</h2>

          <form onSubmit={createPayout}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 15
              }}
            >
              <label>
                Method
                <select
                  value={form.method}
                  onChange={e =>
                    setForm({ ...form, method: e.target.value })
                  }
                  style={inputStyle}
                >
                  {METHODS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Recipient Name
                <input
                  value={form.recipientName}
                  onChange={e =>
                    setForm({
                      ...form,
                      recipientName: e.target.value
                    })
                  }
                  placeholder="Recipient name"
                  style={inputStyle}
                />
              </label>

              <label>
                {isWallet ? "Mobile Number" : "Account Reference"}
                <input
                  value={form.accountReference}
                  onChange={e =>
                    setForm({
                      ...form,
                      accountReference: e.target.value
                    })
                  }
                  placeholder={
                    isWallet
                      ? "03XXXXXXXXX"
                      : "Account / reference"
                  }
                  style={inputStyle}
                />
              </label>

              <label>
                Amount
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={e =>
                    setForm({
                      ...form,
                      amount: e.target.value
                    })
                  }
                  placeholder="0.00"
                  style={inputStyle}
                />
              </label>

              <label>
                Currency
                <select
                  value={form.currency}
                  onChange={e =>
                    setForm({
                      ...form,
                      currency: e.target.value
                    })
                  }
                  style={inputStyle}
                >
                  <option>USD</option>
                  <option>PKR</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </label>

              <label>
                Note
                <input
                  value={form.note}
                  onChange={e =>
                    setForm({
                      ...form,
                      note: e.target.value
                    })
                  }
                  placeholder="Optional note"
                  style={inputStyle}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                marginTop: 20,
                padding: "13px 22px",
                border: 0,
                borderRadius: 10,
                background: "#7c3aed",
                color: "white",
                fontWeight: "bold",
                cursor: saving ? "wait" : "pointer"
              }}
            >
              {saving ? "Creating..." : "Create Payout"}
            </button>
          </form>

          {message && (
            <p style={{ color: "#c4b5fd", marginTop: 15 }}>
              {message}
            </p>
          )}
        </section>

        <section
          style={{
            marginTop: 25,
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 18,
            padding: 25,
            overflowX: "auto"
          }}
        >
          <h2>Payout Requests</h2>

          {loading ? (
            <p style={{ color: "#64748b" }}>Loading...</p>
          ) : payouts.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No payout requests yet.
            </p>
          ) : (
            payouts.map(p => (
              <div
                key={p.id}
                style={{
                  padding: "18px 0",
                  borderBottom: "1px solid #ffffff0d"
                }}
              >
                <div>
                  <b>{p.method}</b>
                  {" — "}
                  {p.recipient_name}
                </div>

                <div style={{ color: "#a78bfa", marginTop: 5 }}>
                  {p.currency} {Number(p.amount).toFixed(2)}
                </div>

                <div style={{ color: "#94a3b8", marginTop: 5 }}>
                  {p.account_reference}
                </div>

                <div style={{ marginTop: 10 }}>
                  <select
                    value={p.status}
                    onChange={e =>
                      updateStatus(p.id, e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      width: "auto",
                      minWidth: 160
                    }}
                  >
                    {STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 7,
  padding: "11px 12px",
  borderRadius: 9,
  border: "1px solid #334155",
  background: "#020617",
  color: "white"
};
