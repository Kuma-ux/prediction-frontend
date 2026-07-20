'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Event = {
    id: number;

    title: string;

    category: string;

    description?: string;

    start_date: string;

    end_date?: string;

    image?: string;

    featured: boolean;
}

type Market = {
  id: number;
  title: string;
  description?: string;
  rules?: string;
  category?: string;
  end_date?: string;
  market_type?: string;

  resolved: boolean;
  shutdown?: boolean;
  outcome: string[] | null;

  event_id?: number | null;

  options: string[];

  featured?: boolean;

  bundle_predictions?: string[];
};

export default function AdminPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [liveDuration, setLiveDuration] = useState("5");
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editRules, setEditRules] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editBundlePredictions, setEditBundlePredictions] = useState("");
  const [category, setCategory] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const [rules, setRules] = useState("");
  const [b, setB] = useState("50");
  const [endDate, setEndDate] = useState("");
  const [bundlePredictions, setBundlePredictions] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<any | null>(null);
  const [editSubmissionTitle, setEditSubmissionTitle] = useState("");
  const [editSubmissionDescription, setEditSubmissionDescription] = useState("");
  const [editSubmissionRules, setEditSubmissionRules] = useState("");
  const [editSubmissionCategory, setEditSubmissionCategory] = useState("");
  const [editSubmissionEndDate, setEditSubmissionEndDate] = useState("");
  const [editSubmissionOptions, setEditSubmissionOptions] = useState("");
  const [editSubmissionBundlePredictions, setEditSubmissionBundlePredictions] = useState("");
  const [editSubmissionB, setEditSubmissionB] = useState("50");
  const [editSubmissionFeatured, setEditSubmissionFeatured] = useState(false);

  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState<number | "">("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [eventFeatured, setEventFeatured] = useState(false);
  const [marketType, setMarketType] = useState("standard");
  const [selectedOutcomes, setSelectedOutcomes] = useState<
    Record<number, string[]>
  >({});

  const [emailModal, setEmailModal] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [previewEmail, setPreviewEmail] = useState(false);

  async function searchUsers(query: string) {
    setUserQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const res = await fetch(
      `https://api.theprobability.site/admin/search-users?q=${encodeURIComponent(query)}`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data.success) {
      setSearchResults(data.users);
    }
  }

  async function sendEmail() {
    if (!selectedUser) {
      alert("Choose a user.");
      return;
    }

    const res = await fetch(
      "https://api.theprobability.site/admin/send-email",
      {
        method: "POST",
        credentials: "include",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          email: selectedUser.email,
          subject: emailSubject,
          message: emailBody,
          html: emailBody
        }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    alert("Email sent!");

    setEmailModal(false);
    setSelectedUser(null);
    setUserQuery("");
    setSearchResults([]);
    setEmailSubject("");
    setEmailBody("");
  }

  async function toggleFeatured(
    marketId: number,
    featured: boolean
  ) {
    try {
      const res = await fetch(
        "https://api.theprobability.site/admin/feature-market",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            marketId,
            featured,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }

      setMarkets(prev =>
        prev.map(m =>
          m.id === marketId
          ? { ...m, featured }
          : m
        )
      );
    } catch (err) {
      console.error(err);
    }
  }
    
  async function createEvent() {
    const res = await fetch(
        "https://api.theprobability.site/admin/create-event",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: eventTitle,
                category: eventCategory,
                description: eventDescription,
                start_date: eventStartDate,
                end_date: eventEndDate,
                image: eventImage,
                featured: eventFeatured,
            }),
        }
    );

    const data = await res.json();

    if (!data.success) {
        alert(data.error);
        return;
    }

    alert("Event created");

    setEventTitle("");
    setEventCategory("");
    setEventDescription("");
    setEventStartDate("");
    setEventEndDate("");
    setEventImage("");
    setEventFeatured(false);

    loadAdmin();
  }

  function openEditSubmission(submission: any){

    setEditingSubmission(submission);

    setEditSubmissionTitle(submission.title || "");
    setEditSubmissionDescription(submission.description || "");
    setEditSubmissionRules(submission.rules || "");
    setEditSubmissionCategory(submission.category || "");

    setEditSubmissionEndDate(
      submission.end_date
        ? new Date(submission.end_date)
          .toISOString()
          .slice(0, 16)
        : ""
    );

    setEditSubmissionOptions(
      (submission.options || []).join(", ")
    );

    setEditSubmissionBundlePredictions(
      (submission.bundle_predictions || []).join("\n")
    );

    setEditSubmissionB(
      String(submission.b || 50)
    );

    setEditSubmissionFeatured(
      submission.featured || false
    );
  }

  async function shutdownMarket(marketId: number) {

    const confirmed = confirm(
      "Shutdown this market and refund everyone?"
    );

    if (!confirmed) return;

    try {

      const res = await fetch(
        "https://api.theprobability.site/admin/shutdown-market",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            marketId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }

      alert("Market shut down");

      loadAdmin();

    } catch (err) {
      console.error(err);
    }
  }

  async function createMarket() {
    try {
      if (!title) {
        alert("Missing title");
        return;
      }
      let options: string[] = [];
      let predictions: string[] = [];
      
      if (marketType === "bundle") {
        predictions = bundlePredictions
          .split("\n")
          .map(p => p.trim())
          .filter(Boolean);

        if (predictions.length < 2) {
          alert("Need at least 2 bundled predictions");
          return;
        }

        options = ["YES", "NO"];
      } else {
        options = optionsText
          .split(",")
          .map(o => o.trim())
          .filter(Boolean);

        if (options.length < 2) {
          alert("Need at least 2 options");
          return;
        }
      }

      setCreating(true);

      const res = await fetch(
        "https://api.theprobability.site/admin/create-market",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            rules,
            category,
            b: Number(b),
            market_type: marketType,
            bundle_predictions: marketType === "bundle" ? predictions : [],
            options,
            end_date: endDate,
            event_id: eventId || null,
            featured,
            is_live: isLive,
            live_duration_minutes: Number(liveDuration),
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed to create market");
        return;
      }

      alert("Market created");

      // FIXED: Clear ALL input states on success
      setTitle("");
      setCategory("");
      setOptionsText("");
      setBundlePredictions("");
      setEndDate("");
      setDescription("");
      setFeatured(false);
      setRules("");

      loadAdmin();
    } catch (err) {
      console.error(err);
      alert("Failed to create market");
    } finally {
      setCreating(false);
    }
  }

  async function deleteMarket(marketId: number) {

    const confirmed = confirm(
      "Delete this market permanently?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        "https://api.theprobability.site/admin/delete-market",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            marketId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }

      alert("Market deleted");

      setMarkets(prev =>
        prev.filter(m => m.id !== marketId)
      );
    } catch (err) {
      console.error(err);

      alert("Failed to delete market");
    }
  }

  async function loadAdmin() {
    try {
      // CHECK USER
      const meRes = await fetch(
        "https://api.theprobability.site/auth/me",
        { credentials: "include" }
      );

      const meData = await meRes.json();
      console.log("ME:", meData);

      if (!meData.success || meData.user?.role !== "admin") {
        router.push("/");
        return; // FIXED: Added early return to stop fetching subsequent resources
      }

      //WITHDRAW
      const withdrawalRes = await fetch(
        "https://api.theprobability.site/admin/withdrawals",
        {
          credentials: "include",
        }
      );

      const withdrawalData =
        await withdrawalRes.json();

      if (withdrawalData.success) {
        setWithdrawals(
          withdrawalData.withdrawals
        );
      }

      //SUBMISSIONS
      const submissionRes = await fetch(
        "https://api.theprobability.site/admin/market-submissions",
        {
          credentials: "include",
        }
      );

      const submissionData =
        await submissionRes.json();

      if (submissionData.success) {
        setSubmissions(
          submissionData.submissions
        );
      }

      // LOAD MARKETS
      const marketRes = await fetch("https://api.theprobability.site/markets");
      const marketData = await marketRes.json();
      console.log("MARKETS:", marketData);

      if (marketData.success) {
        setMarkets(marketData.markets || []);
      }

      const eventRes = await fetch(
        "https://api.theprobability.site/events"
      );

      const eventData = await eventRes.json();

      if (eventData.success) {
        setEvents(eventData.events);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateSubmission() {

    if (!editingSubmission) return;

    const res = await fetch(
      "https://api.theprobability.site/admin/update-submission",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId: editingSubmission.id,
          title: editSubmissionTitle,
          description: editSubmissionDescription,
          rules: editSubmissionRules,
          category: editSubmissionCategory,
          end_date: editSubmissionEndDate,
          options: editSubmissionOptions
            .split(",")
            .map(x => x.trim())
            .filter(Boolean),
          bundle_predictions:
            editSubmissionBundlePredictions
              .split("\n")
              .map(x => x.trim())
              .filter(Boolean),
          b: Number(editSubmissionB),
          featured: editSubmissionFeatured
        }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    alert("Submission updated");

    setEditingSubmission(null);

    loadAdmin();
  }

  async function approveSubmission(
    submissionId: number
  ) {

    const res = await fetch(
      "https://api.theprobability.site/admin/approve-submission",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
        }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    alert("Submission approved");

    loadAdmin();
  }

  async function rejectSubmission(
    submissionId: number
  ) {

    const res = await fetch(
      "https://api.theprobability.site/admin/reject-submission",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
        }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    alert("Submission rejected");

    loadAdmin();
  }

  async function approveWithdrawal(
    withdrawalId: number
  ) {
    try {
      const res = await fetch(
        "https://api.theprobability.site/admin/approve-withdrawal",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            withdrawalId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(
          data.error ||
          "Failed to approve"
        );
        return;
      }

      alert("Withdrawal approved");

      loadAdmin();
    } catch (err) {
      console.error(err);
    }
  }

  async function rejectWithdrawal(
    withdrawalId: number
  ) {
    try {
      const res = await fetch(
        "https://api.theprobability.site/admin/reject-withdrawal",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            withdrawalId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(
          data.error ||
          "Failed to reject"
        );
        return;
      }

      alert("Withdrawal rejected");

      loadAdmin();
    } catch (err) {
      console.error(err);
    }
  }

  function openEditMarket(market: any) {

    setEditingMarket(market);

    setEditTitle(market.title || "");

    setEditRules(market.rules || "");

    setEditDescription(
      market.description || ""
    );

    setEditCategory(
      market.category || ""
    );

    setEditEndDate(
      market.end_date
        ? new Date(market.end_date)
            .toISOString()
            .slice(0, 16)
          : ""
    );

    setEditFeatured(
      market.featured || false
    );

    setEditBundlePredictions(
      (market.bundle_predictions || []).join("\n")
    );
  }

  async function updateMarket() {
    if (!editingMarket) return;

    try {

      const res = await fetch(
        "https://api.theprobability.site/admin/update-market",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            marketId: editingMarket.id,
            title: editTitle,
            description: editDescription,
            rules: editRules,
            category: editCategory,
            end_date: editEndDate,
            featured: editFeatured,
            bundle_predictions:
              editBundlePredictions
                .split("\n")
                .map((p) => p.trim())
                .filter(Boolean),
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }

      alert("Market updated");

      setEditingMarket(null);

      loadAdmin();
    } catch (err) {
      console.error(err);

      alert("Failed to update market");
    }
  }

  async function resolveMarket(marketId: number, outcomes: string[]) {
    try {
      const res = await fetch(
        "https://api.theprobability.site/admin/resolve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ marketId, outcomes }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        alert(data.message || data.error || "Failed to resolve");
        return;
      }

      alert(`Market resolved: ${outcomes}`);
      loadAdmin();
    } catch (err) {
      console.error(err);
      alert("Failed to resolve market");
    }
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading admin...
      </div>
    );
  }

  function insertHtml(before: string, after = "") {
    const textarea = document.getElementById(
      "email-editor"
    ) as HTMLTextAreaElement;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = emailBody.substring(start, end);

    const newText =
      emailBody.substring(0, start) +
      before +
      selected +
      after +
      emailBody.substring(end);

    setEmailBody(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
    }, 0);
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-black mb-10">Admin Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setEmailModal(true)}
          className="
            bg-blue-600
            hover:bg-blue-500
            px-5
            py-3
            rounded-xl
            font-bold
          "
        >
          Send Email
        </button>

        <button
          onClick={() => router.push("/admin/blog/new")}
          className="
            bg-emerald-600
            hover:bg-emerald-500
            px-5
            py-3
            rounded-xl
            font-bold
          "
        >
          Publish Blog
        </button>
      </div>
      <div
        className="
          border
          border-white/10
          rounded-2xl
          bg-zinc-900
          p-6
          mb-10
        "
      >
        <h2 className="text-2xl font-bold mb-6">
          Withdraw Request
        </h2>

        {withdrawals.length === 0 ? (
          <div className="text-zinc-500">
            No pending withdrawals.
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="
                  border
                  border-white/10
                  rounded-xl
                  p-4
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <div className="font-bold">
                    @{w.username}
                  </div>

                  <div className="text-zinc-400 text-sm">
                    Amount:
                    {" "}
                    KES {Number(w.amount).toLocaleString()}
                  </div>

                  <div className="text-zinc-500 text-sm">
                    {w.bank_name}
                    {" "}
                    {w.account_number}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      approveWithdrawal(w.id)
                    }
                    className="
                      bg-emerald-500
                      text-black
                      px-4
                      py-2
                      rounded-xl
                      font-bold
                    "
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectWithdrawal(w.id)
                    }
                    className="
                      bg-red-500/10
                      border
                      border-red-500/30
                      text-red-400
                      px-4
                      py-2
                      rounded-xl
                      font-bold
                    "
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="
        border
        border-white/10
        rounded-2xl
        bg-zinc-900
        p-6
        mb-10
      ">
        <h2 className="text-2xl font-bold mb-6">
          User Market Submissions
        </h2>

        {submissions.length === 0 ? (
          <div className="text-zinc-500">
            No pending submissions.
          </div>
        ) : (
          <div className="space-y-4">

            {submissions.map((s) => (

              <div
                key={s.id}
                className="
                  border
                  border-white/10
                  rounded-xl
                  p-5
                "
              >
                <div className="font-bold text-xl">
                  {s.title}
                </div>

                <div className="text-zinc-400 mb-2">
                  Submitted by @{s.username}
                </div>

                <div className="text-zinc-300 mb-3">
                  {s.description}
                </div>

                <div className="text-sm text-zinc-500 mb-4">
                  Category: {s.category}
                </div>

                <button
                  onClick={() =>
                    openEditSubmission(s)
                  }
                  className="
                    bg-blue-500/10
                    border
                    border-blue-500/30
                    text-blue-400
                    px-4
                    py-2
                    rounded-xl
                    font-bold
                  "
                >
                  Edit
                </button>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      approveSubmission(s.id)
                    }
                    className="
                      bg-emerald-500
                      text-black
                      px-4
                      py-2
                      rounded-xl
                      font-bold
                    "
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectSubmission(s.id)
                    }
                    className="
                      bg-red-500/10
                      border
                      border-red-500/30
                      text-red-400
                      px-4
                      py-2
                      rounded-xl
                      font-bold
                    "
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-6">
        <div className="mb-10 border border-white/10 p-6 rounded-2xl bg-zinc-900">
          <h2 className="text-2xl font-bold mb-4">Create Market</h2>

          <select
            value={marketType}
            onChange={(e) => {
              setMarketType(e.target.value);
              // Optional helper: clear alternative values on switch
              setOptionsText("");
              setBundlePredictions("");
            }}
            className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
          >
            <option value="standard">Standard Market</option>
            <option value="bundle">Bundle Market</option>
          </select>

          <select
            value={eventId}
            onChange={(e) =>
              setEventId(
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
              )
            }
            className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
          >
            <option value="">
              Standalone Market
            </option>

            {events.map(event => (
              <option
                key={event.id}
                value={event.id}
              >
                {event.title}
              </option>
            ))}
          </select>

          <div className="border border-white/10 rounded-2xl bg-zinc-900 p-6 mb-10">

          <h2 className="text-2xl font-bold mb-4">
          Create Event
          </h2>

          <input
          placeholder="Event title"
          value={eventTitle}
          onChange={(e)=>setEventTitle(e.target.value)}
          />

          <input
          placeholder="Category"
          value={eventCategory}
          onChange={(e)=>setEventCategory(e.target.value)}
          />

          <textarea
          placeholder="Description"
          value={eventDescription}
          onChange={(e)=>setEventDescription(e.target.value)}
          />

          <input
          type="datetime-local"
          value={eventStartDate}
          onChange={(e)=>setEventStartDate(e.target.value)}
          />

          <input
          type="datetime-local"
          value={eventEndDate}
          onChange={(e)=>setEventEndDate(e.target.value)}
          />

          <input
          placeholder="Image URL"
          value={eventImage}
          onChange={(e)=>setEventImage(e.target.value)}
          />


          <label>
          <input
              type="checkbox"
              checked={eventFeatured}
              onChange={(e)=>setEventFeatured(e.target.checked)}
          />

          Featured
          </label>

          <button onClick={createEvent}>
          Create Event
          </button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Market title"
            className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (sports, politics...)"
            className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
          />

          {marketType === "bundle" ? (
            <textarea
              value={bundlePredictions}
              onChange={(e) => setBundlePredictions(e.target.value)}
              placeholder={"One prediction per line\nExample:\nMusk becomes president\nFrance wins world cup\nBitcoin reaches $200k"}
              className="w-full h-48 mb-3 bg-black border border-white/10 p-3 rounded resize-none"
            />
          ) : (
            <input
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              placeholder="Options separated by commas"
              className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
            />
          )}

          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Market description"
            className="
              w-full
              h-28
              mb-3
              bg-black
              border
              border-white/10
              p-3
              rounded
              resize-none
            "
            />

          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="Market rules and resolution criteria"
            className="
              w-full
              h-40
              mb-3
              bg-black
              border
              border-white/10
              p-3
              rounded
              resize-none
            "
          />

          <input
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Liquidity (b)"
            className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
          />

          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) =>
                setFeatured(e.target.checked)
              }
              className="w-5 h-5"
            />
            <div className="text-sm text-zinc-300">
              Add to homepage slideshow
            </div>
          </div>

          <div className="border border-white/10 rounded-2xl p-4 mb-4">
            
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={isLive}
                onChange={(e) =>
                  setIsLive(e.target.checked)
                }
                className="w-5 h-5"
              />

              <div className="font-semibold text-emerald-400">
                Continuous Live Market
              </div>
            </div>

            {isLive && (
              <div>

                <div className="text-sm text-zinc-400 mb-2">
                  Auto-resets after resolution
                </div>

                <input
                  value={liveDuration}
                  onChange={(e) =>
                    setLiveDuration(e.target.value)
                  }
                  placeholder="Duration in minutes"
                  className="
                    w-full
                    bg-black
                    border
                    border-white/10
                    p-3
                    rounded
                  "
                />
              </div>
            )}
          </div>

          <button
            onClick={createMarket}
            disabled={creating}
            className="bg-emerald-500 text-black px-5 py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Market"}
          </button>
        </div>

        {markets.map((market) => (
          <div
            key={market.id}
            className="
              border
              border-white/10
              rounded-2xl
              p-6
              bg-zinc-900
            "
          >
            <div className="flex items-start justify-between gap-4 mb-4">

              <div>
                <div className="text-2xl font-bold mb-2">
                  {market.title}
                </div>

                <div className="text-zinc-400">
                  Status:
                  {" "}
                  {market.shutdown
                    ? "Shut Down"
                    : market.resolved
                    ? `Resolved (${market.outcome})`
                    : "Active"}
                </div>
              </div>

              <button
                onClick={() => openEditMarket(market)}
                className="
                  border
                  border-blue-500/30
                  text-blue-300
                  hover:bg-blue-500/10
                  transition
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-bold
                "
              >
                Edit Market
              </button>

              <button
                onClick={() => deleteMarket(market.id)}
                className="
                  border
                  border-red-500/30
                  text-red-400
                  hover:bg-red-500/10
                  transition
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-bold
                "
              >
                Delete Market
              </button>

              <button
                onClick={() =>
                  shutdownMarket(market.id)
                }
                className="
                  border
                  border-yellow-500/30
                  text-yellow-400
                  hover:bg-yellow-500/10
                  transition
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-bold
                "
              >
                Shut Down
              </button>

              <button
                onClick={() =>
                  toggleFeatured(
                    market.id,
                    !market.featured
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-bold
                  transition
                  shrink-0
                  ${
                    market.featured
                    ?`
                     bg-emerald-500
                     text-black`
                    :`
                     border
                     border-white/10
                     text-zinc-300
                     hover:border-emerald-500/40`
                  }`}
                >
                  {market.featured
                    ? "Featured"
                    : "Add To Slideshow"}
                </button>
            </div>

            {!market.resolved && !market.shutdown && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {market.options?.map((option) => {

                  const selected =
                    selectedOutcomes[market.id]?.includes(option);
                  
                  return(
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedOutcomes(prev => {

                        const current =
                          prev[market.id] || [];

                        const exists =
                          current.includes(option);

                        return{
                          ...prev,
                          [market.id]: exists
                          ? current.filter(
                            o => o !== option
                          )
                          : [...current, option]
                        };
                      });
                    }}
                    className={`
                      px-5
                      py-3
                      rounded-xl
                      font-bold
                      transition
                      ${
                        selected
                          ? "bg-emerald-500 text-black"
                          : "bg-zinc-800 border border-white/10"
                      }
                    `}
                  >
                    {option}
                  </button>
                );
                })}
              </div>

              <button
                onClick={() =>
                  resolveMarket(
                    market.id,
                    selectedOutcomes[market.id] || []
                  )
                }
                className="
                  w-full
                  bg-emerald-500
                  text-black
                  py-3
                  rounded-xl
                  font-bold
                "
              >
                Resolve Market
              </button>
            </div>
            )}
          </div>
        ))}
      </div>

      {editingMarket && (
        <div className="
          fixed
          inset-0
          bg-black/80
          z-50
          flex
          items-center
          justify-center
          p-6
        "
        >
          <div className="
            bg-zinc-950
            border
            border-white/10
            rounded-3xl
            p-6
            w-full
            max-w-2xl
          ">

            <h2 className="text-3xl font-black mb-6">
              Edit Market
            </h2>

            <input
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              placeholder="Title"
              className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(e.target.value)
              }
              placeholder="Description"
              className="w-full h-28 mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <textarea
              value={editRules}
              onChange={(e) =>
                setEditRules(e.target.value)
              }
              placeholder="Market rules"
              className="
                w-full
                h-40
                mb-3
                bg-black
                border
                border-white/10
                p-3
                rounded
              "
            />

            <input
              value={editCategory}
              onChange={(e) =>
                setEditCategory(e.target.value)
              }
              placeholder="Category"
              className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <input
              type="datetime-local"
              value={editEndDate}
              onChange={(e) =>
                setEditEndDate(e.target.value)
              }
              className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
            />

            {editingMarket.market_type === "bundle" && (
              <textarea
                value={editBundlePredictions}
                onChange={(e) =>
                  setEditBundlePredictions(e.target.value)
                }
                className="w-full h-40 mb-3 bg-black border border-white/10 p-3 rounded"
              />
            )}
            

            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                checked={editFeatured}
                onChange={(e) =>
                  setEditFeatured(e.target.checked)
                }
              />

              <div className="text-sm text-zinc-300">
                Featured in slideshow
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={updateMarket}
                className="
                  flex-1
                  bg-emerald-500
                  hover:bg-emerald-400
                  transition
                  text-black
                  py-3
                  rounded-xl
                  font-bold
                "
              >
                Save Changes
              </button>

              <button
                onClick={(e) =>
                  setEditingMarket(null)
                }
                className="
                  flex-1
                  border
                  border-white/10
                  py-3
                  rounded-xl
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {emailModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">

          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 w-full max-w-2xl">

            <h2 className="text-3xl font-black mb-6">
              Send Email
            </h2>

            <input
              value={userQuery}
              onChange={(e) => searchUsers(e.target.value)}
              placeholder="Search username or email..."
              className="w-full bg-black border border-white/10 p-3 rounded mb-4"
            />

            {!selectedUser && searchResults.length > 0 && (
              <div className="border border-white/10 rounded-xl max-h-56 overflow-y-auto mb-4">

                {searchResults.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setSearchResults([]);
                    }}
                    className="w-full text-left p-3 hover:bg-zinc-800"
                  >
                    <div className="font-bold">@{u.username}</div>
                    <div className="text-sm text-zinc-400">
                      {u.email}
                    </div>
                  </button>
                ))}
                
              </div>
          )}

          {selectedUser && (
            <div className="mb-4 p-3 rounded-xl bg-zinc-900">
              Sending to:
              <br />
              <strong>@{selectedUser.username}</strong>
              <br />
              {selectedUser.email}
            </div>
          )}

          <input
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Subject"
            className="w-full bg-black border border-white/10 p-3 rounded mb-3"
          />

          <div className="mb-4">

            <div className="flex flex-wrap gap-2 mb-3">

              <button
                onClick={() => insertHtml("<strong>", "</strong>")}
                className="px-3 py-1 rounded bg-zinc-800"
              >
                Bold
              </button>

              <button
                onClick={() => insertHtml("<em>", "</em>")}
                className="px-3 py-1 rounded bg-zinc-800"
              >
                Underline
              </button>

              <button
                onClick={() => insertHtml("<h1>", "</h1>")}
                className="px-3 py-1 rounded bg-zinc-800"
              >
                H1
              </button>

              <button
                onClick={() => insertHtml("<h2>", "</h2>")}
                className="px-3 py-1 rounded bg-zinc-800"
              >
                H2
              </button>

              <button
                onClick={() => insertHtml("<p>", "</p>")}
                className="px-3 py-1 rounded bg-zinc-800"
              >
                Paragraph
              </button>

              <button
                onClick={() =>
                  insertHtml(
                    `<a href="">`,
                    `</a>`
                    )
                }
                className="px-3 py-1 rounded bg-zinc-800"
              >
                Link
              </button>

              <button
                onClick={() =>
                  insertHtml(
                    `<img src="" alt="" style="max-width:100%;" />`
                    )
                }
                className="px-3 py-1 rounded bg-zinc-800"
              >
                Image
              </button>

              <button
                onClick={() =>
                  insertHtml(
                    `<div style="background:#111;padding:20px;border-radius:10px;">`,
                    `</div>`
                    )
                }
                className="px-3 py-1 rounded bg-zinc-800"
              >
                Card
              </button>

              <button
                onClick={() =>
                  insertHtml("<br><br>")
                }
                className="px-3 py-1 rounded bg-zinc-800"
              >
                Break
              </button>

              <button
                onClick={() =>
                  setPreviewEmail(!previewEmail)
                }
                className="ml-auto px-4 py-1 rounded bg-blue-600"
              >
                {previewEmail ? "Edit" : "Preview"}
              </button>
            </div>

            {previewEmail ? (

              <div
                className="
                  border
                  border-white/10
                  rounded-xl
                  p-4
                  bg-white
                  text-black
                  min-h-[350px]
                "
                dangerouslySetInnerHTML={{
                  __html: emailBody
                }}
              />
          ) : (

            <textarea
              id="email-editor"
              value={emailBody}
              onChange={(e) =>
                setEmailBody(e.target.value)
              }
              className="
                w-full
                h-72
                bg-black
                border
                border-white/10
                p-3
                rounded
              "
            />

          )}
          </div>

          <div className="flex gap-3">

            <button
              onClick={sendEmail}
              className="flex-1 bg-emerald-500 text-black py-3 rounded-xl font-bold"
            >
              Send
            </button>

            <button
              onClick={() => setEmailModal(false)}
              className="flex-1 border border-white/10 rounded-xl"
            >
              Cancel
            </button>

          </div>

        </div>

        </div>
      )}
      
      {editingSubmission && (
        <div
          className="
            fixed
            inset-0
            bg-black/80
            z-50
            flex
            items-center
            justify-center
            p-6
            overflow-y-auto
          "
        >
          <div
            className="
             bg-zinc-950
             border
             border-white/10
             rounded-3xl
             p-6
             w-full
             max-w-3xl
             max-h-[90vh]
             overflow-y-auto
            "
          >
            <h2 className="text-3xl font-black mb-6">
              Edit Submission
            </h2>

            <input
              value={editSubmissionTitle}
              onChange={(e) =>
                setEditSubmissionTitle(e.target.value)
              }
              className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <textarea
              value={editSubmissionDescription}
              onChange={(e) =>
                setEditSubmissionDescription(e.target.value)
              }
              className="w-full h-28 mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <textarea
              value={editSubmissionRules}
              onChange={(e) =>
                setEditSubmissionRules(e.target.value)
              }
              className="w-full h-40 mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <input
              value={editSubmissionCategory}
              onChange={(e) =>
                setEditSubmissionCategory(e.target.value)
              }
              className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <input
              type="datetime-local"
              value={editSubmissionEndDate}
              onChange={(e) =>
                setEditSubmissionEndDate(e.target.value)
              }
              className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <textarea
              value={editSubmissionOptions}
              onChange={(e) =>
                setEditSubmissionOptions(e.target.value)
              }
              placeholder="Options separated by commas"
              className="w-full h-24 mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <textarea
              value={editSubmissionBundlePredictions}
              onChange={(e) =>
                setEditSubmissionBundlePredictions(
                  e.target.value
                )
              }
              placeholder="Bundle predictions"
              className="w-full h-32 mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <input
              value={editSubmissionB}
              onChange={(e) =>
                setEditSubmissionB(e.target.value)
              }
              placeholder="Liquidity (b)"
              className="w-full mb-3 bg-black border border-white/10 p-3 rounded"
            />

            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                checked={editSubmissionFeatured}
                onChange={(e) =>
                  setEditSubmissionFeatured(
                    e.target.checked
                  )
                }
              />

              <span>Featured</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={updateSubmission}
                className="
                  flex-1
                  bg-emerald-500
                  text-black
                  py-3
                  rounded-xl
                  font-bold
                "
              >
                Save Changes
              </button>

              <button
                onClick={() =>
                  setEditingSubmission(null)
                }
                className="
                  flex-1
                  border
                  border-white/10
                  py-3
                  rounded-xl
                "
              >
                Cancel
              </button>
            </div>
            
          </div>
        </div>
      )}
    </main>
  );
}
