import { useUserContext } from "@/context/UserContext";
import { RefreshCw, UserCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubscriberDetailDrawer from "./components/SubscriberDetailDrawer";
import SubscriberFiltersBar from "./components/SubscriberFiltersBar";
import {
  AccountSuspendModal,
  AssignSubscriptionModal,
  EditSubscriberModal,
  ExtendExpiryModal,
  OrderInvoiceModal,
  ResetPasswordModal,
  SendSmsModal,
} from "./components/SubscriberModals";
import SubscriberStatsCards from "./components/SubscriberStatsCards";
import SubscriberTable from "./components/SubscriberTable";
import { useSubscriberManagement } from "./hook/useSubscriberManagement";

export default function SubscriberManagement() {
  const { userProfile, startImpersonation } = useUserContext();
  const navigate = useNavigate();
  const isSuperAdmin = userProfile?.role === "Super Admin";

  const {
    subscribers,
    stats,
    packages,
    total,
    pages,
    loadingList,
    fetchingList,
    listError,
    refetchList,
    page,
    setPage,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    userTypeFilter,
    setUserTypeFilter,
    versionFilter,
    setVersionFilter,
    packageFilter,
    setPackageFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortBy,
    setSortBy,
    resetAllFilters,
    selectedIds,
    setSelectedIds,
    activeSubscriberId,
    setActiveSubscriberId,
    detailsData,
    loadingDetails,
    academicConfig,
    allSubjects,
    assignSubscription,
    updateSubscription,
    deleteSubscription,
    toggleAccountStatus,
    updateProfile,
    revokeSessions,
    resetPassword,
    reset2FA,
    addNote,
    deleteNote,
    sendSms,
    bulkExtend,
    impersonate,
    handleExportCsv,
    exporting,
  } = useSubscriberManagement();

  // Modal State
  const [assignModalUser, setAssignModalUser] = useState(null);
  const [extendTarget, setExtendTarget] = useState(null);
  const [bulkExtendOpen, setBulkExtendOpen] = useState(false);
  const [smsRecipients, setSmsRecipients] = useState(null);
  const [editProfileUser, setEditProfileUser] = useState(null);
  const [resetPassUser, setResetPassUser] = useState(null);
  const [suspendAccountUser, setSuspendAccountUser] = useState(null);
  const [invoiceContext, setInvoiceContext] = useState(null);

  const selectedSubscribersOnPage = subscribers.filter((s) =>
    selectedIds.includes(s._id),
  );

  const handleImpersonate = async (subscriber) => {
    const res = await impersonate.mutateAsync(subscriber._id);
    if (res?.accessToken) {
      await startImpersonation(res.accessToken);
      setActiveSubscriberId(null);
      navigate("/dashboard");
    }
  };

  return (
    <div className="space-y-6 font-bengali">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <UserCheck className="size-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight font-sans">
              সাবস্ক্রাইবার ব্যবস্থাপনা
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              সকল নিবন্ধিত শিক্ষক ও শিক্ষা প্রতিষ্ঠানের সাবস্ক্রিপশন, পেমেন্ট, ডিভাইস ও অ্যাক্টিভিটি নিয়ন্ত্রণ করুন।
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetchList()}
          disabled={fetchingList}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <RefreshCw
            className={`size-3.5 ${fetchingList ? "animate-spin text-primary" : ""}`}
          />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* 5 Summary KPI Cards */}
      <SubscriberStatsCards
        stats={stats}
        statusFilter={statusFilter}
        onSelectStatus={setStatusFilter}
      />

      {/* Search, Filters & Bulk Actions */}
      <SubscriberFiltersBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        userTypeFilter={userTypeFilter}
        setUserTypeFilter={setUserTypeFilter}
        versionFilter={versionFilter}
        setVersionFilter={setVersionFilter}
        packageFilter={packageFilter}
        setPackageFilter={setPackageFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        sortBy={sortBy}
        setSortBy={setSortBy}
        packages={packages}
        resetAllFilters={resetAllFilters}
        onExportCsv={handleExportCsv}
        exporting={exporting}
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onOpenBulkSms={() => setSmsRecipients(selectedSubscribersOnPage)}
        onOpenBulkExtend={() => setBulkExtendOpen(true)}
      />

      {/* Subscribers Table */}
      <SubscriberTable
        subscribers={subscribers}
        loading={loadingList}
        error={listError}
        refetch={refetchList}
        page={page}
        pages={pages}
        total={total}
        setPage={setPage}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onOpenDetail={(id) => setActiveSubscriberId(id)}
        onOpenAssign={(user) => setAssignModalUser(user)}
        onOpenExtend={(target) => setExtendTarget(target)}
        onOpenSms={(recips) => setSmsRecipients(recips)}
        onOpenSuspend={(user) => setSuspendAccountUser(user)}
        onImpersonate={handleImpersonate}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Slide-over Detail Drawer */}
      <SubscriberDetailDrawer
        open={Boolean(activeSubscriberId)}
        onClose={() => setActiveSubscriberId(null)}
        detailsData={detailsData}
        loading={loadingDetails}
        isSuperAdmin={isSuperAdmin}
        onOpenAssign={(user) => setAssignModalUser(user)}
        onOpenExtend={(target) => setExtendTarget(target)}
        onToggleSubSuspension={({ userId, subscriptionId, payload }) =>
          updateSubscription.mutate({ userId, subscriptionId, payload })
        }
        onDeleteSub={({ userId, subscriptionId }) =>
          deleteSubscription.mutate({ userId, subscriptionId })
        }
        onOpenSuspendAccount={(user) => setSuspendAccountUser(user)}
        onOpenEditProfile={(user) => setEditProfileUser(user)}
        onOpenResetPassword={(user) => setResetPassUser(user)}
        onReset2FA={(userId) => reset2FA.mutate(userId)}
        onRevokeSession={(args) => revokeSessions.mutate(args)}
        onAddNote={(args) => addNote.mutateAsync(args)}
        onDeleteNote={(args) => deleteNote.mutate(args)}
        onOpenSms={(recips) => setSmsRecipients(recips)}
        onOpenInvoice={(order, subscriber) =>
          setInvoiceContext({ order, subscriber })
        }
        onImpersonate={handleImpersonate}
        mutationsPending={{
          reset2FA: reset2FA.isPending,
          revokeSession: revokeSessions.isPending,
          addNote: addNote.isPending,
          impersonate: impersonate.isPending,
        }}
      />

      {/* Modals (keyed by target id so state initializes cleanly without effects) */}
      {assignModalUser && (
        <AssignSubscriptionModal
          key={`assign-${assignModalUser._id}`}
          open={Boolean(assignModalUser)}
          onClose={() => setAssignModalUser(null)}
          user={assignModalUser}
          packages={packages}
          academicConfig={academicConfig}
          allSubjects={allSubjects}
          onSubmit={(args) => assignSubscription.mutateAsync(args)}
          isPending={assignSubscription.isPending}
        />
      )}

      {extendTarget && (
        <ExtendExpiryModal
          key={`extend-${extendTarget.subscription?._id}`}
          open={Boolean(extendTarget)}
          onClose={() => setExtendTarget(null)}
          target={extendTarget}
          onSubmit={(days) =>
            updateSubscription.mutateAsync({
              userId: extendTarget.user._id,
              subscriptionId: extendTarget.subscription._id,
              payload: { extendDays: days },
            })
          }
          isPending={updateSubscription.isPending}
        />
      )}

      {bulkExtendOpen && (
        <ExtendExpiryModal
          key={`bulk-extend-${selectedIds.length}`}
          open={bulkExtendOpen}
          onClose={() => setBulkExtendOpen(false)}
          bulkCount={selectedIds.length}
          onSubmit={(days) =>
            bulkExtend.mutateAsync({ userIds: selectedIds, extendDays: days })
          }
          isPending={bulkExtend.isPending}
        />
      )}

      {smsRecipients && (
        <SendSmsModal
          key={`sms-${smsRecipients.map((r) => r._id).join("-")}`}
          open={Boolean(smsRecipients)}
          onClose={() => setSmsRecipients(null)}
          recipients={smsRecipients}
          onSubmit={(args) => sendSms.mutateAsync(args)}
          isPending={sendSms.isPending}
        />
      )}

      {editProfileUser && (
        <EditSubscriberModal
          key={`edit-${editProfileUser._id}`}
          open={Boolean(editProfileUser)}
          onClose={() => setEditProfileUser(null)}
          user={editProfileUser}
          onSubmit={(args) => updateProfile.mutateAsync(args)}
          isPending={updateProfile.isPending}
        />
      )}

      {resetPassUser && (
        <ResetPasswordModal
          key={`reset-pass-${resetPassUser._id}`}
          open={Boolean(resetPassUser)}
          onClose={() => setResetPassUser(null)}
          user={resetPassUser}
          onSubmit={(args) => resetPassword.mutateAsync(args)}
          isPending={resetPassword.isPending}
        />
      )}

      {suspendAccountUser && (
        <AccountSuspendModal
          key={`suspend-${suspendAccountUser._id}-${suspendAccountUser.isAccountSuspended}`}
          open={Boolean(suspendAccountUser)}
          onClose={() => setSuspendAccountUser(null)}
          user={suspendAccountUser}
          onSubmit={(args) => toggleAccountStatus.mutateAsync(args)}
          isPending={toggleAccountStatus.isPending}
        />
      )}

      {invoiceContext && (
        <OrderInvoiceModal
          open={Boolean(invoiceContext)}
          onClose={() => setInvoiceContext(null)}
          order={invoiceContext.order}
          subscriber={invoiceContext.subscriber}
        />
      )}
    </div>
  );
}
