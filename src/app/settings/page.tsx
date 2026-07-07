'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const [walletBalance, setWalletBalance] =
    useState(0);

  const [showWithdraw, setShowWithdraw] =
    useState(false);

  const [accountNumber, setAccountNumber] =
    useState("");

  const [withdrawAmount, setWithdrawAmount] =
    useState("");

  const [withdrawing, setWithdrawing] =
    useState(false);

  const [removeAvatar, setRemoveAvatar] =
    useState(false);

  const [avatar, setAvatar] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  async function loadUser() {
    const res = await fetch(
      'https://api.theprobability.site/users/me',
      {
        credentials: 'include',
      }
    );

    const data = await res.json();

    if (data.success) {
      setUser(data.user);

      setUsername(data.user.username || '');
      setBio(data.user.bio || '');

      if (data.user.avatar_url) {
        setPreview(
          `https://api.theprobability.site${data.user.avatar_url}`
        );
      }
    }

    const walletRes = await fetch(
      "https://api.theprobability.site/wallet",
      {
        credentials: "include",
      }
    );

    const walletData = await walletRes.json();

    if (walletData.success) {
      setWalletBalance(
        Number(walletData.wallet.balance || 0)
      );
    }
  }

  async function requestWithdrawal() {
    if (Number(withdrawAmount) > walletBalance) {
      setError(
        "Withdrawal amount exceeds your balance."
      );
      return;
    }
    try {
      setWithdrawing(true);

      setError("");
      setSuccess("");

      const res = await fetch(
        "https://api.theprobability.site/wallet/request-withdrawal",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(withdrawAmount),

            account_number: accountNumber,

            account_name: username,

            bank_name: "M-Pesa",
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(
          data.error ||
          "Failed to submit withdrawal"
        );
        return;
      }

      setSuccess(
        "Withdrawal request Submitted"
      );

      setWithdrawAmount("");
      setAccountNumber("");
      setShowWithdraw(false);

    } catch (err) {
      console.error(err);

      setError(
        "Failed to submit withdrawal request"
      );
    } finally {
      setWithdrawing(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function saveProfile() {
    setSaving(true);

    setError("");
    setSuccess("");

    try {

      const formData = new FormData();

      formData.append("username", username);
      formData.append("bio", bio);
      formData.append(
        "removeAvatar",
        removeAvatar.toString()
      );

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await fetch(
        "https://api.theprobability.site/users/update-profile",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        
        setError(
          data.error ||
          "Failed to update profile"
        );

        return;
      }

      setSuccess(
        "Profile updated successfully."
      );

      loadUser();

    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {

      setSaving(false);

    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  const exceedsBalance =
    Number(withdrawAmount || 0) >
    walletBalance;

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-3xl mx-auto px-6 py-12">

        <h1 className="text-5xl font-black mb-10">
          Settings
        </h1>

        <div
          className="
            bg-zinc-950
            border
            border-white/10
            rounded-3xl
            p-8
            space-y-8
          "
        >

          {error && (
            <div
              className="
                bg-red-500/10
                border
                border-red-500/30
                text-red-400
                px-4
                py-3
                rounded-xl
              "
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="
                bg-emerald-500/10
                border
                border-emerald-500/30
                text-emerald-400
                px-4
                py-3
                rounded-xl
              "
            >
              {success}
            </div>
          )}

          {/* PHOTO */}

          <div>

            <h2 className="font-bold text-xl mb-4">
              Profile Photo
            </h2>

            <div className="flex items-center gap-6">

              {preview ? (
                <img
                  src={preview}
                  alt="Avatar"
                  className="
                    w-24
                    h-24
                    rounded-full
                    object-cover
                    border
                    border-white/10
                  "
                />
              ) : (
                <div
                  className="
                    w-24
                    h-24
                    rounded-full
                    bg-emerald-500
                    flex
                    items-center
                    justify-center
                    text-black
                    text-3xl
                    font-black
                  "
                >
                  {username
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="flex gap-3">

              <label
                className="
                  cursor-pointer
                  px-5
                  py-3
                  rounded-xl
                  bg-zinc-900
                  border
                  border-white/10
                  hover:border-emerald-500/50
                  transition
                "
              >
                Choose Photo

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (!file) return;

                    setAvatar(file);

                    setRemoveAvatar(false);

                    setPreview(
                      URL.createObjectURL(file)
                    );
                  }}
                />
              </label>

              {preview && (

                <button
                  type="button"
                  onClick={() => {
                    setAvatar(null);

                    setPreview(null);

                    setRemoveAvatar(true);
                  }}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    bg-red-500/10
                    border
                    border-red-500/30
                    text-red-400
                    hover:bg-red-500/20
                    transition
                  "
                >
                    Delete Photo
                </button>
              )}

            </div>

            </div>

          </div>

          {/* USERNAME */}

          <div>

            <label className="block mb-2 font-medium">
              Username
            </label>

            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError("");
                setSuccess("");
              }}
              className="
                w-full
                bg-zinc-900
                border
                border-white/10
                rounded-xl
                px-4
                py-3
                focus:border-emerald-500
                outline-none
              "
            />

          </div>

          {/* BIO */}

          <div>

            <label className="block mb-2 font-medium">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value)
                setError("");
                setSuccess("");
              }}
              rows={5}
              className="
                w-full
                bg-zinc-900
                border
                border-white/10
                rounded-xl
                px-4
                py-3
                resize-none
                focus:border-emerald-500
                outline-none
              "
            />

          </div>

          {/* WITHDRAW */}
          <div
            className="
              border
              border-white/10
              rounded-xl
              p-6
              bg-black/30
            "
          >
            <div className="flex items-center justify-between">

              <div>

                <div className="font-bold text-lg">
                  Withdraw Funds
                </div>

                <div className="text-sm text-zinc-400">
                  Send money to your M-Pesa account
                </div>
              </div>

              <button
                onClick={() =>
                  setShowWithdraw(!showWithdraw)
                }
                className="
                  px-5
                  py-3
                  rounded-xl
                  bg-emerald-500
                  text-black
                  font-bold
                "
              >
                Withdraw
              </button>
            </div>

            {showWithdraw && (
              <div className="mt-6 space-y-4">

                <input
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(e.target.value)
                  }
                  placeholder="M-Pesa Phone Number"
                  className="
                    w-full
                    bg-zinc-900
                    border
                    border-white
                    rounded-xl
                    px-4
                    py-3
                  "
                />

                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) =>
                    setWithdrawAmount(e.target.value)
                  }
                  placeholder="Amount"
                  className={`
                    w-full
                    bg-zinc-900
                    border
                    rounded-xl
                    px-4
                    py-3
                    ${
                      exceedsBalance
                      ? "border-red-500 text-red-400"
                      : "border-white"
                    }
                  `}
                />

                <div
                  className={`
                    text-sm
                    ${
                      exceedsBalance
                        ? "text-red-400"
                        : "text-zinc-400"
                    }
                    `}
                >
                  Available balance: KES {walletBalance.toFixed(2)}
                </div>

                {exceedsBalance && (
                  <div className="text-red-400 text-sm">
                    Withdrawal amount exceeds your balance.
                  </div>
                )}

                <div
                  className="
                    text-sm
                    text-zinc-400
                  "
                >
                  Account Name: <b>{username}</b>
                  <br />
                  Provider: <b>M-Pesa</b>
                </div>

                <button
                  onClick={requestWithdrawal}
                  disabled={withdrawing || exceedsBalance || !withdrawAmount}
                  className="
                    bg-emerald-500
                    text-black
                    font-bold
                    px-6
                    py-3
                    rounded-xl
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {withdrawing
                    ? "Submitting..."
                    : "Submit withdrawal"}
                </button>
              </div>
            )}
          </div>

          {/* SAVE */}

          <div className="pt-4">

            <button
              onClick={saveProfile}
              disabled={saving}
              className="
                bg-emerald-500
                text-black
                font-bold
                px-8
                py-3
                rounded-xl
                hover:opacity-90
                transition
                disabled:opacity-50
              "
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}
