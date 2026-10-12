import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { NeonKPIService, NeonKPISnapshot } from '../services/neonKPIService';
import { neonProjectConfig } from '../lib/neon';

export interface DashboardKPICounts {
  investors: number;
  users: number;
  activeUsers: number;
  inquiries: number;
  pendingInquiries: number;
  partners: number;
  blogPosts: number;
  events: number;
}

export interface UseDashboardKPIsOptions {
  collections?: string[];
  autoSync?: boolean;
}

export interface UseDashboardKPIsReturn {
  // Aggregate counts
  counts: DashboardKPICounts;

  // Individual convenience getters for quick access
  investorsCount: number;
  usersCount: number;
  activeUsersCount: number;
  inquiriesCount: number;
  pendingInquiriesCount: number;
  partnersCount: number;
  blogPostsCount: number;
  eventsCount: number;

  // Connection & sync telemetry
  isLive: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Manual actions
  syncToNeon: () => Promise<void>;
  syncToFirebase: () => Promise<void>; // Alias for backwards compatibility
  refresh: () => void;
}

/**
 * Custom React hook `useDashboardKPIs`
 * Integrates directly with Neon PostgreSQL to listen to real-time document/record counts
 * for 'users', 'investors', 'partners', and 'inquiries'.
 */
export const useDashboardKPIs = (
  options: UseDashboardKPIsOptions = {}
): UseDashboardKPIsReturn => {
  const {
    users,
    investors,
    partners,
    inquiries,
    blogPosts,
    events,
    addToast,
  } = useAdmin();

  const [realtimeCounts, setRealtimeCounts] = useState<{
    investors?: number;
    users?: number;
    activeUsers?: number;
    inquiries?: number;
    pendingInquiries?: number;
    partners?: number;
    blogPosts?: number;
    events?: number;
  }>({});

  const [isLive, setIsLive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(new Date().toLocaleTimeString());
  const [refreshToken, setRefreshToken] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = NeonKPIService.subscribeToKPIs(
      (update) => {
        setRealtimeCounts((prev) => ({
          ...prev,
          investors: update.totalInvestors,
          users: update.totalUsers,
          activeUsers: update.activeUsers,
          inquiries: update.totalInquiries,
          pendingInquiries: update.pendingInquiries,
          partners: update.totalPartners,
        }));
        setIsLive(true);
        setIsLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      },
      (err) => {
        console.warn('Neon real-time count subscriber note:', err?.message || err);
        setError(err?.message || 'Error connecting to Neon database');
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [refreshToken]);

  // Synchronize local database models into Neon
  const syncToNeon = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await NeonKPIService.syncLocalRecordsToNeon({
        users,
        investors,
        inquiries,
        partners,
      });

      if (res.success) {
        addToast({
          type: 'success',
          title: 'Synced to Neon PostgreSQL',
          message: `Synchronized ${res.syncedCount} records to Neon (${neonProjectConfig.projectName} / ${neonProjectConfig.branchName}).`,
        });
        setLastUpdated(new Date().toLocaleTimeString());
        setIsLive(true);
        setError(null);
      } else {
        addToast({
          type: 'error',
          title: 'Sync Error',
          message: res.error || 'Failed to sync records to Neon.',
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Sync Exception',
        message: err?.message || 'Unexpected sync error',
      });
    } finally {
      setIsSyncing(false);
    }
  }, [users, investors, inquiries, partners, addToast]);

  const refresh = useCallback(() => {
    setRefreshToken((prev) => prev + 1);
  }, []);

  // Compute final effective counts: Neon count with fallback to state
  const effectiveCounts: DashboardKPICounts = useMemo(() => {
    const fallbackActiveUsers = users.filter((u) => u.status === 'ACTIVE').length;
    const fallbackPendingInquiries = inquiries.filter(
      (i) => i.status === 'NEW' || i.status === 'IN_PROGRESS'
    ).length;
    const fallbackPublishedPosts = blogPosts.filter((b) => b.status === 'PUBLISHED').length;

    return {
      investors:
        realtimeCounts.investors !== undefined && realtimeCounts.investors > 0
          ? realtimeCounts.investors
          : investors.length,
      users:
        realtimeCounts.users !== undefined && realtimeCounts.users > 0
          ? realtimeCounts.users
          : users.length,
      activeUsers:
        realtimeCounts.activeUsers !== undefined && realtimeCounts.activeUsers > 0
          ? realtimeCounts.activeUsers
          : fallbackActiveUsers,
      inquiries:
        realtimeCounts.inquiries !== undefined && realtimeCounts.inquiries > 0
          ? realtimeCounts.inquiries
          : inquiries.length,
      pendingInquiries:
        realtimeCounts.pendingInquiries !== undefined && realtimeCounts.pendingInquiries > 0
          ? realtimeCounts.pendingInquiries
          : fallbackPendingInquiries,
      partners:
        realtimeCounts.partners !== undefined && realtimeCounts.partners > 0
          ? realtimeCounts.partners
          : partners.length,
      blogPosts: fallbackPublishedPosts,
      events: events.length,
    };
  }, [realtimeCounts, users, investors, inquiries, partners, blogPosts, events]);

  return {
    counts: effectiveCounts,
    investorsCount: effectiveCounts.investors,
    usersCount: effectiveCounts.users,
    activeUsersCount: effectiveCounts.activeUsers,
    inquiriesCount: effectiveCounts.inquiries,
    pendingInquiriesCount: effectiveCounts.pendingInquiries,
    partnersCount: effectiveCounts.partners,
    blogPostsCount: effectiveCounts.blogPosts,
    eventsCount: effectiveCounts.events,

    isLive,
    isLoading,
    isSyncing,
    error,
    lastUpdated,

    syncToNeon,
    syncToFirebase: syncToNeon,
    refresh,
  };
};

export default useDashboardKPIs;
